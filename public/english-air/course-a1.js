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

      {
        id: "a1u1l4", title: "Bạn từ đâu đến?",
        goal: "Hỏi và trả lời về quê quán, quốc tịch, thứ tiếng mình nói.",
        teach: [
          { t: "intro", title: "Câu hỏi thứ hai sau khi biết tên", body: "Gặp người nước ngoài, sau câu hỏi tên là câu hỏi quê quán. Chỉ cần thuộc một mẫu câu là bạn trả lời được cả đời.", bullets: ["Where are you from?", "Tên nước và tên thứ tiếng", "Nói mình sống ở đâu"] },
          { t: "vocab", en: "city", vi: "thành phố", pos: "Danh từ", ipa: "/ˈsɪti/", note: "Thành phố lớn. Làng quê là village, thị trấn nhỏ là town.", ex: { en: "Hanoi is a big city.", vi: "Hà Nội là một thành phố lớn." } },
          { t: "vocab", en: "live", vi: "sống, ở", pos: "Động từ", ipa: "/lɪv/", note: "Live in + thành phố, live at + số nhà. Đừng nhầm với leave (rời đi).", ex: { en: "I live in Da Nang.", vi: "Tôi sống ở Đà Nẵng." } },
          { t: "vocab", en: "speak", vi: "nói (một thứ tiếng)", pos: "Động từ", ipa: "/spiːk/", note: "Speak dùng cho thứ tiếng: speak English. Còn talk là trò chuyện với ai đó.", ex: { en: "I speak Vietnamese.", vi: "Tôi nói tiếng Việt." } },
          { t: "vocab", en: "language", vi: "ngôn ngữ", pos: "Danh từ", ipa: "/ˈlæŋɡwɪdʒ/", note: "Tên thứ tiếng luôn viết hoa: English, Vietnamese, Chinese.", ex: { en: "English is a useful language.", vi: "Tiếng Anh là một ngôn ngữ hữu ích." } },
          { t: "vocab", en: "village", vi: "làng", pos: "Danh từ", ipa: "/ˈvɪlɪdʒ/", note: "Nơi ở nhỏ ở nông thôn. Người Anh–Mỹ rất hay hỏi bạn lớn lên ở đâu.", ex: { en: "My village is very quiet.", vi: "Làng tôi rất yên tĩnh." } },
          { t: "phrase", en: "Where are you from?", vi: "Bạn đến từ đâu?", pos: "Cụm từ", ipa: "/wer ɑːr juː frʌm/", note: "Trả lời: I'm from Vietnam. Không nói I from Vietnam — thiếu động từ là sai." },
          { t: "grammar", title: "Tên nước và tên người của nước đó", body: "Tiếng Anh có hai từ khác nhau: một cho tên nước, một cho người và thứ tiếng của nước đó. Học theo cặp cho nhanh.", rows: [
            ["Vietnam", "Vietnamese", "I am Vietnamese. — Tôi là người Việt."],
            ["England", "English", "She speaks English. — Cô ấy nói tiếng Anh."],
            ["China", "Chinese", "He is Chinese. — Anh ấy là người Trung Quốc."],
            ["Japan", "Japanese", "They are Japanese. — Họ là người Nhật."]
          ], tip: "Trước tên nước KHÔNG có a/an: I am from Vietnam, chứ không phải from a Vietnam." },
          { t: "culture", title: "Hỏi quê quán là chuyện bình thường", body: "Người Anh–Mỹ coi Where are you from? là câu làm quen lịch sự, không phải tò mò. Nhưng hỏi tuổi, hỏi lương, hỏi sao chưa lấy vợ chồng thì lại là bất lịch sự — ngược hẳn với thói quen ở Việt Nam." },
          { t: "dialogue", title: "Làm quen ở sân bay", lines: [
            { who: "A", en: "Hello! Where are you from?", vi: "Xin chào! Bạn đến từ đâu?" },
            { who: "B", en: "I am from Vietnam. I live in Hue.", vi: "Tôi đến từ Việt Nam. Tôi sống ở Huế." },
            { who: "A", en: "Nice! Do you speak English?", vi: "Hay quá! Bạn có nói tiếng Anh không?" },
            { who: "B", en: "Yes, a little. I am a student.", vi: "Có, một chút. Tôi là học sinh." }
          ] }
        ],
        sentences: [
          { en: "Where are you from", vi: "Bạn đến từ đâu" },
          { en: "I live in a small village", vi: "Tôi sống ở một ngôi làng nhỏ" },
          { en: "She speaks three languages", vi: "Cô ấy nói được ba thứ tiếng" },
          { en: "Hanoi is a big city", vi: "Hà Nội là một thành phố lớn" },
          { en: "I am Vietnamese", vi: "Tôi là người Việt Nam" }
        ]
      },
      {
        id: "a1u1l5", title: "Cảm ơn & Xin lỗi",
        goal: "Nói lời cảm ơn, xin lỗi, xin phép cho đúng lúc đúng chỗ.",
        teach: [
          { t: "intro", title: "Bốn chữ đổi được cả thiện cảm", body: "Please, thank you, sorry, excuse me — người Anh–Mỹ dùng bốn cụm này nhiều gấp mấy lần người Việt. Thiếu chúng, câu đúng ngữ pháp vẫn nghe cộc lốc.", bullets: ["Xin phép trước khi làm phiền", "Đáp lại lời cảm ơn", "Phân biệt sorry và excuse me"] },
          { t: "vocab", en: "please", vi: "làm ơn, xin vui lòng", pos: "Trạng từ", ipa: "/pliːz/", note: "Thêm vào cuối câu đề nghị là câu lịch sự ngay: Water, please.", ex: { en: "One coffee, please.", vi: "Cho tôi một cà phê." } },
          { t: "vocab", en: "welcome", vi: "hoan nghênh, không có gì", pos: "Tính từ", ipa: "/ˈwelkəm/", note: "You're welcome là câu đáp lại thank you thông dụng nhất.", ex: { en: "You are welcome.", vi: "Không có gì." } },
          { t: "vocab", en: "help", vi: "giúp đỡ", pos: "Động từ", ipa: "/help/", note: "Can you help me? là câu nhờ vả an toàn nhất, dùng được với người lạ.", ex: { en: "Can you help me, please?", vi: "Bạn giúp tôi được không?" } },
          { t: "phrase", en: "Of course", vi: "Tất nhiên rồi", pos: "Cụm từ", ipa: "/əv kɔːrs/", note: "Câu đồng ý nhiệt tình nhất. Nói khi ai đó nhờ mình việc gì." },
          { t: "phrase", en: "Excuse me", vi: "Xin lỗi cho hỏi", pos: "Cụm từ", ipa: "/ɪkˈskjuːz miː/", note: "Dùng TRƯỚC khi làm phiền ai: hỏi đường, gọi phục vụ, xin đi qua." },
          { t: "phrase", en: "Thank you very much", vi: "Cảm ơn bạn rất nhiều", pos: "Cụm từ", ipa: "/θæŋk juː ˈveri mʌtʃ/", note: "Thanks là bản ngắn thân mật. Thank you very much trang trọng hơn." },
          { t: "grammar", title: "Sorry hay Excuse me?", body: "Hai từ này người Việt hay dùng lẫn. Quy tắc rất gọn: một cái dùng TRƯỚC, một cái dùng SAU.", rows: [
            ["Excuse me", "trước khi làm phiền", "Excuse me, where is the bank?"],
            ["Sorry", "sau khi đã làm sai", "Sorry, I am late."],
            ["Excuse me", "xin đi qua chỗ đông", "Excuse me, can I pass?"],
            ["Sorry", "khi từ chối, cho đỡ phũ", "Sorry, I can't come."]
          ], tip: "Đụng phải ai đó thì nói Sorry. Muốn hỏi ai đó thì nói Excuse me." },
          { t: "dialogue", title: "Nhờ giúp một tay", lines: [
            { who: "A", en: "Excuse me, can you help me?", vi: "Xin lỗi, bạn giúp tôi được không?" },
            { who: "B", en: "Of course. What is it?", vi: "Tất nhiên rồi. Chuyện gì vậy?" },
            { who: "A", en: "This bag is very big. Thank you very much!", vi: "Cái túi này to quá. Cảm ơn bạn rất nhiều!" },
            { who: "B", en: "You are welcome!", vi: "Không có gì đâu!" }
          ] }
        ],
        sentences: [
          { en: "Excuse me can you help me", vi: "Xin lỗi bạn giúp tôi được không" },
          { en: "Thank you very much", vi: "Cảm ơn bạn rất nhiều" },
          { en: "You are welcome", vi: "Không có gì" },
          { en: "One coffee please", vi: "Cho tôi một cà phê" },
          { en: "Sorry I am late", vi: "Xin lỗi tôi đến muộn" }
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

      {
        id: "a1u2l4", title: "Nghề của người thân",
        goal: "Nói bố mẹ, anh chị làm nghề gì và làm ở đâu.",
        teach: [
          { t: "intro", title: "Người ta làm gì để sống?", body: "Giới thiệu gia đình mà thiếu nghề nghiệp thì câu chuyện cụt lủn. Bài này cho bạn sáu nghề phổ biến nhất ở Việt Nam và một mẫu câu hỏi.", bullets: ["6 nghề thường gặp", "What does he do?", "Mạo từ a / an trước nghề"] },
          { t: "vocab", en: "farmer", vi: "nông dân", pos: "Danh từ", ipa: "/ˈfɑːrmər/", note: "Nghề phổ biến nhất ở nông thôn Việt Nam. Farm là nông trại.", ex: { en: "My father is a farmer.", vi: "Bố tôi là nông dân." } },
          { t: "vocab", en: "driver", vi: "tài xế", pos: "Danh từ", ipa: "/ˈdraɪvər/", note: "Từ drive (lái xe) thêm -er thành người lái. Nhiều nghề tạo ra kiểu này.", ex: { en: "He is a bus driver.", vi: "Anh ấy là tài xế xe buýt." } },
          { t: "vocab", en: "nurse", vi: "y tá, điều dưỡng", pos: "Danh từ", ipa: "/nɜːrs/", note: "Làm cùng bác sĩ trong bệnh viện. Nurse dùng cho cả nam lẫn nữ.", ex: { en: "My sister is a nurse.", vi: "Chị tôi là y tá." } },
          { t: "vocab", en: "worker", vi: "công nhân", pos: "Danh từ", ipa: "/ˈwɜːrkər/", note: "Người làm việc chân tay, thường ở nhà máy (factory).", ex: { en: "They are factory workers.", vi: "Họ là công nhân nhà máy." } },
          { t: "vocab", en: "engineer", vi: "kỹ sư", pos: "Danh từ", ipa: "/ˌendʒɪˈnɪr/", note: "Trọng âm rơi vào âm cuối: en-gi-NEER. Người Việt hay đọc sai chỗ này.", ex: { en: "She wants to be an engineer.", vi: "Cô ấy muốn làm kỹ sư." } },
          { t: "vocab", en: "police", vi: "công an, cảnh sát", pos: "Danh từ", ipa: "/pəˈliːs/", note: "Police luôn là số nhiều. Một người thì nói a police officer.", ex: { en: "The police are here.", vi: "Công an đang ở đây." } },
          { t: "grammar", title: "A hay An trước tên nghề?", body: "Nói nghề của ai đó thì bắt buộc có a hoặc an đứng trước. Chọn cái nào là tuỳ ÂM đầu tiên, không phải chữ cái.", rows: [
            ["Âm phụ âm", "a", "a teacher, a farmer, a nurse"],
            ["Âm nguyên âm", "an", "an engineer, an artist, an office worker"],
            ["Số nhiều", "không có a/an", "They are farmers."],
            ["Hỏi nghề", "What do / does … do?", "What does your mother do?"]
          ], tip: "Câu hỏi nghề nghiệp có tới hai chữ do, nghe lạ tai nhưng đúng: What does he do?" },
          { t: "dialogue", title: "Hỏi thăm gia đình", lines: [
            { who: "A", en: "What does your father do?", vi: "Bố bạn làm nghề gì?" },
            { who: "B", en: "He is a farmer. My mother is a nurse.", vi: "Bố tôi là nông dân. Mẹ tôi là y tá." },
            { who: "A", en: "And your brother?", vi: "Còn anh trai bạn?" },
            { who: "B", en: "He is an engineer. He works in a big city.", vi: "Anh ấy là kỹ sư. Anh ấy làm việc ở một thành phố lớn." }
          ] }
        ],
        sentences: [
          { en: "My father is a farmer", vi: "Bố tôi là nông dân" },
          { en: "What does your mother do", vi: "Mẹ bạn làm nghề gì" },
          { en: "She wants to be an engineer", vi: "Cô ấy muốn làm kỹ sư" },
          { en: "He is a bus driver", vi: "Anh ấy là tài xế xe buýt" },
          { en: "My sister is a nurse", vi: "Chị tôi là y tá" }
        ]
      },
      {
        id: "a1u2l5", title: "Tính cách bạn bè",
        goal: "Khen và miêu tả tính nết của người khác.",
        teach: [
          { t: "intro", title: "Người ta thế nào, chứ không chỉ trông ra sao", body: "Bài trước bạn tả hình dáng. Bài này tả tính cách — thứ khiến câu chuyện của bạn có tình cảm chứ không chỉ là mô tả khô khan.", bullets: ["6 tính từ chỉ tính cách", "Rất và hơi", "Khen người khác cho tự nhiên"] },
          { t: "vocab", en: "kind", vi: "tốt bụng", pos: "Tính từ", ipa: "/kaɪnd/", note: "Lời khen an toàn nhất trong tiếng Anh. Kind cũng có nghĩa là loại, kiểu.", ex: { en: "My grandmother is very kind.", vi: "Bà tôi rất tốt bụng." } },
          { t: "vocab", en: "funny", vi: "hài hước", pos: "Tính từ", ipa: "/ˈfʌni/", note: "Khen ai làm mình cười. Đừng nhầm với fun (vui, thú vị).", ex: { en: "My friend is very funny.", vi: "Bạn tôi rất hài hước." } },
          { t: "vocab", en: "clever", vi: "thông minh, khéo", pos: "Tính từ", ipa: "/ˈklevər/", note: "Người Anh hay dùng clever, người Mỹ hay dùng smart. Cùng nghĩa.", ex: { en: "She is a clever student.", vi: "Cô ấy là một học sinh thông minh." } },
          { t: "vocab", en: "shy", vi: "nhút nhát", pos: "Tính từ", ipa: "/ʃaɪ/", note: "Không phải điều xấu. Nói I am a bit shy là cách rất tự nhiên để mở đầu.", ex: { en: "He is shy with new people.", vi: "Cậu ấy nhút nhát với người lạ." } },
          { t: "vocab", en: "friendly", vi: "thân thiện", pos: "Tính từ", ipa: "/ˈfrendli/", note: "Từ friend thêm -ly. Khen cả người lẫn nơi chốn: a friendly city.", ex: { en: "The people here are friendly.", vi: "Người ở đây rất thân thiện." } },
          { t: "vocab", en: "quiet", vi: "ít nói, yên tĩnh", pos: "Tính từ", ipa: "/ˈkwaɪət/", note: "Tả người là ít nói, tả nơi chốn là yên tĩnh. Đọc là KWAI-ợt, hai âm tiết.", ex: { en: "My brother is very quiet.", vi: "Em trai tôi rất ít nói." } },
          { t: "grammar", title: "Very, so, a bit — chỉnh mức độ", body: "Ba từ nhỏ đặt trước tính từ, đổi hẳn sắc thái câu nói. Đây là cách nhanh nhất để câu của bạn nghe như người bản xứ.", rows: [
            ["very", "rất", "She is very kind."],
            ["so", "rất (cảm thán)", "You are so funny!"],
            ["a bit", "hơi, một chút", "He is a bit shy."],
            ["not very", "không được … lắm", "I am not very tall."]
          ], tip: "Muốn chê nhẹ thì đừng nói xấu, hãy nói not very + tính từ tốt. Lịch sự hơn nhiều." },
          { t: "culture", title: "Khen thì nhận, đừng chối", body: "Người Việt được khen hay chối cho khiêm tốn. Trong tiếng Anh, chối lời khen làm người ta lúng túng. Cứ nói Thank you! là đủ và đúng." },
          { t: "dialogue", title: "Kể về bạn thân", lines: [
            { who: "A", en: "Tell me about your best friend.", vi: "Kể tôi nghe về bạn thân của bạn đi." },
            { who: "B", en: "Her name is Mai. She is very kind and funny.", vi: "Bạn ấy tên Mai. Bạn ấy rất tốt bụng và hài hước." },
            { who: "A", en: "Is she friendly?", vi: "Bạn ấy có thân thiện không?" },
            { who: "B", en: "Yes, but she is a bit shy with new people.", vi: "Có, nhưng bạn ấy hơi nhút nhát với người lạ." }
          ] }
        ],
        sentences: [
          { en: "My grandmother is very kind", vi: "Bà tôi rất tốt bụng" },
          { en: "He is a bit shy", vi: "Cậu ấy hơi nhút nhát" },
          { en: "The people here are friendly", vi: "Người ở đây rất thân thiện" },
          { en: "She is a clever student", vi: "Cô ấy là một học sinh thông minh" },
          { en: "My brother is very quiet", vi: "Em trai tôi rất ít nói" }
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

      {
        id: "a1u3l4", title: "Hoa quả & Rau",
        goal: "Gọi tên hoa quả, rau củ và nói mình thích hay không thích.",
        teach: [
          { t: "intro", title: "Đi chợ bằng tiếng Anh", body: "Sáu từ trong bài này là những thứ bạn nhìn thấy mỗi ngày. Học xong, bạn nói được món mình thích và món mình chịu không nổi.", bullets: ["Hoa quả và rau thường gặp", "I like / I don't like", "Danh từ đếm được và không đếm được"] },
          { t: "vocab", en: "banana", vi: "quả chuối", pos: "Danh từ", ipa: "/bəˈnænə/", note: "Trọng âm ở giữa: ba-NA-na.", ex: { en: "I eat a banana every day.", vi: "Tôi ăn một quả chuối mỗi ngày." } },
          { t: "vocab", en: "orange", vi: "quả cam; màu cam", pos: "Danh từ", ipa: "/ˈɔːrɪndʒ/", note: "Vừa là quả cam vừa là màu cam — tiếng Anh dùng chung một từ.", ex: { en: "This orange is sweet.", vi: "Quả cam này ngọt." } },
          { t: "vocab", en: "mango", vi: "quả xoài", pos: "Danh từ", ipa: "/ˈmæŋɡoʊ/", note: "Số nhiều là mangoes, thêm -es chứ không phải -s.", ex: { en: "Vietnamese mangoes are delicious.", vi: "Xoài Việt Nam rất ngon." } },
          { t: "vocab", en: "tomato", vi: "quả cà chua", pos: "Danh từ", ipa: "/təˈmeɪtoʊ/", note: "Người Anh đọc tơ-MA-tâu, người Mỹ đọc tơ-MÂY-tâu. Cả hai đều đúng.", ex: { en: "I want two tomatoes.", vi: "Tôi muốn hai quả cà chua." } },
          { t: "vocab", en: "carrot", vi: "củ cà rốt", pos: "Danh từ", ipa: "/ˈkærət/", note: "Trọng âm ở đầu: CA-rợt.", ex: { en: "Rabbits like carrots.", vi: "Thỏ thích cà rốt." } },
          { t: "vocab", en: "vegetable", vi: "rau củ", pos: "Danh từ", ipa: "/ˈvedʒtəbl/", note: "Nói gọn ba âm: VEJ-tơ-bồ, đừng đọc đủ bốn âm như chữ viết.", ex: { en: "Eat more vegetables!", vi: "Ăn nhiều rau vào!" } },
          { t: "grammar", title: "Nói thích và không thích", body: "Ba mức độ, một mẫu câu. Sau like luôn là danh từ SỐ NHIỀU khi nói về sở thích chung.", rows: [
            ["I like…", "thích", "I like mangoes."],
            ["I love…", "rất thích", "I love bananas."],
            ["I don't like…", "không thích", "I don't like tomatoes."],
            ["Do you like…?", "hỏi sở thích", "Do you like carrots?"]
          ], tip: "Nói I like mango (số ít) là đang nói về vị xoài. Nói I like mangoes mới là thích ăn xoài." },
          { t: "dialogue", title: "Ở quầy hoa quả", lines: [
            { who: "A", en: "Do you like mangoes?", vi: "Bạn có thích xoài không?" },
            { who: "B", en: "Yes, I love them! But I don't like tomatoes.", vi: "Có, tôi rất thích! Nhưng tôi không thích cà chua." },
            { who: "A", en: "Really? Tomatoes are good for you.", vi: "Thật à? Cà chua tốt cho bạn đấy." },
            { who: "B", en: "I know. I eat carrots instead.", vi: "Tôi biết. Tôi ăn cà rốt thay vào đó." }
          ] }
        ],
        sentences: [
          { en: "I like mangoes very much", vi: "Tôi rất thích xoài" },
          { en: "Do you like carrots", vi: "Bạn có thích cà rốt không" },
          { en: "Eat more vegetables", vi: "Ăn nhiều rau vào" },
          { en: "This orange is sweet", vi: "Quả cam này ngọt" },
          { en: "I do not like tomatoes", vi: "Tôi không thích cà chua" }
        ]
      },
      {
        id: "a1u3l5", title: "Bữa ăn trong ngày",
        goal: "Gọi tên ba bữa ăn và kể mình ăn gì vào lúc nào.",
        teach: [
          { t: "intro", title: "Ba bữa, ba từ riêng", body: "Tiếng Việt chỉ cần chữ bữa rồi thêm sáng, trưa, tối. Tiếng Anh có ba từ hoàn toàn khác nhau, phải học thuộc.", bullets: ["breakfast, lunch, dinner", "Động từ have thay cho eat", "Nói giờ ăn"] },
          { t: "vocab", en: "breakfast", vi: "bữa sáng", pos: "Danh từ", ipa: "/ˈbrekfəst/", note: "Ghép từ break (phá) + fast (nhịn ăn) — bữa phá vỡ đêm nhịn đói.", ex: { en: "I have breakfast at six.", vi: "Tôi ăn sáng lúc sáu giờ." } },
          { t: "vocab", en: "lunch", vi: "bữa trưa", pos: "Danh từ", ipa: "/lʌntʃ/", note: "Không có a/the khi nói chung: have lunch, chứ không phải have a lunch.", ex: { en: "We have lunch at school.", vi: "Chúng tôi ăn trưa ở trường." } },
          { t: "vocab", en: "dinner", vi: "bữa tối", pos: "Danh từ", ipa: "/ˈdɪnər/", note: "Bữa chính trong ngày ở phương Tây, thường ăn cả nhà cùng nhau.", ex: { en: "Dinner is ready!", vi: "Cơm tối xong rồi!" } },
          { t: "vocab", en: "soup", vi: "món canh, súp", pos: "Danh từ", ipa: "/suːp/", note: "Canh trong mâm cơm Việt cũng gọi là soup. Uống canh nói là eat soup, không phải drink.", ex: { en: "My mother makes good soup.", vi: "Mẹ tôi nấu canh ngon." } },
          { t: "vocab", en: "noodle", vi: "mì, bún, phở", pos: "Danh từ", ipa: "/ˈnuːdl/", note: "Hầu như luôn dùng số nhiều: noodles. Phở là rice noodles.", ex: { en: "I eat noodles for breakfast.", vi: "Tôi ăn phở vào bữa sáng." } },
          { t: "vocab", en: "salt", vi: "muối", pos: "Danh từ", ipa: "/sɔːlt/", note: "Không đếm được, không bao giờ nói a salt hay salts.", ex: { en: "This soup needs salt.", vi: "Canh này thiếu muối." } },
          { t: "grammar", title: "Have — ăn, chứ không phải có", body: "Với bữa ăn và đồ uống, người bản xứ dùng have nhiều hơn eat hay drink. Nghe tự nhiên hơn hẳn.", rows: [
            ["have breakfast", "ăn sáng", "I have breakfast at 6:30."],
            ["have lunch", "ăn trưa", "She has lunch at school."],
            ["have dinner", "ăn tối", "We have dinner together."],
            ["have a coffee", "uống một cốc cà phê", "Let's have a coffee."]
          ], tip: "He, she, it thì have đổi thành has: He has dinner late." },
          { t: "culture", title: "Bữa sáng của họ khác ta", body: "Người Việt ăn sáng bằng phở, bún, xôi — món nóng và mặn. Người Anh–Mỹ thường ăn bánh mì, ngũ cốc, trứng. Kể chuyện bạn ăn phở buổi sáng là câu chuyện họ rất thích nghe." },
          { t: "dialogue", title: "Hỏi chuyện ăn uống", lines: [
            { who: "A", en: "What do you have for breakfast?", vi: "Bạn ăn gì vào bữa sáng?" },
            { who: "B", en: "I usually have noodles and tea.", vi: "Tôi thường ăn phở và uống trà." },
            { who: "A", en: "And what about dinner?", vi: "Còn bữa tối thì sao?" },
            { who: "B", en: "Rice, fish and soup. My mother cooks it.", vi: "Cơm, cá và canh. Mẹ tôi nấu." }
          ] }
        ],
        sentences: [
          { en: "I have breakfast at six", vi: "Tôi ăn sáng lúc sáu giờ" },
          { en: "We have lunch at school", vi: "Chúng tôi ăn trưa ở trường" },
          { en: "What do you have for dinner", vi: "Bạn ăn gì vào bữa tối" },
          { en: "This soup needs salt", vi: "Canh này thiếu muối" },
          { en: "I eat noodles for breakfast", vi: "Tôi ăn phở vào bữa sáng" }
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

      {
        id: "a1u4l4", title: "Việc nhà",
        goal: "Kể những việc bạn làm giúp gia đình và gọi tên các phòng trong nhà.",
        teach: [
          { t: "intro", title: "Chuyện trong nhà", body: "Người nước ngoài rất hay hỏi bạn giúp gì cho gia đình. Sáu từ trong bài này đủ để bạn kể một ngày ở nhà.", bullets: ["Các phòng trong nhà", "Việc nhà thường làm", "Nói tần suất: always, often, never"] },
          { t: "vocab", en: "kitchen", vi: "nhà bếp", pos: "Danh từ", ipa: "/ˈkɪtʃɪn/", note: "Nơi nấu ăn. Đọc KIT-chin, đừng đọc thành ki-CHEN.", ex: { en: "My mother is in the kitchen.", vi: "Mẹ tôi đang ở trong bếp." } },
          { t: "vocab", en: "bedroom", vi: "phòng ngủ", pos: "Danh từ", ipa: "/ˈbedruːm/", note: "Ghép bed (giường) + room (phòng). Kiểu ghép này rất hay gặp.", ex: { en: "I share a bedroom with my brother.", vi: "Tôi ở chung phòng ngủ với em trai." } },
          { t: "vocab", en: "clean", vi: "dọn dẹp; sạch", pos: "Động từ", ipa: "/kliːn/", note: "Vừa là động từ dọn dẹp, vừa là tính từ sạch sẽ.", ex: { en: "I clean my room every Sunday.", vi: "Tôi dọn phòng mỗi chủ nhật." } },
          { t: "vocab", en: "wash", vi: "rửa, giặt", pos: "Động từ", ipa: "/wɑːʃ/", note: "Wash the dishes là rửa bát, wash clothes là giặt quần áo.", ex: { en: "I wash the dishes after dinner.", vi: "Tôi rửa bát sau bữa tối." } },
          { t: "vocab", en: "tidy", vi: "gọn gàng; sắp xếp", pos: "Tính từ", ipa: "/ˈtaɪdi/", note: "Tidy up là dọn cho gọn. Ngược lại là messy (bừa bộn).", ex: { en: "Her room is always tidy.", vi: "Phòng cô ấy lúc nào cũng gọn gàng." } },
          { t: "vocab", en: "often", vi: "thường xuyên", pos: "Trạng từ", ipa: "/ˈɔːfn/", note: "Đứng TRƯỚC động từ thường: I often help. Không nói I help often.", ex: { en: "I often help my mother.", vi: "Tôi thường giúp mẹ." } },
          { t: "grammar", title: "Bao lâu một lần?", body: "Bốn trạng từ tần suất hay dùng nhất, xếp từ nhiều tới ít. Nhớ vị trí: TRƯỚC động từ thường, SAU động từ to be.", rows: [
            ["always", "luôn luôn", "I always wash the dishes."],
            ["often", "thường xuyên", "She often cleans the kitchen."],
            ["sometimes", "thỉnh thoảng", "We sometimes cook together."],
            ["never", "không bao giờ", "He never tidies his bedroom."]
          ], tip: "Với to be thì đảo lại: She is always tidy — trạng từ đứng SAU is." },
          { t: "dialogue", title: "Ai làm việc gì", lines: [
            { who: "A", en: "Do you help your family at home?", vi: "Bạn có giúp gia đình việc nhà không?" },
            { who: "B", en: "Yes. I often clean my bedroom and wash the dishes.", vi: "Có. Tôi thường dọn phòng ngủ và rửa bát." },
            { who: "A", en: "What about your brother?", vi: "Còn em trai bạn?" },
            { who: "B", en: "He never tidies his room!", vi: "Nó không bao giờ dọn phòng!" }
          ] }
        ],
        sentences: [
          { en: "I often help my mother", vi: "Tôi thường giúp mẹ" },
          { en: "I wash the dishes after dinner", vi: "Tôi rửa bát sau bữa tối" },
          { en: "My mother is in the kitchen", vi: "Mẹ tôi đang ở trong bếp" },
          { en: "Her room is always tidy", vi: "Phòng cô ấy lúc nào cũng gọn gàng" },
          { en: "I clean my room every Sunday", vi: "Tôi dọn phòng mỗi chủ nhật" }
        ]
      },
      {
        id: "a1u4l5", title: "Ngày nghỉ của tôi",
        goal: "Kể bạn làm gì lúc rảnh và rủ người khác cùng làm.",
        teach: [
          { t: "intro", title: "Rảnh thì làm gì?", body: "Câu hỏi này xuất hiện trong mọi cuộc làm quen. Có sẵn vài động từ và một mẫu rủ rê là bạn nói chuyện được cả buổi.", bullets: ["6 hoạt động lúc rảnh", "Động từ + ing sau like", "Rủ ai đó: Let's…"] },
          { t: "vocab", en: "play", vi: "chơi", pos: "Động từ", ipa: "/pleɪ/", note: "Play + môn thể thao (play football), play + nhạc cụ có the (play the guitar).", ex: { en: "I play football with my friends.", vi: "Tôi chơi bóng đá với bạn bè." } },
          { t: "vocab", en: "run", vi: "chạy", pos: "Động từ", ipa: "/rʌn/", note: "Go running là đi chạy bộ tập thể dục.", ex: { en: "I run in the park every morning.", vi: "Tôi chạy trong công viên mỗi sáng." } },
          { t: "vocab", en: "read", vi: "đọc", pos: "Động từ", ipa: "/riːd/", note: "Đọc là RIID ở hiện tại, nhưng quá khứ read đọc là RED — viết giống hệt.", ex: { en: "I like reading books.", vi: "Tôi thích đọc sách." } },
          { t: "vocab", en: "listen", vi: "nghe", pos: "Động từ", ipa: "/ˈlɪsn/", note: "Chữ t câm. Luôn đi với to: listen to music.", ex: { en: "I listen to music every day.", vi: "Tôi nghe nhạc mỗi ngày." } },
          { t: "vocab", en: "park", vi: "công viên", pos: "Danh từ", ipa: "/pɑːrk/", note: "In the park, không phải at the park khi nói đang ở bên trong.", ex: { en: "The park is near my house.", vi: "Công viên ở gần nhà tôi." } },
          { t: "vocab", en: "garden", vi: "vườn", pos: "Danh từ", ipa: "/ˈɡɑːrdn/", note: "Vườn sau nhà. Người Mỹ hay gọi là yard.", ex: { en: "My grandmother works in the garden.", vi: "Bà tôi làm vườn." } },
          { t: "grammar", title: "Sau like là động từ đuôi -ing", body: "Nói mình thích LÀM gì thì động từ theo sau phải thêm -ing. Đây là lỗi người Việt sai nhiều nhất ở A1.", rows: [
            ["like + V-ing", "thích làm gì", "I like reading."],
            ["love + V-ing", "rất thích làm gì", "She loves running."],
            ["don't like + V-ing", "không thích làm gì", "He doesn't like washing."],
            ["Let's + V", "rủ cùng làm", "Let's play football!"]
          ], tip: "Nhớ mẹo: sau like thì -ing, sau Let's thì để trần." },
          { t: "dialogue", title: "Rủ nhau đi chơi", lines: [
            { who: "A", en: "What do you do at the weekend?", vi: "Cuối tuần bạn làm gì?" },
            { who: "B", en: "I like reading and listening to music.", vi: "Tôi thích đọc sách và nghe nhạc." },
            { who: "A", en: "Let's run in the park tomorrow!", vi: "Mai mình chạy bộ ở công viên đi!" },
            { who: "B", en: "Good idea. See you at six!", vi: "Ý hay đấy. Hẹn gặp lúc sáu giờ nhé!" }
          ] }
        ],
        sentences: [
          { en: "I like reading books", vi: "Tôi thích đọc sách" },
          { en: "Let us play football", vi: "Mình chơi bóng đá đi" },
          { en: "I listen to music every day", vi: "Tôi nghe nhạc mỗi ngày" },
          { en: "The park is near my house", vi: "Công viên ở gần nhà tôi" },
          { en: "I run in the park every morning", vi: "Tôi chạy trong công viên mỗi sáng" }
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
      {
        id: "a1u5l4", title: "Thứ, tháng & Ngày sinh",
        goal: "Nói thứ mấy, tháng nào, và hỏi ngày sinh của người khác.",
        teach: [
          { t: "intro", title: "Xếp lịch bằng tiếng Anh", body: "Hẹn nhau mà không nói được thứ và tháng thì chịu. Bài này cho bạn từ vựng và hai giới từ quan trọng nhất: on và in.", bullets: ["Thứ trong tuần", "Tháng trong năm", "on Monday nhưng in May"] },
          { t: "vocab", en: "Monday", vi: "thứ Hai", pos: "Danh từ", ipa: "/ˈmʌndeɪ/", note: "Thứ và tháng trong tiếng Anh LUÔN viết hoa, kể cả giữa câu.", ex: { en: "I have class on Monday.", vi: "Tôi có lớp vào thứ Hai." } },
          { t: "vocab", en: "Sunday", vi: "chủ nhật", pos: "Danh từ", ipa: "/ˈsʌndeɪ/", note: "Với người Anh–Mỹ, chủ nhật là ngày ĐẦU tuần trên lịch.", ex: { en: "I stay home on Sunday.", vi: "Chủ nhật tôi ở nhà." } },
          { t: "vocab", en: "month", vi: "tháng", pos: "Danh từ", ipa: "/mʌnθ/", note: "Âm cuối th khó đọc, cắn nhẹ đầu lưỡi. Số nhiều months.", ex: { en: "There are twelve months in a year.", vi: "Một năm có mười hai tháng." } },
          { t: "vocab", en: "year", vi: "năm", pos: "Danh từ", ipa: "/jɪr/", note: "Hỏi tuổi cũng dùng từ này: I am twelve years old.", ex: { en: "See you next year!", vi: "Hẹn gặp lại năm sau!" } },
          { t: "vocab", en: "birthday", vi: "sinh nhật", pos: "Danh từ", ipa: "/ˈbɜːrθdeɪ/", note: "Chúc mừng sinh nhật là Happy birthday! — không có chữ to.", ex: { en: "My birthday is in May.", vi: "Sinh nhật tôi vào tháng Năm." } },
          { t: "vocab", en: "date", vi: "ngày (trong tháng)", pos: "Danh từ", ipa: "/deɪt/", note: "What's the date today? là hỏi hôm nay ngày mấy.", ex: { en: "What is the date today?", vi: "Hôm nay là ngày mấy?" } },
          { t: "grammar", title: "On, in, at — chọn đúng giới từ thời gian", body: "Ba giới từ này người Việt hay dùng nhầm. Quy tắc rất dễ nhớ: càng dài càng dùng in, càng ngắn càng dùng at.", rows: [
            ["at", "giờ cụ thể", "at six o'clock, at night"],
            ["on", "thứ và ngày", "on Monday, on my birthday"],
            ["in", "tháng, năm, mùa", "in May, in 2026, in the morning"],
            ["không dùng gì", "today, tomorrow", "I go today. (không nói on today)"]
          ], tip: "Mẹo nhớ: at GIỜ — on NGÀY — in THÁNG. Đơn vị càng to thì giới từ càng ngắn dần rồi thành in." },
          { t: "dialogue", title: "Hỏi ngày sinh nhật", lines: [
            { who: "A", en: "When is your birthday?", vi: "Sinh nhật bạn khi nào?" },
            { who: "B", en: "It is in May. What about you?", vi: "Vào tháng Năm. Còn bạn?" },
            { who: "A", en: "Mine is on Sunday! Come to my house.", vi: "Của tôi vào chủ nhật này! Đến nhà tôi nhé." },
            { who: "B", en: "Of course. Happy birthday!", vi: "Tất nhiên rồi. Chúc mừng sinh nhật!" }
          ] }
        ],
        sentences: [
          { en: "My birthday is in May", vi: "Sinh nhật tôi vào tháng Năm" },
          { en: "I have class on Monday", vi: "Tôi có lớp vào thứ Hai" },
          { en: "What is the date today", vi: "Hôm nay là ngày mấy" },
          { en: "There are twelve months in a year", vi: "Một năm có mười hai tháng" },
          { en: "I stay home on Sunday", vi: "Chủ nhật tôi ở nhà" }
        ]
      },
      {
        id: "a1u5l5", title: "Đi chợ",
        goal: "Hỏi số lượng, cân đo và mặc cả ở chợ.",
        teach: [
          { t: "intro", title: "Mua theo cân, theo túi", body: "Ở cửa hàng bạn hỏi giá. Ở chợ bạn phải hỏi thêm số lượng. Bài này dạy hai câu hỏi khác nhau mà người Việt hay lẫn: How many và How much.", bullets: ["Từ vựng ở chợ", "How many hay How much", "Some và any"] },
          { t: "vocab", en: "market", vi: "chợ", pos: "Danh từ", ipa: "/ˈmɑːrkɪt/", note: "Chợ truyền thống. Siêu thị là supermarket.", ex: { en: "I go to the market every morning.", vi: "Tôi đi chợ mỗi sáng." } },
          { t: "vocab", en: "kilo", vi: "cân, ki-lô", pos: "Danh từ", ipa: "/ˈkiːloʊ/", note: "Nói tắt của kilogram. A kilo of rice — một cân gạo.", ex: { en: "I want two kilos of rice.", vi: "Tôi muốn hai cân gạo." } },
          { t: "vocab", en: "bag", vi: "túi, cặp", pos: "Danh từ", ipa: "/bæɡ/", note: "A bag of + thứ bên trong: a bag of apples.", ex: { en: "Can I have a bag, please?", vi: "Cho tôi xin một cái túi được không?" } },
          { t: "vocab", en: "box", vi: "hộp", pos: "Danh từ", ipa: "/bɑːks/", note: "Số nhiều là boxes, thêm -es vì tận cùng bằng x.", ex: { en: "She buys a box of milk.", vi: "Cô ấy mua một hộp sữa." } },
          { t: "vocab", en: "some", vi: "một ít, một vài", pos: "Đại từ", ipa: "/sʌm/", note: "Dùng trong câu khẳng định và khi mời mọc: Would you like some tea?", ex: { en: "I want some water.", vi: "Tôi muốn một chút nước." } },
          { t: "vocab", en: "many", vi: "nhiều", pos: "Tính từ", ipa: "/ˈmeni/", note: "Chỉ dùng với danh từ đếm được: many apples. Nước, gạo thì dùng much.", ex: { en: "There are many people here.", vi: "Ở đây có nhiều người." } },
          { t: "grammar", title: "How many hay How much?", body: "Đếm được thì many, không đếm được thì much. Đây là câu hỏi bạn dùng mỗi lần đi chợ.", rows: [
            ["How many", "đếm được, số nhiều", "How many apples do you want?"],
            ["How much", "không đếm được", "How much rice do you need?"],
            ["How much", "hỏi giá tiền", "How much is this bag?"],
            ["some / any", "khẳng định / hỏi–phủ định", "I want some. / Do you have any?"]
          ], tip: "Thứ nào bốc lên đếm được từng cái thì many. Thứ nào phải cân, đong, rót thì much." },
          { t: "culture", title: "Mặc cả — nét riêng của chợ Việt", body: "Ở chợ Việt Nam trả giá là chuyện thường. Ở siêu thị hay cửa hàng phương Tây thì tuyệt đối không. Nếu muốn hỏi giảm giá cho lịch sự, nói: Can you give me a better price?" },
          { t: "dialogue", title: "Mua rau ngoài chợ", lines: [
            { who: "A", en: "How much are these tomatoes?", vi: "Cà chua này bao nhiêu tiền?" },
            { who: "B", en: "Twenty thousand a kilo.", vi: "Hai mươi nghìn một cân." },
            { who: "A", en: "I want one kilo, please. And some carrots.", vi: "Cho tôi một cân. Với một ít cà rốt nữa." },
            { who: "B", en: "Here you are. Do you need a bag?", vi: "Của bạn đây. Bạn có cần túi không?" }
          ] }
        ],
        sentences: [
          { en: "How many apples do you want", vi: "Bạn muốn mấy quả táo" },
          { en: "I want two kilos of rice", vi: "Tôi muốn hai cân gạo" },
          { en: "I go to the market every morning", vi: "Tôi đi chợ mỗi sáng" },
          { en: "There are many people here", vi: "Ở đây có nhiều người" },
          { en: "Can I have a bag please", vi: "Cho tôi xin một cái túi được không" }
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
      {
        id: "a1u6l4", title: "Đi lại bằng gì",
        goal: "Nói bạn đi học, đi làm bằng phương tiện gì và mất bao lâu.",
        teach: [
          { t: "intro", title: "Bạn đến đây bằng gì?", body: "Một câu hỏi nhỏ nhưng gặp mỗi ngày. Chỉ cần thuộc mẫu go by + phương tiện là xong, trừ đúng một ngoại lệ.", bullets: ["6 phương tiện thường dùng", "go by bus nhưng on foot", "Hỏi mất bao lâu"] },
          { t: "vocab", en: "bus", vi: "xe buýt", pos: "Danh từ", ipa: "/bʌs/", note: "Số nhiều là buses. Bến xe buýt là bus stop.", ex: { en: "I go to school by bus.", vi: "Tôi đi học bằng xe buýt." } },
          { t: "vocab", en: "train", vi: "tàu hoả", pos: "Danh từ", ipa: "/treɪn/", note: "Train station là ga tàu. Train cũng là động từ nghĩa luyện tập.", ex: { en: "The train is very fast.", vi: "Tàu hoả rất nhanh." } },
          { t: "vocab", en: "bike", vi: "xe đạp", pos: "Danh từ", ipa: "/baɪk/", note: "Nói tắt của bicycle. Xe máy là motorbike.", ex: { en: "My bike is old but good.", vi: "Xe đạp của tôi cũ nhưng tốt." } },
          { t: "vocab", en: "walk", vi: "đi bộ", pos: "Động từ", ipa: "/wɔːk/", note: "Chữ l câm, đọc là WOOK. Đừng nhầm với work (làm việc).", ex: { en: "I walk to school every day.", vi: "Tôi đi bộ đến trường mỗi ngày." } },
          { t: "vocab", en: "drive", vi: "lái xe", pos: "Động từ", ipa: "/draɪv/", note: "Chỉ dùng cho xe bốn bánh. Đi xe máy, xe đạp thì dùng ride.", ex: { en: "My father drives a car.", vi: "Bố tôi lái ô tô." } },
          { t: "vocab", en: "minute", vi: "phút", pos: "Danh từ", ipa: "/ˈmɪnɪt/", note: "Đọc MI-nịt. Just a minute nghĩa là đợi một chút.", ex: { en: "It takes twenty minutes.", vi: "Mất hai mươi phút." } },
          { t: "grammar", title: "By + phương tiện, trừ đi bộ", body: "Mọi phương tiện đều dùng by và KHÔNG có a/the. Riêng đi bộ là ngoại lệ duy nhất.", rows: [
            ["by bus", "bằng xe buýt", "I go by bus."],
            ["by train", "bằng tàu hoả", "We travel by train."],
            ["by bike", "bằng xe đạp", "She goes by bike."],
            ["on foot", "đi bộ", "He goes to school on foot."]
          ], tip: "Hỏi mất bao lâu: How long does it take? Trả lời: It takes twenty minutes." },
          { t: "dialogue", title: "Hỏi đường đi học", lines: [
            { who: "A", en: "How do you go to school?", vi: "Bạn đi học bằng gì?" },
            { who: "B", en: "I go by bike. It takes fifteen minutes.", vi: "Tôi đi xe đạp. Mất mười lăm phút." },
            { who: "A", en: "That is fast! I walk, so it takes thirty minutes.", vi: "Nhanh đấy! Tôi đi bộ nên mất ba mươi phút." },
            { who: "B", en: "Then take the bus tomorrow!", vi: "Vậy mai đi xe buýt đi!" }
          ] }
        ],
        sentences: [
          { en: "I go to school by bus", vi: "Tôi đi học bằng xe buýt" },
          { en: "How do you go to school", vi: "Bạn đi học bằng gì" },
          { en: "It takes twenty minutes", vi: "Mất hai mươi phút" },
          { en: "I walk to school every day", vi: "Tôi đi bộ đến trường mỗi ngày" },
          { en: "My father drives a car", vi: "Bố tôi lái ô tô" }
        ]
      },
      {
        id: "a1u6l5", title: "Ở bệnh viện",
        goal: "Nói bạn bị làm sao và hiểu lời dặn của bác sĩ.",
        teach: [
          { t: "intro", title: "Khi phải đi khám", body: "Bài trước bạn học tên các bộ phận cơ thể. Bài này là những gì bạn nói ra khi ngồi trước mặt bác sĩ — thứ có thể rất cần khi đi nước ngoài.", bullets: ["Từ vựng ở bệnh viện", "Mẫu câu I have a…", "Hiểu lời dặn của bác sĩ"] },
          { t: "vocab", en: "hospital", vi: "bệnh viện", pos: "Danh từ", ipa: "/ˈhɑːspɪtl/", note: "Đi nằm viện nói go to hospital, không có the. Đi thăm ai thì có: go to the hospital.", ex: { en: "The hospital is near the station.", vi: "Bệnh viện ở gần nhà ga." } },
          { t: "vocab", en: "medicine", vi: "thuốc", pos: "Danh từ", ipa: "/ˈmedsn/", note: "Uống thuốc nói là take medicine, KHÔNG phải drink medicine.", ex: { en: "Take this medicine twice a day.", vi: "Uống thuốc này hai lần mỗi ngày." } },
          { t: "vocab", en: "hurt", vi: "đau", pos: "Động từ", ipa: "/hɜːrt/", note: "Chỗ nào đau thì làm chủ ngữ: My head hurts. — Tôi đau đầu.", ex: { en: "My leg hurts.", vi: "Chân tôi đau." } },
          { t: "vocab", en: "fever", vi: "sốt", pos: "Danh từ", ipa: "/ˈfiːvər/", note: "Luôn đi với have: I have a fever. Không nói I am fever.", ex: { en: "She has a high fever.", vi: "Cô ấy sốt cao." } },
          { t: "vocab", en: "rest", vi: "nghỉ ngơi", pos: "Động từ", ipa: "/rest/", note: "Get some rest là lời dặn quen thuộc của bác sĩ.", ex: { en: "You need to rest at home.", vi: "Bạn cần nghỉ ở nhà." } },
          { t: "vocab", en: "better", vi: "khá hơn, đỡ hơn", pos: "Tính từ", ipa: "/ˈbetər/", note: "Get better là khỏi bệnh. Chúc mau khỏi: Get well soon!", ex: { en: "I feel better today.", vi: "Hôm nay tôi thấy đỡ hơn." } },
          { t: "grammar", title: "Nói mình bị làm sao", body: "Tiếng Anh có ba mẫu câu cho chuyện ốm đau. Chọn mẫu nào là tuỳ bạn nói về triệu chứng, bộ phận, hay cảm giác.", rows: [
            ["I have a…", "triệu chứng", "I have a fever. / I have a cold."],
            ["My … hurts", "bộ phận đau", "My head hurts."],
            ["I feel…", "cảm giác chung", "I feel sick. / I feel better."],
            ["I can't…", "không làm được gì", "I can't sleep."]
          ], tip: "Nhớ: có triệu chứng thì HAVE, bộ phận đau thì HURTS, cảm giác thì FEEL." },
          { t: "culture", title: "Get well soon", body: "Câu chúc người ốm chuẩn nhất trong tiếng Anh là Get well soon! Người Anh–Mỹ ít khi hỏi kỹ về bệnh tật của nhau như người Việt — họ coi đó là chuyện riêng tư." },
          { t: "dialogue", title: "Khám bệnh", lines: [
            { who: "A", en: "Good morning. What is the problem?", vi: "Chào buổi sáng. Bạn bị làm sao?" },
            { who: "B", en: "I have a fever and my head hurts.", vi: "Tôi bị sốt và đau đầu." },
            { who: "A", en: "Take this medicine and rest at home.", vi: "Uống thuốc này và nghỉ ở nhà nhé." },
            { who: "B", en: "Thank you, doctor. I hope I feel better tomorrow.", vi: "Cảm ơn bác sĩ. Mong là mai tôi đỡ hơn." }
          ] }
        ],
        sentences: [
          { en: "I have a fever", vi: "Tôi bị sốt" },
          { en: "My leg hurts", vi: "Chân tôi đau" },
          { en: "You need to rest at home", vi: "Bạn cần nghỉ ở nhà" },
          { en: "I feel better today", vi: "Hôm nay tôi thấy đỡ hơn" },
          { en: "Take this medicine twice a day", vi: "Uống thuốc này hai lần mỗi ngày" }
        ]
      },
      { id: "a1u6c", title: "Ôn tập chương 6", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  }

  ]
};
