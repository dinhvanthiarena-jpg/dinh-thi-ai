/* ============================================================
   English Air — Trình độ A2 (Tiền trung cấp, khung CEFR)
   Cùng cấu trúc với A1: teach[] dạy trước, sentences[] để luyện.
   ============================================================ */

const A2 = {
  id: "a2", code: "A2", name: "Tiền trung cấp",
  desc: "Kể lại chuyện đã qua, nói về kế hoạch và hẹn gặp bằng tiếng Anh.",
  units: [

  /* ================= CHƯƠNG 1 ================= */
  {
    id: "a2u1", title: "Kể về quá khứ",
    goal: "Kể lại việc đã xảy ra bằng was/were và thì quá khứ đơn.",
    lessons: [
      {
        id: "a2u1l1", title: "was & were",
        goal: "Dạng quá khứ của to be và từ chỉ thời gian quá khứ.",
        teach: [
          { t: "intro", title: "Quá khứ của to be", body: "Bạn đã biết am / is / are. Quá khứ của chúng chỉ có hai dạng: was và were. Đây là bước đầu tiên để kể chuyện đã qua.", bullets: ["was / were", "6 từ chỉ thời gian quá khứ", "Câu hỏi và phủ định"] },
          { t: "grammar", title: "was / were", body: "am và is thành was. are thành were. Chỉ vậy thôi.", rows: [
            ["I / He / She / It", "was", "I was busy yesterday. — Hôm qua tôi bận."],
            ["You / We / They", "were", "They were at home. — Họ đã ở nhà."],
            ["Phủ định", "was not / were not", "She was not happy. — Cô ấy đã không vui."],
            ["Viết tắt", "wasn't / weren't", "We weren't tired. — Chúng tôi đã không mệt."],
            ["Câu hỏi", "Was / Were + chủ ngữ", "Were you at school? — Bạn đã ở trường à?"]
          ], tip: "Đảo was/were lên đầu là thành câu hỏi, không cần mượn did." },
          { t: "vocab", en: "yesterday", vi: "hôm qua", pos: "Trạng từ", ipa: "/ˈjestərdeɪ/", note: "Không cần giới từ: I was busy yesterday.", ex: { en: "I was at home yesterday.", vi: "Hôm qua tôi ở nhà." } },
          { t: "vocab", en: "last", vi: "vừa rồi, trước", pos: "Trạng từ", ipa: "/læst/", note: "last week, last month, last year — đều không cần giới từ.", ex: { en: "We were in Hue last week.", vi: "Tuần trước chúng tôi ở Huế." } },
          { t: "vocab", en: "ago", vi: "cách đây", pos: "Trạng từ", ipa: "/əˈɡoʊ/", note: "Đứng SAU khoảng thời gian: two days ago, chứ không phải ago two days.", ex: { en: "She was here two hours ago.", vi: "Cô ấy ở đây cách đây hai tiếng." } },
          { t: "vocab", en: "busy", vi: "bận", pos: "Tính từ", ipa: "/ˈbɪzi/", note: "Đọc là /ˈbɪ-zi/, chữ u không đọc thành “biu”.", ex: { en: "I was very busy last week.", vi: "Tuần trước tôi rất bận." } },
          { t: "vocab", en: "free", vi: "rảnh, miễn phí", pos: "Tính từ", ipa: "/friː/", note: "Hai nghĩa: rảnh rỗi và miễn phí. Hiểu theo ngữ cảnh.", ex: { en: "Were you free yesterday?", vi: "Hôm qua bạn có rảnh không?" } },
          { t: "vocab", en: "born", vi: "sinh ra", pos: "Động từ", ipa: "/bɔːrn/", note: "Luôn dùng bị động: I was born in 1990. Không bao giờ nói I born.", ex: { en: "He was born in Hanoi.", vi: "Anh ấy sinh ra ở Hà Nội." } },
          { t: "dialogue", title: "Hôm qua bạn ở đâu", lines: [
            { who: "A", en: "Where were you yesterday?", vi: "Hôm qua bạn ở đâu?" },
            { who: "B", en: "I was at home. I was very busy.", vi: "Tôi ở nhà. Tôi rất bận." },
            { who: "A", en: "My sister was free, but I wasn't.", vi: "Em gái tôi rảnh, còn tôi thì không." }
          ] }
        ],
        sentences: [
          { en: "I was at home yesterday", vi: "Hôm qua tôi ở nhà" },
          { en: "They were very busy last week", vi: "Tuần trước họ rất bận" },
          { en: "He was born in Hanoi", vi: "Anh ấy sinh ra ở Hà Nội" }
        ]
      },

      {
        id: "a2u1l2", title: "Quá khứ đơn",
        goal: "Động từ có quy tắc thêm -ed và 5 động từ bất quy tắc thông dụng.",
        teach: [
          { t: "intro", title: "Kể lại một ngày đã qua", body: "Động từ thường ở quá khứ chia làm hai nhóm: có quy tắc thì thêm -ed, bất quy tắc thì phải học thuộc. Tin vui là chỉ khoảng 100 động từ bất quy tắc hay dùng.", bullets: ["Thêm -ed", "5 động từ bất quy tắc", "did / didn't"] },
          { t: "grammar", title: "Động từ có quy tắc: + ed", body: "Không đổi theo chủ ngữ. He, she, it hay I đều dùng một dạng.", rows: [
            ["Thường: + ed", "work → worked", "I worked yesterday."],
            ["Tận cùng e: + d", "live → lived", "She lived in Hue."],
            ["Phụ âm + y: → ied", "study → studied", "He studied English."],
            ["Phụ âm kép", "stop → stopped", "The bus stopped here."]
          ], tip: "Đuôi -ed có 3 cách đọc: /t/ sau âm vô thanh (worked), /d/ sau âm hữu thanh (lived), /ɪd/ sau t hoặc d (wanted)." },
          { t: "grammar", title: "5 động từ bất quy tắc hay gặp nhất", body: "Nhóm này không thêm -ed mà đổi hẳn hình dạng. Học thuộc từng cặp một.", rows: [
            ["go → went", "I went to school.", "Tôi đã đi học."],
            ["eat → ate", "We ate at home.", "Chúng tôi đã ăn ở nhà."],
            ["see → saw", "She saw a film.", "Cô ấy đã xem một bộ phim."],
            ["have → had", "They had a car.", "Họ đã có một chiếc ô tô."],
            ["buy → bought", "He bought a book.", "Anh ấy đã mua một quyển sách."]
          ], tip: "Trong câu phủ định và câu hỏi, động từ trở lại NGUYÊN DẠNG vì did đã mang nghĩa quá khứ rồi." },
          { t: "vocab", en: "visit", vi: "thăm", pos: "Động từ", ipa: "/ˈvɪzɪt/", note: "Có quy tắc: visited.", ex: { en: "I visited my parents.", vi: "Tôi đã về thăm bố mẹ." } },
          { t: "vocab", en: "travel", vi: "đi du lịch", pos: "Động từ", ipa: "/ˈtrævl/", note: "Anh–Anh viết travelled, Anh–Mỹ viết traveled.", ex: { en: "We travelled to Hue.", vi: "Chúng tôi đã đi Huế." } },
          { t: "vocab", en: "watch", vi: "xem", pos: "Động từ", ipa: "/wɑːtʃ/", note: "watch dùng cho phim, TV. see dùng cho nhìn thấy.", ex: { en: "I watched a film last night.", vi: "Tối qua tôi đã xem một bộ phim." } },
          { t: "vocab", en: "meet", vi: "gặp", pos: "Động từ", ipa: "/miːt/", note: "Bất quy tắc: met.", ex: { en: "I met my friend yesterday.", vi: "Hôm qua tôi đã gặp bạn tôi." } },
          { t: "vocab", en: "buy", vi: "mua", pos: "Động từ", ipa: "/baɪ/", note: "Bất quy tắc: bought /bɔːt/.", ex: { en: "She bought a new phone.", vi: "Cô ấy đã mua một chiếc điện thoại mới." } },
          { t: "grammar", title: "did và didn't", body: "Câu hỏi và phủ định ở quá khứ đều mượn did, và động từ chính quay về nguyên dạng.", rows: [
            ["Phủ định", "I did not go.", "Tôi đã không đi."],
            ["Viết tắt", "She didn't buy it.", "Cô ấy đã không mua nó."],
            ["Câu hỏi", "Did you see him?", "Bạn có gặp anh ấy không?"],
            ["Lỗi thường gặp", "I didn't went.", "(sai — phải là didn't go)"]
          ] },
          { t: "dialogue", title: "Cuối tuần vừa rồi", lines: [
            { who: "A", en: "What did you do last weekend?", vi: "Cuối tuần vừa rồi bạn làm gì?" },
            { who: "B", en: "I visited my parents and we ate together.", vi: "Tôi về thăm bố mẹ và chúng tôi ăn cùng nhau." },
            { who: "A", en: "Did you go to Hue?", vi: "Bạn có đi Huế không?" },
            { who: "B", en: "No, I didn't go. I watched a film at home.", vi: "Không, tôi không đi. Tôi ở nhà xem phim." }
          ] }
        ],
        sentences: [
          { en: "I visited my parents last week", vi: "Tuần trước tôi về thăm bố mẹ" },
          { en: "She bought a new phone", vi: "Cô ấy đã mua một chiếc điện thoại mới" },
          { en: "What did you do yesterday", vi: "Hôm qua bạn làm gì" }
        ]
      },

      { id: "a2u1c", title: "Ôn tập chương 1", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  },

  /* ================= CHƯƠNG 2 ================= */
  {
    id: "a2u2", title: "Kế hoạch & Hẹn gặp",
    goal: "Nói về dự định sắp tới và hẹn gặp ai đó.",
    lessons: [
      {
        id: "a2u2l1", title: "be going to",
        goal: "Nói về dự định đã lên kế hoạch từ trước.",
        teach: [
          { t: "intro", title: "Dự định khác lời hứa", body: "Tiếng Anh phân biệt hai loại tương lai: be going to cho việc đã định sẵn, will cho quyết định ngay lúc nói. Nhầm hai cái này là lỗi rất phổ biến.", bullets: ["Công thức be going to", "Khi nào dùng will", "6 từ về kế hoạch"] },
          { t: "grammar", title: "be going to + động từ nguyên thể", body: "Chia to be theo chủ ngữ, phần going to giữ nguyên.", rows: [
            ["I", "am going to", "I am going to travel. — Tôi định đi du lịch."],
            ["He / She / It", "is going to", "She is going to buy a car."],
            ["You / We / They", "are going to", "They are going to visit us."],
            ["Phủ định", "am not going to", "I'm not going to work tomorrow."],
            ["Câu hỏi", "Are you going to…?", "Are you going to study tonight?"]
          ], tip: "Nói nhanh, người bản xứ đọc going to thành gonna. Nghe thì hiểu, nhưng viết thì đừng viết vậy." },
          { t: "grammar", title: "going to hay will?", body: "Chọn theo thời điểm bạn quyết định, không phải theo thời điểm việc xảy ra.", rows: [
            ["Đã định trước", "I'm going to visit Hue next week.", "Tôi đã lên kế hoạch rồi."],
            ["Quyết ngay lúc nói", "It's raining. I'll take a taxi.", "Vừa nghĩ ra."],
            ["Dự đoán có căn cứ", "Look at the sky. It's going to rain.", "Nhìn thấy dấu hiệu."],
            ["Lời hứa", "I will help you.", "Cam kết với người nghe."]
          ] },
          { t: "vocab", en: "plan", vi: "kế hoạch, dự định", pos: "Danh từ", ipa: "/plæn/", note: "Vừa danh từ vừa động từ: I plan to go.", ex: { en: "What is your plan for tomorrow?", vi: "Kế hoạch ngày mai của bạn là gì?" } },
          { t: "vocab", en: "weekend", vi: "cuối tuần", pos: "Danh từ", ipa: "/ˈwiːkend/", note: "Anh–Anh nói at the weekend, Anh–Mỹ nói on the weekend.", ex: { en: "I am going to rest this weekend.", vi: "Cuối tuần này tôi định nghỉ ngơi." } },
          { t: "vocab", en: "holiday", vi: "kỳ nghỉ", pos: "Danh từ", ipa: "/ˈhɑːlədeɪ/", note: "Anh–Mỹ thường nói vacation.", ex: { en: "We are going to Da Nang on holiday.", vi: "Chúng tôi sẽ đi Đà Nẵng nghỉ mát." } },
          { t: "vocab", en: "ticket", vi: "vé", pos: "Danh từ", ipa: "/ˈtɪkɪt/", note: "Vé máy bay là a plane ticket.", ex: { en: "I bought two tickets.", vi: "Tôi đã mua hai vé." } },
          { t: "vocab", en: "airport", vi: "sân bay", pos: "Danh từ", ipa: "/ˈerpɔːrt/", note: "Ra sân bay: go to the airport, có the.", ex: { en: "We are going to the airport at six.", vi: "Sáu giờ chúng tôi ra sân bay." } },
          { t: "vocab", en: "tonight", vi: "tối nay", pos: "Trạng từ", ipa: "/təˈnaɪt/", note: "Không cần giới từ, giống today và tomorrow.", ex: { en: "I am going to study tonight.", vi: "Tối nay tôi định học bài." } },
          { t: "dialogue", title: "Kế hoạch cuối tuần", lines: [
            { who: "A", en: "What are you going to do this weekend?", vi: "Cuối tuần này bạn định làm gì?" },
            { who: "B", en: "I am going to travel to Da Nang. I bought my ticket.", vi: "Tôi định đi Đà Nẵng. Tôi mua vé rồi." },
            { who: "A", en: "Nice! I am not going to go anywhere.", vi: "Hay quá! Tôi thì không định đi đâu cả." }
          ] }
        ],
        sentences: [
          { en: "I am going to travel next week", vi: "Tuần sau tôi định đi du lịch" },
          { en: "What are you going to do tonight", vi: "Tối nay bạn định làm gì" },
          { en: "She is going to buy a ticket", vi: "Cô ấy định mua một cái vé" }
        ]
      },

      {
        id: "a2u2l2", title: "Hẹn gặp",
        goal: "Mẫu câu rủ, hẹn giờ và từ chối lịch sự.",
        teach: [
          { t: "intro", title: "Rủ ai đó đi đâu", body: "Ba mẫu câu dưới đây bao trọn việc hẹn gặp: rủ, chốt giờ, và từ chối mà không làm mất lòng.", bullets: ["Are you free…?", "Let's… / Shall we…?", "Từ chối lịch sự"] },
          { t: "phrase", en: "Are you free on Sunday?", vi: "Chủ nhật bạn có rảnh không?", pos: "Cụm từ", ipa: "/ɑːr juː friː ɑːn ˈsʌndeɪ/", note: "Cách mở lời tự nhiên nhất. Nhớ dùng on với thứ trong tuần." },
          { t: "phrase", en: "Let's meet at six", vi: "Gặp nhau lúc sáu giờ nhé", pos: "Cụm từ", ipa: "/lets miːt æt sɪks/", note: "Let's = let us. Sau let's luôn là động từ nguyên thể." },
          { t: "phrase", en: "I'm sorry, I can't", vi: "Xin lỗi, tôi không đi được", pos: "Cụm từ", ipa: "/aɪm ˈsɑːri aɪ kænt/", note: "Từ chối chuẩn: xin lỗi trước, rồi mới nêu lý do." },
          { t: "vocab", en: "meeting", vi: "cuộc họp", pos: "Danh từ", ipa: "/ˈmiːtɪŋ/", note: "Có cuộc họp nói have a meeting.", ex: { en: "I have a meeting at ten.", vi: "Tôi có cuộc họp lúc mười giờ." } },
          { t: "vocab", en: "later", vi: "lát nữa, muộn hơn", pos: "Trạng từ", ipa: "/ˈleɪtər/", note: "See you later là câu chia tay rất thông dụng.", ex: { en: "Can we meet later?", vi: "Lát nữa gặp nhau được không?" } },
          { t: "vocab", en: "together", vi: "cùng nhau", pos: "Trạng từ", ipa: "/təˈɡeðər/", note: "Đứng cuối câu: We study together.", ex: { en: "Let's have lunch together.", vi: "Ăn trưa cùng nhau nhé." } },
          { t: "vocab", en: "wait", vi: "chờ", pos: "Động từ", ipa: "/weɪt/", note: "Chờ ai đó thì phải có for: wait for me.", ex: { en: "Please wait for me.", vi: "Làm ơn chờ tôi với." } },
          { t: "vocab", en: "phone", vi: "gọi điện, điện thoại", pos: "Danh từ", ipa: "/foʊn/", pic: "phone", note: "Vừa danh từ vừa động từ: I'll phone you.", ex: { en: "I will phone you tonight.", vi: "Tối nay tôi sẽ gọi cho bạn." } },
          { t: "culture", title: "Đúng giờ là tôn trọng", body: "Ở phần lớn nước nói tiếng Anh, hẹn 6 giờ nghĩa là 6 giờ. Muộn quá 5 phút thường phải nhắn báo trước. Nếu bạn đến muộn, câu chuẩn là Sorry I'm late." },
          { t: "dialogue", title: "Hẹn cà phê", lines: [
            { who: "A", en: "Are you free on Sunday?", vi: "Chủ nhật bạn rảnh không?" },
            { who: "B", en: "I'm sorry, I can't. I have a meeting.", vi: "Xin lỗi, tôi không đi được. Tôi có cuộc họp." },
            { who: "A", en: "No problem. Let's meet on Monday then.", vi: "Không sao. Vậy thứ Hai gặp nhau nhé." },
            { who: "B", en: "Great. I will phone you later.", vi: "Tuyệt. Lát nữa tôi gọi cho bạn." }
          ] }
        ],
        sentences: [
          { en: "Are you free on Sunday", vi: "Chủ nhật bạn có rảnh không" },
          { en: "Let's meet at six", vi: "Gặp nhau lúc sáu giờ nhé" },
          { en: "I will phone you tonight", vi: "Tối nay tôi sẽ gọi cho bạn" }
        ]
      },

      { id: "a2u2c", title: "Ôn tập chương 2", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  },

  /* ================= CHƯƠNG 3 ================= */
  {
    id: "a2u3", title: "So sánh & Miêu tả",
    goal: "So sánh hai vật, chọn cái tốt nhất và nói giống hay khác.",
    lessons: [
      {
        id: "a2u3l1", title: "Cái này hơn cái kia",
        goal: "So sánh hơn: thêm -er hay dùng more.",
        teach: [
          { t: "intro", title: "Hai cách so sánh, chọn theo độ dài", body: "Tiếng Anh không so sánh kiểu nào cũng như nhau. Tính từ ngắn thì thêm đuôi, tính từ dài thì thêm chữ đứng trước. Quy tắc đếm âm tiết là đủ.", bullets: ["Tính từ ngắn: + er", "Tính từ dài: more + …", "Luôn có chữ than"] },
          { t: "grammar", title: "So sánh hơn", body: "Đếm âm tiết của tính từ để chọn cách.", rows: [
            ["1 âm tiết: + er", "big → bigger", "to hơn"],
            ["Tận cùng y: → ier", "easy → easier", "dễ hơn"],
            ["3 âm tiết trở lên: more", "difficult → more difficult", "khó hơn"],
            ["Bất quy tắc", "good → better, bad → worse", "tốt hơn, tệ hơn"],
            ["Luôn kèm than", "This is bigger than that.", "Cái này to hơn cái kia."]
          ], tip: "Không bao giờ dùng cả hai: “more bigger” là sai. Chọn một trong hai cách thôi." },
          { t: "vocab", en: "big", vi: "to, lớn", pos: "Tính từ", ipa: "/bɪɡ/", note: "Gấp đôi phụ âm khi so sánh: bigger.", ex: { en: "My house is bigger than yours.", vi: "Nhà tôi to hơn nhà bạn." } },
          { t: "vocab", en: "small", vi: "nhỏ", pos: "Tính từ", ipa: "/smɔːl/", note: "Trái nghĩa của big. So sánh: smaller.", ex: { en: "This bag is smaller.", vi: "Cái túi này nhỏ hơn." } },
          { t: "vocab", en: "fast", vi: "nhanh", pos: "Tính từ", ipa: "/fæst/", note: "Vừa là tính từ vừa là trạng từ: He runs fast.", ex: { en: "A plane is faster than a car.", vi: "Máy bay nhanh hơn ô tô." } },
          { t: "vocab", en: "slow", vi: "chậm", pos: "Tính từ", ipa: "/sloʊ/", note: "Trạng từ là slowly: Please speak slowly.", ex: { en: "This bus is very slow.", vi: "Xe buýt này rất chậm." } },
          { t: "vocab", en: "easy", vi: "dễ", pos: "Tính từ", ipa: "/ˈiːzi/", note: "Đổi y thành i khi so sánh: easier.", ex: { en: "This lesson is easier.", vi: "Bài này dễ hơn." } },
          { t: "vocab", en: "difficult", vi: "khó", pos: "Tính từ", ipa: "/ˈdɪfɪkəlt/", note: "Ba âm tiết nên phải dùng more difficult.", ex: { en: "English is more difficult than maths.", vi: "Tiếng Anh khó hơn toán." } },
          { t: "dialogue", title: "So hai chiếc điện thoại", lines: [
            { who: "A", en: "Which phone is better?", vi: "Điện thoại nào tốt hơn?" },
            { who: "B", en: "This one is faster, but it is more expensive.", vi: "Cái này nhanh hơn, nhưng đắt hơn." },
            { who: "A", en: "Then I will take the smaller one.", vi: "Vậy tôi lấy cái nhỏ hơn." }
          ] }
        ],
        sentences: [
          { en: "My house is bigger than yours", vi: "Nhà tôi to hơn nhà bạn" },
          { en: "A plane is faster than a car", vi: "Máy bay nhanh hơn ô tô" },
          { en: "English is more difficult than maths", vi: "Tiếng Anh khó hơn toán" }
        ]
      },
      {
        id: "a2u3l2", title: "Nhất trong tất cả",
        goal: "So sánh nhất và cách nói về sở thích.",
        teach: [
          { t: "intro", title: "Từ “hơn” lên “nhất”", body: "Biết so sánh hơn rồi thì so sánh nhất chỉ đổi đuôi và thêm the. Quy tắc dài ngắn vẫn y nguyên.", bullets: ["Ngắn: the + est", "Dài: the most + …", "Luôn có the"] },
          { t: "grammar", title: "So sánh nhất", body: "Nhớ chữ the ở trước — đây là chỗ người Việt hay quên nhất.", rows: [
            ["1 âm tiết: the + est", "the biggest", "to nhất"],
            ["Tận cùng y: the + iest", "the easiest", "dễ nhất"],
            ["Dài: the most", "the most beautiful", "đẹp nhất"],
            ["Bất quy tắc", "the best, the worst", "tốt nhất, tệ nhất"],
            ["Phạm vi so sánh", "the best student in my class", "học sinh giỏi nhất lớp tôi"]
          ], tip: "Sau so sánh nhất thường có in (trong một nhóm, một nơi) hoặc of (trong một tập hợp): the tallest in the class, the best of all." },
          { t: "vocab", en: "best", vi: "tốt nhất", pos: "Tính từ", ipa: "/best/", note: "Dạng nhất của good. Bạn thân nhất là best friend.", ex: { en: "She is the best student.", vi: "Cô ấy là học sinh giỏi nhất." } },
          { t: "vocab", en: "favourite", vi: "yêu thích nhất", pos: "Tính từ", ipa: "/ˈfeɪvərɪt/", note: "Anh–Mỹ viết favorite. Bản thân nó đã mang nghĩa “nhất” nên không thêm most.", ex: { en: "Blue is my favourite colour.", vi: "Xanh là màu tôi thích nhất." } },
          { t: "vocab", en: "popular", vi: "được ưa chuộng", pos: "Tính từ", ipa: "/ˈpɑːpjələr/", note: "Ba âm tiết nên dùng more popular / the most popular.", ex: { en: "This song is very popular.", vi: "Bài hát này rất được ưa chuộng." } },
          { t: "vocab", en: "beautiful", vi: "đẹp", pos: "Tính từ", ipa: "/ˈbjuːtɪfl/", note: "Dùng cho phong cảnh, đồ vật, phụ nữ. Khen đàn ông thì dùng handsome.", ex: { en: "Ha Long Bay is the most beautiful place.", vi: "Vịnh Hạ Long là nơi đẹp nhất." } },
          { t: "vocab", en: "interesting", vi: "thú vị", pos: "Tính từ", ipa: "/ˈɪntrəstɪŋ/", note: "Vật thì interesting, người cảm thấy thì interested: I am interested in music.", ex: { en: "This book is interesting.", vi: "Quyển sách này thú vị." } },
          { t: "culture", title: "Đừng khen quá đà", body: "Người Anh–Mỹ ít dùng “the best” cho mọi thứ. Khen vừa phải bằng really good, quite nice nghe tự nhiên hơn. Nói cái gì cũng “the best” dễ bị coi là nói cho có." },
          { t: "dialogue", title: "Hỏi về sở thích", lines: [
            { who: "A", en: "What is your favourite film?", vi: "Bộ phim bạn thích nhất là gì?" },
            { who: "B", en: "The most interesting film for me is Titanic.", vi: "Với tôi bộ phim thú vị nhất là Titanic." },
            { who: "A", en: "It is the most popular film in my class too.", vi: "Ở lớp tôi nó cũng là phim được thích nhất." }
          ] }
        ],
        sentences: [
          { en: "She is the best student", vi: "Cô ấy là học sinh giỏi nhất" },
          { en: "Blue is my favourite colour", vi: "Xanh là màu tôi thích nhất" },
          { en: "What is your favourite film", vi: "Bộ phim bạn thích nhất là gì" }
        ]
      },
      {
        id: "a2u3l3", title: "Giống nhau hay khác nhau",
        goal: "Nói hai thứ giống nhau, khác nhau và chọn cái nào.",
        teach: [
          { t: "intro", title: "Không phải lúc nào cũng hơn kém", body: "Nhiều khi hai thứ ngang nhau. Tiếng Anh có mẫu riêng cho trường hợp đó, và một mẫu để nói mình chọn cái nào.", bullets: ["as … as: bằng nhau", "the same / different", "prefer: thích hơn"] },
          { t: "grammar", title: "as … as và not as … as", body: "Kẹp tính từ giữa hai chữ as là thành “bằng”. Thêm not là “không bằng”.", rows: [
            ["Bằng nhau", "She is as tall as me.", "Cô ấy cao bằng tôi."],
            ["Không bằng", "This is not as easy as that.", "Cái này không dễ bằng cái kia."],
            ["Giống nhau", "My bag is the same as yours.", "Túi tôi giống túi bạn."],
            ["Khác nhau", "Their houses are different.", "Nhà họ khác nhau."]
          ], tip: "the same phải đi với as, còn different đi với from: different from mine." },
          { t: "vocab", en: "same", vi: "giống nhau", pos: "Tính từ", ipa: "/seɪm/", note: "Luôn có the đứng trước: the same, không bao giờ nói “a same”.", ex: { en: "We are in the same class.", vi: "Chúng tôi học cùng lớp." } },
          { t: "vocab", en: "different", vi: "khác nhau", pos: "Tính từ", ipa: "/ˈdɪfrənt/", note: "Đọc 2 âm tiết /ˈdɪf-rənt/, không phải 3.", ex: { en: "These two bags are different.", vi: "Hai cái túi này khác nhau." } },
          { t: "vocab", en: "both", vi: "cả hai", pos: "Đại từ", ipa: "/boʊθ/", note: "Chỉ dùng cho đúng hai thứ. Ba thứ trở lên thì dùng all.", ex: { en: "Both of them are my friends.", vi: "Cả hai người họ đều là bạn tôi." } },
          { t: "vocab", en: "choose", vi: "chọn", pos: "Động từ", ipa: "/tʃuːz/", note: "Quá khứ bất quy tắc: chose /tʃoʊz/.", ex: { en: "You can choose one.", vi: "Bạn có thể chọn một cái." } },
          { t: "vocab", en: "prefer", vi: "thích hơn", pos: "Động từ", ipa: "/prɪˈfɜːr/", note: "So sánh hai thứ thì dùng prefer A to B, không dùng than.", ex: { en: "I prefer tea to coffee.", vi: "Tôi thích trà hơn cà phê." } },
          { t: "dialogue", title: "Chọn quán", lines: [
            { who: "A", en: "Both restaurants are good. Which one do you prefer?", vi: "Cả hai nhà hàng đều ngon. Bạn thích cái nào hơn?" },
            { who: "B", en: "They are not the same. This one is not as expensive.", vi: "Chúng không giống nhau đâu. Cái này không đắt bằng." },
            { who: "A", en: "Then let's choose this one.", vi: "Vậy chọn cái này nhé." }
          ] }
        ],
        sentences: [
          { en: "We are in the same class", vi: "Chúng tôi học cùng lớp" },
          { en: "I prefer tea to coffee", vi: "Tôi thích trà hơn cà phê" },
          { en: "Both of them are my friends", vi: "Cả hai người họ đều là bạn tôi" }
        ]
      },
      { id: "a2u3c", title: "Ôn tập chương 3", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  },

  /* ================= CHƯƠNG 4 ================= */
  {
    id: "a2u4", title: "Công việc & Sở thích",
    goal: "Nói về nghề nghiệp, sở thích và kể trải nghiệm đã từng có.",
    lessons: [
      {
        id: "a2u4l1", title: "Nghề nghiệp",
        goal: "Từ vựng công việc và cách hỏi nghề của người khác.",
        teach: [
          { t: "intro", title: "Câu hỏi làm quen số một", body: "Sau tên tuổi, người ta hỏi ngay nghề nghiệp. Có hai cách hỏi và một cái bẫy mạo từ.", bullets: ["What do you do?", "6 từ về công việc", "Bẫy: a/an trước nghề"] },
          { t: "vocab", en: "job", vi: "công việc", pos: "Danh từ", ipa: "/dʒɑːb/", note: "Job đếm được (a job), còn work thì không đếm được.", ex: { en: "I have a new job.", vi: "Tôi có công việc mới." } },
          { t: "vocab", en: "office", vi: "văn phòng", pos: "Danh từ", ipa: "/ˈɔːfɪs/", note: "Làm ở văn phòng là work in an office.", ex: { en: "She works in an office.", vi: "Cô ấy làm việc ở văn phòng." } },
          { t: "vocab", en: "company", vi: "công ty", pos: "Danh từ", ipa: "/ˈkʌmpəni/", note: "Số nhiều đổi y thành ies: companies.", ex: { en: "He works for a big company.", vi: "Anh ấy làm cho một công ty lớn." } },
          { t: "vocab", en: "boss", vi: "sếp", pos: "Danh từ", ipa: "/bɔːs/", note: "Trang trọng hơn thì dùng manager.", ex: { en: "My boss is very kind.", vi: "Sếp tôi rất tốt bụng." } },
          { t: "vocab", en: "salary", vi: "lương", pos: "Danh từ", ipa: "/ˈsæləri/", note: "Lương tháng là salary, lương theo giờ là wage.", ex: { en: "The salary is good.", vi: "Lương khá tốt." } },
          { t: "vocab", en: "career", vi: "sự nghiệp", pos: "Danh từ", ipa: "/kəˈrɪr/", note: "Nhấn âm thứ hai: ca-REER. Khác job — career là cả con đường nghề nghiệp.", ex: { en: "She wants a career in music.", vi: "Cô ấy muốn theo nghiệp âm nhạc." } },
          { t: "grammar", title: "Hỏi và nói nghề nghiệp", body: "Nghề nghiệp trong tiếng Anh luôn cần mạo từ a/an — đây là lỗi người Việt mắc nhiều nhất.", rows: [
            ["Hỏi nghề", "What do you do?", "Bạn làm nghề gì?"],
            ["Trả lời", "I am a teacher.", "Tôi là giáo viên."],
            ["Nguyên âm dùng an", "She is an engineer.", "Cô ấy là kỹ sư."],
            ["Sai", "I am teacher.", "(thiếu chữ a)"],
            ["Nói nơi làm", "I work for a school.", "Tôi làm cho một trường học."]
          ], tip: "What do you do? hỏi nghề nghiệp. What are you doing? lại là “bạn đang làm gì đấy?” — khác hẳn nhau." },
          { t: "dialogue", title: "Gặp nhau ở tiệc", lines: [
            { who: "A", en: "What do you do?", vi: "Bạn làm nghề gì?" },
            { who: "B", en: "I am a teacher. I work for a big school.", vi: "Tôi là giáo viên. Tôi làm cho một trường lớn." },
            { who: "A", en: "Nice! My boss was a teacher before.", vi: "Hay đấy! Sếp tôi trước cũng là giáo viên." }
          ] }
        ],
        sentences: [
          { en: "I have a new job", vi: "Tôi có công việc mới" },
          { en: "She works in an office", vi: "Cô ấy làm việc ở văn phòng" },
          { en: "He works for a big company", vi: "Anh ấy làm cho một công ty lớn" }
        ]
      },
      {
        id: "a2u4l2", title: "Sở thích rảnh rỗi",
        goal: "Nói về sở thích và động từ theo sau like.",
        teach: [
          { t: "intro", title: "Sau like là gì?", body: "Muốn nói “thích làm gì đó”, tiếng Anh có quy tắc riêng cho động từ đứng sau. Nắm được là nói được cả chục câu.", bullets: ["6 từ sở thích", "like + V-ing", "Hỏi sở thích"] },
          { t: "vocab", en: "hobby", vi: "sở thích", pos: "Danh từ", ipa: "/ˈhɑːbi/", note: "Số nhiều là hobbies.", ex: { en: "My hobby is reading.", vi: "Sở thích của tôi là đọc sách." } },
          { t: "vocab", en: "music", vi: "âm nhạc", pos: "Danh từ", ipa: "/ˈmjuːzɪk/", note: "Không đếm được, không bao giờ có musics.", ex: { en: "I listen to music every day.", vi: "Tôi nghe nhạc mỗi ngày." } },
          { t: "vocab", en: "sport", vi: "thể thao", pos: "Danh từ", ipa: "/spɔːrt/", note: "Anh–Mỹ hay dùng số nhiều sports.", ex: { en: "Football is my favourite sport.", vi: "Bóng đá là môn thể thao tôi thích nhất." } },
          { t: "vocab", en: "film", vi: "bộ phim", pos: "Danh từ", ipa: "/fɪlm/", note: "Anh–Mỹ dùng movie.", ex: { en: "We watched a good film.", vi: "Chúng tôi đã xem một bộ phim hay." } },
          { t: "vocab", en: "swim", vi: "bơi", pos: "Động từ", ipa: "/swɪm/", note: "Bất quy tắc: swam. Đi bơi là go swimming.", ex: { en: "I like swimming in summer.", vi: "Tôi thích bơi vào mùa hè." } },
          { t: "vocab", en: "cook", vi: "nấu ăn", pos: "Động từ", ipa: "/kʊk/", note: "Cũng là danh từ nghĩa đầu bếp. Đầu bếp nhà hàng là chef.", ex: { en: "My mother cooks very well.", vi: "Mẹ tôi nấu ăn rất giỏi." } },
          { t: "grammar", title: "like + V-ing", body: "Sau các động từ chỉ sở thích, động từ tiếp theo phải thêm -ing.", rows: [
            ["like + V-ing", "I like swimming.", "Tôi thích bơi."],
            ["love / enjoy + V-ing", "She enjoys cooking.", "Cô ấy thích nấu ăn."],
            ["hate + V-ing", "He hates waiting.", "Anh ấy ghét phải chờ."],
            ["Hỏi sở thích", "What do you like doing?", "Bạn thích làm gì?"],
            ["Sai", "I like swim.", "(phải là swimming)"]
          ], tip: "Riêng want thì khác: want + to + động từ nguyên thể — I want to swim." },
          { t: "dialogue", title: "Cuối tuần làm gì", lines: [
            { who: "A", en: "What do you like doing at the weekend?", vi: "Cuối tuần bạn thích làm gì?" },
            { who: "B", en: "I like swimming and watching films.", vi: "Tôi thích bơi và xem phim." },
            { who: "A", en: "My hobby is cooking. Music is nice too.", vi: "Sở thích của tôi là nấu ăn. Nghe nhạc cũng hay." }
          ] }
        ],
        sentences: [
          { en: "I like swimming in summer", vi: "Tôi thích bơi vào mùa hè" },
          { en: "My mother cooks very well", vi: "Mẹ tôi nấu ăn rất giỏi" },
          { en: "What do you like doing at the weekend", vi: "Cuối tuần bạn thích làm gì" }
        ]
      },
      {
        id: "a2u4l3", title: "Đã từng chưa?",
        goal: "Thì hiện tại hoàn thành để kể trải nghiệm.",
        teach: [
          { t: "intro", title: "Chuyện đã từng, không nói rõ khi nào", body: "Muốn khoe “tôi đã từng đi Nhật” mà không cần nói năm nào, tiếng Anh dùng một thì riêng: hiện tại hoàn thành.", bullets: ["have / has + V3", "ever, never, already, yet", "Khác gì quá khứ đơn"] },
          { t: "grammar", title: "Hiện tại hoàn thành", body: "Công thức: have/has + động từ cột 3 (quá khứ phân từ).", rows: [
            ["I / You / We / They", "have been", "I have been to Japan. — Tôi đã từng đến Nhật."],
            ["He / She / It", "has been", "She has visited Hue. — Cô ấy đã từng thăm Huế."],
            ["Câu hỏi", "Have you ever…?", "Have you ever eaten sushi? — Bạn đã ăn sushi bao giờ chưa?"],
            ["Phủ định", "have never", "I have never seen snow. — Tôi chưa từng thấy tuyết."]
          ], tip: "Khác biệt cốt lõi: có mốc thời gian rõ (yesterday, last week) thì dùng quá khứ đơn; không nói rõ khi nào, chỉ nói “đã từng” thì dùng hiện tại hoàn thành." },
          { t: "vocab", en: "ever", vi: "đã từng", pos: "Trạng từ", ipa: "/ˈevər/", note: "Hầu như chỉ dùng trong câu hỏi: Have you ever…?", ex: { en: "Have you ever been to Hanoi?", vi: "Bạn đã đến Hà Nội bao giờ chưa?" } },
          { t: "vocab", en: "never", vi: "chưa bao giờ", pos: "Trạng từ", ipa: "/ˈnevər/", note: "Bản thân đã mang nghĩa phủ định, không thêm not nữa.", ex: { en: "I have never seen snow.", vi: "Tôi chưa bao giờ thấy tuyết." } },
          { t: "vocab", en: "already", vi: "rồi, đã", pos: "Trạng từ", ipa: "/ɔːlˈredi/", note: "Đứng giữa have và động từ: I have already eaten.", ex: { en: "She has already finished.", vi: "Cô ấy làm xong rồi." } },
          { t: "vocab", en: "yet", vi: "chưa", pos: "Trạng từ", ipa: "/jet/", note: "Đứng cuối câu, chỉ dùng trong câu hỏi và câu phủ định.", ex: { en: "I have not finished yet.", vi: "Tôi vẫn chưa xong." } },
          { t: "vocab", en: "try", vi: "thử", pos: "Động từ", ipa: "/traɪ/", note: "Quá khứ đổi y thành ied: tried.", ex: { en: "Have you tried Vietnamese coffee?", vi: "Bạn đã thử cà phê Việt Nam chưa?" } },
          { t: "vocab", en: "abroad", vi: "ở nước ngoài", pos: "Trạng từ", ipa: "/əˈbrɔːd/", note: "Không có giới từ: go abroad, chứ không phải go to abroad.", ex: { en: "I have never been abroad.", vi: "Tôi chưa từng ra nước ngoài." } },
          { t: "dialogue", title: "Hỏi về trải nghiệm", lines: [
            { who: "A", en: "Have you ever been abroad?", vi: "Bạn đã ra nước ngoài bao giờ chưa?" },
            { who: "B", en: "I have never been abroad, but I want to try.", vi: "Tôi chưa bao giờ, nhưng tôi muốn thử." },
            { who: "A", en: "I have already visited three countries.", vi: "Tôi thì đã đi ba nước rồi." }
          ] }
        ],
        sentences: [
          { en: "Have you ever been abroad", vi: "Bạn đã ra nước ngoài bao giờ chưa" },
          { en: "I have never seen snow", vi: "Tôi chưa bao giờ thấy tuyết" },
          { en: "She has already finished", vi: "Cô ấy làm xong rồi" }
        ]
      },
      { id: "a2u4c", title: "Ôn tập chương 4", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  }

  ]
};

/* Ghép các trình độ lại thành một khoá học */
const COURSE = {
  name: "Tiếng Anh",
  levels: [A1, A2]
};

/* Giải đấu tuần — đối thủ mô phỏng, lưu trên máy người dùng */
const RIVALS = [
  { name: "Minh Anh",   xp: 620 }, { name: "Quốc Bảo",   xp: 545 },
  { name: "Thu Hà",     xp: 498 }, { name: "Gia Huy",    xp: 430 },
  { name: "Khánh Linh", xp: 388 }, { name: "Trọng Nhân", xp: 322 },
  { name: "Bảo Ngọc",   xp: 275 }, { name: "Đức Thắng",  xp: 210 },
  { name: "Hải Yến",    xp: 165 }, { name: "Phương Vy",  xp: 120 }
];

/* Bậc giải đấu, đi lên khi vào top 5 tuần */
/* Màu bậc đủ tối để icon trắng đạt tương phản 3:1 ở cả nền sáng lẫn nền tối. */
const LEAGUES = [
  { id: "bronze",   name: "Đồng",      color: "#92400E" },
  { id: "silver",   name: "Bạc",       color: "#52525B" },
  { id: "gold",     name: "Vàng",      color: "#A16207" },
  { id: "platinum", name: "Bạch Kim",  color: "#0F766E" },
  { id: "diamond",  name: "Kim Cương", color: "#4F46E5" }
];
