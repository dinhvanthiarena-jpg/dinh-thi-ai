<?php
/**
 * Kích hoạt plugin bằng license key do thầy Đinh Thi Ai cấp — PORT trực tiếp
 * từ aai-ads-module/activation.js (bản Node.js) sang PHP, giữ NGUYÊN logic:
 * key PHẢI hỏi lại 1 server trung tâm (3dvietpro.com) mỗi lần kích hoạt VÀ
 * định kỳ sau đó (đây là cách DUY NHẤT thu hồi được key đã cấp — checksum
 * toán học thuần offline thì không thể "tắt" từ xa). Có "grace period" 3 ngày
 * cho lỗi mạng/server tạm thời, KHÔNG áp dụng khi server xác nhận rõ đã bị
 * thu hồi/hết hạn (khoá ngay, không chờ).
 */

if (!defined('ABSPATH')) exit;

class AAI_Ads_License
{
    const OPTION_KEY = 'aai_ads_license_state';
    const GRACE_PERIOD_SECONDS = 3 * 24 * 60 * 60;
    const REVERIFY_INTERVAL_SECONDS = 24 * 60 * 60;

    private static function verify_url(): string
    {
        $custom = get_option('aai_ads_license_verify_url');
        return $custom ?: 'https://3dvietpro.com/api/aai-license/verify';
    }

    public static function is_well_formed(string $input): bool
    {
        $normalized = strtoupper(preg_replace('/[^A-Z0-9]/', '', $input));
        return (bool) preg_match('/^AIWEB[A-Z0-9]{12}$/', $normalized);
    }

    private static function verify_online(string $key): array
    {
        $url = self::verify_url() . '?key=' . rawurlencode($key);
        $res = wp_remote_get($url, ['timeout' => 15]);
        if (is_wp_error($res)) return ['ok' => false, 'network_error' => true];
        if (wp_remote_retrieve_response_code($res) !== 200) return ['ok' => false, 'network_error' => true];
        $data = json_decode(wp_remote_retrieve_body($res), true);
        return ['ok' => true, 'valid' => !empty($data['valid'])];
    }

    // Gọi khi khách nhập key lần đầu — bắt buộc liên lạc được với server trung
    // tâm, không có "chưa xác minh được thì cứ cho qua" ở bước kích hoạt (grace
    // period chỉ áp dụng cho các lần TÁI xác minh sau này).
    public static function activate(string $key): array
    {
        $key = strtoupper(trim($key));
        if (!self::is_well_formed($key)) {
            return ['ok' => false, 'error' => 'Key sai định dạng — đúng dạng phải là AIWEB-XXXX-XXXX-XXXX.'];
        }
        $result = self::verify_online($key);
        if (!$result['ok']) {
            return ['ok' => false, 'error' => 'Không liên lạc được với server xác thực — thử lại sau ít phút.'];
        }
        if (!$result['valid']) {
            return ['ok' => false, 'error' => 'Key không hợp lệ, đã hết hạn hoặc đã bị thu hồi. Liên hệ người cấp key để được hỗ trợ.'];
        }
        update_option(self::OPTION_KEY, [
            'key' => $key,
            'activatedAt' => time(),
            'lastVerifiedAt' => time(),
            'lastVerifiedValid' => true,
        ]);
        return ['ok' => true];
    }

    public static function deactivate(): void
    {
        delete_option(self::OPTION_KEY);
    }

    private static function reverify(string $key): void
    {
        $result = self::verify_online($key);
        if (!$result['ok']) return; // lỗi mạng: giữ nguyên trạng thái cũ, chỉ grace period tự nhiên hết hạn mới khoá
        $state = get_option(self::OPTION_KEY, []);
        $state['key'] = $key;
        $state['lastVerifiedAt'] = time();
        $state['lastVerifiedValid'] = $result['valid'];
        update_option(self::OPTION_KEY, $state);
    }

    // Trạng thái hiện tại: ['activated' => bool, 'key' => string|null].
    // Tự tái xác minh nền khi đã quá 24h kể từ lần xác minh gần nhất (không
    // chặn request hiện tại chờ mạng — dùng kết quả cũ cho lần này, áp dụng
    // kết quả mới cho lần sau, giống hệt cơ chế bên activation.js).
    public static function get_status(): array
    {
        $state = get_option(self::OPTION_KEY, null);
        if (!$state || empty($state['key'])) {
            return ['activated' => false, 'key' => null];
        }
        if (empty($state['lastVerifiedAt']) || (time() - $state['lastVerifiedAt']) > self::REVERIFY_INTERVAL_SECONDS) {
            self::reverify($state['key']);
            $state = get_option(self::OPTION_KEY, $state);
        }
        $within_grace = !empty($state['lastVerifiedAt']) && (time() - $state['lastVerifiedAt']) < self::GRACE_PERIOD_SECONDS;
        if (($state['lastVerifiedValid'] ?? true) === false && !$within_grace) {
            return ['activated' => false, 'key' => $state['key'], 'revoked' => true];
        }
        return ['activated' => true, 'key' => $state['key']];
    }

    public static function is_activated(): bool
    {
        return self::get_status()['activated'];
    }
}
