<?php
/**
 * Gọi Claude (Anthropic API) để tự viết bài — PORT trực tiếp từ phần viết bài
 * trong services/aaiAdsService.js::runAiAutoPost(), giữ NGUYÊN prompt và
 * NGUYÊN cơ chế parse JSON "khoan dung nhưng không bao giờ đăng nội dung lỗi"
 * (extract theo độ sâu ngoặc {} thay vì regex tham lam, và KHÔNG BAO GIỜ dùng
 * text thô/chủ đề làm nội dung dự phòng khi AI trả JSON hỏng — đây chính là
 * bug thật đã xảy ra 2 lần trong quá trình phát triển, xem
 * feedback_aai_ads_caption_style và bản vá 2026-09-16 trong fb-ads-manager).
 */

if (!defined('ABSPATH')) exit;

class AAI_Ads_Writer
{
    // Trích đúng 1 khối JSON cân bằng ngoặc {..} — bỏ qua ngoặc nằm trong
    // chuỗi "..." — an toàn hơn regex tham lam vốn có thể nuốt luôn chữ giải
    // thích trước/sau JSON thật.
    private static function extract_json_object(string $text): ?string
    {
        $start = strpos($text, '{');
        if ($start === false) return null;
        $depth = 0;
        $in_string = false;
        $escape = false;
        $len = strlen($text);
        for ($i = $start; $i < $len; $i++) {
            $ch = $text[$i];
            if ($in_string) {
                if ($escape) { $escape = false; }
                elseif ($ch === '\\') { $escape = true; }
                elseif ($ch === '"') { $in_string = false; }
            } elseif ($ch === '"') {
                $in_string = true;
            } elseif ($ch === '{') {
                $depth++;
            } elseif ($ch === '}') {
                $depth--;
                if ($depth === 0) return substr($text, $start, $i - $start + 1);
            }
        }
        return null; // JSON bị cắt cụt giữa chừng (vd hết max_tokens)
    }

    private static function parse_json_loose(string $text): ?array
    {
        $json_str = self::extract_json_object($text);
        if ($json_str === null) return null;
        $parsed = json_decode($json_str, true);
        if (is_array($parsed)) return $parsed;

        // Model quên escape xuống dòng/tab thật bên trong chuỗi — escape lại
        // rồi thử parse lần nữa trước khi bỏ cuộc.
        $fixed = '';
        $in_string = false;
        $escape = false;
        $len = strlen($json_str);
        for ($i = 0; $i < $len; $i++) {
            $ch = $json_str[$i];
            if ($in_string) {
                if ($escape) { $fixed .= $ch; $escape = false; }
                elseif ($ch === '\\') { $fixed .= $ch; $escape = true; }
                elseif ($ch === '"') { $in_string = false; $fixed .= $ch; }
                elseif ($ch === "\n") { $fixed .= '\\n'; }
                elseif ($ch === "\r") { $fixed .= '\\r'; }
                elseif ($ch === "\t") { $fixed .= '\\t'; }
                else { $fixed .= $ch; }
            } else {
                if ($ch === '"') $in_string = true;
                $fixed .= $ch;
            }
        }
        $parsed = json_decode($fixed, true);
        return is_array($parsed) ? $parsed : null;
    }

    private static function call_claude(string $system, string $user_message, int $max_tokens = 16000): string
    {
        $api_key = get_option('aai_ads_anthropic_key');
        if (!$api_key) throw new Exception('Chưa cấu hình Anthropic API Key.');

        $res = wp_remote_post('https://api.anthropic.com/v1/messages', [
            'timeout' => 90,
            'headers' => [
                'content-type' => 'application/json',
                'x-api-key' => $api_key,
                'anthropic-version' => '2023-06-01',
            ],
            'body' => wp_json_encode([
                'model' => 'claude-sonnet-5',
                'max_tokens' => $max_tokens,
                'system' => $system,
                'messages' => [['role' => 'user', 'content' => $user_message]],
                'tools' => [['type' => 'web_search_20250305', 'name' => 'web_search', 'max_uses' => 2]],
            ]),
        ]);
        if (is_wp_error($res)) throw new Exception('Lỗi gọi Claude: ' . $res->get_error_message());
        $code = wp_remote_retrieve_response_code($res);
        $body = wp_remote_retrieve_body($res);
        if ($code !== 200) throw new Exception("Claude API lỗi HTTP $code: " . substr($body, 0, 300));

        $data = json_decode($body, true);
        $text = '';
        foreach (($data['content'] ?? []) as $block) {
            if (($block['type'] ?? '') === 'text') $text .= $block['text'];
        }
        return trim($text);
    }

    // Trả về ['articleTitle', 'articleContent', 'fbCaption', 'imageKeywords']
    // — NÉM EXCEPTION nếu AI không trả JSON hợp lệ, KHÔNG BAO GIỜ trả về nội
    // dung thô/dự phòng (nơi gọi phải coi exception là "huỷ đăng lần này").
    public static function write_article(string $topic, array $recent_titles = []): array
    {
        $recent_block = '';
        if (!empty($recent_titles)) {
            $recent_block = "\n\nCác bài đã viết gần đây (viết theo góc độ khác, đừng lặp lại ý/tiêu đề):\n"
                . implode("\n", array_map(fn($t) => "- $t", $recent_titles));
        }

        $system = <<<SYS
Bạn là chuyên gia content marketing kiêm biên tập viên công nghệ, chuyên viết caption Facebook thu hút tương tác cao. Dùng công cụ tìm kiếm web để tra cứu tin tức/bài viết MỚI NHẤT, nổi bật nhất về chủ đề được giao. Sau đó TỰ VIẾT một bài hoàn toàn mới bằng văn phong, cách diễn đạt của riêng bạn — dựa trên thông tin/xu hướng tìm được để bài viết cập nhật và có giá trị thật, nhưng TUYỆT ĐỐI không sao chép nguyên câu/đoạn văn từ bất kỳ nguồn nào.

Yêu cầu riêng cho fbCaption (ĐỌC KỸ, đây là phần hiển thị công khai trên Fanpage nên phải thật chuyên nghiệp và hấp dẫn):
- Dài khoảng 150-250 chữ (không phải 1 đoạn tóm tắt ngắn 2-3 câu).
- Câu mở đầu phải là 1 câu "hook" thật giật gân/gây tò mò để giữ chân người đọc (câu hỏi, số liệu sốc, hoặc tuyên bố bất ngờ). VIẾT IN HOA TOÀN BỘ khoảng 3-6 từ đầu tiên của câu hook này để tạo điểm nhấn thị giác — chỉ in hoa phần mở đầu, phần còn lại viết bình thường.
- Trình bày CHUYÊN NGHIỆP: chia thành nhiều đoạn ngắn 1-2 câu bằng \\n\\n, có thể dùng gạch đầu dòng bằng emoji (👉, ✅, 🔥...) để liệt kê ý khi phù hợp.
- Dùng 3-5 emoji rải rác đúng chỗ.
- Kết thúc bằng 1 câu kêu gọi tương tác.
- Cuối cùng thêm 3-5 hashtag liên quan, viết liền không dấu cách kiểu #ViDu.

Trả lời CHỈ bằng 1 khối JSON hợp lệ, không markdown, không code fence, không giải thích gì thêm, đúng format sau:
{"articleTitle": "tiêu đề bài viết cho website, hấp dẫn, tối đa 70 ký tự", "articleContent": "nội dung bài viết đầy đủ cho website, khoảng 400-600 chữ, chia đoạn bằng \\n\\n, văn phong tự nhiên và có thông tin thật", "fbCaption": "caption Facebook đầy đủ theo đúng yêu cầu trình bày ở trên", "imageKeywords": "2-4 từ khóa TIẾNG ANH ngắn gọn mô tả hình ảnh minh họa phù hợp"}
SYS;

        $user_message = "Chủ đề/sản phẩm/dịch vụ cần quảng bá: $topic$recent_block";

        $raw = self::call_claude($system, $user_message);
        $parsed = self::parse_json_loose($raw);

        if (!$parsed || empty($parsed['articleContent']) && empty($parsed['fbCaption'])) {
            $tail = substr($raw, -300);
            throw new Exception('AI không trả về JSON hợp lệ (raw length=' . strlen($raw) . ", đuôi: " . wp_json_encode($tail) . ') — đã huỷ đăng để tránh đăng nội dung lỗi.');
        }

        $article_title = trim($parsed['articleTitle'] ?? '') ?: mb_substr($topic, 0, 60);
        $article_content = trim($parsed['articleContent'] ?? '');
        $fb_caption = trim($parsed['fbCaption'] ?? '') ?: mb_substr($article_content, 0, 300);

        return [
            'articleTitle' => $article_title,
            'articleContent' => $article_content,
            'fbCaption' => $fb_caption,
            'imageKeywords' => trim($parsed['imageKeywords'] ?? ''),
        ];
    }

    // Chuyển text thuần (đoạn cách nhau \n\n) thành HTML — PORT của
    // utils/markdownToHtml.js, cần vì wp_insert_post lưu content sẽ được
    // hiển thị qua the_content filter (wpautop có thể xử lý \n\n, nhưng bọc
    // <p> tường minh chắc chắn hơn qua mọi theme/Gutenberg).
    public static function markdown_to_html(string $text): string
    {
        $blocks = preg_split('/\n{2,}/', trim($text));
        $html = [];
        foreach ($blocks as $block) {
            $block = trim($block);
            if ($block === '') continue;
            $block = str_replace("\n", '<br>', esc_html($block));
            $html[] = "<p>$block</p>";
        }
        return implode("\n", $html);
    }

    // Tìm 1 ảnh stock miễn phí qua Pixabay (nếu thầy/khách có cấu hình key) —
    // trả về URL ảnh trực tiếp hoặc null nếu không tìm được/chưa cấu hình.
    public static function find_stock_photo_url(string $keywords): ?string
    {
        $api_key = get_option('aai_ads_pixabay_key');
        if (!$api_key || !$keywords) return null;
        $url = 'https://pixabay.com/api/?key=' . rawurlencode($api_key)
            . '&q=' . rawurlencode($keywords)
            . '&image_type=photo&orientation=horizontal&safesearch=true&per_page=6';
        $res = wp_remote_get($url, ['timeout' => 15]);
        if (is_wp_error($res) || wp_remote_retrieve_response_code($res) !== 200) return null;
        $data = json_decode(wp_remote_retrieve_body($res), true);
        return $data['hits'][0]['largeImageURL'] ?? null;
    }
}
