<?php
/**
 * Plugin Name: A-AI Ads — Đăng bài tự động bằng AI
 * Description: AI tự tìm chủ đề đang hot, tự viết bài, tự đăng lên Fanpage Facebook và lên chính website này — khách tự vận hành ngay trong wp-admin, không cần vào web nào khác. Cần license key do Đinh Thi Ai cấp (dạng AIWEB-XXXX-XXXX-XXXX).
 * Version: 1.0.0
 * Author: Đinh Thi Ai
 * Text Domain: aai-ads
 *
 * Kiến trúc: đây là bản PHP độc lập của tính năng "AI tự động đăng bài" trong
 * A-AI Ads (xem D:\CLAUDE CODE\dinh-thi-ai\services\aaiAdsService.js — bản
 * Node.js chạy trên chính web của Đinh Thi Ai — và aai-ads-module/ — bản clone
 * cho web Node.js khác). Plugin này dành cho web KHÔNG chạy Node.js (WordPress)
 * — thầy Đinh Thi Ai chọn hướng "tool đa dạng, theo web hiện có" thay vì bắt
 * mọi web đổi sang Node.js (quyết định 2026-09-16).
 *
 * KHÔNG bao gồm phần tạo chiến dịch Facebook Ads/CRM/Catalog/AI Decision Center
 * của bản đầy đủ — phạm vi plugin này chỉ là tính năng "AI tự động đăng bài"
 * (viết bài + đăng Fanpage + đăng lên chính site này), đúng phần đã dùng thật
 * và đã kiểm chứng trong toàn bộ phiên làm việc dẫn tới bản này.
 */

if (!defined('ABSPATH')) exit;

define('AAI_ADS_VERSION', '1.0.0');
define('AAI_ADS_DIR', plugin_dir_path(__FILE__));
define('AAI_ADS_URL', plugin_dir_url(__FILE__));

require_once AAI_ADS_DIR . 'includes/class-license.php';
require_once AAI_ADS_DIR . 'includes/class-ai-writer.php';
require_once AAI_ADS_DIR . 'includes/class-facebook.php';
require_once AAI_ADS_DIR . 'includes/class-poster.php';
require_once AAI_ADS_DIR . 'includes/class-cron.php';
require_once AAI_ADS_DIR . 'includes/class-settings-page.php';

register_activation_hook(__FILE__, ['AAI_Ads_Cron', 'on_activate']);
register_deactivation_hook(__FILE__, ['AAI_Ads_Cron', 'on_deactivate']);

add_action('plugins_loaded', function () {
    AAI_Ads_Settings_Page::init();
    AAI_Ads_Facebook::init();
    AAI_Ads_Cron::init();
});
