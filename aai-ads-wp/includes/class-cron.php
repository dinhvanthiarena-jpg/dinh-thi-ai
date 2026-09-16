<?php
/**
 * Lên lịch chạy tự động bằng WP-Cron — đơn giản hoá so với bản Node.js (vốn
 * có tần suất/khoảng-cách riêng cho từng Fanpage/Website): ở đây 1 lần chạy
 * viết 1 bài rồi đăng đồng thời lên MỌI nơi đã chọn (đúng cách "đăng 1 lần
 * lên tất cả" mà thầy vốn muốn — xem project_dinh-thi-ai_cross_posting), lặp
 * lại theo đúng số "bài/ngày" khách đặt (VD 2 bài/ngày = chạy cách nhau 12h).
 */

if (!defined('ABSPATH')) exit;

class AAI_Ads_Cron
{
    const HOOK = 'aai_ads_run_event';

    public static function init(): void
    {
        add_action(self::HOOK, [AAI_Ads_Poster::class, 'run']);
        add_filter('cron_schedules', [__CLASS__, 'register_schedule']);
    }

    public static function register_schedule(array $schedules): array
    {
        $per_day = max(1, (int) get_option('aai_ads_posts_per_day', 1));
        $interval_seconds = (int) floor(DAY_IN_SECONDS / $per_day);
        $schedules['aai_ads_custom'] = [
            'interval' => $interval_seconds,
            'display' => "A-AI Ads ($per_day bài/ngày)",
        ];
        return $schedules;
    }

    // Gọi khi bật/lưu cấu hình — huỷ lịch cũ rồi đặt lại theo tần suất mới.
    public static function reschedule(): void
    {
        $timestamp = wp_next_scheduled(self::HOOK);
        if ($timestamp) wp_unschedule_event($timestamp, self::HOOK);
        if (get_option('aai_ads_enabled')) {
            wp_schedule_event(time(), 'aai_ads_custom', self::HOOK);
        }
    }

    public static function on_activate(): void
    {
        // Không tự bật lịch khi mới cài — chờ khách bấm "Bật AI tự động đăng
        // bài" sau khi đã cấu hình đầy đủ (key, chủ đề, Facebook...).
    }

    public static function on_deactivate(): void
    {
        $timestamp = wp_next_scheduled(self::HOOK);
        if ($timestamp) wp_unschedule_event($timestamp, self::HOOK);
    }
}
