/* ============================================================
   English Air — Trình độ B1 (Trung cấp, khung CEFR)
   Cùng cấu trúc với A1/A2: teach[] dạy trước, sentences[] để luyện.
   ============================================================ */

const B1 = {
  id: "b1", code: "B1", name: "Trung cấp",
  desc: "Nêu ý kiến, khuyên nhủ, kể lại chuyện đang xảy ra và nói về điều kiện.",
  units: [

  /* ================= CHƯƠNG 1 ================= */
  {
    id: "b1u1", title: "Ý kiến & Lời khuyên",
    goal: "Nêu quan điểm, đưa lời khuyên và nối câu bằng lý do.",
    lessons: [
      {
        id: "b1u1l1", title: "Đưa lời khuyên",
        goal: "should / shouldn't và cách nêu ý kiến lịch sự.",
        teach: [
          { t: "intro", title: "Khuyên mà không ra lệnh", body: "Nói thẳng “Do this!” nghe như ra lệnh. Người bản xứ dùng should để khuyên — nhẹ nhàng mà vẫn rõ ý.", bullets: ["should / shouldn't", "Nêu ý kiến: I think…", "Đồng ý và không đồng ý"] },
          { t: "grammar", title: "should — nên", body: "Giống can: dùng chung cho mọi chủ ngữ, động từ theo sau ở nguyên thể.", rows: [
            ["Khuyên nên", "You should rest.", "Bạn nên nghỉ ngơi."],
            ["Khuyên đừng", "You shouldn't eat so late.", "Bạn không nên ăn muộn thế."],
            ["Hỏi xin lời khuyên", "What should I do?", "Tôi nên làm gì?"],
            ["Nêu ý kiến", "I think you should try.", "Tôi nghĩ bạn nên thử."],
            ["Sai", "You should to rest.", "(không có to sau should)"]
          ], tip: "Muốn mềm hơn nữa thì thêm maybe hoặc I think ở đầu: Maybe you should call her." },
          { t: "vocab", en: "advice", vi: "lời khuyên", pos: "Danh từ", ipa: "/ədˈvaɪs/", note: "KHÔNG đếm được — không có advices. Muốn đếm thì nói a piece of advice.", ex: { en: "Can you give me some advice?", vi: "Bạn cho tôi vài lời khuyên được không?" } },
          { t: "vocab", en: "opinion", vi: "ý kiến", pos: "Danh từ", ipa: "/əˈpɪnjən/", note: "Theo ý tôi là in my opinion, dùng ở đầu câu.", ex: { en: "In my opinion, this is better.", vi: "Theo tôi thì cái này tốt hơn." } },
          { t: "vocab", en: "agree", vi: "đồng ý", pos: "Động từ", ipa: "/əˈɡriː/", note: "Đồng ý với ai thì agree with someone, không dùng agree to someone.", ex: { en: "I agree with you.", vi: "Tôi đồng ý với bạn." } },
          { t: "vocab", en: "disagree", vi: "không đồng ý", pos: "Động từ", ipa: "/ˌdɪsəˈɡriː/", note: "Nói thẳng I disagree hơi mạnh; thêm I'm afraid cho lịch sự.", ex: { en: "I'm afraid I disagree.", vi: "Tôi e là tôi không đồng ý." } },
          { t: "vocab", en: "important", vi: "quan trọng", pos: "Tính từ", ipa: "/ɪmˈpɔːrtnt/", note: "So sánh dùng more important, không thêm -er.", ex: { en: "Sleep is very important.", vi: "Giấc ngủ rất quan trọng." } },
          { t: "vocab", en: "problem", vi: "vấn đề", pos: "Danh từ", ipa: "/ˈprɑːbləm/", note: "Không sao đâu là No problem.", ex: { en: "What is the problem?", vi: "Vấn đề là gì?" } },
          { t: "culture", title: "Không đồng ý sao cho khéo", body: "Người Anh–Mỹ hiếm khi nói thẳng “You are wrong”. Họ mở đầu bằng I see your point, but… hoặc I'm not sure about that. Nói thẳng quá dễ bị coi là thô, dù nội dung đúng." },
          { t: "dialogue", title: "Bạn xin lời khuyên", lines: [
            { who: "A", en: "I am always tired. What should I do?", vi: "Tôi lúc nào cũng mệt. Tôi nên làm gì?" },
            { who: "B", en: "I think you should sleep more. Sleep is important.", vi: "Tôi nghĩ bạn nên ngủ nhiều hơn. Giấc ngủ rất quan trọng." },
            { who: "A", en: "I agree with you. That is good advice.", vi: "Tôi đồng ý với bạn. Đó là lời khuyên hay." }
          ] }
        ],
        sentences: [
          { en: "I think you should sleep more", vi: "Tôi nghĩ bạn nên ngủ nhiều hơn" },
          { en: "In my opinion this is better", vi: "Theo tôi thì cái này tốt hơn" },
          { en: "Can you give me some advice", vi: "Bạn cho tôi vài lời khuyên được không" }
        ]
      },
      {
        id: "b1u1l2", title: "Bắt buộc hay không",
        goal: "must / have to / don't have to — ba mức độ khác nhau.",
        teach: [
          { t: "intro", title: "Ba mức bắt buộc dễ nhầm", body: "must, have to và don't have to nghe giống nhau nhưng nghĩa khác hẳn. Nhầm một cái là câu đổi nghĩa hoàn toàn.", bullets: ["must = tự thấy phải làm", "have to = quy định bắt phải", "don't have to = không cần"] },
          { t: "grammar", title: "must / have to / mustn't / don't have to", body: "Chú ý cặp phủ định — đây mới là chỗ bẫy thật sự.", rows: [
            ["must — tự thấy cần", "I must study tonight.", "Tối nay tôi phải học."],
            ["have to — quy định", "We have to wear a helmet.", "Chúng ta phải đội mũ bảo hiểm."],
            ["mustn't — CẤM", "You mustn't smoke here.", "Bạn không được hút thuốc ở đây."],
            ["don't have to — KHÔNG CẦN", "You don't have to come.", "Bạn không cần đến đâu."],
            ["Ngôi thứ ba", "She has to work.", "Cô ấy phải đi làm."]
          ], tip: "mustn't và don't have to trái ngược nhau: một cái là cấm, một cái là được phép không làm. Đừng dùng lẫn." },
          { t: "vocab", en: "rule", vi: "quy định, luật lệ", pos: "Danh từ", ipa: "/ruːl/", note: "Tuân theo quy định là follow the rules.", ex: { en: "These are the school rules.", vi: "Đây là nội quy trường." } },
          { t: "vocab", en: "allow", vi: "cho phép", pos: "Động từ", ipa: "/əˈlaʊ/", note: "Hay dùng bị động: Smoking is not allowed.", ex: { en: "They do not allow food here.", vi: "Ở đây không cho mang đồ ăn vào." } },
          { t: "vocab", en: "careful", vi: "cẩn thận", pos: "Tính từ", ipa: "/ˈkerfl/", note: "Cẩn thận nhé! là Be careful!", ex: { en: "Be careful on the road.", vi: "Cẩn thận khi đi đường nhé." } },
          { t: "vocab", en: "safe", vi: "an toàn", pos: "Tính từ", ipa: "/seɪf/", note: "Danh từ là safety. Trái nghĩa là dangerous.", ex: { en: "This place is safe.", vi: "Chỗ này an toàn." } },
          { t: "vocab", en: "health", vi: "sức khoẻ", pos: "Danh từ", ipa: "/helθ/", note: "Không đếm được. Tính từ là healthy (khoẻ mạnh).", ex: { en: "Health is more important than money.", vi: "Sức khoẻ quan trọng hơn tiền bạc." } },
          { t: "vocab", en: "exercise", vi: "tập thể dục", pos: "Động từ", ipa: "/ˈeksərsaɪz/", note: "Vừa là danh từ (bài tập) vừa là động từ (tập luyện).", ex: { en: "You should exercise every day.", vi: "Bạn nên tập thể dục mỗi ngày." } },
          { t: "dialogue", title: "Nội quy phòng tập", lines: [
            { who: "A", en: "Do I have to bring my own towel?", vi: "Tôi có phải mang khăn riêng không?" },
            { who: "B", en: "No, you don't have to. But you mustn't wear shoes inside.", vi: "Không, bạn không cần. Nhưng không được đi giày vào trong." },
            { who: "A", en: "I see. I must be careful then.", vi: "Tôi hiểu rồi. Vậy tôi phải cẩn thận." }
          ] }
        ],
        sentences: [
          { en: "You should exercise every day", vi: "Bạn nên tập thể dục mỗi ngày" },
          { en: "We have to wear a helmet", vi: "Chúng ta phải đội mũ bảo hiểm" },
          { en: "Health is more important than money", vi: "Sức khoẻ quan trọng hơn tiền bạc" }
        ]
      },
      {
        id: "b1u1l3", title: "Nối câu bằng lý do",
        goal: "because / although / however để câu dài mà mạch lạc.",
        teach: [
          { t: "intro", title: "Từ câu ngắn sang câu dài", body: "Trình độ B1 khác A2 ở chỗ biết nối ý. Ba từ nối dưới đây đủ để câu của bạn nghe chững chạc hẳn lên.", bullets: ["because — vì", "although — mặc dù", "however — tuy nhiên"] },
          { t: "grammar", title: "Ba từ nối, ba cách dùng", body: "Khác nhau ở dấu câu và vị trí, phải để ý.", rows: [
            ["because + mệnh đề", "I stayed home because it rained.", "Tôi ở nhà vì trời mưa."],
            ["although + mệnh đề", "Although it rained, I went out.", "Mặc dù trời mưa, tôi vẫn ra ngoài."],
            ["however + dấu chấm", "It rained. However, I went out.", "Trời mưa. Tuy nhiên tôi vẫn ra ngoài."],
            ["Sai", "Although it rained, but I went out.", "(có although rồi thì bỏ but)"]
          ], tip: "Lỗi kinh điển của người Việt: dùng cả “although” lẫn “but” trong một câu, vì tiếng Việt nói “mặc dù… nhưng…”. Tiếng Anh chỉ được chọn một." },
          { t: "vocab", en: "reason", vi: "lý do", pos: "Danh từ", ipa: "/ˈriːzn/", note: "Lý do của cái gì thì dùng reason for, không dùng reason of.", ex: { en: "What is the reason for this?", vi: "Lý do của việc này là gì?" } },
          { t: "vocab", en: "result", vi: "kết quả", pos: "Danh từ", ipa: "/rɪˈzʌlt/", note: "Kết quả là… nói as a result, đứng đầu câu.", ex: { en: "The result was very good.", vi: "Kết quả rất tốt." } },
          { t: "vocab", en: "however", vi: "tuy nhiên", pos: "Trạng từ", ipa: "/haʊˈevər/", note: "Đứng đầu câu MỚI, sau nó có dấu phẩy. Không nối hai mệnh đề như but.", ex: { en: "However, I still like it.", vi: "Tuy nhiên, tôi vẫn thích nó." } },
          { t: "vocab", en: "decide", vi: "quyết định", pos: "Động từ", ipa: "/dɪˈsaɪd/", note: "Theo sau là to + động từ: decide to go.", ex: { en: "I decided to study English.", vi: "Tôi đã quyết định học tiếng Anh." } },
          { t: "vocab", en: "explain", vi: "giải thích", pos: "Động từ", ipa: "/ɪkˈspleɪn/", note: "Giải thích cho ai thì explain to me, không nói explain me.", ex: { en: "Can you explain it to me?", vi: "Bạn giải thích cho tôi được không?" } },
          { t: "vocab", en: "maybe", vi: "có lẽ", pos: "Trạng từ", ipa: "/ˈmeɪbi/", note: "Đứng đầu câu. Viết liền, khác hẳn may be (có thể là) viết rời.", ex: { en: "Maybe you are right.", vi: "Có lẽ bạn đúng." } },
          { t: "dialogue", title: "Giải thích một quyết định", lines: [
            { who: "A", en: "Why did you decide to study English?", vi: "Vì sao bạn quyết định học tiếng Anh?" },
            { who: "B", en: "Because I want a better job. Although it is difficult, I enjoy it.", vi: "Vì tôi muốn công việc tốt hơn. Mặc dù khó, tôi vẫn thấy thích." },
            { who: "A", en: "Can you explain the reason to my brother too?", vi: "Bạn giải thích lý do đó cho em tôi được không?" }
          ] }
        ],
        sentences: [
          { en: "I decided to study English", vi: "Tôi đã quyết định học tiếng Anh" },
          { en: "Can you explain it to me", vi: "Bạn giải thích cho tôi được không" },
          { en: "What is the reason for this", vi: "Lý do của việc này là gì" }
        ]
      },
      { id: "b1u1c", title: "Ôn tập chương 1", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  },

  /* ================= CHƯƠNG 2 ================= */
  {
    id: "b1u2", title: "Kể chuyện & Điều kiện",
    goal: "Kể lại chuyện đang xảy ra thì có việc xen vào, và nói về điều kiện.",
    lessons: [
      {
        id: "b1u2l1", title: "Đang làm thì…",
        goal: "Quá khứ tiếp diễn với while và when.",
        teach: [
          { t: "intro", title: "Hai việc, một lúc", body: "Kể chuyện hay nhất là khi có “đang… thì…”. Tiếng Anh dùng quá khứ tiếp diễn cho việc dài, quá khứ đơn cho việc xen vào.", bullets: ["was/were + V-ing", "while cho việc dài", "when cho việc ngắn"] },
          { t: "grammar", title: "Quá khứ tiếp diễn", body: "Việc nào kéo dài thì dùng tiếp diễn, việc nào cắt ngang thì dùng quá khứ đơn.", rows: [
            ["Việc đang diễn ra", "I was cooking.", "Tôi đang nấu ăn."],
            ["Việc xen vào", "…when the phone rang.", "…thì điện thoại reo."],
            ["while + việc dài", "While I was cooking, he arrived.", "Trong lúc tôi nấu ăn, anh ấy đến."],
            ["Hai việc cùng kéo dài", "She was reading while I was cooking.", "Cô ấy đọc sách trong khi tôi nấu ăn."]
          ], tip: "Mẹo nhớ: while đi với V-ing (việc dài), when đi với quá khứ đơn (việc ngắn cắt ngang)." },
          { t: "vocab", en: "while", vi: "trong lúc", pos: "Giới từ", ipa: "/waɪl/", note: "Sau while thường là mệnh đề tiếp diễn.", ex: { en: "While I was cooking, he arrived.", vi: "Trong lúc tôi nấu ăn, anh ấy đến." } },
          { t: "vocab", en: "suddenly", vi: "đột nhiên", pos: "Trạng từ", ipa: "/ˈsʌdnli/", note: "Hay đứng đầu câu để mở nút thắt của câu chuyện.", ex: { en: "Suddenly, the lights went off.", vi: "Đột nhiên đèn tắt phụt." } },
          { t: "vocab", en: "happen", vi: "xảy ra", pos: "Động từ", ipa: "/ˈhæpən/", note: "Chuyện gì xảy ra thế? là What happened? — không dùng bị động.", ex: { en: "What happened yesterday?", vi: "Hôm qua đã xảy ra chuyện gì?" } },
          { t: "vocab", en: "notice", vi: "nhận ra, để ý", pos: "Động từ", ipa: "/ˈnoʊtɪs/", note: "Cũng là danh từ nghĩa thông báo.", ex: { en: "I did not notice him.", vi: "Tôi không để ý thấy anh ấy." } },
          { t: "vocab", en: "moment", vi: "khoảnh khắc", pos: "Danh từ", ipa: "/ˈmoʊmənt/", note: "Chờ chút nhé là Just a moment.", ex: { en: "At that moment, I understood.", vi: "Ngay lúc đó tôi hiểu ra." } },
          { t: "vocab", en: "accident", vi: "tai nạn", pos: "Danh từ", ipa: "/ˈæksɪdənt/", note: "Vô tình làm gì đó là by accident.", ex: { en: "There was an accident on the road.", vi: "Có một vụ tai nạn trên đường." } },
          { t: "dialogue", title: "Kể lại buổi tối hôm qua", lines: [
            { who: "A", en: "What happened last night?", vi: "Tối qua xảy ra chuyện gì thế?" },
            { who: "B", en: "While I was cooking, suddenly the lights went off.", vi: "Trong lúc tôi đang nấu ăn thì đèn tắt phụt." },
            { who: "A", en: "Did you notice the reason?", vi: "Bạn có để ý vì sao không?" }
          ] }
        ],
        sentences: [
          { en: "While I was cooking he arrived", vi: "Trong lúc tôi nấu ăn anh ấy đến" },
          { en: "What happened yesterday", vi: "Hôm qua đã xảy ra chuyện gì" },
          { en: "At that moment I understood", vi: "Ngay lúc đó tôi hiểu ra" }
        ]
      },
      {
        id: "b1u2l2", title: "Nếu… thì…",
        goal: "Câu điều kiện loại 1 cho chuyện có thể xảy ra.",
        teach: [
          { t: "intro", title: "Bẫy lớn nhất của câu điều kiện", body: "Tiếng Việt nói “Nếu ngày mai trời mưa thì tôi sẽ ở nhà” — hai vế đều tương lai. Tiếng Anh thì vế if phải ở HIỆN TẠI.", bullets: ["If + hiện tại, will + nguyên thể", "Không dùng will sau if", "Đảo vế được"] },
          { t: "grammar", title: "Câu điều kiện loại 1", body: "Dùng cho việc có thật sự khả năng xảy ra trong tương lai.", rows: [
            ["If + hiện tại đơn, will", "If it rains, I will stay home.", "Nếu trời mưa, tôi sẽ ở nhà."],
            ["Đảo vế, bỏ phẩy", "I will stay home if it rains.", "Tôi sẽ ở nhà nếu trời mưa."],
            ["Phủ định", "If you don't hurry, we will be late.", "Nếu bạn không nhanh lên, chúng ta sẽ muộn."],
            ["Sai", "If it will rain, I will stay home.", "(sau if không dùng will)"]
          ], tip: "Nhớ một câu: “sau if không bao giờ có will”. Riêng câu này thuộc là tránh được lỗi phổ biến nhất." },
          { t: "vocab", en: "promise", vi: "hứa", pos: "Động từ", ipa: "/ˈprɑːmɪs/", note: "Vừa là danh từ (lời hứa): keep a promise là giữ lời.", ex: { en: "I promise I will call you.", vi: "Tôi hứa sẽ gọi cho bạn." } },
          { t: "vocab", en: "invite", vi: "mời", pos: "Động từ", ipa: "/ɪnˈvaɪt/", note: "Mời ai đến đâu là invite someone to somewhere.", ex: { en: "I will invite you to my party.", vi: "Tôi sẽ mời bạn đến bữa tiệc của tôi." } },
          { t: "vocab", en: "remember", vi: "nhớ", pos: "Động từ", ipa: "/rɪˈmembər/", note: "remember to do là nhớ phải làm; remember doing là nhớ đã làm.", ex: { en: "Remember to bring your book.", vi: "Nhớ mang sách theo nhé." } },
          { t: "vocab", en: "forget", vi: "quên", pos: "Động từ", ipa: "/fərˈɡet/", note: "Bất quy tắc: forgot, forgotten.", ex: { en: "Don't forget your keys.", vi: "Đừng quên chìa khoá." } },
          { t: "vocab", en: "chance", vi: "cơ hội", pos: "Danh từ", ipa: "/tʃæns/", note: "Cũng nghĩa là khả năng: There is a chance of rain.", ex: { en: "This is a good chance for you.", vi: "Đây là cơ hội tốt cho bạn." } },
          { t: "vocab", en: "hurry", vi: "vội, nhanh lên", pos: "Động từ", ipa: "/ˈhɜːri/", note: "Nhanh lên! là Hurry up!", ex: { en: "If you hurry, you will catch the bus.", vi: "Nếu bạn nhanh lên, bạn sẽ kịp xe buýt." } },
          { t: "dialogue", title: "Hẹn nhau đi chơi", lines: [
            { who: "A", en: "If the weather is good, I will invite you to the park.", vi: "Nếu thời tiết đẹp, tôi sẽ mời bạn đi công viên." },
            { who: "B", en: "I promise I will come. Don't forget to call me.", vi: "Tôi hứa sẽ đến. Đừng quên gọi cho tôi nhé." },
            { who: "A", en: "If you hurry, we will have more time.", vi: "Nếu bạn nhanh lên, chúng ta sẽ có nhiều thời gian hơn." }
          ] }
        ],
        sentences: [
          { en: "If it rains I will stay home", vi: "Nếu trời mưa tôi sẽ ở nhà" },
          { en: "I promise I will call you", vi: "Tôi hứa sẽ gọi cho bạn" },
          { en: "Remember to bring your book", vi: "Nhớ mang sách theo nhé" }
        ]
      },
      { id: "b1u2c", title: "Ôn tập chương 2", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  }

  ]
};
