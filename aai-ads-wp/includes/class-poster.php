<?php
/**
 * Chạy 1 lượt "AI tự động đăng bài" — PORT của runAiAutoPost() trong
 * services/aaiAdsService.js: viết 1 bài, đăng lên các Fanpage đã chọn, và
 * (tuỳ chọn) đăng thẳng lên chính website này bằng wp_insert_post() — không
 * cần gọi REST API vì đã chạy ngay trong WordPress.
 */

if (!defined('ABSPATH')) exit;

class AAI_Ads_Poster
{
    const LOG_OPTION = 'aai_ads_posting_log';
    const MAX_LOG_ENTRIES = 200;

    private static function log(array $entry): void
    {
        $entry['time'] = time();
        $log = get_option(self::LOG_OPTION, []);
        array_unshift($log, $entry);
        $log = array_slice($log, 0, self::MAX_LOG_ENTRIES);
        update_option(self::LOG_OPTION, $log);
    }

    public static function get_log(): array
    {
        return get_option(self::LOG_OPTION, []);
    }

    private static function recent_titles(): array
    {
        $log = self::get_log();
        $titles = [];
        foreach ($log as $entry) {
            if (($entry['status'] ?? '') === 'posted' && !empty($entry['articleTitle'])) {
                $titles[] = $entry['articleTitle'];
                if (count($titles) >= 5) break;
            }
        }
        return $titles;
    }

    // Điểm vào chính — gọi từ nút "Chạy thử ngay" hoặc từ WP-Cron.
    public static function run(): void
    {
        if (!AAI_Ads_License::is_activated()) return;
        if (!get_option('aai_ads_enabled')) return;

        $topic = trim((string) get_option('aai_ads_topic'));
        $page_ids = get_option('aai_ads_selected_page_ids', []);
        $post_to_site = (bool) get_option('aai_ads_post_to_site');
        if (!$topic || (!$page_ids && !$post_to_site)) return;

        try {
            $article = AAI_Ads_Writer::write_article($topic, self::recent_titles());
        } catch (Exception $e) {
            self::log(['targetId' => 'ai-writer', 'targetName' => 'AI tự động đăng bài', 'status' => 'error', 'error' => $e->getMessage()]);
            return;
        }

        $image_url = null;
        if ($article['imageKeywords']) {
            $image_url = AAI_Ads_Writer::find_stock_photo_url($article['imageKeywords']);
        }

        if ($post_to_site) {
            self::post_to_own_site($article);
        }

        if ($page_ids) {
            self::post_to_pages($page_ids, $article, $image_url);
        }
    }

    private static function post_to_own_site(array $article): void
    {
        $category_id = (int) get_option('aai_ads_category_id');
        $post_id = wp_insert_post([
            'post_title' => $article['articleTitle'],
            'post_content' => AAI_Ads_Writer::markdown_to_html($article['articleContent']),
            'post_status' => 'publish',
            'post_category' => $category_id ? [$category_id] : [],
        ], true);

        if (is_wp_error($post_id)) {
            self::log(['targetId' => 'own-site', 'targetName' => get_bloginfo('name'), 'status' => 'error', 'error' => $post_id->get_error_message()]);
            return;
        }

        self::log([
            'targetId' => 'own-site',
            'targetName' => get_bloginfo('name') . ' (Website)',
            'status' => 'posted',
            'message' => $article['articleContent'],
            'articleTitle' => $article['articleTitle'],
            'permalink' => get_permalink($post_id),
        ]);
    }

    private static function post_to_pages(array $page_ids, array $article, ?string $image_url): void
    {
        $pages = AAI_Ads_Facebook::get_pages();
        foreach ($page_ids as $page_id) {
            $page = null;
            foreach ($pages as $p) {
                if ($p['id'] === $page_id) { $page = $p; break; }
            }
            if (!$page) {
                self::log(['targetId' => $page_id, 'targetName' => 'Fanpage', 'status' => 'error', 'error' => 'Không tìm thấy token của Page này — kết nối lại Facebook.']);
                continue;
            }

            $result = AAI_Ads_Facebook::publish_to_page($page['id'], $page['access_token'], $article['fbCaption'], $image_url);
            if ($result['ok']) {
                self::log([
                    'targetId' => $page['id'],
                    'targetName' => $page['name'],
                    'status' => 'posted',
                    'message' => $article['fbCaption'],
                    'articleTitle' => $article['articleTitle'],
                    'permalink' => AAI_Ads_Facebook::permalink_from_post_id($page['id'], $result['postId']),
                ]);
            } else {
                self::log(['targetId' => $page['id'], 'targetName' => $page['name'], 'status' => 'error', 'error' => $result['error']]);
            }
        }
    }
}
