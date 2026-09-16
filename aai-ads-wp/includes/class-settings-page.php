<?php
/**
 * Trang quản trị duy nhất của plugin: wp-admin → "A-AI Ads". Trước khi kích
 * hoạt key chỉ hiện form nhập key; sau khi kích hoạt hiện toàn bộ cấu hình
 * (Facebook, chủ đề, tần suất, log) — tất cả khách tự thao tác ngay tại đây,
 * không cần vào 3dvietpro.com.
 */

if (!defined('ABSPATH')) exit;

class AAI_Ads_Settings_Page
{
    public static function init(): void
    {
        add_action('admin_menu', [__CLASS__, 'register_menu']);
        add_action('admin_post_aai_ads_activate', [__CLASS__, 'handle_activate']);
        add_action('admin_post_aai_ads_save_settings', [__CLASS__, 'handle_save_settings']);
        add_action('admin_post_aai_ads_disconnect_fb', [__CLASS__, 'handle_disconnect_fb']);
        add_action('admin_post_aai_ads_run_now', [__CLASS__, 'handle_run_now']);
        add_action('admin_post_aai_ads_deactivate_license', [__CLASS__, 'handle_deactivate_license']);
    }

    public static function register_menu(): void
    {
        add_menu_page(
            'A-AI Ads',
            '🚀 A-AI Ads',
            'manage_options',
            'aai-ads',
            [__CLASS__, 'render_page'],
            'dashicons-megaphone',
            30
        );
    }

    private static function check_nonce(string $action): void
    {
        if (!isset($_POST['_wpnonce']) || !wp_verify_nonce($_POST['_wpnonce'], $action)) {
            wp_die('Yêu cầu không hợp lệ (nonce sai) — quay lại và thử lại.');
        }
        if (!current_user_can('manage_options')) wp_die('Không có quyền.');
    }

    private static function redirect_back(string $notice = ''): void
    {
        $url = admin_url('admin.php?page=aai-ads');
        if ($notice) $url = add_query_arg('aai_notice', rawurlencode($notice), $url);
        wp_redirect($url);
        exit;
    }

    public static function handle_activate(): void
    {
        self::check_nonce('aai_ads_activate');
        $result = AAI_Ads_License::activate($_POST['license_key'] ?? '');
        self::redirect_back($result['ok'] ? 'Đã kích hoạt thành công!' : $result['error']);
    }

    public static function handle_deactivate_license(): void
    {
        self::check_nonce('aai_ads_deactivate_license');
        AAI_Ads_License::deactivate();
        self::redirect_back('Đã gỡ key khỏi plugin.');
    }

    public static function handle_save_settings(): void
    {
        self::check_nonce('aai_ads_save_settings');

        update_option('aai_ads_anthropic_key', sanitize_text_field($_POST['anthropic_key'] ?? ''));
        update_option('aai_ads_pixabay_key', sanitize_text_field($_POST['pixabay_key'] ?? ''));
        update_option('aai_ads_fb_app_id', sanitize_text_field($_POST['fb_app_id'] ?? ''));
        update_option('aai_ads_fb_app_secret', sanitize_text_field($_POST['fb_app_secret'] ?? ''));
        update_option('aai_ads_topic', sanitize_textarea_field($_POST['topic'] ?? ''));
        update_option('aai_ads_category_id', (int) ($_POST['category_id'] ?? 0));
        update_option('aai_ads_post_to_site', !empty($_POST['post_to_site']));
        update_option('aai_ads_posts_per_day', max(1, (int) ($_POST['posts_per_day'] ?? 1)));
        update_option('aai_ads_selected_page_ids', array_map('sanitize_text_field', (array) ($_POST['page_ids'] ?? [])));
        update_option('aai_ads_enabled', !empty($_POST['enabled']));

        AAI_Ads_Cron::reschedule();
        self::redirect_back('Đã lưu cấu hình.');
    }

    public static function handle_disconnect_fb(): void
    {
        self::check_nonce('aai_ads_disconnect_fb');
        AAI_Ads_Facebook::disconnect();
        self::redirect_back('Đã ngắt kết nối Facebook.');
    }

    public static function handle_run_now(): void
    {
        self::check_nonce('aai_ads_run_now');
        AAI_Ads_Poster::run();
        self::redirect_back('Đã chạy xong — xem kết quả ở Nhật ký hoạt động bên dưới.');
    }

    public static function render_page(): void
    {
        if (!current_user_can('manage_options')) return;
        $notice = isset($_GET['aai_notice']) ? sanitize_text_field(wp_unslash($_GET['aai_notice'])) : '';
        $license = AAI_Ads_License::get_status();
        ?>
        <div class="wrap">
            <h1>🚀 A-AI Ads — Đăng bài tự động bằng AI</h1>
            <?php if ($notice): ?>
                <div class="notice notice-info is-dismissible"><p><?php echo esc_html($notice); ?></p></div>
            <?php endif; ?>

            <?php if (!$license['activated']): ?>
                <?php self::render_activation_form($license); ?>
            <?php else: ?>
                <?php self::render_settings_form(); ?>
            <?php endif; ?>
        </div>
        <?php
    }

    private static function render_activation_form(array $license): void
    {
        ?>
        <div class="card" style="max-width:480px;padding:24px;margin-top:16px;">
            <h2>Kích hoạt bằng license key</h2>
            <?php if (!empty($license['revoked'])): ?>
                <p style="color:#b32d2e;">Key <code><?php echo esc_html($license['key']); ?></code> đã hết hạn hoặc bị thu hồi. Liên hệ người cấp key để gia hạn.</p>
            <?php endif; ?>
            <p>Nhập license key được cấp (dạng <code>AIWEB-XXXX-XXXX-XXXX</code>) để bắt đầu sử dụng.</p>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('aai_ads_activate'); ?>
                <input type="hidden" name="action" value="aai_ads_activate" />
                <input type="text" name="license_key" placeholder="AIWEB-XXXX-XXXX-XXXX" style="width:100%;font-family:monospace;font-size:16px;padding:8px;margin-bottom:12px;" required />
                <?php submit_button('Kích hoạt'); ?>
            </form>
        </div>
        <?php
    }

    private static function render_settings_form(): void
    {
        $pages = AAI_Ads_Facebook::get_pages();
        $selected_page_ids = get_option('aai_ads_selected_page_ids', []);
        $categories = get_categories(['hide_empty' => false]);
        $log = AAI_Ads_Poster::get_log();
        ?>
        <div style="display:flex;gap:8px;align-items:center;margin:12px 0;">
            <span class="dashicons dashicons-yes-alt" style="color:#00a32a;"></span>
            <span>Key đang hoạt động: <code><?php echo esc_html(AAI_Ads_License::get_status()['key']); ?></code></span>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="margin-left:auto;">
                <?php wp_nonce_field('aai_ads_deactivate_license'); ?>
                <input type="hidden" name="action" value="aai_ads_deactivate_license" />
                <button type="submit" class="button-link" onclick="return confirm('Gỡ key khỏi plugin này?');">Gỡ key</button>
            </form>
        </div>

        <div class="card" style="max-width:640px;padding:24px;margin-bottom:16px;">
            <h2>Kết nối Facebook</h2>
            <p class="description">Dùng App Facebook Developer <strong>của riêng bạn</strong> (tự tạo tại developers.facebook.com) — không dùng chung App với ai khác. Redirect URI cần đăng ký trong App: <code><?php echo esc_html(AAI_Ads_Facebook::redirect_uri()); ?></code></p>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('aai_ads_save_settings'); ?>
                <input type="hidden" name="action" value="aai_ads_save_settings" />
                <table class="form-table">
                    <tr>
                        <th><label for="fb_app_id">Facebook App ID</label></th>
                        <td><input type="text" id="fb_app_id" name="fb_app_id" class="regular-text" value="<?php echo esc_attr(get_option('aai_ads_fb_app_id')); ?>" /></td>
                    </tr>
                    <tr>
                        <th><label for="fb_app_secret">Facebook App Secret</label></th>
                        <td><input type="password" id="fb_app_secret" name="fb_app_secret" class="regular-text" value="<?php echo esc_attr(get_option('aai_ads_fb_app_secret')); ?>" /></td>
                    </tr>
                </table>
                <?php submit_button('Lưu App ID/Secret', 'secondary'); ?>
            </form>
            <?php if (AAI_Ads_Facebook::is_connected()): ?>
                <p style="color:#00a32a;">✓ Đã kết nối Facebook.</p>
                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                    <?php wp_nonce_field('aai_ads_disconnect_fb'); ?>
                    <input type="hidden" name="action" value="aai_ads_disconnect_fb" />
                    <button type="submit" class="button">Ngắt kết nối</button>
                </form>
            <?php else: ?>
                <p><a class="button button-primary" href="<?php echo esc_url(AAI_Ads_Facebook::connect_url()); ?>">Kết nối Facebook</a> (lưu App ID/Secret ở trên trước)</p>
            <?php endif; ?>
        </div>

        <div class="card" style="max-width:640px;padding:24px;">
            <h2>🤖 AI tự động đăng bài</h2>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('aai_ads_save_settings'); ?>
                <input type="hidden" name="action" value="aai_ads_save_settings" />
                <table class="form-table">
                    <tr>
                        <th><label for="anthropic_key">Anthropic API Key</label></th>
                        <td><input type="password" id="anthropic_key" name="anthropic_key" class="regular-text" value="<?php echo esc_attr(get_option('aai_ads_anthropic_key')); ?>" /><p class="description">Dùng để AI viết bài. Lấy tại console.anthropic.com.</p></td>
                    </tr>
                    <tr>
                        <th><label for="pixabay_key">Pixabay API Key (tùy chọn)</label></th>
                        <td><input type="text" id="pixabay_key" name="pixabay_key" class="regular-text" value="<?php echo esc_attr(get_option('aai_ads_pixabay_key')); ?>" /><p class="description">Để tự tìm ảnh minh hoạ. Bỏ trống thì vẫn đăng được, chỉ không có ảnh.</p></td>
                    </tr>
                    <tr>
                        <th><label for="topic">Chủ đề/sản phẩm cần quảng bá</label></th>
                        <td><textarea id="topic" name="topic" rows="3" class="large-text"><?php echo esc_textarea(get_option('aai_ads_topic')); ?></textarea></td>
                    </tr>
                    <tr>
                        <th>Fanpage muốn đăng</th>
                        <td>
                            <?php if (!$pages): ?>
                                <p class="description">Chưa có Fanpage nào — kết nối Facebook ở trên trước.</p>
                            <?php else: foreach ($pages as $p): ?>
                                <label style="display:block;"><input type="checkbox" name="page_ids[]" value="<?php echo esc_attr($p['id']); ?>" <?php checked(in_array($p['id'], $selected_page_ids)); ?> /> <?php echo esc_html($p['name']); ?></label>
                            <?php endforeach; endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <th>Đăng lên chính website này</th>
                        <td>
                            <label><input type="checkbox" name="post_to_site" <?php checked((bool) get_option('aai_ads_post_to_site')); ?> /> Bật</label>
                            <select name="category_id" style="margin-left:12px;">
                                <option value="0">— Không chọn chuyên mục —</option>
                                <?php foreach ($categories as $cat): ?>
                                    <option value="<?php echo esc_attr($cat->term_id); ?>" <?php selected((int) get_option('aai_ads_category_id'), $cat->term_id); ?>><?php echo esc_html($cat->name); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="posts_per_day">Số bài / ngày</label></th>
                        <td><input type="number" id="posts_per_day" name="posts_per_day" min="1" max="10" value="<?php echo esc_attr(get_option('aai_ads_posts_per_day', 1)); ?>" /></td>
                    </tr>
                    <tr>
                        <th>Bật tự động</th>
                        <td><label><input type="checkbox" name="enabled" <?php checked((bool) get_option('aai_ads_enabled')); ?> /> Bật AI tự động đăng bài theo lịch trên</label></td>
                    </tr>
                </table>
                <?php submit_button('Lưu cấu hình'); ?>
            </form>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="display:inline-block;margin-top:8px;">
                <?php wp_nonce_field('aai_ads_run_now'); ?>
                <input type="hidden" name="action" value="aai_ads_run_now" />
                <button type="submit" class="button button-secondary">▶ Chạy thử ngay</button>
            </form>
        </div>

        <div class="card" style="max-width:800px;padding:24px;margin-top:16px;">
            <h2>Nhật ký hoạt động</h2>
            <?php if (!$log): ?>
                <p class="description">Chưa có bài nào.</p>
            <?php else: ?>
                <table class="widefat striped">
                    <thead><tr><th>Thời gian</th><th>Nơi đăng</th><th>Trạng thái</th><th>Chi tiết</th></tr></thead>
                    <tbody>
                    <?php foreach (array_slice($log, 0, 30) as $entry): ?>
                        <tr>
                            <td><?php echo esc_html(date_i18n('d/m/Y H:i', $entry['time'] ?? time())); ?></td>
                            <td><?php echo esc_html($entry['targetName'] ?? ''); ?></td>
                            <td><?php echo esc_html($entry['status'] ?? ''); ?></td>
                            <td>
                                <?php if (!empty($entry['permalink'])): ?>
                                    <a href="<?php echo esc_url($entry['permalink']); ?>" target="_blank"><?php echo esc_html($entry['articleTitle'] ?? 'Xem bài'); ?></a>
                                <?php elseif (!empty($entry['error'])): ?>
                                    <span style="color:#b32d2e;"><?php echo esc_html($entry['error']); ?></span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
        <?php
    }
}
