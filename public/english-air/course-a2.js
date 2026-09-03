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

      {
        id: "a2u1l3", title: "Động từ bất quy tắc",
        goal: "Sáu động từ quá khứ không theo quy tắc, gặp trong mọi câu chuyện.",
        teach: [
          { t: "intro", title: "Nhóm bướng bỉnh nhất tiếng Anh", body: "Bài trước bạn thêm -ed vào là xong. Nhưng những động từ hay dùng nhất lại không chịu quy tắc — chúng đổi hẳn hình dạng. Không có cách nào khác ngoài học thuộc.", bullets: ["6 động từ bất quy tắc thông dụng", "Bảng V1 – V2", "Câu phủ định thì lại về V1"] },
          { t: "vocab", en: "begin", vi: "bắt đầu", pos: "Động từ", ipa: "/bɪˈɡɪn/", note: "Quá khứ là began. Đồng nghĩa với start nhưng trang trọng hơn.", ex: { en: "The film began at eight.", vi: "Bộ phim bắt đầu lúc tám giờ." } },
          { t: "vocab", en: "bring", vi: "mang đến", pos: "Động từ", ipa: "/brɪŋ/", note: "Quá khứ là brought. Bring là mang TỚI chỗ người nói, take là mang ĐI.", ex: { en: "She brought a gift for me.", vi: "Cô ấy mang quà đến cho tôi." } },
          { t: "vocab", en: "find", vi: "tìm thấy", pos: "Động từ", ipa: "/faɪnd/", note: "Quá khứ là found. Find là tìm THẤY, còn look for mới là đang tìm.", ex: { en: "I found my phone under the bed.", vi: "Tôi tìm thấy điện thoại dưới gầm giường." } },
          { t: "vocab", en: "lose", vi: "mất, thua", pos: "Động từ", ipa: "/luːz/", note: "Quá khứ là lost. Vừa nghĩa mất đồ vừa nghĩa thua cuộc.", ex: { en: "He lost his ticket yesterday.", vi: "Hôm qua anh ấy làm mất vé." } },
          { t: "vocab", en: "break", vi: "làm vỡ, làm hỏng", pos: "Động từ", ipa: "/breɪk/", note: "Quá khứ là broke. Break cũng là giờ giải lao: a coffee break.", ex: { en: "I broke a glass this morning.", vi: "Sáng nay tôi làm vỡ một cái cốc." } },
          { t: "vocab", en: "catch", vi: "bắt, bắt kịp", pos: "Động từ", ipa: "/kætʃ/", note: "Quá khứ là caught. Catch a bus là bắt kịp chuyến xe buýt.", ex: { en: "We caught the last train.", vi: "Chúng tôi bắt kịp chuyến tàu cuối." } },
          { t: "grammar", title: "Bảng V1 – V2 phải thuộc", body: "Cột trái là dạng gốc, cột giữa là quá khứ. Đọc to vài lần rồi che cột giữa tự nhớ lại — cách học hiệu quả nhất.", rows: [
            ["begin", "began", "The class began late."],
            ["bring", "brought", "He brought his book."],
            ["find / lose", "found / lost", "I lost my bag but found it."],
            ["break / catch", "broke / caught", "She broke her phone."]
          ], tip: "Cạm bẫy lớn nhất: câu phủ định và câu hỏi thì động từ QUAY VỀ dạng gốc — I didn't find it, chứ không phải didn't found." },
          { t: "dialogue", title: "Buổi sáng xui xẻo", lines: [
            { who: "A", en: "You look tired. What happened?", vi: "Trông bạn mệt thế. Có chuyện gì vậy?" },
            { who: "B", en: "I lost my keys and broke a glass this morning.", vi: "Sáng nay tôi làm mất chìa khoá và làm vỡ một cái cốc." },
            { who: "A", en: "Did you find the keys?", vi: "Bạn tìm thấy chìa khoá chưa?" },
            { who: "B", en: "Yes, but I didn't catch my bus.", vi: "Rồi, nhưng tôi lỡ mất chuyến xe buýt." }
          ] }
        ],
        sentences: [
          { en: "I found my phone under the bed", vi: "Tôi tìm thấy điện thoại dưới gầm giường" },
          { en: "She brought a gift for me", vi: "Cô ấy mang quà đến cho tôi" },
          { en: "We caught the last train", vi: "Chúng tôi bắt kịp chuyến tàu cuối" },
          { en: "He lost his ticket yesterday", vi: "Hôm qua anh ấy làm mất vé" },
          { en: "The film began at eight", vi: "Bộ phim bắt đầu lúc tám giờ" }
        ]
      },
      {
        id: "a2u1l4", title: "Kỳ nghỉ vừa rồi",
        goal: "Kể lại một chuyến đi: đi đâu, ở đâu, làm gì.",
        teach: [
          { t: "intro", title: "Câu chuyện ai cũng muốn nghe", body: "Kể về chuyến đi là chủ đề dễ nói nhất khi làm quen. Bạn đã có thì quá khứ, giờ chỉ cần thêm từ vựng cho đúng chỗ.", bullets: ["Từ vựng du lịch", "Trật tự kể chuyện", "Trạng từ chỉ thời gian trong quá khứ"] },
          { t: "vocab", en: "beach", vi: "bãi biển", pos: "Danh từ", ipa: "/biːtʃ/", note: "Đi biển nói go to the beach. Biển nói chung là the sea.", ex: { en: "We went to the beach last summer.", vi: "Hè năm ngoái chúng tôi đi biển." } },
          { t: "vocab", en: "mountain", vi: "núi", pos: "Danh từ", ipa: "/ˈmaʊntn/", note: "Đọc MAUN-tần, chữ ai trong -tain đọc rất nhẹ.", ex: { en: "Sapa has beautiful mountains.", vi: "Sa Pa có những ngọn núi đẹp." } },
          { t: "vocab", en: "hotel", vi: "khách sạn", pos: "Danh từ", ipa: "/hoʊˈtel/", note: "Trọng âm ở âm sau: hô-TEL. Nhà nghỉ nhỏ gọi là guesthouse.", ex: { en: "We stayed at a small hotel.", vi: "Chúng tôi ở một khách sạn nhỏ." } },
          { t: "vocab", en: "photo", vi: "bức ảnh", pos: "Danh từ", ipa: "/ˈfoʊtoʊ/", note: "Chụp ảnh là take a photo, KHÔNG phải shoot hay make.", ex: { en: "I took many photos there.", vi: "Tôi chụp rất nhiều ảnh ở đó." } },
          { t: "vocab", en: "souvenir", vi: "quà lưu niệm", pos: "Danh từ", ipa: "/ˌsuːvəˈnɪr/", note: "Từ mượn tiếng Pháp, trọng âm ở âm cuối: su-vơ-NIA.", ex: { en: "She bought a souvenir for her mother.", vi: "Cô ấy mua quà lưu niệm cho mẹ." } },
          { t: "vocab", en: "trip", vi: "chuyến đi", pos: "Danh từ", ipa: "/trɪp/", note: "Chuyến đi ngắn. Trip cũng là động từ nghĩa vấp ngã.", ex: { en: "It was a wonderful trip.", vi: "Đó là một chuyến đi tuyệt vời." } },
          { t: "grammar", title: "Kể chuyện theo thứ tự", body: "Một câu chuyện hay không chỉ đúng ngữ pháp, mà còn đúng thứ tự. Bốn từ nối này giúp người nghe theo được mạch chuyện.", rows: [
            ["First,", "Đầu tiên", "First, we went to the beach."],
            ["Then,", "Sau đó", "Then, we visited the mountains."],
            ["After that,", "Tiếp theo đó", "After that, we ate seafood."],
            ["Finally,", "Cuối cùng", "Finally, we came home."]
          ], tip: "Bắt đầu câu chuyện bằng Last summer / Two years ago, rồi mới dùng bốn từ nối này." },
          { t: "dialogue", title: "Kể về chuyến đi Đà Nẵng", lines: [
            { who: "A", en: "Where did you go last summer?", vi: "Hè năm ngoái bạn đi đâu?" },
            { who: "B", en: "I went to Da Nang. We stayed at a small hotel near the beach.", vi: "Tôi đi Đà Nẵng. Chúng tôi ở một khách sạn nhỏ gần biển." },
            { who: "A", en: "Did you take many photos?", vi: "Bạn có chụp nhiều ảnh không?" },
            { who: "B", en: "Yes! And I bought souvenirs for my family. It was a wonderful trip.", vi: "Có! Tôi còn mua quà lưu niệm cho gia đình. Đó là một chuyến đi tuyệt vời." }
          ] }
        ],
        sentences: [
          { en: "We went to the beach last summer", vi: "Hè năm ngoái chúng tôi đi biển" },
          { en: "I took many photos there", vi: "Tôi chụp rất nhiều ảnh ở đó" },
          { en: "We stayed at a small hotel", vi: "Chúng tôi ở một khách sạn nhỏ" },
          { en: "It was a wonderful trip", vi: "Đó là một chuyến đi tuyệt vời" },
          { en: "She bought a souvenir for her mother", vi: "Cô ấy mua quà lưu niệm cho mẹ" }
        ]
      },
      {
        id: "a2u1l5", title: "Chuyện hồi bé",
        goal: "Kể về tuổi thơ bằng used to và các từ chỉ thời thơ ấu.",
        teach: [
          { t: "intro", title: "Ngày xưa tôi từng…", body: "Có một cấu trúc dành riêng cho những việc bạn LÀM ĐỀU ĐẶN hồi xưa nhưng giờ không làm nữa. Người Việt ít biết cấu trúc này nên câu chuyện tuổi thơ hay bị kể sai.", bullets: ["used to + động từ", "Từ vựng tuổi thơ", "Phân biệt used to và quá khứ đơn"] },
          { t: "vocab", en: "childhood", vi: "tuổi thơ", pos: "Danh từ", ipa: "/ˈtʃaɪldhʊd/", note: "Ghép child (đứa trẻ) + hood (thời kỳ). Tương tự có neighbourhood.", ex: { en: "I had a happy childhood.", vi: "Tôi có một tuổi thơ hạnh phúc." } },
          { t: "vocab", en: "grandmother", vi: "bà", pos: "Danh từ", ipa: "/ˈɡrænmʌðər/", note: "Gọi thân mật là grandma. Tiếng Anh không phân biệt bà nội bà ngoại.", ex: { en: "My grandmother told me stories.", vi: "Bà tôi kể chuyện cho tôi nghe." } },
          { t: "vocab", en: "grandfather", vi: "ông", pos: "Danh từ", ipa: "/ˈɡrænfɑːðər/", note: "Gọi thân mật là grandpa. Cả ông và bà gọi chung là grandparents.", ex: { en: "My grandfather grew rice.", vi: "Ông tôi trồng lúa." } },
          { t: "vocab", en: "toy", vi: "đồ chơi", pos: "Danh từ", ipa: "/tɔɪ/", note: "Đếm được: a toy, many toys.", ex: { en: "I used to play with old toys.", vi: "Hồi bé tôi hay chơi với đồ chơi cũ." } },
          { t: "vocab", en: "story", vi: "câu chuyện", pos: "Danh từ", ipa: "/ˈstɔːri/", note: "Số nhiều là stories. Kể chuyện là tell a story, không phải say.", ex: { en: "She tells wonderful stories.", vi: "Bà ấy kể những câu chuyện rất hay." } },
          { t: "vocab", en: "afraid", vi: "sợ", pos: "Tính từ", ipa: "/əˈfreɪd/", note: "Luôn đi với of: afraid of dogs. I'm afraid… còn nghĩa là e rằng.", ex: { en: "I was afraid of the dark.", vi: "Hồi bé tôi sợ bóng tối." } },
          { t: "grammar", title: "Used to — chuyện xưa giờ không còn", body: "Dùng khi việc đó lặp đi lặp lại trong quá khứ và BÂY GIỜ ĐÃ THÔI. Quá khứ đơn chỉ kể một lần xảy ra.", rows: [
            ["used to + V", "hồi xưa hay…", "I used to live in a village."],
            ["didn't use to + V", "hồi xưa không…", "She didn't use to like coffee."],
            ["Did you use to…?", "hồi xưa bạn có…?", "Did you use to play football?"],
            ["so sánh", "quá khứ đơn = một lần", "I went there in 2019. (một lần)"]
          ], tip: "Ở dạng phủ định và câu hỏi thì bỏ chữ d: didn't USE to, chứ không phải didn't used to." },
          { t: "culture", title: "Tuổi thơ là chủ đề an toàn", body: "Muốn nói chuyện lâu với người nước ngoài mà không sợ chạm vào chuyện riêng tư, hãy hỏi về tuổi thơ của họ. Ai cũng có chuyện để kể, và ai cũng thích kể." },
          { t: "dialogue", title: "Nhớ ngày xưa", lines: [
            { who: "A", en: "Where did you live when you were a child?", vi: "Hồi bé bạn sống ở đâu?" },
            { who: "B", en: "I used to live in a small village with my grandmother.", vi: "Hồi đó tôi sống ở một ngôi làng nhỏ với bà." },
            { who: "A", en: "Did you use to play outside?", vi: "Bạn có hay chơi ngoài trời không?" },
            { who: "B", en: "Every day! But I was afraid of the dark.", vi: "Ngày nào cũng chơi! Nhưng tôi sợ bóng tối." }
          ] }
        ],
        sentences: [
          { en: "I used to live in a village", vi: "Hồi xưa tôi sống ở một ngôi làng" },
          { en: "My grandmother told me stories", vi: "Bà tôi kể chuyện cho tôi nghe" },
          { en: "I was afraid of the dark", vi: "Tôi sợ bóng tối" },
          { en: "Did you use to play football", vi: "Hồi bé bạn có hay chơi bóng đá không" },
          { en: "I had a happy childhood", vi: "Tôi có một tuổi thơ hạnh phúc" }
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

      {
        id: "a2u2l3", title: "Sẽ và có lẽ",
        goal: "Phân biệt will, might và be going to khi nói về tương lai.",
        teach: [
          { t: "intro", title: "Ba cách nói về ngày mai", body: "Bạn đã có be going to cho kế hoạch. Nhưng còn chuyện bạn quyết ngay lúc nói, và chuyện bạn chưa chắc? Mỗi loại có một từ riêng.", bullets: ["will cho quyết định tức thì", "might cho chuyện chưa chắc", "Khi nào dùng be going to"] },
          { t: "vocab", en: "future", vi: "tương lai", pos: "Danh từ", ipa: "/ˈfjuːtʃər/", note: "In the future là trong tương lai. Đọc FYUU-chờ.", ex: { en: "What do you want to do in the future?", vi: "Trong tương lai bạn muốn làm gì?" } },
          { t: "vocab", en: "dream", vi: "ước mơ; giấc mơ", pos: "Danh từ", ipa: "/driːm/", note: "Vừa là ước mơ vừa là giấc mơ khi ngủ. Dream of + V-ing.", ex: { en: "My dream is to be a doctor.", vi: "Ước mơ của tôi là làm bác sĩ." } },
          { t: "vocab", en: "hope", vi: "hy vọng", pos: "Động từ", ipa: "/hoʊp/", note: "I hope so là câu đáp rất hay dùng: Mong là vậy.", ex: { en: "I hope it will be sunny.", vi: "Tôi mong trời sẽ nắng." } },
          { t: "vocab", en: "sure", vi: "chắc chắn", pos: "Tính từ", ipa: "/ʃʊr/", note: "I'm not sure là câu nói giảm rất lịch sự khi bạn chưa biết.", ex: { en: "I am not sure about tomorrow.", vi: "Tôi chưa chắc về ngày mai." } },
          { t: "vocab", en: "probably", vi: "có lẽ, chắc là", pos: "Trạng từ", ipa: "/ˈprɑːbəbli/", note: "Chắc chắn hơn maybe. Đứng trước động từ thường, sau will.", ex: { en: "I will probably stay home.", vi: "Chắc tôi sẽ ở nhà." } },
          { t: "vocab", en: "university", vi: "trường đại học", pos: "Danh từ", ipa: "/ˌjuːnɪˈvɜːrsəti/", note: "Dùng a chứ không phải an, vì đọc là YU chứ không phải U: a university.", ex: { en: "She wants to go to university.", vi: "Cô ấy muốn vào đại học." } },
          { t: "grammar", title: "Will, might hay be going to?", body: "Ba cách, ba tình huống khác hẳn nhau. Chọn sai thì câu vẫn hiểu được nhưng nghe không tự nhiên.", rows: [
            ["be going to", "kế hoạch đã định", "I'm going to visit Hue next week."],
            ["will", "quyết định ngay lúc nói", "It's cold — I'll close the window."],
            ["might", "có thể, chưa chắc", "I might go to the party."],
            ["will probably", "khá chắc nhưng chưa hẳn", "She will probably come."]
          ], tip: "Mẹo: đã có kế hoạch từ trước thì GOING TO. Nghĩ ra ngay lúc nói thì WILL. Chưa chắc thì MIGHT." },
          { t: "dialogue", title: "Nói chuyện tương lai", lines: [
            { who: "A", en: "What do you want to do in the future?", vi: "Trong tương lai bạn muốn làm gì?" },
            { who: "B", en: "My dream is to be an engineer. I'm going to study hard this year.", vi: "Ước mơ của tôi là làm kỹ sư. Năm nay tôi sẽ học chăm." },
            { who: "A", en: "Will you go to university in Hanoi?", vi: "Bạn sẽ học đại học ở Hà Nội chứ?" },
            { who: "B", en: "I'm not sure. I might go to Da Nang.", vi: "Tôi chưa chắc. Có thể tôi vào Đà Nẵng." }
          ] }
        ],
        sentences: [
          { en: "My dream is to be a doctor", vi: "Ước mơ của tôi là làm bác sĩ" },
          { en: "I might go to the party", vi: "Có thể tôi sẽ đi bữa tiệc" },
          { en: "I am not sure about tomorrow", vi: "Tôi chưa chắc về ngày mai" },
          { en: "She wants to go to university", vi: "Cô ấy muốn vào đại học" },
          { en: "I will probably stay home", vi: "Chắc tôi sẽ ở nhà" }
        ]
      },
      {
        id: "a2u2l4", title: "Mời và từ chối",
        goal: "Mời ai đó đi chơi, nhận lời hoặc từ chối mà không mất lòng.",
        teach: [
          { t: "intro", title: "Từ chối cũng phải học", body: "Nói Yes thì dễ. Nói No mà người ta vẫn vui mới khó. Bài này cho bạn công thức từ chối lịch sự mà người bản xứ dùng hằng ngày.", bullets: ["Mẫu câu mời", "Nhận lời", "Từ chối ba bước"] },
          { t: "vocab", en: "party", vi: "bữa tiệc", pos: "Danh từ", ipa: "/ˈpɑːrti/", note: "Đi dự tiệc là go to a party. Tổ chức tiệc là have a party.", ex: { en: "We are having a party on Saturday.", vi: "Thứ Bảy chúng tôi tổ chức tiệc." } },
          { t: "vocab", en: "guest", vi: "khách mời", pos: "Danh từ", ipa: "/ɡest/", note: "Khách đến chơi nhà. Khách hàng mua bán thì gọi là customer.", ex: { en: "There were twenty guests.", vi: "Có hai mươi khách mời." } },
          { t: "vocab", en: "gift", vi: "món quà", pos: "Danh từ", ipa: "/ɡɪft/", note: "Trang trọng hơn present một chút. Cả hai đều dùng được.", ex: { en: "I brought a small gift.", vi: "Tôi mang theo một món quà nhỏ." } },
          { t: "vocab", en: "join", vi: "tham gia", pos: "Động từ", ipa: "/dʒɔɪn/", note: "Join us là câu rủ rất tự nhiên. Không cần giới từ phía sau.", ex: { en: "Would you like to join us?", vi: "Bạn có muốn tham gia cùng không?" } },
          { t: "vocab", en: "accept", vi: "nhận lời, chấp nhận", pos: "Động từ", ipa: "/əkˈsept/", note: "Trang trọng. Nói chuyện thường ngày người ta hay dùng say yes.", ex: { en: "She accepted the invitation.", vi: "Cô ấy đã nhận lời mời." } },
          { t: "vocab", en: "refuse", vi: "từ chối", pos: "Động từ", ipa: "/rɪˈfjuːz/", note: "Khá mạnh. Trong câu nói hằng ngày nên dùng I'm afraid I can't cho nhẹ.", ex: { en: "He refused politely.", vi: "Anh ấy từ chối một cách lịch sự." } },
          { t: "grammar", title: "Từ chối ba bước", body: "Người bản xứ hiếm khi nói No trống không. Họ dùng đúng ba bước, và bạn nên bắt chước y hệt.", rows: [
            ["Bước 1", "Cảm ơn lời mời", "Thanks for asking!"],
            ["Bước 2", "Nói không, có đệm", "I'm afraid I can't."],
            ["Bước 3", "Nêu lý do ngắn", "I have to study that day."],
            ["Thêm", "Gợi ý dịp khác", "Maybe next time?"]
          ], tip: "Câu mời lịch sự nhất là Would you like to…? Trả lời nhận lời: I'd love to!" },
          { t: "culture", title: "Trả lời dứt khoát mới là lịch sự", body: "Người Việt hay nói để xem đã cho đỡ mất lòng. Người Anh–Mỹ coi câu trả lời lấp lửng là thiếu tôn trọng vì họ phải xếp chỗ, mua đồ ăn. Nhận thì nói rõ nhận, không thì từ chối sớm." },
          { t: "dialogue", title: "Lời mời sinh nhật", lines: [
            { who: "A", en: "We are having a party on Saturday. Would you like to join us?", vi: "Thứ Bảy chúng tôi tổ chức tiệc. Bạn có muốn tham gia không?" },
            { who: "B", en: "Thanks for asking! I'm afraid I can't — I have to work.", vi: "Cảm ơn bạn đã mời! Nhưng tôi e là không được, tôi phải đi làm." },
            { who: "A", en: "That's a pity. Maybe next time?", vi: "Tiếc quá. Lần sau nhé?" },
            { who: "B", en: "I'd love to. I will bring a gift!", vi: "Tôi rất muốn. Tôi sẽ mang quà!" }
          ] }
        ],
        sentences: [
          { en: "Would you like to join us", vi: "Bạn có muốn tham gia cùng không" },
          { en: "I am afraid I cannot come", vi: "Tôi e là tôi không đến được" },
          { en: "We are having a party on Saturday", vi: "Thứ Bảy chúng tôi tổ chức tiệc" },
          { en: "She accepted the invitation", vi: "Cô ấy đã nhận lời mời" },
          { en: "I brought a small gift", vi: "Tôi mang theo một món quà nhỏ" }
        ]
      },
      {
        id: "a2u2l5", title: "Đặt chỗ & Giờ giấc",
        goal: "Đặt bàn, đặt phòng và nói về giờ khởi hành, giờ đến.",
        teach: [
          { t: "intro", title: "Những câu cần khi đi xa", body: "Đặt phòng khách sạn, hỏi giờ tàu chạy, xin lỗi vì đến muộn — ba tình huống ai đi du lịch cũng gặp.", bullets: ["Từ vựng lịch trình", "Đặt chỗ cho lịch sự", "Sớm, muộn và đúng giờ"] },
          { t: "vocab", en: "reserve", vi: "đặt chỗ trước", pos: "Động từ", ipa: "/rɪˈzɜːrv/", note: "Trang trọng hơn book. Nhà hàng, khách sạn đều hiểu cả hai từ.", ex: { en: "I would like to reserve a table.", vi: "Tôi muốn đặt một bàn." } },
          { t: "vocab", en: "arrive", vi: "đến nơi", pos: "Động từ", ipa: "/əˈraɪv/", note: "Arrive IN thành phố, arrive AT nhà ga. Không bao giờ arrive to.", ex: { en: "The train arrives at seven.", vi: "Tàu đến lúc bảy giờ." } },
          { t: "vocab", en: "leave", vi: "rời đi, khởi hành", pos: "Động từ", ipa: "/liːv/", note: "Quá khứ là left. Đừng nhầm với live (sống) — leave đọc dài hơn.", ex: { en: "We leave at six in the morning.", vi: "Chúng tôi khởi hành lúc sáu giờ sáng." } },
          { t: "vocab", en: "early", vi: "sớm", pos: "Trạng từ", ipa: "/ˈɜːrli/", note: "Vừa là tính từ vừa là trạng từ, không thêm -ly nữa.", ex: { en: "I always arrive early.", vi: "Tôi luôn đến sớm." } },
          { t: "vocab", en: "late", vi: "muộn", pos: "Trạng từ", ipa: "/leɪt/", note: "Late là muộn, nhưng lately lại nghĩa là dạo gần đây — hai từ khác hẳn.", ex: { en: "Sorry, I am late.", vi: "Xin lỗi, tôi đến muộn." } },
          { t: "vocab", en: "delay", vi: "trễ, hoãn", pos: "Danh từ", ipa: "/dɪˈleɪ/", note: "Ở sân bay hay thấy chữ DELAYED trên bảng điện tử.", ex: { en: "There was a two-hour delay.", vi: "Có một sự chậm trễ hai tiếng." } },
          { t: "grammar", title: "Đặt chỗ cho lịch sự", body: "Câu đặt chỗ dùng would like thay cho want. Cùng nghĩa nhưng lịch sự hơn hẳn, và đây là chuẩn mực khi nói với người lạ.", rows: [
            ["I would like to…", "Tôi muốn…", "I'd like to reserve a room."],
            ["Could I…?", "Tôi có thể… được không?", "Could I have a table for two?"],
            ["What time does… ?", "Mấy giờ thì…?", "What time does the train leave?"],
            ["It leaves at…", "Nó khởi hành lúc…", "It leaves at 6:30."]
          ], tip: "Đừng nói I want a room — đúng ngữ pháp nhưng nghe cộc. Luôn dùng I'd like." },
          { t: "dialogue", title: "Gọi điện đặt phòng", lines: [
            { who: "A", en: "Good afternoon. I'd like to reserve a room for two nights.", vi: "Chào buổi chiều. Tôi muốn đặt phòng hai đêm." },
            { who: "B", en: "Of course. What time will you arrive?", vi: "Vâng ạ. Anh chị đến lúc mấy giờ?" },
            { who: "A", en: "Our train leaves at six, so we arrive quite late.", vi: "Tàu chúng tôi chạy lúc sáu giờ, nên chúng tôi đến khá muộn." },
            { who: "B", en: "No problem. We are open all night.", vi: "Không sao ạ. Chúng tôi mở cửa cả đêm." }
          ] }
        ],
        sentences: [
          { en: "I would like to reserve a table", vi: "Tôi muốn đặt một bàn" },
          { en: "What time does the train leave", vi: "Mấy giờ tàu khởi hành" },
          { en: "The train arrives at seven", vi: "Tàu đến lúc bảy giờ" },
          { en: "Sorry I am late", vi: "Xin lỗi tôi đến muộn" },
          { en: "I always arrive early", vi: "Tôi luôn đến sớm" }
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
      {
        id: "a2u3l4", title: "Miêu tả nơi chốn",
        goal: "Tả một thành phố, một ngôi làng, một quán ăn cho người khác hình dung được.",
        teach: [
          { t: "intro", title: "Nói cho người ta thấy được", body: "Tả nơi chốn không chỉ là đẹp hay xấu. Sáu tính từ trong bài này cho phép bạn vẽ ra một bức tranh bằng lời.", bullets: ["6 tính từ tả nơi chốn", "There is / There are", "Trật tự nhiều tính từ"] },
          { t: "vocab", en: "crowded", vi: "đông đúc", pos: "Tính từ", ipa: "/ˈkraʊdɪd/", note: "Từ crowd (đám đông). Chỉ dùng cho nơi chốn, không dùng cho người.", ex: { en: "The market is very crowded.", vi: "Chợ rất đông đúc." } },
          { t: "vocab", en: "modern", vi: "hiện đại", pos: "Tính từ", ipa: "/ˈmɑːdərn/", note: "Trọng âm ở đầu: MO-dơn. Ngược lại là old-fashioned.", ex: { en: "Da Nang is a modern city.", vi: "Đà Nẵng là một thành phố hiện đại." } },
          { t: "vocab", en: "ancient", vi: "cổ kính", pos: "Tính từ", ipa: "/ˈeɪnʃənt/", note: "Rất cổ, hàng trăm năm. Đồ cũ bình thường thì dùng old.", ex: { en: "Hoi An is an ancient town.", vi: "Hội An là một phố cổ." } },
          { t: "vocab", en: "noisy", vi: "ồn ào", pos: "Tính từ", ipa: "/ˈnɔɪzi/", note: "Từ noise (tiếng ồn). Ngược lại là quiet.", ex: { en: "My street is noisy at night.", vi: "Phố nhà tôi ồn ào về đêm." } },
          { t: "vocab", en: "wide", vi: "rộng", pos: "Tính từ", ipa: "/waɪd/", note: "Rộng theo bề ngang: a wide road. Rộng về diện tích thì dùng large.", ex: { en: "The roads here are wide.", vi: "Đường ở đây rộng." } },
          { t: "vocab", en: "narrow", vi: "hẹp", pos: "Tính từ", ipa: "/ˈnæroʊ/", note: "Ngược với wide. Ngõ nhỏ là a narrow lane.", ex: { en: "The old streets are narrow.", vi: "Những con phố cổ thì hẹp." } },
          { t: "grammar", title: "There is và There are", body: "Đây là cấu trúc để nói ở đâu đó CÓ gì. Người Việt hay dịch thẳng thành It has — sai hoàn toàn.", rows: [
            ["There is + số ít", "có một…", "There is a market near my house."],
            ["There are + số nhiều", "có nhiều…", "There are many old houses."],
            ["There isn't / aren't", "không có", "There aren't any tall buildings."],
            ["Is there…? / Are there…?", "có… không?", "Is there a hotel near here?"]
          ], tip: "Nhớ: nói nơi chốn CÓ gì thì luôn là There is/are, tuyệt đối không nói It has." },
          { t: "dialogue", title: "Kể về quê mình", lines: [
            { who: "A", en: "What is your hometown like?", vi: "Quê bạn thế nào?" },
            { who: "B", en: "It is a small town. The streets are narrow and quiet.", vi: "Đó là một thị trấn nhỏ. Đường phố hẹp và yên tĩnh." },
            { who: "A", en: "Are there many shops?", vi: "Ở đó có nhiều cửa hàng không?" },
            { who: "B", en: "Not many. But there is an ancient temple. It's beautiful.", vi: "Không nhiều. Nhưng có một ngôi đền cổ. Rất đẹp." }
          ] }
        ],
        sentences: [
          { en: "The market is very crowded", vi: "Chợ rất đông đúc" },
          { en: "There are many old houses", vi: "Có nhiều ngôi nhà cổ" },
          { en: "Hoi An is an ancient town", vi: "Hội An là một phố cổ" },
          { en: "My street is noisy at night", vi: "Phố nhà tôi ồn ào về đêm" },
          { en: "Is there a hotel near here", vi: "Gần đây có khách sạn nào không" }
        ]
      },
      {
        id: "a2u3l5", title: "Quá và đủ",
        goal: "Dùng too và enough để nói cái gì quá mức hoặc vừa đủ.",
        teach: [
          { t: "intro", title: "Hai chữ nhỏ, hai vị trí ngược nhau", body: "Too đứng TRƯỚC tính từ, enough đứng SAU. Nhớ nhầm là câu sai ngay. Đây là điểm ngữ pháp A2 mà người Việt sai nhiều nhất.", bullets: ["too + tính từ", "tính từ + enough", "Nói giảm bằng a bit too"] },
          { t: "vocab", en: "enough", vi: "đủ", pos: "Trạng từ", ipa: "/ɪˈnʌf/", note: "Viết gh nhưng đọc là f: i-NÁP. Đứng SAU tính từ, TRƯỚC danh từ.", ex: { en: "This room is big enough.", vi: "Phòng này đủ rộng." } },
          { t: "vocab", en: "quite", vi: "khá", pos: "Trạng từ", ipa: "/kwaɪt/", note: "Đừng nhầm với quiet (yên tĩnh) — viết gần giống nhưng khác hẳn.", ex: { en: "The food is quite good.", vi: "Đồ ăn khá ngon." } },
          { t: "vocab", en: "almost", vi: "gần như, suýt", pos: "Trạng từ", ipa: "/ˈɔːlmoʊst/", note: "Đứng trước động từ hoặc tính từ: I almost forgot.", ex: { en: "I am almost ready.", vi: "Tôi gần xong rồi." } },
          { t: "vocab", en: "heavy", vi: "nặng", pos: "Tính từ", ipa: "/ˈhevi/", note: "Ngược lại là light (nhẹ). Heavy rain là mưa to.", ex: { en: "This bag is too heavy.", vi: "Cái túi này nặng quá." } },
          { t: "vocab", en: "comfortable", vi: "thoải mái, dễ chịu", pos: "Tính từ", ipa: "/ˈkʌmftəbl/", note: "Nói gọn ba âm: CÂMF-tơ-bồ. Người Việt hay đọc đủ bốn âm nên nghe rất lạ.", ex: { en: "This chair is comfortable enough.", vi: "Cái ghế này đủ thoải mái." } },
          { t: "vocab", en: "space", vi: "chỗ trống, không gian", pos: "Danh từ", ipa: "/speɪs/", note: "Không đếm được khi nói về chỗ trống: enough space.", ex: { en: "There is not enough space.", vi: "Không đủ chỗ." } },
          { t: "grammar", title: "Too trước, enough sau", body: "Đây là bảng bạn nên chép ra giấy dán lên tường. Vị trí sai thì câu sai.", rows: [
            ["too + tính từ", "quá … (theo hướng xấu)", "It is too expensive."],
            ["tính từ + enough", "đủ …", "It is comfortable enough."],
            ["enough + danh từ", "đủ (số lượng)", "We have enough money."],
            ["not … enough", "chưa đủ …", "The room isn't big enough."]
          ], tip: "Too luôn mang nghĩa TIÊU CỰC: quá đắt, quá nặng. Muốn khen thì dùng very, đừng dùng too." },
          { t: "dialogue", title: "Chọn phòng trọ", lines: [
            { who: "A", en: "What do you think about this room?", vi: "Bạn thấy phòng này thế nào?" },
            { who: "B", en: "It is quite nice, but it is too small.", vi: "Cũng khá đẹp, nhưng nhỏ quá." },
            { who: "A", en: "Is the bed comfortable enough?", vi: "Giường có đủ thoải mái không?" },
            { who: "B", en: "Yes, but there is not enough space for my books.", vi: "Thoải mái, nhưng không đủ chỗ để sách của tôi." }
          ] }
        ],
        sentences: [
          { en: "This bag is too heavy", vi: "Cái túi này nặng quá" },
          { en: "This room is big enough", vi: "Phòng này đủ rộng" },
          { en: "There is not enough space", vi: "Không đủ chỗ" },
          { en: "The food is quite good", vi: "Đồ ăn khá ngon" },
          { en: "I am almost ready", vi: "Tôi gần xong rồi" }
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
      {
        id: "a2u4l4", title: "Phỏng vấn xin việc",
        goal: "Nói về kinh nghiệm, kỹ năng và trả lời câu hỏi phỏng vấn cơ bản.",
        teach: [
          { t: "intro", title: "Mười lăm phút quyết định", body: "Buổi phỏng vấn tiếng Anh xoay quanh đúng ba câu hỏi. Chuẩn bị trước ba câu trả lời là bạn đã hơn phần lớn ứng viên.", bullets: ["Từ vựng tuyển dụng", "Tell me about yourself", "Nói kỹ năng bằng can"] },
          { t: "vocab", en: "interview", vi: "buổi phỏng vấn", pos: "Danh từ", ipa: "/ˈɪntərvjuː/", note: "Trọng âm ở đầu: IN-tơ-viu. Đi phỏng vấn là have an interview.", ex: { en: "I have an interview tomorrow.", vi: "Mai tôi có buổi phỏng vấn." } },
          { t: "vocab", en: "experience", vi: "kinh nghiệm", pos: "Danh từ", ipa: "/ɪkˈspɪriəns/", note: "Không đếm được khi nói kinh nghiệm làm việc: much experience, không phải many experiences.", ex: { en: "I have two years of experience.", vi: "Tôi có hai năm kinh nghiệm." } },
          { t: "vocab", en: "skill", vi: "kỹ năng", pos: "Danh từ", ipa: "/skɪl/", note: "Đếm được: computer skills, language skills.", ex: { en: "Communication is an important skill.", vi: "Giao tiếp là một kỹ năng quan trọng." } },
          { t: "vocab", en: "apply", vi: "nộp đơn, ứng tuyển", pos: "Động từ", ipa: "/əˈplaɪ/", note: "Luôn đi với for: apply for a job. Đơn xin việc là an application.", ex: { en: "I applied for the job last week.", vi: "Tuần trước tôi nộp đơn xin việc." } },
          { t: "vocab", en: "hire", vi: "tuyển dụng, thuê", pos: "Động từ", ipa: "/ˈhaɪər/", note: "Công ty hire người. Bị cho nghỉ là be fired.", ex: { en: "The company hired ten people.", vi: "Công ty đã tuyển mười người." } },
          { t: "vocab", en: "team", vi: "nhóm, đội", pos: "Danh từ", ipa: "/tiːm/", note: "Work in a team là làm việc nhóm — cụm rất hay dùng khi phỏng vấn.", ex: { en: "I like working in a team.", vi: "Tôi thích làm việc nhóm." } },
          { t: "grammar", title: "Ba câu hỏi phỏng vấn nào cũng có", body: "Mỗi câu hỏi có một cấu trúc trả lời gọn gàng. Học thuộc khung, chỉ cần thay nội dung của bạn vào.", rows: [
            ["Tell me about yourself.", "I am… / I have…", "I'm a student. I have some experience in sales."],
            ["Why do you want this job?", "Because…", "Because I want to improve my skills."],
            ["What can you do?", "I can…", "I can use a computer and speak English."],
            ["Do you have experience?", "I have… years of…", "I have two years of experience."]
          ], tip: "Đừng trả lời một chữ Yes hay No. Luôn thêm một câu giải thích — đó là điều người phỏng vấn chờ nghe." },
          { t: "culture", title: "Nói về mình không phải khoe khoang", body: "Người Việt được dạy khiêm tốn nên hay hạ thấp bản thân khi phỏng vấn. Ở môi trường quốc tế, nói rõ mình làm được gì là chuyện bình thường và cần thiết. Không nói ra thì không ai biết." },
          { t: "dialogue", title: "Trong phòng phỏng vấn", lines: [
            { who: "A", en: "Tell me about yourself.", vi: "Hãy kể về bản thân bạn." },
            { who: "B", en: "I am a student and I have one year of experience in a shop.", vi: "Tôi là sinh viên và có một năm kinh nghiệm ở cửa hàng." },
            { who: "A", en: "Why did you apply for this job?", vi: "Tại sao bạn nộp đơn vào vị trí này?" },
            { who: "B", en: "Because I like working in a team and I want to learn new skills.", vi: "Vì tôi thích làm việc nhóm và muốn học thêm kỹ năng mới." }
          ] }
        ],
        sentences: [
          { en: "I have two years of experience", vi: "Tôi có hai năm kinh nghiệm" },
          { en: "I applied for the job last week", vi: "Tuần trước tôi nộp đơn xin việc" },
          { en: "I like working in a team", vi: "Tôi thích làm việc nhóm" },
          { en: "I have an interview tomorrow", vi: "Mai tôi có buổi phỏng vấn" },
          { en: "Communication is an important skill", vi: "Giao tiếp là một kỹ năng quan trọng" }
        ]
      },
      {
        id: "a2u4l5", title: "Thể thao & Trận đấu",
        goal: "Nói về môn thể thao bạn theo dõi và kể lại một trận đấu.",
        teach: [
          { t: "intro", title: "Chủ đề bắt chuyện dễ nhất thế giới", body: "Không biết nói gì với người nước ngoài thì hỏi về bóng đá. Sáu từ trong bài này đủ để bạn theo được một cuộc tán gẫu thể thao.", bullets: ["Từ vựng trận đấu", "play, go hay do", "Kể lại kết quả"] },
          { t: "vocab", en: "match", vi: "trận đấu", pos: "Danh từ", ipa: "/mætʃ/", note: "Người Anh dùng match, người Mỹ dùng game. Match cũng nghĩa là que diêm.", ex: { en: "The match starts at eight.", vi: "Trận đấu bắt đầu lúc tám giờ." } },
          { t: "vocab", en: "win", vi: "thắng", pos: "Động từ", ipa: "/wɪn/", note: "Quá khứ là won, đọc là WẦN. Win a match, nhưng beat a team.", ex: { en: "Our team won the match.", vi: "Đội chúng tôi thắng trận." } },
          { t: "vocab", en: "score", vi: "tỉ số; ghi bàn", pos: "Danh từ", ipa: "/skɔːr/", note: "Hỏi tỉ số: What's the score? Ghi bàn: score a goal.", ex: { en: "What is the score?", vi: "Tỉ số bao nhiêu rồi?" } },
          { t: "vocab", en: "player", vi: "cầu thủ, người chơi", pos: "Danh từ", ipa: "/ˈpleɪər/", note: "Từ play thêm -er. Cầu thủ bóng đá là a football player.", ex: { en: "He is my favourite player.", vi: "Anh ấy là cầu thủ tôi thích nhất." } },
          { t: "vocab", en: "coach", vi: "huấn luyện viên", pos: "Danh từ", ipa: "/koʊtʃ/", note: "Coach còn nghĩa là xe khách đường dài.", ex: { en: "The coach is very strict.", vi: "Huấn luyện viên rất nghiêm." } },
          { t: "vocab", en: "practice", vi: "luyện tập", pos: "Danh từ", ipa: "/ˈpræktɪs/", note: "Practice makes perfect — có công mài sắt có ngày nên kim.", ex: { en: "We have practice every Tuesday.", vi: "Chúng tôi tập vào thứ Ba hằng tuần." } },
          { t: "grammar", title: "Play, go hay do?", body: "Ba động từ cho ba nhóm môn thể thao khác nhau. Chọn sai là lỗi rất dễ nhận ra.", rows: [
            ["play + môn có bóng", "play football, play tennis", "I play football on Sunday."],
            ["go + môn đuôi -ing", "go swimming, go running", "She goes swimming every day."],
            ["do + môn võ, thể dục", "do yoga, do karate", "He does karate."],
            ["watch + trận đấu", "xem", "We watched the match on TV."]
          ], tip: "Mẹo: có quả bóng thì PLAY, có đuôi -ing thì GO, còn lại phần lớn là DO." },
          { t: "dialogue", title: "Bàn về trận tối qua", lines: [
            { who: "A", en: "Did you watch the match last night?", vi: "Tối qua bạn có xem trận đấu không?" },
            { who: "B", en: "Yes! Our team won two to one.", vi: "Có! Đội mình thắng hai một." },
            { who: "A", en: "Who scored the goals?", vi: "Ai ghi bàn vậy?" },
            { who: "B", en: "My favourite player. The coach was very happy.", vi: "Cầu thủ tôi thích nhất. Huấn luyện viên vui lắm." }
          ] }
        ],
        sentences: [
          { en: "Our team won the match", vi: "Đội chúng tôi thắng trận" },
          { en: "Did you watch the match last night", vi: "Tối qua bạn có xem trận đấu không" },
          { en: "He is my favourite player", vi: "Anh ấy là cầu thủ tôi thích nhất" },
          { en: "We have practice every Tuesday", vi: "Chúng tôi tập vào thứ Ba hằng tuần" },
          { en: "What is the score", vi: "Tỉ số bao nhiêu rồi" }
        ]
      },
      { id: "a2u4c", title: "Ôn tập chương 4", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  },

  {
    id: "a2u5", title: "Thời tiết, Cảm xúc & Nghề nghiệp",
    goal: "Mở rộng vốn từ: thời tiết, cảm xúc, nghề nghiệp và việc nhà.",
    lessons: [
      {
        id: "a2u5l1", title: "Thời tiết bốn mùa",
        goal: "10 từ tả thời tiết và mùa.",
        teach: [
          { t: "intro", title: "Bài này bạn sẽ học gì?", body: "Người Anh mở đầu câu chuyện bằng thời tiết. Biết mấy từ này là bắt chuyện được với ai cũng được.", bullets: ["10 từ thời tiết", "Cấu trúc It is + tính từ", "Hỏi thời tiết cho tự nhiên"] },
          { t: "vocab", en: "weather", vi: "thời tiết", pos: "Danh từ", ipa: "/ˈweðər/", note: "KHÔNG đếm được. Hỏi: How is the weather?", ex: { en: "How is the weather today?", vi: "Hôm nay thời tiết thế nào?" } },
          { t: "vocab", en: "hot", vi: "nóng", pos: "Tính từ", ipa: "/hɑːt/", note: "Nóng ẩm kiểu Việt Nam là hot and humid.", ex: { en: "It is very hot today.", vi: "Hôm nay nóng lắm." } },
          { t: "vocab", en: "cold", vi: "lạnh", pos: "Tính từ", ipa: "/koʊld/", note: "Cũng có nghĩa cảm lạnh: I have a cold.", ex: { en: "It is cold in December.", vi: "Tháng Mười Hai trời lạnh." } },
          { t: "vocab", en: "cool", vi: "mát mẻ", pos: "Tính từ", ipa: "/kuːl/", note: "Còn nghĩa lóng là ngầu, hay.", ex: { en: "The weather is cool.", vi: "Trời mát mẻ." } },
          { t: "vocab", en: "wet", vi: "ẩm ướt", pos: "Tính từ", ipa: "/wet/", note: "Mùa mưa là the wet season.", ex: { en: "My shoes are wet.", vi: "Giày tôi ướt rồi." } },
          { t: "vocab", en: "dry", vi: "khô ráo", pos: "Tính từ", ipa: "/draɪ/", note: "Mùa khô là the dry season.", ex: { en: "The dry season is long.", vi: "Mùa khô kéo dài." } },
          { t: "vocab", en: "cloud", vi: "đám mây", pos: "Danh từ", ipa: "/klaʊd/", note: "Nhiều mây là cloudy.", ex: { en: "There are many clouds.", vi: "Trời nhiều mây." } },
          { t: "vocab", en: "spring", vi: "mùa xuân", pos: "Danh từ", ipa: "/sprɪŋ/", note: "Còn nghĩa lò xo và mùa xuân.", ex: { en: "Spring is warm.", vi: "Mùa xuân ấm áp." } },
          { t: "vocab", en: "summer", vi: "mùa hè", pos: "Danh từ", ipa: "/ˈsʌmər/", note: "Nghỉ hè là summer holiday.", ex: { en: "I swim in summer.", vi: "Mùa hè tôi đi bơi." } },
          { t: "vocab", en: "winter", vi: "mùa đông", pos: "Danh từ", ipa: "/ˈwɪntər/", note: "Áo khoác mùa đông là a winter coat.", ex: { en: "Winter in Hanoi is cold.", vi: "Mùa đông Hà Nội lạnh." } },
        ],
        sentences: [
          { en: "How is the weather today", vi: "Hôm nay thời tiết thế nào" },
          { en: "It is very hot today", vi: "Hôm nay nóng lắm" },
          { en: "Winter in Hanoi is cold", vi: "Mùa đông Hà Nội lạnh" },
          { en: "I swim in summer", vi: "Mùa hè tôi đi bơi" },
        ]
      },
      {
        id: "a2u5l2", title: "Cảm xúc & Tính cách",
        goal: "10 từ tả cảm xúc và tính cách.",
        teach: [
          { t: "intro", title: "Bài này bạn sẽ học gì?", body: "Nói được mình đang thấy thế nào, và tả được người khác — đây là phần làm câu chuyện có hồn.", bullets: ["10 từ cảm xúc, tính cách", "I feel + tính từ", "Tả người: He is…"] },
          { t: "vocab", en: "angry", vi: "tức giận", pos: "Tính từ", ipa: "/ˈæŋɡri/", note: "Giận ai đó: angry WITH someone.", ex: { en: "Do not be angry.", vi: "Đừng giận mà." } },
          { t: "vocab", en: "worried", vi: "lo lắng", pos: "Tính từ", ipa: "/ˈwɜːrid/", note: "Lo về việc gì: worried ABOUT something.", ex: { en: "I am worried about the exam.", vi: "Tôi lo về kỳ thi." } },
          { t: "vocab", en: "bored", vi: "chán", pos: "Tính từ", ipa: "/bɔːrd/", note: "Bored là mình thấy chán; boring là thứ đó gây chán.", ex: { en: "I am bored at home.", vi: "Ở nhà tôi thấy chán." } },
          { t: "vocab", en: "excited", vi: "hào hứng", pos: "Tính từ", ipa: "/ɪkˈsaɪtɪd/", note: "Háo hức về việc gì: excited ABOUT.", ex: { en: "I am excited about the trip.", vi: "Tôi háo hức về chuyến đi." } },
          { t: "vocab", en: "nervous", vi: "hồi hộp", pos: "Tính từ", ipa: "/ˈnɜːrvəs/", note: "Trước khi thi hay phỏng vấn hay dùng.", ex: { en: "I feel nervous before the test.", vi: "Trước khi thi tôi hồi hộp." } },
          { t: "vocab", en: "proud", vi: "tự hào", pos: "Tính từ", ipa: "/praʊd/", note: "Tự hào về ai: proud OF someone.", ex: { en: "I am proud of my son.", vi: "Tôi tự hào về con trai." } },
          { t: "vocab", en: "honest", vi: "trung thực", pos: "Tính từ", ipa: "/ˈɑːnɪst/", note: "Chữ h CÂM, đọc là ó-nịt.", ex: { en: "She is an honest person.", vi: "Cô ấy là người trung thực." } },
          { t: "vocab", en: "lazy", vi: "lười biếng", pos: "Tính từ", ipa: "/ˈleɪzi/", note: "Trái nghĩa là hard-working.", ex: { en: "Do not be lazy.", vi: "Đừng lười." } },
          { t: "vocab", en: "generous", vi: "rộng lượng", pos: "Tính từ", ipa: "/ˈdʒenərəs/", note: "Người hay cho đi, hào phóng.", ex: { en: "My grandmother is generous.", vi: "Bà tôi rất rộng lượng." } },
          { t: "vocab", en: "patient", vi: "kiên nhẫn", pos: "Tính từ", ipa: "/ˈpeɪʃnt/", note: "Cũng là danh từ: bệnh nhân.", ex: { en: "A teacher must be patient.", vi: "Giáo viên phải kiên nhẫn." } },
        ],
        sentences: [
          { en: "Do not be angry", vi: "Đừng giận" },
          { en: "I am worried about the exam", vi: "Tôi lo về kỳ thi" },
          { en: "I am proud of my son", vi: "Tôi tự hào về con trai" },
          { en: "A teacher must be patient", vi: "Giáo viên phải kiên nhẫn" },
        ]
      },
      {
        id: "a2u5l3", title: "Nghề nghiệp",
        goal: "10 nghề hay gặp và cách hỏi nghề.",
        teach: [
          { t: "intro", title: "Bài này bạn sẽ học gì?", body: "Gặp người mới thế nào cũng hỏi nhau làm nghề gì. Đây là phần không thể thiếu.", bullets: ["10 nghề nghiệp", "Hỏi nghề: What do you do?", "Mạo từ a/an trước tên nghề"] },
          { t: "vocab", en: "engineer", vi: "kỹ sư", pos: "Danh từ", ipa: "/ˌendʒɪˈnɪr/", note: "Trọng âm rơi vào cuối: en-gi-NIA.", ex: { en: "My brother is an engineer.", vi: "Anh tôi là kỹ sư." } },
          { t: "vocab", en: "nurse", vi: "y tá", pos: "Danh từ", ipa: "/nɜːrs/", note: "Bác sĩ là doctor, y tá là nurse.", ex: { en: "She works as a nurse.", vi: "Cô ấy làm y tá." } },
          { t: "vocab", en: "driver", vi: "tài xế", pos: "Danh từ", ipa: "/ˈdraɪvər/", note: "Từ drive + er. Nhiều nghề thêm er như thế.", ex: { en: "He is a bus driver.", vi: "Anh ấy là tài xế xe buýt." } },
          { t: "vocab", en: "cook", vi: "đầu bếp", pos: "Danh từ", ipa: "/kʊk/", note: "Vừa là nấu ăn vừa là người nấu. Bếp trưởng là chef.", ex: { en: "My mother is a good cook.", vi: "Mẹ tôi nấu ăn giỏi." } },
          { t: "vocab", en: "waiter", vi: "phục vụ bàn", pos: "Danh từ", ipa: "/ˈweɪtər/", note: "Nữ gọi là waitress.", ex: { en: "The waiter is friendly.", vi: "Anh phục vụ thân thiện." } },
          { t: "vocab", en: "seller", vi: "người bán hàng", pos: "Danh từ", ipa: "/ˈselər/", note: "Người bán ở chợ. Nhân viên bán hàng là a shop assistant.", ex: { en: "The seller is very kind.", vi: "Người bán hàng rất tử tế." } },
          { t: "vocab", en: "soldier", vi: "bộ đội", pos: "Danh từ", ipa: "/ˈsoʊldʒər/", note: "Chữ d đọc thành âm j: sâu-jờ.", ex: { en: "My grandfather was a soldier.", vi: "Ông tôi từng là bộ đội." } },
          { t: "vocab", en: "singer", vi: "ca sĩ", pos: "Danh từ", ipa: "/ˈsɪŋər/", note: "Từ sing + er.", ex: { en: "She wants to be a singer.", vi: "Cô ấy muốn làm ca sĩ." } },
          { t: "vocab", en: "artist", vi: "hoạ sĩ", pos: "Danh từ", ipa: "/ˈɑːrtɪst/", note: "Nói chung là người làm nghệ thuật.", ex: { en: "He is a famous artist.", vi: "Ông ấy là hoạ sĩ nổi tiếng." } },
          { t: "vocab", en: "job", vi: "công việc", pos: "Danh từ", ipa: "/dʒɑːb/", note: "Job đếm được, work thì không.", ex: { en: "I have a new job.", vi: "Tôi có công việc mới." } },
        ],
        sentences: [
          { en: "My brother is an engineer", vi: "Anh tôi là kỹ sư" },
          { en: "She works as a nurse", vi: "Cô ấy làm y tá" },
          { en: "What do you do", vi: "Bạn làm nghề gì" },
          { en: "I have a new job", vi: "Tôi có công việc mới" },
        ]
      },
      {
        id: "a2u5l4", title: "Việc nhà hằng ngày",
        goal: "10 việc nhà và cách nói thói quen.",
        teach: [
          { t: "intro", title: "Bài này bạn sẽ học gì?", body: "Kể một ngày của mình, hay phân công việc nhà — đều cần mấy động từ này.", bullets: ["10 việc nhà thường ngày", "Thì hiện tại đơn cho thói quen", "Trạng từ tần suất: always, often…"] },
          { t: "vocab", en: "cook", vi: "nấu ăn", pos: "Động từ", ipa: "/kʊk/", note: "Nấu cơm là cook rice.", ex: { en: "I cook dinner every day.", vi: "Tôi nấu bữa tối mỗi ngày." } },
          { t: "vocab", en: "wash", vi: "rửa, giặt", pos: "Động từ", ipa: "/wɑːʃ/", note: "Rửa bát: wash the dishes. Giặt đồ: wash clothes.", ex: { en: "I wash the dishes.", vi: "Tôi rửa bát." } },
          { t: "vocab", en: "sweep", vi: "quét", pos: "Động từ", ipa: "/swiːp/", note: "Quét nhà là sweep the floor.", ex: { en: "She sweeps the floor.", vi: "Chị ấy quét nhà." } },
          { t: "vocab", en: "iron", vi: "là quần áo", pos: "Động từ", ipa: "/ˈaɪərn/", note: "Chữ r gần như câm, đọc ai-ợn. Cũng là sắt.", ex: { en: "I iron my shirt.", vi: "Tôi là áo sơ mi." } },
          { t: "vocab", en: "water", vi: "tưới cây", pos: "Động từ", ipa: "/ˈwɔːtər/", note: "Vừa là nước vừa là tưới.", ex: { en: "I water the flowers.", vi: "Tôi tưới hoa." } },
          { t: "vocab", en: "feed", vi: "cho ăn", pos: "Động từ", ipa: "/fiːd/", note: "Cho vật nuôi ăn. Quá khứ là fed.", ex: { en: "I feed the dog.", vi: "Tôi cho chó ăn." } },
          { t: "vocab", en: "tidy", vi: "dọn dẹp", pos: "Động từ", ipa: "/ˈtaɪdi/", note: "Vừa là tính từ gọn gàng vừa là động từ dọn.", ex: { en: "Tidy your room.", vi: "Dọn phòng đi con." } },
          { t: "vocab", en: "repair", vi: "sửa chữa", pos: "Động từ", ipa: "/rɪˈper/", note: "Đồng nghĩa với fix, trang trọng hơn.", ex: { en: "My father repairs the bike.", vi: "Bố tôi sửa xe đạp." } },
          { t: "vocab", en: "shopping", vi: "đi chợ, mua sắm", pos: "Danh từ", ipa: "/ˈʃɑːpɪŋ/", note: "Đi chợ là go shopping, luôn có ing.", ex: { en: "I go shopping on Sunday.", vi: "Chủ nhật tôi đi chợ." } },
          { t: "vocab", en: "rubbish", vi: "rác", pos: "Danh từ", ipa: "/ˈrʌbɪʃ/", note: "Anh dùng rubbish, Mỹ dùng garbage/trash.", ex: { en: "Take out the rubbish.", vi: "Đổ rác đi con." } },
        ],
        sentences: [
          { en: "I cook dinner every day", vi: "Tôi nấu bữa tối mỗi ngày" },
          { en: "She sweeps the floor", vi: "Chị ấy quét nhà" },
          { en: "I go shopping on Sunday", vi: "Chủ nhật tôi đi chợ" },
          { en: "Take out the rubbish", vi: "Đổ rác đi" },
        ]
      },
      { id: "a2u5cp", title: "Ôn tập chương 5", checkpoint: true },
    ]
  },
]
};
