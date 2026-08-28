/* ============================================================
   English Air — Trình độ A1 (Sơ cấp, khung CEFR)
   Mỗi bài gồm 2 phần theo mô hình "Học trước, Luyện sau":
     teach[]     — các slide dạy: intro / vocab / phrase / grammar / culture / dialogue
     sentences[] — câu dùng cho bài tập ghép câu
   Bài checkpoint không có teach, chỉ luyện lại toàn chương.
   ============================================================ */

const A1 = {
  id: "a1", code: "A1", name: "Sơ cấp",
  desc: "Chào hỏi, giới thiệu bản thân, gia đình, ăn uống và sinh hoạt hằng ngày.",
  units: [

  /* ================= CHƯƠNG 1 ================= */
  {
    id: "a1u1", title: "Chào hỏi & Làm quen",
    goal: "Chào hỏi đúng thời điểm trong ngày và giới thiệu bản thân.",
    lessons: [
      {
        id: "a1u1l1", title: "Xin chào",
        goal: "6 cách chào hỏi và cách đáp lại tự nhiên.",
        teach: [
          { t: "intro", title: "Bài này bạn sẽ học gì?", body: "Người Anh chào theo thời điểm trong ngày. Chọn đúng câu chào là ấn tượng đầu tiên tốt nhất bạn có thể tạo ra.", bullets: ["6 câu chào cơ bản", "Cách đáp lại lời chào", "Khi nào dùng câu nào"] },
          { t: "vocab", en: "hello", vi: "xin chào", pos: "Chào hỏi", ipa: "/həˈloʊ/", note: "Dùng được ở mọi hoàn cảnh, mọi thời điểm. An toàn nhất khi bạn chưa chắc.", ex: { en: "Hello, I am Nam.", vi: "Xin chào, tôi là Nam." } },
          { t: "vocab", en: "hi", vi: "chào", pos: "Chào hỏi", ipa: "/haɪ/", note: "Thân mật hơn hello. Dùng với bạn bè, đồng nghiệp quen.", ex: { en: "Hi, how are you?", vi: "Chào, bạn khoẻ không?" } },
          { t: "vocab", en: "good morning", vi: "chào buổi sáng", pos: "Chào hỏi", ipa: "/ɡʊd ˈmɔːrnɪŋ/", note: "Dùng từ lúc thức dậy đến 12 giờ trưa.", ex: { en: "Good morning, teacher.", vi: "Chào buổi sáng thầy ạ." } },
          { t: "vocab", en: "good afternoon", vi: "chào buổi chiều", pos: "Chào hỏi", ipa: "/ɡʊd ˌæftərˈnuːn/", note: "Từ 12 giờ trưa đến khoảng 6 giờ chiều.", ex: { en: "Good afternoon, everyone.", vi: "Chào buổi chiều mọi người." } },
          { t: "vocab", en: "good evening", vi: "chào buổi tối", pos: "Chào hỏi", ipa: "/ɡʊd ˈiːvnɪŋ/", note: "Sau 6 giờ chiều. Đây là câu CHÀO khi gặp nhau.", ex: { en: "Good evening, sir.", vi: "Chào buổi tối, thưa ông." } },
          { t: "vocab", en: "goodbye", vi: "tạm biệt", pos: "Chào hỏi", ipa: "/ɡʊdˈbaɪ/", note: "Nói khi chia tay. Thân mật hơn thì dùng bye.", ex: { en: "Goodbye, see you tomorrow.", vi: "Tạm biệt, hẹn gặp lại ngày mai." } },
          { t: "phrase", en: "Nice to meet you", vi: "Rất vui được gặp bạn", pos: "Cụm từ", ipa: "/naɪs tə miːt juː/", note: "Chỉ nói ở LẦN ĐẦU gặp mặt. Gặp lại lần sau thì nói Nice to see you again." },
          { t: "culture", title: "Good night không phải lời chào", body: "Rất nhiều người Việt nhầm chỗ này. Good evening là chào khi GẶP vào buổi tối. Good night là chúc ngủ ngon khi bạn RỜI ĐI hoặc đi ngủ. Nói Good night lúc mới gặp ai đó là bạn đang bảo họ về đi ngủ." },
          { t: "dialogue", title: "Gặp nhau buổi sáng", lines: [
            { who: "A", en: "Good morning!", vi: "Chào buổi sáng!" },
            { who: "B", en: "Good morning. Nice to meet you.", vi: "Chào buổi sáng. Rất vui được gặp bạn." },
            { who: "A", en: "Nice to meet you too. Goodbye!", vi: "Tôi cũng vậy. Tạm biệt nhé!" }
          ] }
        ],
        sentences: [
          { en: "Good morning teacher", vi: "Chào buổi sáng thầy" },
          { en: "Nice to meet you", vi: "Rất vui được gặp bạn" },
          { en: "Goodbye see you tomorrow", vi: "Tạm biệt hẹn gặp lại ngày mai" }
        ]
      },

      {
        id: "a1u1l2", title: "Tôi là ai",
        goal: "Động từ to be và cách giới thiệu tên, nghề, quê quán.",
        teach: [
          { t: "intro", title: "Động từ quan trọng nhất tiếng Anh", body: "Câu tiếng Anh bắt buộc phải có động từ. Tiếng Việt nói “Tôi là học sinh” hay “Tôi 20 tuổi” đều không cần động từ, nhưng tiếng Anh thì có: đó là to be.", bullets: ["3 dạng: am / is / are", "Viết tắt: I'm, you're, he's", "Nói tên, nghề và quê quán"] },
          { t: "grammar", title: "To be — am / is / are", body: "Chọn dạng nào là tuỳ chủ ngữ đứng trước. Học thuộc bảng này là xong một nửa ngữ pháp A1.", rows: [
            ["I", "am", "I am Nam. — Tôi là Nam."],
            ["You", "are", "You are a student. — Bạn là học sinh."],
            ["He / She / It", "is", "She is my teacher. — Cô ấy là giáo viên của tôi."],
            ["We / They", "are", "They are from Vietnam. — Họ đến từ Việt Nam."]
          ], tip: "Khi nói, người bản xứ hầu như luôn viết tắt: I'm, you're, he's, she's, we're, they're." },
          { t: "vocab", en: "name", vi: "tên", pos: "Danh từ", ipa: "/neɪm/", note: "First name là tên, last name là họ.", ex: { en: "My name is Lan.", vi: "Tên tôi là Lan." } },
          { t: "vocab", en: "student", vi: "học sinh, sinh viên", pos: "Danh từ", ipa: "/ˈstuːdnt/", note: "Tiếng Anh không phân biệt học sinh và sinh viên như tiếng Việt.", ex: { en: "I am a student.", vi: "Tôi là học sinh." } },
          { t: "vocab", en: "teacher", vi: "giáo viên", pos: "Danh từ", ipa: "/ˈtiːtʃər/", note: "Gọi thầy cô ở nước ngoài thường dùng Mr/Ms + họ, không gọi trống là Teacher.", ex: { en: "He is a teacher.", vi: "Anh ấy là giáo viên." } },
          { t: "vocab", en: "from", vi: "đến từ", pos: "Giới từ", ipa: "/frʌm/", note: "Luôn đi với to be: I am from…, chứ không phải I come from… trong văn nói thường ngày.", ex: { en: "I am from Hanoi.", vi: "Tôi đến từ Hà Nội." } },
          { t: "vocab", en: "country", vi: "đất nước", pos: "Danh từ", ipa: "/ˈkʌntri/", note: "Tên nước luôn viết hoa: Vietnam, England, Japan.", ex: { en: "Vietnam is a beautiful country.", vi: "Việt Nam là một đất nước xinh đẹp." } },
          { t: "phrase", en: "What is your name?", vi: "Tên bạn là gì?", pos: "Cụm từ", ipa: "/wʌt ɪz jɔːr neɪm/", note: "Nói nhanh thành What's your name? Trả lời: My name is… hoặc ngắn gọn I'm…" },
          { t: "dialogue", title: "Làm quen ở lớp học", lines: [
            { who: "A", en: "Hi! What is your name?", vi: "Chào! Tên bạn là gì?" },
            { who: "B", en: "My name is Lan. I am from Hue.", vi: "Tên tôi là Lan. Tôi đến từ Huế." },
            { who: "A", en: "I am Nam. I am a student too.", vi: "Tôi là Nam. Tôi cũng là học sinh." }
          ] }
        ],
        sentences: [
          { en: "My name is Nam", vi: "Tên tôi là Nam" },
          { en: "I am from Vietnam", vi: "Tôi đến từ Việt Nam" },
          { en: "She is my teacher", vi: "Cô ấy là giáo viên của tôi" },
          { en: "What is your name", vi: "Tên bạn là gì" }
        ]
      },

      {
        id: "a1u1l3", title: "Bạn khoẻ không?",
        goal: "Hỏi thăm sức khoẻ và trả lời bằng tính từ cảm xúc.",
        teach: [
          { t: "intro", title: "Câu hỏi bạn sẽ nghe mỗi ngày", body: "How are you? không phải câu hỏi thật về sức khoẻ. Nó là một phần của lời chào. Người ta mong bạn trả lời ngắn và tích cực rồi hỏi lại.", bullets: ["Cách hỏi thăm", "5 tính từ trả lời", "Hỏi ngược lại cho lịch sự"] },
          { t: "phrase", en: "How are you?", vi: "Bạn khoẻ không?", pos: "Cụm từ", ipa: "/haʊ ɑːr juː/", note: "Trả lời chuẩn: I'm fine, thank you. And you? — luôn hỏi ngược lại." },
          { t: "vocab", en: "fine", vi: "ổn, khoẻ", pos: "Tính từ", ipa: "/faɪn/", note: "Câu trả lời trung tính và an toàn nhất.", ex: { en: "I am fine, thank you.", vi: "Tôi khoẻ, cảm ơn bạn." } },
          { t: "vocab", en: "great", vi: "tuyệt", pos: "Tính từ", ipa: "/ɡreɪt/", note: "Mạnh hơn fine, thể hiện bạn đang rất vui.", ex: { en: "I am great today!", vi: "Hôm nay tôi rất tuyệt!" } },
          { t: "vocab", en: "tired", vi: "mệt", pos: "Tính từ", ipa: "/ˈtaɪərd/", note: "Đọc là hai âm /ˈtaɪ-ərd/, không phải một âm.", ex: { en: "I am very tired.", vi: "Tôi rất mệt." } },
          { t: "vocab", en: "happy", vi: "vui, hạnh phúc", pos: "Tính từ", ipa: "/ˈhæpi/", note: "Trái nghĩa là sad (buồn).", ex: { en: "She is happy today.", vi: "Hôm nay cô ấy vui." } },
          { t: "vocab", en: "thanks", vi: "cảm ơn", pos: "Chào hỏi", ipa: "/θæŋks/", note: "Dạng thân mật của thank you. Âm /θ/ đặt lưỡi giữa hai hàm răng.", ex: { en: "Thanks a lot!", vi: "Cảm ơn nhiều!" } },
          { t: "vocab", en: "sorry", vi: "xin lỗi", pos: "Chào hỏi", ipa: "/ˈsɑːri/", note: "Cũng dùng khi nghe không rõ: Sorry? = Bạn nói gì cơ?", ex: { en: "Sorry, I am late.", vi: "Xin lỗi, tôi đến muộn." } },
          { t: "grammar", title: "Very — làm mạnh tính từ", body: "Đặt very ngay trước tính từ để tăng mức độ. Đây là cách đơn giản nhất để câu của bạn giàu sắc thái hơn.", rows: [
            ["very + tính từ", "I am very tired.", "Tôi rất mệt."],
            ["very + tính từ", "This is very good.", "Cái này rất tốt."],
            ["not very + tính từ", "I am not very happy.", "Tôi không vui lắm."]
          ], tip: "Đừng nói very very. Muốn mạnh hơn nữa thì dùng really hoặc so." },
          { t: "culture", title: "Đừng trả lời quá thật", body: "Khi người Anh–Mỹ hỏi How are you?, họ mong nghe I'm fine, thanks — kể cả khi bạn đang mệt. Kể lể chi tiết về sức khoẻ chỉ dành cho bạn thân hoặc bác sĩ." },
          { t: "dialogue", title: "Gặp lại bạn cũ", lines: [
            { who: "A", en: "Hi Lan! How are you?", vi: "Chào Lan! Bạn khoẻ không?" },
            { who: "B", en: "I am fine, thanks. And you?", vi: "Tôi khoẻ, cảm ơn. Còn bạn?" },
            { who: "A", en: "I am very tired today.", vi: "Hôm nay tôi rất mệt." }
          ] }
        ],
        sentences: [
          { en: "I am fine thank you", vi: "Tôi khoẻ cảm ơn bạn" },
          { en: "How are you today", vi: "Hôm nay bạn thế nào" },
          { en: "I am very tired", vi: "Tôi rất mệt" }
        ]
      },

      { id: "a1u1c", title: "Ôn tập chương 1", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  },

  /* ================= CHƯƠNG 2 ================= */
  {
    id: "a1u2", title: "Gia đình & Con người",
    goal: "Giới thiệu người thân, miêu tả người và nói về sở hữu.",
    lessons: [
      {
        id: "a1u2l1", title: "Gia đình tôi",
        goal: "Từ chỉ người thân và tính từ sở hữu my / your / his / her.",
        teach: [
          { t: "intro", title: "Nói về người thân", body: "Muốn giới thiệu gia đình, bạn cần hai thứ: từ chỉ người thân, và từ chỉ “của ai”. Bài này dạy cả hai.", bullets: ["6 từ chỉ người thân", "my / your / his / her", "Giới thiệu một người"] },
          { t: "vocab", en: "family", vi: "gia đình", pos: "Danh từ", ipa: "/ˈfæməli/", note: "Là danh từ số ít: My family is big.", ex: { en: "This is my family.", vi: "Đây là gia đình tôi." } },
          { t: "vocab", en: "mother", vi: "mẹ", pos: "Danh từ", ipa: "/ˈmʌðər/", note: "Thân mật gọi là mum (Anh) hoặc mom (Mỹ).", ex: { en: "My mother is a teacher.", vi: "Mẹ tôi là giáo viên." } },
          { t: "vocab", en: "father", vi: "bố", pos: "Danh từ", ipa: "/ˈfɑːðər/", note: "Thân mật gọi là dad.", ex: { en: "His father is a doctor.", vi: "Bố anh ấy là bác sĩ." } },
          { t: "vocab", en: "brother", vi: "anh trai, em trai", pos: "Danh từ", ipa: "/ˈbrʌðər/", note: "Tiếng Anh không phân biệt anh và em. Cần rõ thì nói older brother / younger brother.", ex: { en: "I have one brother.", vi: "Tôi có một người anh trai." } },
          { t: "vocab", en: "sister", vi: "chị gái, em gái", pos: "Danh từ", ipa: "/ˈsɪstər/", note: "Cũng không phân biệt chị và em như tiếng Việt.", ex: { en: "Her sister is very young.", vi: "Em gái cô ấy còn rất nhỏ." } },
          { t: "vocab", en: "parents", vi: "bố mẹ", pos: "Danh từ", ipa: "/ˈperənts/", note: "Luôn ở dạng số nhiều vì gồm hai người: My parents are…", ex: { en: "My parents are from Hue.", vi: "Bố mẹ tôi đến từ Huế." } },
          { t: "grammar", title: "Tính từ sở hữu", body: "Đặt ngay TRƯỚC danh từ, không cần thêm gì khác. Tiếng Việt nói “mẹ của tôi”, tiếng Anh đảo lại thành “my mother”.", rows: [
            ["my — của tôi", "my mother", "mẹ của tôi"],
            ["your — của bạn", "your family", "gia đình của bạn"],
            ["his — của anh ấy", "his brother", "anh trai của anh ấy"],
            ["her — của cô ấy", "her father", "bố của cô ấy"],
            ["their — của họ", "their parents", "bố mẹ của họ"]
          ], tip: "his hay her là theo giới tính của NGƯỜI SỞ HỮU, không phải của vật được sở hữu." },
          { t: "dialogue", title: "Khoe ảnh gia đình", lines: [
            { who: "A", en: "Is this your family?", vi: "Đây là gia đình bạn à?" },
            { who: "B", en: "Yes. This is my mother and my father.", vi: "Đúng rồi. Đây là mẹ tôi và bố tôi." },
            { who: "A", en: "Her sister is very beautiful.", vi: "Em gái cô ấy xinh quá." }
          ] }
        ],
        sentences: [
          { en: "This is my family", vi: "Đây là gia đình tôi" },
          { en: "My mother is a teacher", vi: "Mẹ tôi là giáo viên" },
          { en: "His brother is a student", vi: "Anh trai anh ấy là học sinh" }
        ]
      },

      {
        id: "a1u2l2", title: "Miêu tả người",
        goal: "Tính từ miêu tả và vị trí của tính từ trong câu.",
        teach: [
          { t: "intro", title: "Trật tự từ khác tiếng Việt", body: "Tiếng Việt nói “người đàn ông cao”. Tiếng Anh đảo ngược: “a tall man”. Nắm được quy tắc này là bạn tránh được lỗi sai phổ biến nhất của người Việt.", bullets: ["6 tính từ miêu tả", "Tính từ đứng TRƯỚC danh từ", "a hay an"] },
          { t: "vocab", en: "man", vi: "người đàn ông", pos: "Danh từ", ipa: "/mæn/", note: "Số nhiều bất quy tắc: men /men/.", ex: { en: "He is a young man.", vi: "Anh ấy là một chàng trai trẻ." } },
          { t: "vocab", en: "woman", vi: "người phụ nữ", pos: "Danh từ", ipa: "/ˈwʊmən/", note: "Số nhiều là women, đọc là /ˈwɪmɪn/ — đổi cả nguyên âm.", ex: { en: "She is a kind woman.", vi: "Cô ấy là một người phụ nữ tốt bụng." } },
          { t: "vocab", en: "friend", vi: "bạn bè", pos: "Danh từ", ipa: "/frend/", note: "Bạn thân là best friend.", ex: { en: "He is my best friend.", vi: "Anh ấy là bạn thân nhất của tôi." } },
          { t: "vocab", en: "tall", vi: "cao", pos: "Tính từ", ipa: "/tɔːl/", note: "Dùng cho người và cây. Nói về núi hay toà nhà thì dùng high.", ex: { en: "My father is very tall.", vi: "Bố tôi rất cao." } },
          { t: "vocab", en: "young", vi: "trẻ", pos: "Tính từ", ipa: "/jʌŋ/", note: "Trái nghĩa là old (già, cũ).", ex: { en: "She is a young teacher.", vi: "Cô ấy là một giáo viên trẻ." } },
          { t: "vocab", en: "old", vi: "già, cũ", pos: "Tính từ", ipa: "/oʊld/", note: "Dùng cho cả người và đồ vật: an old house.", ex: { en: "This is an old book.", vi: "Đây là một quyển sách cũ." } },
          { t: "grammar", title: "a / an và vị trí tính từ", body: "Công thức: a/an + tính từ + danh từ. Chọn a hay an là theo ÂM đầu tiên của từ đứng ngay sau nó.", rows: [
            ["a + phụ âm", "a tall man", "một người đàn ông cao"],
            ["an + nguyên âm", "an old man", "một ông già"],
            ["Sai", "a man tall", "(không đảo như tiếng Việt)"],
            ["Đúng", "a young woman", "một người phụ nữ trẻ"]
          ], tip: "Nghe âm chứ đừng nhìn chữ: an hour (chữ h câm), a university (đọc là /juː/)." },
          { t: "dialogue", title: "Tìm bạn trong đám đông", lines: [
            { who: "A", en: "Where is your friend?", vi: "Bạn của bạn đâu rồi?" },
            { who: "B", en: "He is the tall man over there.", vi: "Anh ấy là người đàn ông cao ở đằng kia." },
            { who: "A", en: "The young man with a book?", vi: "Chàng trai trẻ cầm quyển sách à?" }
          ] }
        ],
        sentences: [
          { en: "He is a tall man", vi: "Anh ấy là một người đàn ông cao" },
          { en: "She is a young teacher", vi: "Cô ấy là một giáo viên trẻ" },
          { en: "This is an old book", vi: "Đây là một quyển sách cũ" }
        ]
      },

      {
        id: "a1u2l3", title: "Sở hữu & Số nhiều",
        goal: "Động từ have / has và cách thêm -s cho danh từ số nhiều.",
        teach: [
          { t: "intro", title: "Nói bạn có gì", body: "Tiếng Việt chỉ có một chữ “có”. Tiếng Anh có hai dạng: have và has. Bài này cũng dạy cách biến một thành nhiều.", bullets: ["have / has", "Danh từ số nhiều thêm -s", "5 từ đồ vật quen thuộc"] },
          { t: "grammar", title: "have hay has?", body: "Quy tắc giống to be: chọn theo chủ ngữ. Chỉ có he / she / it dùng has, còn lại đều have.", rows: [
            ["I / You / We / They", "have", "I have a dog. — Tôi có một con chó."],
            ["He / She / It", "has", "She has two cats. — Cô ấy có hai con mèo."],
            ["Câu phủ định", "do not have", "I do not have a car. — Tôi không có ô tô."],
            ["Câu hỏi", "Do you have…?", "Do you have a book? — Bạn có sách không?"]
          ], tip: "Nói tắt: I've, she's got, don't have." },
          { t: "vocab", en: "dog", vi: "con chó", pos: "Danh từ", ipa: "/dɔːɡ/", pic: "dog", note: "Số nhiều: dogs.", ex: { en: "I have a small dog.", vi: "Tôi có một con chó nhỏ." } },
          { t: "vocab", en: "cat", vi: "con mèo", pos: "Danh từ", ipa: "/kæt/", pic: "cat", note: "Số nhiều: cats.", ex: { en: "She has two cats.", vi: "Cô ấy có hai con mèo." } },
          { t: "vocab", en: "house", vi: "ngôi nhà", pos: "Danh từ", ipa: "/haʊs/", pic: "house", note: "House là toà nhà, home là mái ấm. Về nhà nói go home.", ex: { en: "My house is very old.", vi: "Nhà tôi rất cũ." } },
          { t: "vocab", en: "car", vi: "ô tô", pos: "Danh từ", ipa: "/kɑːr/", pic: "car", note: "Đi bằng ô tô: by car.", ex: { en: "My father has a new car.", vi: "Bố tôi có một chiếc ô tô mới." } },
          { t: "vocab", en: "book", vi: "quyển sách", pos: "Danh từ", ipa: "/bʊk/", pic: "book", note: "Book cũng là động từ: đặt chỗ, đặt vé.", ex: { en: "I have many books.", vi: "Tôi có nhiều sách." } },
          { t: "grammar", title: "Danh từ số nhiều", body: "Phần lớn chỉ cần thêm -s. Một số ít thay đổi khác, phải học thuộc.", rows: [
            ["Thường: + s", "book → books", "sách"],
            ["Tận cùng s, ch, sh, x: + es", "class → classes", "lớp học"],
            ["Bất quy tắc", "man → men, child → children", "đàn ông, trẻ con"],
            ["Không đổi", "fish → fish", "cá"]
          ], tip: "Có số đếm lớn hơn 1 thì danh từ BẮT BUỘC ở số nhiều: two cats, chứ không phải two cat." },
          { t: "dialogue", title: "Hỏi về thú cưng", lines: [
            { who: "A", en: "Do you have a pet?", vi: "Bạn có nuôi thú cưng không?" },
            { who: "B", en: "Yes, I have two cats and a dog.", vi: "Có, tôi có hai con mèo và một con chó." },
            { who: "A", en: "I do not have a pet. I have many books!", vi: "Tôi không nuôi con nào. Tôi có nhiều sách!" }
          ] }
        ],
        sentences: [
          { en: "I have a small dog", vi: "Tôi có một con chó nhỏ" },
          { en: "She has two cats", vi: "Cô ấy có hai con mèo" },
          { en: "My father has a new car", vi: "Bố tôi có một chiếc ô tô mới" }
        ]
      },

      { id: "a1u2c", title: "Ôn tập chương 2", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  },

  /* ================= CHƯƠNG 3 ================= */
  {
    id: "a1u3", title: "Ăn uống",
    goal: "Gọi món, nói sở thích ăn uống và giao tiếp trong nhà hàng.",
    lessons: [
      {
        id: "a1u3l1", title: "Món ăn",
        goal: "Danh từ đếm được, không đếm được và cách dùng some.",
        teach: [
          { t: "intro", title: "Một quả táo, nhưng không phải một cơm", body: "Tiếng Anh chia danh từ làm hai loại. Đếm được thì dùng a/an và số nhiều. Không đếm được thì không bao giờ thêm -s.", bullets: ["6 từ đồ ăn", "Đếm được / không đếm được", "Dùng some cho cả hai"] },
          { t: "vocab", en: "apple", vi: "quả táo", pos: "Danh từ", ipa: "/ˈæpl/", pic: "apple", note: "Đếm được: an apple, two apples.", ex: { en: "I eat an apple every day.", vi: "Tôi ăn một quả táo mỗi ngày." } },
          { t: "vocab", en: "bread", vi: "bánh mì", pos: "Danh từ", ipa: "/bred/", pic: "bread", note: "KHÔNG đếm được. Muốn đếm phải nói a loaf of bread hoặc a slice of bread.", ex: { en: "I want some bread.", vi: "Tôi muốn một ít bánh mì." } },
          { t: "vocab", en: "rice", vi: "cơm, gạo", pos: "Danh từ", ipa: "/raɪs/", note: "Không đếm được, không bao giờ có rices.", ex: { en: "We eat rice every day.", vi: "Chúng tôi ăn cơm mỗi ngày." } },
          { t: "vocab", en: "egg", vi: "quả trứng", pos: "Danh từ", ipa: "/eɡ/", note: "Đếm được: an egg, three eggs.", ex: { en: "She has two eggs.", vi: "Cô ấy có hai quả trứng." } },
          { t: "vocab", en: "fish", vi: "con cá, thịt cá", pos: "Danh từ", ipa: "/fɪʃ/", pic: "fish", note: "Số nhiều vẫn là fish. Fishes chỉ dùng khi nói về nhiều LOÀI cá khác nhau.", ex: { en: "I like fish and rice.", vi: "Tôi thích cá và cơm." } },
          { t: "vocab", en: "meat", vi: "thịt", pos: "Danh từ", ipa: "/miːt/", note: "Không đếm được. Đọc giống hệt meet (gặp).", ex: { en: "He does not eat meat.", vi: "Anh ấy không ăn thịt." } },
          { t: "grammar", title: "a / an / some", body: "Đây là bảng quyết định nhanh khi bạn không chắc dùng gì.", rows: [
            ["Đếm được, số ít", "an apple, an egg", "một quả táo, một quả trứng"],
            ["Đếm được, số nhiều", "some apples", "vài quả táo"],
            ["Không đếm được", "some bread, some rice", "một ít bánh mì, một ít cơm"],
            ["Sai", "a bread, two rices", "(không đếm được thì không đếm)"]
          ], tip: "Không chắc? Dùng some. Nó đúng với cả hai loại danh từ." },
          { t: "culture", title: "Bữa sáng khác nhau", body: "Người Việt ăn phở, bún, xôi vào bữa sáng. Người Anh–Mỹ thường ăn bread, eggs, cereal. Khi kể về bữa ăn của mình, đừng ngại giải thích — đó là chủ đề trò chuyện rất được yêu thích." }
        ],
        sentences: [
          { en: "I eat rice every day", vi: "Tôi ăn cơm mỗi ngày" },
          { en: "She has two eggs", vi: "Cô ấy có hai quả trứng" },
          { en: "I want some bread", vi: "Tôi muốn một ít bánh mì" }
        ]
      },

      {
        id: "a1u3l2", title: "Đồ uống",
        goal: "Nói về sở thích với like và don't like.",
        teach: [
          { t: "intro", title: "Nói bạn thích gì", body: "like là động từ thường, nên câu phủ định và câu hỏi phải mượn trợ động từ do / does. Đây là điểm ngữ pháp mới quan trọng nhất của bài.", bullets: ["6 từ đồ uống", "like / likes", "don't like / doesn't like"] },
          { t: "vocab", en: "water", vi: "nước", pos: "Danh từ", ipa: "/ˈwɔːtər/", pic: "water", note: "Không đếm được. Gọi nước ở quán: a glass of water.", ex: { en: "Can I have some water?", vi: "Cho tôi xin ít nước được không?" } },
          { t: "vocab", en: "coffee", vi: "cà phê", pos: "Danh từ", ipa: "/ˈkɔːfi/", pic: "coffee", note: "Gọi một ly thì nói a coffee — người bản xứ vẫn nói vậy dù nó không đếm được.", ex: { en: "I drink coffee in the morning.", vi: "Tôi uống cà phê vào buổi sáng." } },
          { t: "vocab", en: "tea", vi: "trà", pos: "Danh từ", ipa: "/tiː/", note: "Trà đá là iced tea, trà sữa là milk tea.", ex: { en: "The tea is very hot.", vi: "Trà rất nóng." } },
          { t: "vocab", en: "milk", vi: "sữa", pos: "Danh từ", ipa: "/mɪlk/", note: "Không đếm được.", ex: { en: "Children drink milk.", vi: "Trẻ con uống sữa." } },
          { t: "vocab", en: "juice", vi: "nước ép", pos: "Danh từ", ipa: "/dʒuːs/", note: "Nước cam là orange juice.", ex: { en: "I like orange juice.", vi: "Tôi thích nước cam." } },
          { t: "vocab", en: "drink", vi: "uống", pos: "Động từ", ipa: "/drɪŋk/", note: "Vừa là động từ (uống) vừa là danh từ (đồ uống).", ex: { en: "What do you want to drink?", vi: "Bạn muốn uống gì?" } },
          { t: "grammar", title: "like và don't like", body: "Với he / she / it thì động từ thêm -s, nhưng khi đã có does thì động từ chính trở lại nguyên dạng.", rows: [
            ["I / You / We / They", "like", "I like tea. — Tôi thích trà."],
            ["He / She / It", "likes", "She likes coffee. — Cô ấy thích cà phê."],
            ["Phủ định", "do not like", "I do not like milk. — Tôi không thích sữa."],
            ["Phủ định (he/she)", "does not like", "He does not like tea. — Anh ấy không thích trà."],
            ["Câu hỏi", "Do you like…?", "Do you like coffee? — Bạn thích cà phê không?"]
          ], tip: "Lỗi rất phổ biến: He doesn't likes. Đã có does thì KHÔNG thêm -s nữa." },
          { t: "dialogue", title: "Ở quán cà phê", lines: [
            { who: "A", en: "Do you like coffee?", vi: "Bạn thích cà phê không?" },
            { who: "B", en: "No, I do not like coffee. I like tea.", vi: "Không, tôi không thích cà phê. Tôi thích trà." },
            { who: "A", en: "OK. Two teas and some water, please.", vi: "Được thôi. Cho hai trà và một ít nước nhé." }
          ] }
        ],
        sentences: [
          { en: "I drink coffee in the morning", vi: "Tôi uống cà phê vào buổi sáng" },
          { en: "She likes tea and milk", vi: "Cô ấy thích trà và sữa" },
          { en: "Can I have some water", vi: "Cho tôi xin ít nước được không" }
        ]
      },

      {
        id: "a1u3l3", title: "Ở nhà hàng",
        goal: "Mẫu câu gọi món lịch sự và từ vựng nhà hàng.",
        teach: [
          { t: "intro", title: "Gọi món cho lịch sự", body: "I want a coffee đúng ngữ pháp nhưng nghe cộc lốc. Bài này dạy hai mẫu câu lịch sự mà người bản xứ thực sự dùng.", bullets: ["6 từ nhà hàng", "Can I have…? / I would like…", "Hỏi hoá đơn"] },
          { t: "vocab", en: "restaurant", vi: "nhà hàng", pos: "Danh từ", ipa: "/ˈrestrɑːnt/", note: "Chú ý phát âm: chỉ 2–3 âm tiết, không đọc rõ chữ au.", ex: { en: "This restaurant is very good.", vi: "Nhà hàng này rất ngon." } },
          { t: "vocab", en: "menu", vi: "thực đơn", pos: "Danh từ", ipa: "/ˈmenjuː/", note: "Đọc là /ˈmen-juː/, không phải “mê-nu”.", ex: { en: "Can I see the menu?", vi: "Cho tôi xem thực đơn được không?" } },
          { t: "vocab", en: "order", vi: "gọi món", pos: "Động từ", ipa: "/ˈɔːrdər/", note: "Vừa là động từ vừa là danh từ: Are you ready to order?", ex: { en: "I want to order now.", vi: "Tôi muốn gọi món bây giờ." } },
          { t: "vocab", en: "bill", vi: "hoá đơn", pos: "Danh từ", ipa: "/bɪl/", note: "Người Anh nói bill, người Mỹ nói check.", ex: { en: "Can I have the bill, please?", vi: "Cho tôi xin hoá đơn nhé?" } },
          { t: "vocab", en: "delicious", vi: "ngon", pos: "Tính từ", ipa: "/dɪˈlɪʃəs/", note: "Mạnh hơn good rất nhiều. Khen món ăn thì dùng từ này.", ex: { en: "The food is delicious.", vi: "Món ăn rất ngon." } },
          { t: "vocab", en: "hungry", vi: "đói", pos: "Tính từ", ipa: "/ˈhʌŋɡri/", note: "Đi với to be: I am hungry, KHÔNG phải I have hungry.", ex: { en: "I am very hungry.", vi: "Tôi rất đói." } },
          { t: "grammar", title: "Hai mẫu câu lịch sự", body: "Thêm please vào cuối là mức lịch sự chuẩn ở nhà hàng.", rows: [
            ["Can I have…?", "Can I have a coffee, please?", "Cho tôi một cà phê nhé?"],
            ["I would like…", "I would like some water.", "Tôi muốn một ít nước."],
            ["Viết tắt", "I'd like the fish, please.", "Cho tôi món cá nhé."],
            ["Quá cộc", "Give me a coffee.", "(đừng nói như vậy)"]
          ], tip: "I'd like lịch sự hơn I want. Ở nhà hàng, gần như luôn dùng I'd like." },
          { t: "dialogue", title: "Gọi món", lines: [
            { who: "A", en: "Good evening. Are you ready to order?", vi: "Chào buổi tối. Anh chị gọi món chưa ạ?" },
            { who: "B", en: "Yes. I would like the fish, please.", vi: "Rồi. Cho tôi món cá nhé." },
            { who: "A", en: "And to drink?", vi: "Đồ uống thì sao ạ?" },
            { who: "B", en: "Can I have some water, please?", vi: "Cho tôi xin ít nước nhé?" }
          ] }
        ],
        sentences: [
          { en: "I am very hungry", vi: "Tôi rất đói" },
          { en: "Can I see the menu", vi: "Cho tôi xem thực đơn được không" },
          { en: "The food is delicious", vi: "Món ăn rất ngon" }
        ]
      },

      { id: "a1u3c", title: "Ôn tập chương 3", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  },

  /* ================= CHƯƠNG 4 ================= */
  {
    id: "a1u4", title: "Đời sống hằng ngày",
    goal: "Nói về giờ giấc, thói quen và việc học ở trường.",
    lessons: [
      {
        id: "a1u4l1", title: "Thời gian",
        goal: "Từ chỉ thời gian và giới từ at / in / on.",
        teach: [
          { t: "intro", title: "Ba giới từ, ba quy tắc", body: "at, in, on đều dịch là “vào lúc”, nhưng dùng sai là lộ ngay. May mắn là quy tắc rất gọn: giờ dùng at, buổi dùng in, ngày dùng on.", bullets: ["6 từ chỉ thời gian", "at / in / on", "Hỏi giờ"] },
          { t: "vocab", en: "time", vi: "thời gian, giờ", pos: "Danh từ", ipa: "/taɪm/", pic: "clock", note: "Hỏi giờ: What time is it?", ex: { en: "What time is it now?", vi: "Bây giờ là mấy giờ?" } },
          { t: "vocab", en: "morning", vi: "buổi sáng", pos: "Danh từ", ipa: "/ˈmɔːrnɪŋ/", note: "Đi với in: in the morning.", ex: { en: "I study in the morning.", vi: "Tôi học vào buổi sáng." } },
          { t: "vocab", en: "night", vi: "buổi tối, ban đêm", pos: "Danh từ", ipa: "/naɪt/", note: "Ngoại lệ: at night, không phải in the night.", ex: { en: "I sleep at night.", vi: "Tôi ngủ vào ban đêm." } },
          { t: "vocab", en: "today", vi: "hôm nay", pos: "Trạng từ", ipa: "/təˈdeɪ/", note: "Không cần giới từ: I work today, không phải on today.", ex: { en: "I am busy today.", vi: "Hôm nay tôi bận." } },
          { t: "vocab", en: "tomorrow", vi: "ngày mai", pos: "Trạng từ", ipa: "/təˈmɑːroʊ/", note: "Cũng không cần giới từ.", ex: { en: "See you tomorrow.", vi: "Hẹn gặp lại ngày mai." } },
          { t: "vocab", en: "week", vi: "tuần", pos: "Danh từ", ipa: "/wiːk/", note: "Cuối tuần là weekend. Đọc giống weak (yếu).", ex: { en: "I work five days a week.", vi: "Tôi làm việc năm ngày một tuần." } },
          { t: "grammar", title: "at / in / on", body: "Học theo độ dài thời gian: càng ngắn càng dùng at, càng dài càng dùng in.", rows: [
            ["at + giờ", "at 7 o'clock", "lúc 7 giờ"],
            ["at + night", "at night", "vào ban đêm"],
            ["in + buổi", "in the morning", "vào buổi sáng"],
            ["in + tháng, năm", "in May, in 2026", "vào tháng Năm, năm 2026"],
            ["on + thứ, ngày", "on Monday", "vào thứ Hai"]
          ], tip: "today, tomorrow, yesterday, next week KHÔNG dùng giới từ." },
          { t: "dialogue", title: "Hẹn giờ", lines: [
            { who: "A", en: "What time is it?", vi: "Mấy giờ rồi?" },
            { who: "B", en: "It is seven o'clock.", vi: "Bảy giờ rồi." },
            { who: "A", en: "I have a class at eight in the morning.", vi: "Tôi có lớp lúc tám giờ sáng." }
          ] }
        ],
        sentences: [
          { en: "I study in the morning", vi: "Tôi học vào buổi sáng" },
          { en: "What time is it now", vi: "Bây giờ là mấy giờ" },
          { en: "See you tomorrow", vi: "Hẹn gặp lại ngày mai" }
        ]
      },

      {
        id: "a1u4l2", title: "Thói quen hằng ngày",
        goal: "Thì hiện tại đơn và quy tắc thêm -s cho ngôi thứ ba.",
        teach: [
          { t: "intro", title: "Thì của việc lặp lại mỗi ngày", body: "Hiện tại đơn dùng cho thói quen và sự thật. Quy tắc duy nhất cần nhớ: he / she / it thì động từ thêm -s.", bullets: ["6 động từ hằng ngày", "Thêm -s cho he/she/it", "Trạng từ tần suất"] },
          { t: "vocab", en: "get up", vi: "thức dậy", pos: "Động từ", ipa: "/ɡet ʌp/", note: "Cụm động từ. Rời khỏi giường là get up, còn wake up là tỉnh giấc.", ex: { en: "I get up at six.", vi: "Tôi dậy lúc sáu giờ." } },
          { t: "vocab", en: "work", vi: "làm việc", pos: "Động từ", ipa: "/wɜːrk/", note: "Vừa là động từ vừa là danh từ (công việc).", ex: { en: "She works in a school.", vi: "Cô ấy làm việc ở một trường học." } },
          { t: "vocab", en: "study", vi: "học", pos: "Động từ", ipa: "/ˈstʌdi/", note: "Ngôi thứ ba đổi y thành ies: studies.", ex: { en: "He studies English.", vi: "Anh ấy học tiếng Anh." } },
          { t: "vocab", en: "eat", vi: "ăn", pos: "Động từ", ipa: "/iːt/", note: "Quá khứ bất quy tắc là ate.", ex: { en: "We eat at seven.", vi: "Chúng tôi ăn lúc bảy giờ." } },
          { t: "vocab", en: "sleep", vi: "ngủ", pos: "Động từ", ipa: "/sliːp/", note: "Buồn ngủ là sleepy.", ex: { en: "I sleep eight hours.", vi: "Tôi ngủ tám tiếng." } },
          { t: "vocab", en: "go", vi: "đi", pos: "Động từ", ipa: "/ɡoʊ/", note: "Ngôi thứ ba là goes, thêm -es.", ex: { en: "She goes to school.", vi: "Cô ấy đi học." } },
          { t: "grammar", title: "Thêm -s cho ngôi thứ ba", body: "Chỉ he, she, it mới đổi. Tất cả ngôi khác giữ nguyên động từ.", rows: [
            ["Thường: + s", "work → works", "He works every day."],
            ["Tận cùng o, ch, sh, x: + es", "go → goes", "She goes to school."],
            ["Phụ âm + y: đổi thành ies", "study → studies", "He studies English."],
            ["Bất quy tắc", "have → has", "She has a car."]
          ], tip: "Trạng từ tần suất đứng TRƯỚC động từ thường: I always get up at six. Nhưng đứng SAU to be: I am always tired." },
          { t: "dialogue", title: "Một ngày của bạn", lines: [
            { who: "A", en: "What time do you get up?", vi: "Bạn dậy lúc mấy giờ?" },
            { who: "B", en: "I get up at six and I study in the morning.", vi: "Tôi dậy lúc sáu giờ và học vào buổi sáng." },
            { who: "A", en: "My sister gets up at seven. She goes to school at eight.", vi: "Em gái tôi dậy lúc bảy giờ. Nó đi học lúc tám giờ." }
          ] }
        ],
        sentences: [
          { en: "I get up at six every day", vi: "Tôi dậy lúc sáu giờ mỗi ngày" },
          { en: "She goes to school at eight", vi: "Cô ấy đi học lúc tám giờ" },
          { en: "He studies English at night", vi: "Anh ấy học tiếng Anh vào buổi tối" }
        ]
      },

      {
        id: "a1u4l3", title: "Ở trường",
        goal: "Từ vựng trường lớp và động từ khuyết thiếu can.",
        teach: [
          { t: "intro", title: "Nói bạn làm được gì", body: "can là động từ đặc biệt: sau nó động từ luôn ở dạng nguyên thể, không bao giờ thêm -s, và câu hỏi không cần do.", bullets: ["6 từ trường lớp", "can / can't", "Xin phép bằng can"] },
          { t: "vocab", en: "school", vi: "trường học", pos: "Danh từ", ipa: "/skuːl/", pic: "school", note: "Đi học nói go to school, không có the.", ex: { en: "I go to school every day.", vi: "Tôi đến trường mỗi ngày." } },
          { t: "vocab", en: "class", vi: "lớp học", pos: "Danh từ", ipa: "/klæs/", note: "Số nhiều là classes.", ex: { en: "My class has thirty students.", vi: "Lớp tôi có ba mươi học sinh." } },
          { t: "vocab", en: "homework", vi: "bài tập về nhà", pos: "Danh từ", ipa: "/ˈhoʊmwɜːrk/", note: "KHÔNG đếm được, không bao giờ có homeworks.", ex: { en: "I do my homework at night.", vi: "Tôi làm bài tập vào buổi tối." } },
          { t: "vocab", en: "learn", vi: "học được, tiếp thu", pos: "Động từ", ipa: "/lɜːrn/", note: "study là hành động ngồi học, learn là kết quả tiếp thu được.", ex: { en: "I learn English every day.", vi: "Tôi học tiếng Anh mỗi ngày." } },
          { t: "vocab", en: "question", vi: "câu hỏi", pos: "Danh từ", ipa: "/ˈkwestʃən/", note: "Đặt câu hỏi nói ask a question.", ex: { en: "Can I ask a question?", vi: "Tôi hỏi một câu được không?" } },
          { t: "vocab", en: "answer", vi: "câu trả lời, trả lời", pos: "Danh từ", ipa: "/ˈænsər/", note: "Chữ w câm, đọc là /ˈæn-sər/.", ex: { en: "I know the answer.", vi: "Tôi biết câu trả lời." } },
          { t: "grammar", title: "can — làm được, được phép", body: "can dùng chung cho mọi chủ ngữ, không đổi dạng. Động từ theo sau luôn nguyên thể.", rows: [
            ["Khẳng định", "I can speak English.", "Tôi nói được tiếng Anh."],
            ["Phủ định", "She cannot swim.", "Cô ấy không biết bơi."],
            ["Viết tắt", "He can't come today.", "Hôm nay anh ấy không đến được."],
            ["Câu hỏi", "Can you help me?", "Bạn giúp tôi được không?"],
            ["Xin phép", "Can I ask a question?", "Tôi hỏi một câu được không?"]
          ], tip: "Không bao giờ nói She cans hay He can speaks. can không đổi, động từ sau nó cũng không đổi." },
          { t: "culture", title: "Hỏi là chuyện bình thường", body: "Ở lớp học phương Tây, đặt câu hỏi được xem là dấu hiệu của người học tích cực, không phải làm phiền thầy cô. Câu Can I ask a question? luôn được hoan nghênh." },
          { t: "dialogue", title: "Trong lớp", lines: [
            { who: "A", en: "Can I ask a question?", vi: "Em hỏi một câu được không ạ?" },
            { who: "B", en: "Of course. What is your question?", vi: "Tất nhiên rồi. Câu hỏi của em là gì?" },
            { who: "A", en: "I can't do my homework. Can you help me?", vi: "Em không làm được bài tập. Thầy giúp em được không ạ?" }
          ] }
        ],
        sentences: [
          { en: "I go to school every day", vi: "Tôi đến trường mỗi ngày" },
          { en: "Can you help me", vi: "Bạn giúp tôi được không" },
          { en: "I do my homework at night", vi: "Tôi làm bài tập vào buổi tối" }
        ]
      },

      { id: "a1u4c", title: "Ôn tập chương 4", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  },

  /* ================= CHƯƠNG 5 ================= */
  {
    id: "a1u5", title: "Số đếm & Mua sắm",
    goal: "Đếm số, hỏi giá và mua bán bằng tiếng Anh.",
    lessons: [
      {
        id: "a1u5l1", title: "Số đếm 1–100",
        goal: "Đọc số và ba cái bẫy phát âm người Việt hay mắc.",
        teach: [
          { t: "intro", title: "Số là thứ dùng nhiều nhất", body: "Giá tiền, giờ giấc, tuổi tác, số nhà — không có số thì gần như không nói được gì. Bài này gom cả bảng số vào ba quy luật ngắn.", bullets: ["1–12 phải học thuộc", "13–19 thêm đuôi -teen", "20–90 thêm đuôi -ty"] },
          { t: "grammar", title: "Ba nhóm số", body: "Chỉ có nhóm đầu là phải học thuộc lòng. Hai nhóm sau đều có quy luật.", rows: [
            ["1–12 học thuộc", "one, two, three… twelve", "một, hai, ba… mười hai"],
            ["13–19 thêm -teen", "thirteen, fourteen… nineteen", "mười ba, mười bốn… mười chín"],
            ["20–90 thêm -ty", "twenty, thirty… ninety", "hai mươi, ba mươi… chín mươi"],
            ["Ghép có gạch nối", "twenty-one, forty-five", "hai mươi mốt, bốn mươi lăm"],
            ["Hàng trăm", "one hundred", "một trăm"]
          ], tip: "Ba số đổi chính tả, không theo quy luật: three→thirteen/thirty, five→fifteen/fifty, eight→eighteen/eighty." },
          { t: "vocab", en: "number", vi: "con số", pos: "Danh từ", ipa: "/ˈnʌmbər/", note: "Số điện thoại là phone number.", ex: { en: "What is your phone number?", vi: "Số điện thoại của bạn là gì?" } },
          { t: "vocab", en: "first", vi: "thứ nhất", pos: "Tính từ", ipa: "/fɜːrst/", note: "Số thứ tự khác số đếm: one → first, two → second, three → third.", ex: { en: "This is my first lesson.", vi: "Đây là bài học đầu tiên của tôi." } },
          { t: "vocab", en: "count", vi: "đếm", pos: "Động từ", ipa: "/kaʊnt/", note: "Đếm từ 1 đến 10 là count from one to ten.", ex: { en: "Can you count to twenty?", vi: "Bạn đếm đến hai mươi được không?" } },
          { t: "vocab", en: "age", vi: "tuổi", pos: "Danh từ", ipa: "/eɪdʒ/", note: "Nhưng hỏi tuổi thì KHÔNG dùng age — phải nói How old are you?", ex: { en: "My age is fifteen.", vi: "Tuổi tôi là mười lăm." } },
          { t: "culture", title: "Bẫy nghe: -teen hay -ty?", body: "Fifteen (15) và fifty (50) rất dễ nghe nhầm. Mẹo: đuôi -teen được nhấn mạnh ở CUỐI từ (fif-TEEN), còn đuôi -ty nhấn ở ĐẦU (FIF-ty). Khi mua bán mà nghe không chắc, cứ hỏi lại: Did you say fifteen or fifty?" },
          { t: "dialogue", title: "Hỏi tuổi", lines: [
            { who: "A", en: "How old are you?", vi: "Bạn bao nhiêu tuổi?" },
            { who: "B", en: "I am fifteen years old. And you?", vi: "Tôi mười lăm tuổi. Còn bạn?" },
            { who: "A", en: "I am thirteen. My father is fifty.", vi: "Tôi mười ba. Bố tôi năm mươi." }
          ] }
        ],
        sentences: [
          { en: "How old are you", vi: "Bạn bao nhiêu tuổi" },
          { en: "I am fifteen years old", vi: "Tôi mười lăm tuổi" },
          { en: "This is my first lesson", vi: "Đây là bài học đầu tiên của tôi" }
        ]
      },
      {
        id: "a1u5l2", title: "Ở cửa hàng",
        goal: "Hỏi giá và mẫu câu mua hàng.",
        teach: [
          { t: "intro", title: "Ba câu là mua được hàng", body: "Vào cửa hàng nước ngoài chỉ cần ba câu: hỏi giá, nói muốn mua, và xin hoá đơn. Bài này dạy đủ ba.", bullets: ["How much…?", "I would like…", "Từ vựng cửa hàng"] },
          { t: "vocab", en: "shop", vi: "cửa hàng", pos: "Danh từ", ipa: "/ʃɑːp/", note: "Anh–Mỹ hay dùng store. Đi mua sắm là go shopping.", ex: { en: "The shop opens at nine.", vi: "Cửa hàng mở cửa lúc chín giờ." } },
          { t: "vocab", en: "price", vi: "giá", pos: "Danh từ", ipa: "/praɪs/", note: "Đắt là expensive, rẻ là cheap.", ex: { en: "The price is too high.", vi: "Giá cao quá." } },
          { t: "vocab", en: "pay", vi: "trả tiền", pos: "Động từ", ipa: "/peɪ/", note: "Trả bằng thẻ là pay by card, trả tiền mặt là pay in cash.", ex: { en: "Can I pay by card?", vi: "Tôi trả bằng thẻ được không?" } },
          { t: "vocab", en: "cheap", vi: "rẻ", pos: "Tính từ", ipa: "/tʃiːp/", note: "Khen đồ rẻ mà tốt thì nói good value, vì cheap đôi khi hàm ý kém chất lượng.", ex: { en: "This shirt is very cheap.", vi: "Cái áo này rất rẻ." } },
          { t: "vocab", en: "expensive", vi: "đắt", pos: "Tính từ", ipa: "/ɪkˈspensɪv/", note: "Nhấn ở âm thứ hai: ex-PEN-sive.", ex: { en: "That phone is expensive.", vi: "Chiếc điện thoại đó đắt." } },
          { t: "vocab", en: "size", vi: "cỡ, kích cỡ", pos: "Danh từ", ipa: "/saɪz/", note: "Xin thử cỡ khác: Do you have a bigger size?", ex: { en: "What size do you want?", vi: "Bạn muốn cỡ nào?" } },
          { t: "phrase", en: "How much is it?", vi: "Cái này bao nhiêu tiền?", pos: "Cụm từ", ipa: "/haʊ mʌtʃ ɪz ɪt/", note: "Hỏi giá nhiều món thì dùng How much are they? Hỏi số lượng thì lại là How many." },
          { t: "grammar", title: "How much hay How many?", body: "Chọn theo loại danh từ đứng sau — đúng cái quy tắc đếm được / không đếm được đã học ở chương 3.", rows: [
            ["How much + không đếm được", "How much water?", "Bao nhiêu nước?"],
            ["How many + đếm được", "How many books?", "Bao nhiêu quyển sách?"],
            ["Hỏi giá luôn dùng much", "How much is this shirt?", "Cái áo này bao nhiêu tiền?"]
          ], tip: "Tiền bạc luôn coi là không đếm được, nên hỏi giá thì luôn là How much, không bao giờ How many." },
          { t: "dialogue", title: "Mua áo", lines: [
            { who: "A", en: "How much is this shirt?", vi: "Cái áo này bao nhiêu tiền?" },
            { who: "B", en: "It is two hundred thousand dong.", vi: "Hai trăm nghìn đồng." },
            { who: "A", en: "That is expensive. Do you have a cheaper one?", vi: "Đắt quá. Có cái nào rẻ hơn không?" }
          ] }
        ],
        sentences: [
          { en: "How much is this shirt", vi: "Cái áo này bao nhiêu tiền" },
          { en: "Can I pay by card", vi: "Tôi trả bằng thẻ được không" },
          { en: "That phone is very expensive", vi: "Chiếc điện thoại đó rất đắt" }
        ]
      },
      {
        id: "a1u5l3", title: "Màu sắc & Quần áo",
        goal: "Gọi tên màu và đồ mặc, đặt tính từ đúng chỗ.",
        teach: [
          { t: "intro", title: "Màu đứng ở đâu trong câu?", body: "Tiếng Việt nói “áo đỏ”, tiếng Anh nói “red shirt” — màu đứng TRƯỚC. Đây vẫn là quy tắc tính từ đứng trước danh từ đã học ở chương 2.", bullets: ["6 màu cơ bản", "5 món quần áo", "Thứ tự tính từ"] },
          { t: "vocab", en: "red", vi: "màu đỏ", pos: "Tính từ", ipa: "/red/", note: "Cũng dùng cho tóc đỏ: red hair.", ex: { en: "She has a red bag.", vi: "Cô ấy có một cái túi màu đỏ." } },
          { t: "vocab", en: "blue", vi: "màu xanh dương", pos: "Tính từ", ipa: "/bluː/", note: "Tiếng Việt gọi chung là “xanh”, tiếng Anh tách hẳn blue và green.", ex: { en: "The sky is blue.", vi: "Bầu trời màu xanh." } },
          { t: "vocab", en: "green", vi: "màu xanh lá", pos: "Tính từ", ipa: "/ɡriːn/", note: "Cũng nghĩa là thân thiện môi trường: green energy.", ex: { en: "I like green tea.", vi: "Tôi thích trà xanh." } },
          { t: "vocab", en: "black", vi: "màu đen", pos: "Tính từ", ipa: "/blæk/", note: "Cà phê đen là black coffee.", ex: { en: "He wears a black shirt.", vi: "Anh ấy mặc áo đen." } },
          { t: "vocab", en: "white", vi: "màu trắng", pos: "Tính từ", ipa: "/waɪt/", note: "Chú ý âm /w/ ở đầu, không đọc thành “oai”.", ex: { en: "I need a white shirt.", vi: "Tôi cần một cái áo trắng." } },
          { t: "vocab", en: "shirt", vi: "áo sơ mi", pos: "Danh từ", ipa: "/ʃɜːrt/", note: "Áo phông là T-shirt.", ex: { en: "This shirt is too big.", vi: "Cái áo này rộng quá." } },
          { t: "vocab", en: "wear", vi: "mặc, đeo", pos: "Động từ", ipa: "/wer/", note: "Dùng cho cả quần áo, giày, kính, đồng hồ. Quá khứ bất quy tắc: wore.", ex: { en: "I wear a white shirt to school.", vi: "Tôi mặc áo trắng đi học." } },
          { t: "grammar", title: "Thứ tự tính từ", body: "Khi có nhiều tính từ, tiếng Anh có thứ tự cố định. Với trình độ A1 chỉ cần nhớ: kích cỡ đứng trước màu sắc.", rows: [
            ["Cỡ + màu + danh từ", "a big red bag", "một cái túi đỏ to"],
            ["Cỡ + màu + danh từ", "a small black cat", "một con mèo đen nhỏ"],
            ["Sai thứ tự", "a red big bag", "(nghe rất lạ tai)"]
          ], tip: "Mẹo nhớ: cái gì đo được (to, nhỏ) thì nói trước, cái gì nhìn thấy (màu) nói sau." },
          { t: "dialogue", title: "Chọn áo", lines: [
            { who: "A", en: "What colour do you want?", vi: "Bạn muốn màu gì?" },
            { who: "B", en: "I want a white shirt, size medium.", vi: "Tôi muốn áo trắng, cỡ vừa." },
            { who: "A", en: "We have a big blue one too.", vi: "Chúng tôi cũng có cái màu xanh to hơn." }
          ] }
        ],
        sentences: [
          { en: "I wear a white shirt to school", vi: "Tôi mặc áo trắng đi học" },
          { en: "She has a big red bag", vi: "Cô ấy có một cái túi đỏ to" },
          { en: "What colour do you want", vi: "Bạn muốn màu gì" }
        ]
      },
      { id: "a1u5c", title: "Ôn tập chương 5", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  },

  /* ================= CHƯƠNG 6 ================= */
  {
    id: "a1u6", title: "Sức khoẻ & Chỉ đường",
    goal: "Nói về sức khoẻ, hỏi đường và chỉ đường.",
    lessons: [
      {
        id: "a1u6l1", title: "Cơ thể & Ốm đau",
        goal: "Bộ phận cơ thể và cách nói mình bị đau ở đâu.",
        teach: [
          { t: "intro", title: "Nói cho bác sĩ hiểu", body: "Đi khám ở nước ngoài, chỉ cần biết tên bộ phận cơ thể và một mẫu câu là nói được mình đau ở đâu.", bullets: ["6 bộ phận cơ thể", "Mẫu câu: I have a…", "Từ chỉ triệu chứng"] },
          { t: "vocab", en: "head", vi: "cái đầu", pos: "Danh từ", ipa: "/hed/", note: "Đau đầu là a headache, đọc là /ˈhed-eɪk/.", ex: { en: "I have a headache.", vi: "Tôi bị đau đầu." } },
          { t: "vocab", en: "eye", vi: "con mắt", pos: "Danh từ", ipa: "/aɪ/", note: "Đọc giống chữ I. Hai mắt là eyes.", ex: { en: "She has beautiful eyes.", vi: "Cô ấy có đôi mắt đẹp." } },
          { t: "vocab", en: "hand", vi: "bàn tay", pos: "Danh từ", ipa: "/hænd/", note: "Cánh tay là arm, ngón tay là finger.", ex: { en: "Wash your hands.", vi: "Rửa tay đi." } },
          { t: "vocab", en: "leg", vi: "cái chân", pos: "Danh từ", ipa: "/leɡ/", note: "Leg là cả chân, foot là bàn chân.", ex: { en: "My leg hurts.", vi: "Chân tôi đau." } },
          { t: "vocab", en: "sick", vi: "ốm, bệnh", pos: "Tính từ", ipa: "/sɪk/", note: "Đi với to be: I am sick. Nghỉ ốm là a sick day.", ex: { en: "He is sick today.", vi: "Hôm nay anh ấy bị ốm." } },
          { t: "vocab", en: "doctor", vi: "bác sĩ", pos: "Danh từ", ipa: "/ˈdɑːktər/", note: "Đi khám là go to the doctor.", ex: { en: "You should see a doctor.", vi: "Bạn nên đi khám bác sĩ." } },
          { t: "grammar", title: "Nói mình bị đau", body: "Có hai mẫu, dùng cái nào cũng được.", rows: [
            ["I have a + bệnh", "I have a headache.", "Tôi bị đau đầu."],
            ["My + bộ phận + hurts", "My leg hurts.", "Chân tôi đau."],
            ["I feel + tính từ", "I feel sick.", "Tôi thấy khó chịu."],
            ["Sai", "I am headache.", "(phải là I have a headache)"]
          ], tip: "Các bệnh thường gặp đều ghép với -ache: headache (đau đầu), toothache (đau răng), stomachache (đau bụng)." },
          { t: "dialogue", title: "Ở phòng khám", lines: [
            { who: "A", en: "How do you feel today?", vi: "Hôm nay bạn thấy thế nào?" },
            { who: "B", en: "I am sick. I have a headache.", vi: "Tôi bị ốm. Tôi đau đầu." },
            { who: "A", en: "You should see a doctor.", vi: "Bạn nên đi khám bác sĩ." }
          ] }
        ],
        sentences: [
          { en: "I have a headache", vi: "Tôi bị đau đầu" },
          { en: "He is sick today", vi: "Hôm nay anh ấy bị ốm" },
          { en: "You should see a doctor", vi: "Bạn nên đi khám bác sĩ" }
        ]
      },
      {
        id: "a1u6l2", title: "Hỏi đường",
        goal: "Hỏi đường và hiểu câu chỉ đường.",
        teach: [
          { t: "intro", title: "Lạc đường thì hỏi thế nào?", body: "Chỉ cần một câu hỏi và bốn từ chỉ hướng là bạn tìm được đường ở bất cứ thành phố nào.", bullets: ["Excuse me, where is…?", "left / right / straight", "Từ vựng nơi chốn"] },
          { t: "phrase", en: "Excuse me, where is the station?", vi: "Xin lỗi, nhà ga ở đâu ạ?", pos: "Cụm từ", ipa: "/ɪkˈskjuːz miː wer ɪz/", note: "Excuse me là câu mở lời bắt buộc khi hỏi người lạ. Không có nó nghe rất cộc." },
          { t: "vocab", en: "left", vi: "bên trái", pos: "Danh từ", ipa: "/left/", note: "Rẽ trái là turn left. Bên tay trái là on the left.", ex: { en: "Turn left at the corner.", vi: "Rẽ trái ở góc đường." } },
          { t: "vocab", en: "right", vi: "bên phải", pos: "Danh từ", ipa: "/raɪt/", note: "Right còn nghĩa là đúng: That's right!", ex: { en: "The shop is on the right.", vi: "Cửa hàng ở bên phải." } },
          { t: "vocab", en: "straight", vi: "thẳng", pos: "Trạng từ", ipa: "/streɪt/", note: "Đi thẳng là go straight. Chữ gh câm.", ex: { en: "Go straight for two minutes.", vi: "Đi thẳng khoảng hai phút." } },
          { t: "vocab", en: "near", vi: "gần", pos: "Tính từ", ipa: "/nɪr/", note: "Trái nghĩa là far (xa).", ex: { en: "The school is near my house.", vi: "Trường học gần nhà tôi." } },
          { t: "vocab", en: "station", vi: "nhà ga, bến", pos: "Danh từ", ipa: "/ˈsteɪʃn/", note: "Bến xe buýt là bus station, ga tàu là train station.", ex: { en: "Where is the bus station?", vi: "Bến xe buýt ở đâu?" } },
          { t: "vocab", en: "map", vi: "bản đồ", pos: "Danh từ", ipa: "/mæp/", note: "Xem bản đồ là look at the map.", ex: { en: "Can I see your map?", vi: "Cho tôi xem bản đồ được không?" } },
          { t: "grammar", title: "Câu mệnh lệnh chỉ đường", body: "Chỉ đường dùng câu mệnh lệnh: bỏ chủ ngữ, bắt đầu luôn bằng động từ nguyên thể.", rows: [
            ["Động từ + hướng", "Turn left.", "Rẽ trái."],
            ["Động từ + hướng", "Go straight.", "Đi thẳng."],
            ["Thêm nơi chốn", "Turn right at the school.", "Rẽ phải ở chỗ trường học."],
            ["Lịch sự hơn", "Please go straight.", "Làm ơn đi thẳng."]
          ], tip: "Muốn lịch sự thì thêm please ở đầu hoặc cuối câu, không cần đổi gì khác." },
          { t: "culture", title: "Hỏi đường sao cho lịch sự", body: "Ở phương Tây, mở lời bằng Excuse me rồi mới hỏi là bắt buộc. Hỏi xong nhớ nói Thank you, kể cả khi người ta không biết đường. Chạm vào người lạ để gây chú ý bị coi là bất lịch sự." },
          { t: "dialogue", title: "Tìm nhà ga", lines: [
            { who: "A", en: "Excuse me, where is the station?", vi: "Xin lỗi, nhà ga ở đâu ạ?" },
            { who: "B", en: "Go straight, then turn left. It is near the school.", vi: "Đi thẳng, rồi rẽ trái. Nó ở gần trường học." },
            { who: "A", en: "Thank you very much!", vi: "Cảm ơn bạn rất nhiều!" }
          ] }
        ],
        sentences: [
          { en: "Turn left at the corner", vi: "Rẽ trái ở góc đường" },
          { en: "The school is near my house", vi: "Trường học gần nhà tôi" },
          { en: "Where is the bus station", vi: "Bến xe buýt ở đâu" }
        ]
      },
      {
        id: "a1u6l3", title: "Thời tiết",
        goal: "Nói về thời tiết — chủ đề mở đầu câu chuyện phổ biến nhất.",
        teach: [
          { t: "intro", title: "Câu chuyện mở đầu an toàn nhất", body: "Người Anh nói về thời tiết mọi lúc. Biết vài câu là bạn luôn có cách bắt chuyện với người lạ.", bullets: ["6 từ thời tiết", "Mẫu It is…", "Hỏi thời tiết"] },
          { t: "vocab", en: "weather", vi: "thời tiết", pos: "Danh từ", ipa: "/ˈweðər/", note: "Không đếm được, không bao giờ có weathers.", ex: { en: "The weather is nice today.", vi: "Hôm nay thời tiết đẹp." } },
          { t: "vocab", en: "sunny", vi: "nắng", pos: "Tính từ", ipa: "/ˈsʌni/", note: "Từ sun (mặt trời) thêm -ny.", ex: { en: "It is sunny today.", vi: "Hôm nay trời nắng." } },
          { t: "vocab", en: "rain", vi: "mưa", pos: "Danh từ", ipa: "/reɪn/", note: "Vừa là danh từ vừa là động từ: It rains a lot. Trời đang mưa: It is raining.", ex: { en: "I like the rain.", vi: "Tôi thích mưa." } },
          { t: "vocab", en: "cold", vi: "lạnh", pos: "Tính từ", ipa: "/koʊld/", note: "Cold còn là danh từ nghĩa là cảm lạnh: I have a cold.", ex: { en: "It is very cold in December.", vi: "Tháng Mười Hai rất lạnh." } },
          { t: "vocab", en: "warm", vi: "ấm", pos: "Tính từ", ipa: "/wɔːrm/", note: "Ấm dễ chịu là warm, nóng bức là hot.", ex: { en: "Spring is warm.", vi: "Mùa xuân thì ấm áp." } },
          { t: "vocab", en: "wind", vi: "gió", pos: "Danh từ", ipa: "/wɪnd/", note: "Có gió là windy.", ex: { en: "There is a lot of wind today.", vi: "Hôm nay nhiều gió." } },
          { t: "grammar", title: "Chủ ngữ giả “It”", body: "Nói về thời tiết, giờ giấc, khoảng cách thì tiếng Anh bắt buộc phải có chủ ngữ It, dù chẳng chỉ vật gì cả.", rows: [
            ["Thời tiết", "It is sunny.", "Trời nắng."],
            ["Giờ giấc", "It is seven o'clock.", "Bảy giờ rồi."],
            ["Đang diễn ra", "It is raining.", "Trời đang mưa."],
            ["Sai", "Is sunny today.", "(thiếu chủ ngữ It)"]
          ], tip: "Người Việt hay quên chữ It vì tiếng Việt nói “Trời nắng” là đủ. Tiếng Anh thì câu nào cũng phải có chủ ngữ." },
          { t: "dialogue", title: "Bắt chuyện về thời tiết", lines: [
            { who: "A", en: "How is the weather today?", vi: "Hôm nay thời tiết thế nào?" },
            { who: "B", en: "It is sunny and warm.", vi: "Trời nắng và ấm." },
            { who: "A", en: "Nice! Yesterday it was very cold.", vi: "Tuyệt! Hôm qua trời rất lạnh." }
          ] }
        ],
        sentences: [
          { en: "The weather is nice today", vi: "Hôm nay thời tiết đẹp" },
          { en: "It is sunny and warm", vi: "Trời nắng và ấm" },
          { en: "It is very cold in December", vi: "Tháng Mười Hai rất lạnh" }
        ]
      },
      { id: "a1u6c", title: "Ôn tập chương 6", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  }

  ]
};
