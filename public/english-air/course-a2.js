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
