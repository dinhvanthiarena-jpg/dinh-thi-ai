<?php
/**
 * Kết nối Facebook Page CỦA KHÁCH — mỗi khách dùng App Facebook Developer
 * CỦA RIÊNG HỌ (đúng mô hình tự phục vụ đã thống nhất cho aai-ads-module:
 * khách tự quản lý Fanpage/quảng cáo của họ, thầy không đăng nhập/làm admin
 * hộ). Đăng bài dùng thẳng Graph API qua wp_remote_*, không cần SDK.
 */

if (!defined('ABSPATH')) exit;

class AAI_Ads_Facebook
{
    const GRAPH_VERSION = 'v21.0';

    public static function init(): void
    {
        add_action('admin_init', [__CLASS__, 'maybe_handle_callback']);
    }

    public static function redirect_uri(): string
    {
        return admin_url('admin.php?page=aai-ads&aai_oauth_callback=1');
    }

    public static function connect_url(): string
    {
        $app_id = get_option('aai_ads_fb_app_id');
        $state = wp_create_nonce('aai_ads_oauth');
        update_option('aai_ads_oauth_state', $state);
        $params = http_build_query([
            'client_id' => $app_id,
            'redirect_uri' => self::redirect_uri(),
            'state' => $state,
            'scope' => 'pages_show_list,pages_manage_posts,pages_read_engagement,business_management',
            'response_type' => 'code',
        ]);
        return 'https://www.facebook.com/' . self::GRAPH_VERSION . '/dialog/oauth?' . $params;
    }

    public static function maybe_handle_callback(): void
    {
        if (empty($_GET['aai_oauth_callback']) || empty($_GET['code'])) return;
        if (empty($_GET['state']) || $_GET['state'] !== get_option('aai_ads_oauth_state')) {
            add_action('admin_notices', fn() => print '<div class="notice notice-error"><p>Xác thực Facebook thất bại (state không khớp) — thử kết nối lại.</p></div>');
            return;
        }

        $app_id = get_option('aai_ads_fb_app_id');
        $app_secret = get_option('aai_ads_fb_app_secret');
        $code = sanitize_text_field($_GET['code']);

        try {
            $short_token = self::exchange_code_for_token($app_id, $app_secret, $code);
            $long_token = self::exchange_for_long_lived_token($app_id, $app_secret, $short_token);
            update_option('aai_ads_fb_access_token', $long_token);
            $pages = self::fetch_pages($long_token);
            update_option('aai_ads_fb_pages', $pages);
            add_action('admin_notices', fn() => print '<div class="notice notice-success"><p>✓ Đã kết nối Facebook — chọn Fanpage muốn đăng bên dưới.</p></div>');
        } catch (Exception $e) {
            $msg = esc_html($e->getMessage());
            add_action('admin_notices', fn() => print "<div class=\"notice notice-error\"><p>Kết nối Facebook lỗi: $msg</p></div>");
        }
    }

    private static function exchange_code_for_token(string $app_id, string $app_secret, string $code): string
    {
        $url = 'https://graph.facebook.com/' . self::GRAPH_VERSION . '/oauth/access_token?' . http_build_query([
            'client_id' => $app_id,
            'redirect_uri' => self::redirect_uri(),
            'client_secret' => $app_secret,
            'code' => $code,
        ]);
        $res = wp_remote_get($url, ['timeout' => 20]);
        $data = json_decode(wp_remote_retrieve_body($res), true);
        if (empty($data['access_token'])) throw new Exception($data['error']['message'] ?? 'Không đổi được code lấy token.');
        return $data['access_token'];
    }

    private static function exchange_for_long_lived_token(string $app_id, string $app_secret, string $short_token): string
    {
        $url = 'https://graph.facebook.com/' . self::GRAPH_VERSION . '/oauth/access_token?' . http_build_query([
            'grant_type' => 'fb_exchange_token',
            'client_id' => $app_id,
            'client_secret' => $app_secret,
            'fb_exchange_token' => $short_token,
        ]);
        $res = wp_remote_get($url, ['timeout' => 20]);
        $data = json_decode(wp_remote_retrieve_body($res), true);
        if (empty($data['access_token'])) throw new Exception($data['error']['message'] ?? 'Không đổi được long-lived token.');
        return $data['access_token'];
    }

    // /me/accounts trả page access token đã LÀ long-lived nếu user token dùng
    // để gọi cũng là long-lived — không cần đổi riêng cho từng Page.
    private static function fetch_pages(string $user_token): array
    {
        $url = 'https://graph.facebook.com/' . self::GRAPH_VERSION . '/me/accounts?' . http_build_query([
            'access_token' => $user_token,
            'fields' => 'id,name,access_token',
        ]);
        $res = wp_remote_get($url, ['timeout' => 20]);
        $data = json_decode(wp_remote_retrieve_body($res), true);
        if (isset($data['error'])) throw new Exception($data['error']['message']);
        return $data['data'] ?? [];
    }

    public static function get_pages(): array
    {
        return get_option('aai_ads_fb_pages', []);
    }

    public static function is_connected(): bool
    {
        return (bool) get_option('aai_ads_fb_access_token');
    }

    public static function disconnect(): void
    {
        delete_option('aai_ads_fb_access_token');
        delete_option('aai_ads_fb_pages');
    }

    // Đăng lên 1 Page — có ảnh thì dùng /photos (caption = message), không
    // ảnh thì dùng /feed. Trả về ['ok' => bool, 'postId' => string|null,
    // 'error' => string|null].
    public static function publish_to_page(string $page_id, string $page_token, string $message, ?string $image_url = null): array
    {
        $endpoint = $image_url ? "/$page_id/photos" : "/$page_id/feed";
        $body = $image_url
            ? ['url' => $image_url, 'caption' => $message, 'access_token' => $page_token]
            : ['message' => $message, 'access_token' => $page_token];

        $res = wp_remote_post('https://graph.facebook.com/' . self::GRAPH_VERSION . $endpoint, [
            'timeout' => 30,
            'body' => $body,
        ]);
        if (is_wp_error($res)) return ['ok' => false, 'error' => $res->get_error_message()];
        $data = json_decode(wp_remote_retrieve_body($res), true);
        if (isset($data['error'])) return ['ok' => false, 'error' => $data['error']['message']];

        $post_id = $data['post_id'] ?? $data['id'] ?? null;
        return ['ok' => true, 'postId' => $post_id];
    }

    public static function permalink_from_post_id(string $page_id, ?string $post_id): ?string
    {
        if (!$post_id) return null;
        // post_id dạng "{page_id}_{post_id}" cho cả /feed lẫn /photos.
        if (strpos($post_id, '_') !== false) {
            return 'https://www.facebook.com/' . str_replace('_', '/posts/', $post_id);
        }
        return null;
    }
}
