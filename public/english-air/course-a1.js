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
          { t: "vocab", en: "hello", vi: "xin chào", ipa: "/həˈloʊ/", note: "Dùng được ở mọi hoàn cảnh, mọi thời điểm. An toàn nhất khi bạn chưa chắc.", ex: { en: "Hello, I am Nam.", vi: "Xin chào, tôi là Nam." } },
          { t: "vocab", en: "hi", vi: "chào", ipa: "/haɪ/", note: "Thân mật hơn hello. Dùng với bạn bè, đồng nghiệp quen.", ex: { en: "Hi, how are you?", vi: "Chào, bạn khoẻ không?" } },
          { t: "vocab", en: "good morning", vi: "chào buổi sáng", ipa: "/ɡʊd ˈmɔːrnɪŋ/", note: "Dùng từ lúc thức dậy đến 12 giờ trưa.", ex: { en: "Good morning, teacher.", vi: "Chào buổi sáng thầy ạ." } },
          { t: "vocab", en: "good afternoon", vi: "chào buổi chiều", ipa: "/ɡʊd ˌæftərˈnuːn/", note: "Từ 12 giờ trưa đến khoảng 6 giờ chiều.", ex: { en: "Good afternoon, everyone.", vi: "Chào buổi chiều mọi người." } },
          { t: "vocab", en: "good evening", vi: "chào buổi tối", ipa: "/ɡʊd ˈiːvnɪŋ/", note: "Sau 6 giờ chiều. Đây là câu CHÀO khi gặp nhau.", ex: { en: "Good evening, sir.", vi: "Chào buổi tối, thưa ông." } },
          { t: "vocab", en: "goodbye", vi: "tạm biệt", ipa: "/ɡʊdˈbaɪ/", note: "Nói khi chia tay. Thân mật hơn thì dùng bye.", ex: { en: "Goodbye, see you tomorrow.", vi: "Tạm biệt, hẹn gặp lại ngày mai." } },
          { t: "phrase", en: "Nice to meet you", vi: "Rất vui được gặp bạn", ipa: "/naɪs tə miːt juː/", note: "Chỉ nói ở LẦN ĐẦU gặp mặt. Gặp lại lần sau thì nói Nice to see you again." },
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
          { t: "vocab", en: "name", vi: "tên", ipa: "/neɪm/", note: "First name là tên, last name là họ.", ex: { en: "My name is Lan.", vi: "Tên tôi là Lan." } },
          { t: "vocab", en: "student", vi: "học sinh, sinh viên", ipa: "/ˈstuːdnt/", note: "Tiếng Anh không phân biệt học sinh và sinh viên như tiếng Việt.", ex: { en: "I am a student.", vi: "Tôi là học sinh." } },
          { t: "vocab", en: "teacher", vi: "giáo viên", ipa: "/ˈtiːtʃər/", note: "Gọi thầy cô ở nước ngoài thường dùng Mr/Ms + họ, không gọi trống là Teacher.", ex: { en: "He is a teacher.", vi: "Anh ấy là giáo viên." } },
          { t: "vocab", en: "from", vi: "đến từ", ipa: "/frʌm/", note: "Luôn đi với to be: I am from…, chứ không phải I come from… trong văn nói thường ngày.", ex: { en: "I am from Hanoi.", vi: "Tôi đến từ Hà Nội." } },
          { t: "vocab", en: "country", vi: "đất nước", ipa: "/ˈkʌntri/", note: "Tên nước luôn viết hoa: Vietnam, England, Japan.", ex: { en: "Vietnam is a beautiful country.", vi: "Việt Nam là một đất nước xinh đẹp." } },
          { t: "phrase", en: "What is your name?", vi: "Tên bạn là gì?", ipa: "/wʌt ɪz jɔːr neɪm/", note: "Nói nhanh thành What's your name? Trả lời: My name is… hoặc ngắn gọn I'm…" },
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
          { t: "phrase", en: "How are you?", vi: "Bạn khoẻ không?", ipa: "/haʊ ɑːr juː/", note: "Trả lời chuẩn: I'm fine, thank you. And you? — luôn hỏi ngược lại." },
          { t: "vocab", en: "fine", vi: "ổn, khoẻ", ipa: "/faɪn/", note: "Câu trả lời trung tính và an toàn nhất.", ex: { en: "I am fine, thank you.", vi: "Tôi khoẻ, cảm ơn bạn." } },
          { t: "vocab", en: "great", vi: "tuyệt", ipa: "/ɡreɪt/", note: "Mạnh hơn fine, thể hiện bạn đang rất vui.", ex: { en: "I am great today!", vi: "Hôm nay tôi rất tuyệt!" } },
          { t: "vocab", en: "tired", vi: "mệt", ipa: "/ˈtaɪərd/", note: "Đọc là hai âm /ˈtaɪ-ərd/, không phải một âm.", ex: { en: "I am very tired.", vi: "Tôi rất mệt." } },
          { t: "vocab", en: "happy", vi: "vui, hạnh phúc", ipa: "/ˈhæpi/", note: "Trái nghĩa là sad (buồn).", ex: { en: "She is happy today.", vi: "Hôm nay cô ấy vui." } },
          { t: "vocab", en: "thanks", vi: "cảm ơn", ipa: "/θæŋks/", note: "Dạng thân mật của thank you. Âm /θ/ đặt lưỡi giữa hai hàm răng.", ex: { en: "Thanks a lot!", vi: "Cảm ơn nhiều!" } },
          { t: "vocab", en: "sorry", vi: "xin lỗi", ipa: "/ˈsɑːri/", note: "Cũng dùng khi nghe không rõ: Sorry? = Bạn nói gì cơ?", ex: { en: "Sorry, I am late.", vi: "Xin lỗi, tôi đến muộn." } },
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
          { t: "vocab", en: "family", vi: "gia đình", ipa: "/ˈfæməli/", note: "Là danh từ số ít: My family is big.", ex: { en: "This is my family.", vi: "Đây là gia đình tôi." } },
          { t: "vocab", en: "mother", vi: "mẹ", ipa: "/ˈmʌðər/", note: "Thân mật gọi là mum (Anh) hoặc mom (Mỹ).", ex: { en: "My mother is a teacher.", vi: "Mẹ tôi là giáo viên." } },
          { t: "vocab", en: "father", vi: "bố", ipa: "/ˈfɑːðər/", note: "Thân mật gọi là dad.", ex: { en: "His father is a doctor.", vi: "Bố anh ấy là bác sĩ." } },
          { t: "vocab", en: "brother", vi: "anh trai, em trai", ipa: "/ˈbrʌðər/", note: "Tiếng Anh không phân biệt anh và em. Cần rõ thì nói older brother / younger brother.", ex: { en: "I have one brother.", vi: "Tôi có một người anh trai." } },
          { t: "vocab", en: "sister", vi: "chị gái, em gái", ipa: "/ˈsɪstər/", note: "Cũng không phân biệt chị và em như tiếng Việt.", ex: { en: "Her sister is very young.", vi: "Em gái cô ấy còn rất nhỏ." } },
          { t: "vocab", en: "parents", vi: "bố mẹ", ipa: "/ˈperənts/", note: "Luôn ở dạng số nhiều vì gồm hai người: My parents are…", ex: { en: "My parents are from Hue.", vi: "Bố mẹ tôi đến từ Huế." } },
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
          { t: "vocab", en: "man", vi: "người đàn ông", ipa: "/mæn/", note: "Số nhiều bất quy tắc: men /men/.", ex: { en: "He is a young man.", vi: "Anh ấy là một chàng trai trẻ." } },
          { t: "vocab", en: "woman", vi: "người phụ nữ", ipa: "/ˈwʊmən/", note: "Số nhiều là women, đọc là /ˈwɪmɪn/ — đổi cả nguyên âm.", ex: { en: "She is a kind woman.", vi: "Cô ấy là một người phụ nữ tốt bụng." } },
          { t: "vocab", en: "friend", vi: "bạn bè", ipa: "/frend/", note: "Bạn thân là best friend.", ex: { en: "He is my best friend.", vi: "Anh ấy là bạn thân nhất của tôi." } },
          { t: "vocab", en: "tall", vi: "cao", ipa: "/tɔːl/", note: "Dùng cho người và cây. Nói về núi hay toà nhà thì dùng high.", ex: { en: "My father is very tall.", vi: "Bố tôi rất cao." } },
          { t: "vocab", en: "young", vi: "trẻ", ipa: "/jʌŋ/", note: "Trái nghĩa là old (già, cũ).", ex: { en: "She is a young teacher.", vi: "Cô ấy là một giáo viên trẻ." } },
          { t: "vocab", en: "old", vi: "già, cũ", ipa: "/oʊld/", note: "Dùng cho cả người và đồ vật: an old house.", ex: { en: "This is an old book.", vi: "Đây là một quyển sách cũ." } },
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
          { t: "vocab", en: "dog", vi: "con chó", ipa: "/dɔːɡ/", pic: "dog", note: "Số nhiều: dogs.", ex: { en: "I have a small dog.", vi: "Tôi có một con chó nhỏ." } },
          { t: "vocab", en: "cat", vi: "con mèo", ipa: "/kæt/", pic: "cat", note: "Số nhiều: cats.", ex: { en: "She has two cats.", vi: "Cô ấy có hai con mèo." } },
          { t: "vocab", en: "house", vi: "ngôi nhà", ipa: "/haʊs/", pic: "house", note: "House là toà nhà, home là mái ấm. Về nhà nói go home.", ex: { en: "My house is very old.", vi: "Nhà tôi rất cũ." } },
          { t: "vocab", en: "car", vi: "ô tô", ipa: "/kɑːr/", pic: "car", note: "Đi bằng ô tô: by car.", ex: { en: "My father has a new car.", vi: "Bố tôi có một chiếc ô tô mới." } },
          { t: "vocab", en: "book", vi: "quyển sách", ipa: "/bʊk/", pic: "book", note: "Book cũng là động từ: đặt chỗ, đặt vé.", ex: { en: "I have many books.", vi: "Tôi có nhiều sách." } },
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
          { t: "vocab", en: "apple", vi: "quả táo", ipa: "/ˈæpl/", pic: "apple", note: "Đếm được: an apple, two apples.", ex: { en: "I eat an apple every day.", vi: "Tôi ăn một quả táo mỗi ngày." } },
          { t: "vocab", en: "bread", vi: "bánh mì", ipa: "/bred/", pic: "bread", note: "KHÔNG đếm được. Muốn đếm phải nói a loaf of bread hoặc a slice of bread.", ex: { en: "I want some bread.", vi: "Tôi muốn một ít bánh mì." } },
          { t: "vocab", en: "rice", vi: "cơm, gạo", ipa: "/raɪs/", note: "Không đếm được, không bao giờ có rices.", ex: { en: "We eat rice every day.", vi: "Chúng tôi ăn cơm mỗi ngày." } },
          { t: "vocab", en: "egg", vi: "quả trứng", ipa: "/eɡ/", note: "Đếm được: an egg, three eggs.", ex: { en: "She has two eggs.", vi: "Cô ấy có hai quả trứng." } },
          { t: "vocab", en: "fish", vi: "con cá, thịt cá", ipa: "/fɪʃ/", pic: "fish", note: "Số nhiều vẫn là fish. Fishes chỉ dùng khi nói về nhiều LOÀI cá khác nhau.", ex: { en: "I like fish and rice.", vi: "Tôi thích cá và cơm." } },
          { t: "vocab", en: "meat", vi: "thịt", ipa: "/miːt/", note: "Không đếm được. Đọc giống hệt meet (gặp).", ex: { en: "He does not eat meat.", vi: "Anh ấy không ăn thịt." } },
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
          { t: "vocab", en: "water", vi: "nước", ipa: "/ˈwɔːtər/", pic: "water", note: "Không đếm được. Gọi nước ở quán: a glass of water.", ex: { en: "Can I have some water?", vi: "Cho tôi xin ít nước được không?" } },
          { t: "vocab", en: "coffee", vi: "cà phê", ipa: "/ˈkɔːfi/", pic: "coffee", note: "Gọi một ly thì nói a coffee — người bản xứ vẫn nói vậy dù nó không đếm được.", ex: { en: "I drink coffee in the morning.", vi: "Tôi uống cà phê vào buổi sáng." } },
          { t: "vocab", en: "tea", vi: "trà", ipa: "/tiː/", note: "Trà đá là iced tea, trà sữa là milk tea.", ex: { en: "The tea is very hot.", vi: "Trà rất nóng." } },
          { t: "vocab", en: "milk", vi: "sữa", ipa: "/mɪlk/", note: "Không đếm được.", ex: { en: "Children drink milk.", vi: "Trẻ con uống sữa." } },
          { t: "vocab", en: "juice", vi: "nước ép", ipa: "/dʒuːs/", note: "Nước cam là orange juice.", ex: { en: "I like orange juice.", vi: "Tôi thích nước cam." } },
          { t: "vocab", en: "drink", vi: "uống", ipa: "/drɪŋk/", note: "Vừa là động từ (uống) vừa là danh từ (đồ uống).", ex: { en: "What do you want to drink?", vi: "Bạn muốn uống gì?" } },
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
          { t: "vocab", en: "restaurant", vi: "nhà hàng", ipa: "/ˈrestrɑːnt/", note: "Chú ý phát âm: chỉ 2–3 âm tiết, không đọc rõ chữ au.", ex: { en: "This restaurant is very good.", vi: "Nhà hàng này rất ngon." } },
          { t: "vocab", en: "menu", vi: "thực đơn", ipa: "/ˈmenjuː/", note: "Đọc là /ˈmen-juː/, không phải “mê-nu”.", ex: { en: "Can I see the menu?", vi: "Cho tôi xem thực đơn được không?" } },
          { t: "vocab", en: "order", vi: "gọi món", ipa: "/ˈɔːrdər/", note: "Vừa là động từ vừa là danh từ: Are you ready to order?", ex: { en: "I want to order now.", vi: "Tôi muốn gọi món bây giờ." } },
          { t: "vocab", en: "bill", vi: "hoá đơn", ipa: "/bɪl/", note: "Người Anh nói bill, người Mỹ nói check.", ex: { en: "Can I have the bill, please?", vi: "Cho tôi xin hoá đơn nhé?" } },
          { t: "vocab", en: "delicious", vi: "ngon", ipa: "/dɪˈlɪʃəs/", note: "Mạnh hơn good rất nhiều. Khen món ăn thì dùng từ này.", ex: { en: "The food is delicious.", vi: "Món ăn rất ngon." } },
          { t: "vocab", en: "hungry", vi: "đói", ipa: "/ˈhʌŋɡri/", note: "Đi với to be: I am hungry, KHÔNG phải I have hungry.", ex: { en: "I am very hungry.", vi: "Tôi rất đói." } },
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
          { t: "vocab", en: "time", vi: "thời gian, giờ", ipa: "/taɪm/", pic: "clock", note: "Hỏi giờ: What time is it?", ex: { en: "What time is it now?", vi: "Bây giờ là mấy giờ?" } },
          { t: "vocab", en: "morning", vi: "buổi sáng", ipa: "/ˈmɔːrnɪŋ/", note: "Đi với in: in the morning.", ex: { en: "I study in the morning.", vi: "Tôi học vào buổi sáng." } },
          { t: "vocab", en: "night", vi: "buổi tối, ban đêm", ipa: "/naɪt/", note: "Ngoại lệ: at night, không phải in the night.", ex: { en: "I sleep at night.", vi: "Tôi ngủ vào ban đêm." } },
          { t: "vocab", en: "today", vi: "hôm nay", ipa: "/təˈdeɪ/", note: "Không cần giới từ: I work today, không phải on today.", ex: { en: "I am busy today.", vi: "Hôm nay tôi bận." } },
          { t: "vocab", en: "tomorrow", vi: "ngày mai", ipa: "/təˈmɑːroʊ/", note: "Cũng không cần giới từ.", ex: { en: "See you tomorrow.", vi: "Hẹn gặp lại ngày mai." } },
          { t: "vocab", en: "week", vi: "tuần", ipa: "/wiːk/", note: "Cuối tuần là weekend. Đọc giống weak (yếu).", ex: { en: "I work five days a week.", vi: "Tôi làm việc năm ngày một tuần." } },
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
          { t: "vocab", en: "get up", vi: "thức dậy", ipa: "/ɡet ʌp/", note: "Cụm động từ. Rời khỏi giường là get up, còn wake up là tỉnh giấc.", ex: { en: "I get up at six.", vi: "Tôi dậy lúc sáu giờ." } },
          { t: "vocab", en: "work", vi: "làm việc", ipa: "/wɜːrk/", note: "Vừa là động từ vừa là danh từ (công việc).", ex: { en: "She works in a school.", vi: "Cô ấy làm việc ở một trường học." } },
          { t: "vocab", en: "study", vi: "học", ipa: "/ˈstʌdi/", note: "Ngôi thứ ba đổi y thành ies: studies.", ex: { en: "He studies English.", vi: "Anh ấy học tiếng Anh." } },
          { t: "vocab", en: "eat", vi: "ăn", ipa: "/iːt/", note: "Quá khứ bất quy tắc là ate.", ex: { en: "We eat at seven.", vi: "Chúng tôi ăn lúc bảy giờ." } },
          { t: "vocab", en: "sleep", vi: "ngủ", ipa: "/sliːp/", note: "Buồn ngủ là sleepy.", ex: { en: "I sleep eight hours.", vi: "Tôi ngủ tám tiếng." } },
          { t: "vocab", en: "go", vi: "đi", ipa: "/ɡoʊ/", note: "Ngôi thứ ba là goes, thêm -es.", ex: { en: "She goes to school.", vi: "Cô ấy đi học." } },
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
          { t: "vocab", en: "school", vi: "trường học", ipa: "/skuːl/", pic: "school", note: "Đi học nói go to school, không có the.", ex: { en: "I go to school every day.", vi: "Tôi đến trường mỗi ngày." } },
          { t: "vocab", en: "class", vi: "lớp học", ipa: "/klæs/", note: "Số nhiều là classes.", ex: { en: "My class has thirty students.", vi: "Lớp tôi có ba mươi học sinh." } },
          { t: "vocab", en: "homework", vi: "bài tập về nhà", ipa: "/ˈhoʊmwɜːrk/", note: "KHÔNG đếm được, không bao giờ có homeworks.", ex: { en: "I do my homework at night.", vi: "Tôi làm bài tập vào buổi tối." } },
          { t: "vocab", en: "learn", vi: "học được, tiếp thu", ipa: "/lɜːrn/", note: "study là hành động ngồi học, learn là kết quả tiếp thu được.", ex: { en: "I learn English every day.", vi: "Tôi học tiếng Anh mỗi ngày." } },
          { t: "vocab", en: "question", vi: "câu hỏi", ipa: "/ˈkwestʃən/", note: "Đặt câu hỏi nói ask a question.", ex: { en: "Can I ask a question?", vi: "Tôi hỏi một câu được không?" } },
          { t: "vocab", en: "answer", vi: "câu trả lời, trả lời", ipa: "/ˈænsər/", note: "Chữ w câm, đọc là /ˈæn-sər/.", ex: { en: "I know the answer.", vi: "Tôi biết câu trả lời." } },
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
  }

  ]
};
