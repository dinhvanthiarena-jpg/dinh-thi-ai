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
      {
        id: "b1u1l4", title: "Đề nghị & Cân nhắc",
        goal: "Gợi ý một hướng đi và nói rõ bạn chắc chắn hay còn phân vân.",
        teach: [
          { t: "intro", title: "Nói ý mình mà không áp đặt", body: "Bài trước bạn học đưa lời khuyên. Bài này đi xa hơn: gợi ý một cách mềm, và nói rõ mức độ chắc chắn của mình. Đây là thứ phân biệt người nói tiếng Anh khá với người nói tiếng Anh giỏi.", bullets: ["suggest và consider", "Mức độ chắc chắn", "Thừa nhận mình có thể sai"] },
          { t: "vocab", en: "suggest", vi: "gợi ý, đề xuất", pos: "Động từ", ipa: "/səˈdʒest/", note: "Theo sau là V-ing hoặc that: I suggest going early. KHÔNG nói suggest to go.", ex: { en: "I suggest leaving before six.", vi: "Tôi gợi ý là nên đi trước sáu giờ." } },
          { t: "vocab", en: "consider", vi: "cân nhắc, xem xét", pos: "Động từ", ipa: "/kənˈsɪdər/", note: "Cũng đi với V-ing: consider moving. Trang trọng hơn think about.", ex: { en: "We should consider other options.", vi: "Chúng ta nên cân nhắc các lựa chọn khác." } },
          { t: "vocab", en: "doubt", vi: "nghi ngờ, không chắc", pos: "Động từ", ipa: "/daʊt/", note: "Chữ b câm, đọc là DAUT. I doubt it nghĩa là tôi e là không đâu.", ex: { en: "I doubt he will come.", vi: "Tôi không chắc anh ấy sẽ đến." } },
          { t: "vocab", en: "certain", vi: "chắc chắn", pos: "Tính từ", ipa: "/ˈsɜːrtn/", note: "Mạnh hơn sure. I'm certain that… dùng khi bạn thật sự chắc.", ex: { en: "I am certain this is the right way.", vi: "Tôi chắc chắn đây là đường đúng." } },
          { t: "vocab", en: "obvious", vi: "rõ ràng, hiển nhiên", pos: "Tính từ", ipa: "/ˈɑːbviəs/", note: "It's obvious that… — dùng khi điều đó ai cũng thấy.", ex: { en: "It is obvious that she is tired.", vi: "Rõ ràng là cô ấy đang mệt." } },
          { t: "vocab", en: "admit", vi: "thừa nhận", pos: "Động từ", ipa: "/ədˈmɪt/", note: "Cũng đi với V-ing: admit making a mistake. Nhân đôi chữ t khi thêm -ed: admitted.", ex: { en: "He admitted making a mistake.", vi: "Anh ấy thừa nhận đã phạm sai lầm." } },
          { t: "grammar", title: "Thang đo mức độ chắc chắn", body: "Người bản xứ hiếm khi nói chắc như đinh đóng cột. Họ chọn từ theo đúng mức tin của mình — và người nghe đánh giá bạn qua chính chỗ đó.", rows: [
            ["I'm certain / definitely", "chắc chắn 100%", "I'm certain she said that."],
            ["It's obvious that…", "rõ ràng, ai cũng thấy", "It's obvious that he is angry."],
            ["I think / probably", "khá chắc", "I think he will agree."],
            ["I doubt / I'm not sure", "không chắc", "I doubt it will rain."]
          ], tip: "Sau suggest, consider, admit thì động từ luôn thêm -ing. Đây là ba động từ hay bị dùng sai nhất ở B1." },
          { t: "culture", title: "Nói chắc quá lại mất tin cậy", body: "Trong môi trường công việc quốc tế, người nói câu nào cũng chắc nịch thường bị coi là thiếu cẩn trọng. Ngược lại, người biết nói I'm not sure, let me check lại được tin. Khiêm tốn có tính toán là một kỹ năng." },
          { t: "dialogue", title: "Bàn kế hoạch nhóm", lines: [
            { who: "A", en: "I suggest starting the project this week.", vi: "Tôi gợi ý là bắt đầu dự án ngay tuần này." },
            { who: "B", en: "I'm not sure. Should we consider waiting for the report?", vi: "Tôi không chắc. Hay là mình cân nhắc chờ báo cáo?" },
            { who: "A", en: "It's obvious that we don't have much time.", vi: "Rõ ràng là chúng ta không còn nhiều thời gian." },
            { who: "B", en: "You're right. I admit I was being too careful.", vi: "Bạn nói đúng. Tôi thừa nhận là mình đã quá thận trọng." }
          ] }
        ],
        sentences: [
          { en: "I suggest leaving before six", vi: "Tôi gợi ý là nên đi trước sáu giờ" },
          { en: "We should consider other options", vi: "Chúng ta nên cân nhắc các lựa chọn khác" },
          { en: "It is obvious that she is tired", vi: "Rõ ràng là cô ấy đang mệt" },
          { en: "I doubt he will come", vi: "Tôi không chắc anh ấy sẽ đến" },
          { en: "He admitted making a mistake", vi: "Anh ấy thừa nhận đã phạm sai lầm" }
        ]
      },
      {
        id: "b1u1l5", title: "Yêu cầu lịch sự",
        goal: "Nhờ vả, xin phép và xin lỗi theo đúng mức trang trọng của tình huống.",
        teach: [
          { t: "intro", title: "Cùng một việc, ba cách nói", body: "Nhờ bạn thân đóng cửa sổ khác hẳn nhờ sếp. Tiếng Anh phân tầng lịch sự rất rõ, và dùng sai tầng thì người ta thấy ngay.", bullets: ["Ba mức nhờ vả", "Would you mind + V-ing", "Xin lỗi cho đúng mức"] },
          { t: "vocab", en: "polite", vi: "lịch sự", pos: "Tính từ", ipa: "/pəˈlaɪt/", note: "Trọng âm ở âm sau: pơ-LAIT. Ngược lại là rude (thô lỗ).", ex: { en: "She is always polite to customers.", vi: "Cô ấy luôn lịch sự với khách hàng." } },
          { t: "vocab", en: "request", vi: "lời đề nghị, yêu cầu", pos: "Danh từ", ipa: "/rɪˈkwest/", note: "Trang trọng. Make a request là đưa ra một đề nghị.", ex: { en: "I have a small request.", vi: "Tôi có một đề nghị nhỏ." } },
          { t: "vocab", en: "mind", vi: "phiền, ngại", pos: "Động từ", ipa: "/maɪnd/", note: "Would you mind…? nghĩa là bạn có phiền không. Trả lời No, not at all mới là đồng ý!", ex: { en: "Would you mind closing the door?", vi: "Bạn đóng cửa giúp được không?" } },
          { t: "vocab", en: "favour", vi: "sự giúp đỡ", pos: "Danh từ", ipa: "/ˈfeɪvər/", note: "Người Mỹ viết favor. Can I ask you a favour? là câu mở đầu khi nhờ việc lớn.", ex: { en: "Can I ask you a favour?", vi: "Tôi nhờ bạn một việc được không?" } },
          { t: "vocab", en: "offer", vi: "đề nghị giúp, mời", pos: "Động từ", ipa: "/ˈɔːfər/", note: "Offer to + V: He offered to help me. Khác với suggest — offer là tự mình làm.", ex: { en: "He offered to carry my bag.", vi: "Anh ấy đề nghị xách túi giúp tôi." } },
          { t: "vocab", en: "apologise", vi: "xin lỗi (trang trọng)", pos: "Động từ", ipa: "/əˈpɑːlədʒaɪz/", note: "Người Mỹ viết apologize. Trang trọng hơn sorry nhiều, dùng trong email công việc.", ex: { en: "I apologise for the delay.", vi: "Tôi xin lỗi vì sự chậm trễ." } },
          { t: "grammar", title: "Thang lịch sự khi nhờ vả", body: "Bốn bậc, từ thân mật tới rất trang trọng. Chọn đúng bậc là chuyện quan trọng hơn cả chọn đúng từ vựng.", rows: [
            ["Can you…?", "thân mật, bạn bè", "Can you pass the salt?"],
            ["Could you…?", "lịch sự, dùng được mọi lúc", "Could you help me, please?"],
            ["Would you mind + V-ing?", "rất lịch sự", "Would you mind waiting a moment?"],
            ["I was wondering if…", "trang trọng nhất", "I was wondering if you could help."]
          ], tip: "Cạm bẫy lớn: Would you mind…? hỏi bạn CÓ PHIỀN KHÔNG. Muốn đồng ý phải trả lời No — nói Yes là bạn đang từ chối!" },
          { t: "dialogue", title: "Nhờ đồng nghiệp", lines: [
            { who: "A", en: "Can I ask you a favour?", vi: "Tôi nhờ bạn một việc được không?" },
            { who: "B", en: "Of course. What is it?", vi: "Tất nhiên rồi. Việc gì vậy?" },
            { who: "A", en: "Would you mind checking this report? I apologise for asking so late.", vi: "Bạn xem giúp báo cáo này được không? Tôi xin lỗi vì nhờ muộn quá." },
            { who: "B", en: "Not at all. I offered to help last week anyway.", vi: "Không phiền gì đâu. Tuần trước tôi đã bảo sẽ giúp mà." }
          ] }
        ],
        sentences: [
          { en: "Would you mind closing the door", vi: "Bạn đóng cửa giúp được không" },
          { en: "Can I ask you a favour", vi: "Tôi nhờ bạn một việc được không" },
          { en: "I apologise for the delay", vi: "Tôi xin lỗi vì sự chậm trễ" },
          { en: "He offered to carry my bag", vi: "Anh ấy đề nghị xách túi giúp tôi" },
          { en: "She is always polite to customers", vi: "Cô ấy luôn lịch sự với khách hàng" }
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
      {
        id: "b1u2l3", title: "Giá như — điều kiện loại 2",
        goal: "Nói về những chuyện không có thật, giả sử, ước ao.",
        teach: [
          { t: "intro", title: "Chuyện không có thật thì nói thế nào?", body: "Bài trước là điều kiện loại 1: chuyện có thể xảy ra. Bài này là loại 2: chuyện không có thật ở hiện tại. Điểm lạ là động từ lùi về quá khứ dù đang nói chuyện bây giờ.", bullets: ["If + quá khứ, would + V", "were cho mọi chủ ngữ", "Ước ao với I wish"] },
          { t: "vocab", en: "imagine", vi: "tưởng tượng", pos: "Động từ", ipa: "/ɪˈmædʒɪn/", note: "Theo sau là V-ing: Imagine living there.", ex: { en: "Imagine living by the sea.", vi: "Tưởng tượng sống bên bờ biển xem." } },
          { t: "vocab", en: "choice", vi: "sự lựa chọn", pos: "Danh từ", ipa: "/tʃɔɪs/", note: "Danh từ của choose. Have no choice là không còn cách nào khác.", ex: { en: "I had no choice.", vi: "Tôi không còn lựa chọn nào khác." } },
          { t: "vocab", en: "situation", vi: "tình huống, hoàn cảnh", pos: "Danh từ", ipa: "/ˌsɪtʃuˈeɪʃn/", note: "In this situation là trong tình huống này.", ex: { en: "In your situation, I would wait.", vi: "Ở hoàn cảnh của bạn, tôi sẽ đợi." } },
          { t: "vocab", en: "instead", vi: "thay vào đó", pos: "Trạng từ", ipa: "/ɪnˈsted/", note: "Đứng cuối câu. Instead OF + danh từ hoặc V-ing.", ex: { en: "Let's take the bus instead.", vi: "Hay là mình đi xe buýt thay vào đó." } },
          { t: "vocab", en: "unless", vi: "trừ khi", pos: "Giới từ", ipa: "/ənˈles/", note: "Bằng if… not. Sau unless KHÔNG dùng phủ định nữa.", ex: { en: "I won't go unless you come.", vi: "Tôi sẽ không đi trừ khi bạn đi cùng." } },
          { t: "vocab", en: "wish", vi: "ước", pos: "Động từ", ipa: "/wɪʃ/", note: "Sau I wish, động từ cũng lùi về quá khứ giống điều kiện loại 2.", ex: { en: "I wish I had more time.", vi: "Ước gì tôi có nhiều thời gian hơn." } },
          { t: "grammar", title: "If + quá khứ, would + động từ", body: "Cấu trúc trông như quá khứ nhưng nói về HIỆN TẠI không có thật. Đây là chỗ khiến người học Việt Nam bối rối nhất.", rows: [
            ["If + V2, would + V", "nếu… thì sẽ…", "If I had money, I would travel."],
            ["If I were you…", "nếu tôi là bạn", "If I were you, I would apologise."],
            ["I wish + V2", "ước gì", "I wish I spoke Chinese."],
            ["so sánh loại 1", "chuyện có thể xảy ra", "If it rains, I will stay home."]
          ], tip: "Ở loại 2, was đổi thành WERE cho MỌI chủ ngữ: If I were you, if he were here. Đây là dấu hiệu của người viết tiếng Anh chuẩn." },
          { t: "dialogue", title: "Nếu trúng số", lines: [
            { who: "A", en: "What would you do if you won the lottery?", vi: "Nếu trúng số bạn sẽ làm gì?" },
            { who: "B", en: "I would buy a house for my parents. What about you?", vi: "Tôi sẽ mua nhà cho bố mẹ. Còn bạn?" },
            { who: "A", en: "If I were you, I would travel instead.", vi: "Nếu là bạn, tôi sẽ đi du lịch thay vào đó." },
            { who: "B", en: "I wish I had that much free time!", vi: "Ước gì tôi có nhiều thời gian rảnh đến thế!" }
          ] }
        ],
        sentences: [
          { en: "If I had money I would travel", vi: "Nếu có tiền tôi sẽ đi du lịch" },
          { en: "If I were you I would wait", vi: "Nếu là bạn tôi sẽ đợi" },
          { en: "I wish I had more time", vi: "Ước gì tôi có nhiều thời gian hơn" },
          { en: "Let us take the bus instead", vi: "Hay là mình đi xe buýt thay vào đó" },
          { en: "I will not go unless you come", vi: "Tôi sẽ không đi trừ khi bạn đi cùng" }
        ]
      },
      {
        id: "b1u2l4", title: "Thuật lại lời người khác",
        goal: "Kể lại ai đó đã nói gì mà không trích nguyên văn.",
        teach: [
          { t: "intro", title: "Anh ấy bảo là…", body: "Khi kể lại lời người khác, tiếng Anh bắt động từ lùi một thì về quá khứ. Nghe rắc rối, nhưng chỉ cần nắm một quy tắc là xong.", bullets: ["Lùi thì khi thuật lại", "say hay tell", "Động từ thay cho said"] },
          { t: "vocab", en: "mention", vi: "nhắc đến, đề cập", pos: "Động từ", ipa: "/ˈmenʃn/", note: "Don't mention it là câu đáp lại lời cảm ơn: có gì đâu.", ex: { en: "She mentioned your name.", vi: "Cô ấy có nhắc đến tên bạn." } },
          { t: "vocab", en: "reply", vi: "trả lời, đáp lại", pos: "Động từ", ipa: "/rɪˈplaɪ/", note: "Reply TO someone. Vừa là động từ vừa là danh từ.", ex: { en: "He replied to my email.", vi: "Anh ấy đã trả lời email của tôi." } },
          { t: "vocab", en: "complain", vi: "phàn nàn", pos: "Động từ", ipa: "/kəmˈpleɪn/", note: "Complain ABOUT something, complain TO someone.", ex: { en: "They complained about the noise.", vi: "Họ phàn nàn về tiếng ồn." } },
          { t: "vocab", en: "shout", vi: "hét, quát", pos: "Động từ", ipa: "/ʃaʊt/", note: "Shout AT someone là quát ai đó — nghe rất nặng.", ex: { en: "He shouted at the driver.", vi: "Anh ta quát tài xế." } },
          { t: "vocab", en: "whisper", vi: "thì thầm", pos: "Động từ", ipa: "/ˈwɪspər/", note: "Ngược với shout. Chữ h gần như không nghe thấy.", ex: { en: "She whispered the answer.", vi: "Cô ấy thì thầm câu trả lời." } },
          { t: "vocab", en: "warn", vi: "cảnh báo", pos: "Động từ", ipa: "/wɔːrn/", note: "Warn someone about something. Chữ r rất nhẹ trong giọng Anh.", ex: { en: "He warned me about the rain.", vi: "Anh ấy đã báo trước cho tôi về cơn mưa." } },
          { t: "grammar", title: "Lùi một thì khi thuật lại", body: "Nguyên tắc duy nhất: mọi thì đều lùi về sau một bậc, và đại từ đổi theo người kể.", rows: [
            ["\"I am tired.\"", "→ said (that) he WAS tired", "hiện tại → quá khứ"],
            ["\"I went home.\"", "→ said he HAD GONE home", "quá khứ → quá khứ hoàn thành"],
            ["\"I will call.\"", "→ said he WOULD call", "will → would"],
            ["\"Can you help?\"", "→ asked if I COULD help", "can → could"]
          ], tip: "Say KHÔNG có người nghe đi liền sau: he said that… Tell thì BẮT BUỘC có: he told ME that… Đây là lỗi kinh điển." },
          { t: "dialogue", title: "Kể lại cuộc họp", lines: [
            { who: "A", en: "What did the manager say?", vi: "Quản lý nói gì vậy?" },
            { who: "B", en: "He said the report was late, and he warned us about the deadline.", vi: "Anh ấy bảo báo cáo trễ, và nhắc chúng ta về hạn chót." },
            { who: "A", en: "Did anyone complain?", vi: "Có ai phàn nàn không?" },
            { who: "B", en: "Nam mentioned the problem, but nobody replied.", vi: "Nam có nhắc đến vấn đề đó, nhưng không ai trả lời." }
          ] }
        ],
        sentences: [
          { en: "She mentioned your name", vi: "Cô ấy có nhắc đến tên bạn" },
          { en: "He said he was tired", vi: "Anh ấy bảo là anh ấy mệt" },
          { en: "They complained about the noise", vi: "Họ phàn nàn về tiếng ồn" },
          { en: "He warned me about the rain", vi: "Anh ấy đã báo trước cho tôi về cơn mưa" },
          { en: "He replied to my email", vi: "Anh ấy đã trả lời email của tôi" }
        ]
      },
      {
        id: "b1u2l5", title: "Nguyên nhân & Hậu quả",
        goal: "Nối chuyện này với chuyện kia: vì sao xảy ra và dẫn tới điều gì.",
        teach: [
          { t: "intro", title: "Không chỉ kể, mà giải thích", body: "Đến B1, người ta chờ bạn không chỉ kể chuyện gì đã xảy ra mà còn nói được TẠI SAO và RỒI SAO. Sáu từ trong bài này là bộ khung để làm điều đó.", bullets: ["cause và effect", "Ngăn chặn và tránh né", "Từ nối chỉ hậu quả"] },
          { t: "vocab", en: "cause", vi: "gây ra; nguyên nhân", pos: "Động từ", ipa: "/kɔːz/", note: "Vừa là động từ vừa là danh từ. The cause of the accident.", ex: { en: "Heavy rain caused the accident.", vi: "Mưa lớn đã gây ra vụ tai nạn." } },
          { t: "vocab", en: "effect", vi: "tác động, ảnh hưởng", pos: "Danh từ", ipa: "/ɪˈfekt/", note: "Effect là DANH từ, affect là ĐỘNG từ. Đây là cặp gây nhầm nhiều nhất tiếng Anh.", ex: { en: "It had a big effect on me.", vi: "Nó có tác động lớn tới tôi." } },
          { t: "vocab", en: "affect", vi: "ảnh hưởng đến", pos: "Động từ", ipa: "/əˈfekt/", note: "Đi thẳng với tân ngữ, không cần giới từ: affect the result.", ex: { en: "The weather affects my mood.", vi: "Thời tiết ảnh hưởng đến tâm trạng tôi." } },
          { t: "vocab", en: "avoid", vi: "tránh", pos: "Động từ", ipa: "/əˈvɔɪd/", note: "Theo sau là V-ing: avoid making noise. Không nói avoid to make.", ex: { en: "Try to avoid making the same mistake.", vi: "Cố tránh phạm cùng một lỗi." } },
          { t: "vocab", en: "prevent", vi: "ngăn chặn", pos: "Động từ", ipa: "/prɪˈvent/", note: "Prevent somebody FROM doing something.", ex: { en: "Exercise prevents many illnesses.", vi: "Tập thể dục ngăn được nhiều bệnh." } },
          { t: "vocab", en: "solve", vi: "giải quyết", pos: "Động từ", ipa: "/sɑːlv/", note: "Solve a problem. Danh từ là solution (giải pháp).", ex: { en: "We solved the problem together.", vi: "Chúng tôi đã cùng nhau giải quyết vấn đề." } },
          { t: "grammar", title: "Nối nguyên nhân với hậu quả", body: "Bốn cách nối, khác nhau ở chỗ đặt câu và dấu phẩy. Dùng đúng thì bài viết của bạn lên hẳn một bậc.", rows: [
            ["because + mệnh đề", "vì (có chủ ngữ + động từ)", "We stayed home because it rained."],
            ["because of + danh từ", "vì (chỉ danh từ)", "We stayed home because of the rain."],
            ["so", "nên", "It rained, so we stayed home."],
            ["as a result,", "kết quả là", "It rained. As a result, we stayed home."]
          ], tip: "Nhớ: because đi với CẢ MỘT CÂU, because of chỉ đi với DANH TỪ. Sai chỗ này là lỗi phổ biến nhất khi viết." },
          { t: "culture", title: "Người ta chờ bạn nói vì sao", body: "Trong bài thi nói và trong họp hành quốc tế, một câu trả lời không kèm lý do bị coi là chưa hoàn chỉnh. Tập thói quen: nói ý kiến, rồi thêm ngay một chữ because." },
          { t: "dialogue", title: "Bàn cách xử lý", lines: [
            { who: "A", en: "Why was the delivery late?", vi: "Sao hàng lại giao muộn vậy?" },
            { who: "B", en: "Because of the storm. It affected all the roads.", vi: "Vì cơn bão. Nó ảnh hưởng đến toàn bộ các tuyến đường." },
            { who: "A", en: "How can we prevent this next time?", vi: "Lần sau làm sao ngăn được chuyện này?" },
            { who: "B", en: "We can order earlier. That would solve most of it.", vi: "Mình có thể đặt hàng sớm hơn. Vậy là giải quyết được phần lớn." }
          ] }
        ],
        sentences: [
          { en: "Heavy rain caused the accident", vi: "Mưa lớn đã gây ra vụ tai nạn" },
          { en: "The weather affects my mood", vi: "Thời tiết ảnh hưởng đến tâm trạng tôi" },
          { en: "We solved the problem together", vi: "Chúng tôi đã cùng nhau giải quyết vấn đề" },
          { en: "Try to avoid making the same mistake", vi: "Cố tránh phạm cùng một lỗi" },
          { en: "It had a big effect on me", vi: "Nó có tác động lớn tới tôi" }
        ]
      },
      { id: "b1u2c", title: "Ôn tập chương 2", checkpoint: true,
        goal: "Kiểm tra lại toàn bộ từ và mẫu câu của chương." }
    ]
  },

  {
    id: "b1u3", title: "Sức khoẻ, Môi trường & Công nghệ",
    goal: "Mở rộng vốn từ bậc trung: y tế, môi trường, công nghệ và tiền bạc.",
    lessons: [
      {
        id: "b1u3l1", title: "Sức khoẻ & Bệnh viện",
        goal: "10 từ đi khám bệnh.",
        teach: [
          { t: "intro", title: "Bài này bạn sẽ học gì?", body: "Đi khám ở nước ngoài, hay đọc đơn thuốc tiếng Anh — mấy từ này cứu bạn.", bullets: ["10 từ y tế thiết yếu", "Tả triệu chứng cho bác sĩ", "Cấu trúc I have + bệnh"] },
          { t: "vocab", en: "symptom", vi: "triệu chứng", pos: "Danh từ", ipa: "/ˈsɪmptəm/", note: "Cái mình cảm thấy: sốt, ho, đau.", ex: { en: "What are your symptoms?", vi: "Bạn có triệu chứng gì?" } },
          { t: "vocab", en: "cough", vi: "ho", pos: "Danh từ", ipa: "/kɔːf/", note: "Viết ough nhưng đọc là ọp. Bẫy phát âm kinh điển.", ex: { en: "I have a bad cough.", vi: "Tôi ho nặng." } },
          { t: "vocab", en: "pain", vi: "cơn đau", pos: "Danh từ", ipa: "/peɪn/", note: "Đau ở đâu: a pain in my back.", ex: { en: "I have a pain in my back.", vi: "Tôi bị đau lưng." } },
          { t: "vocab", en: "injury", vi: "chấn thương", pos: "Danh từ", ipa: "/ˈɪndʒəri/", note: "Do tai nạn, va đập. Động từ là injure.", ex: { en: "He has a leg injury.", vi: "Anh ấy bị chấn thương chân." } },
          { t: "vocab", en: "treatment", vi: "cách điều trị", pos: "Danh từ", ipa: "/ˈtriːtmənt/", note: "Từ treat (điều trị) + ment.", ex: { en: "The treatment takes a month.", vi: "Việc điều trị mất một tháng." } },
          { t: "vocab", en: "prescription", vi: "đơn thuốc", pos: "Danh từ", ipa: "/prɪˈskrɪpʃn/", note: "Giấy bác sĩ kê để ra hiệu thuốc mua.", ex: { en: "The doctor wrote a prescription.", vi: "Bác sĩ đã kê đơn." } },
          { t: "vocab", en: "pharmacy", vi: "hiệu thuốc", pos: "Danh từ", ipa: "/ˈfɑːrməsi/", note: "Anh cũng gọi là chemist.", ex: { en: "The pharmacy is next door.", vi: "Hiệu thuốc ở ngay bên cạnh." } },
          { t: "vocab", en: "appointment", vi: "lịch hẹn", pos: "Danh từ", ipa: "/əˈpɔɪntmənt/", note: "Đặt lịch khám: make an appointment.", ex: { en: "I made an appointment.", vi: "Tôi đã đặt lịch hẹn." } },
          { t: "vocab", en: "recover", vi: "hồi phục", pos: "Động từ", ipa: "/rɪˈkʌvər/", note: "Khỏi bệnh: recover FROM an illness.", ex: { en: "She recovered quickly.", vi: "Cô ấy hồi phục nhanh." } },
          { t: "vocab", en: "healthy", vi: "khoẻ mạnh", pos: "Tính từ", ipa: "/ˈhelθi/", note: "Ăn uống lành mạnh là a healthy diet.", ex: { en: "Eat healthy food.", vi: "Hãy ăn đồ lành mạnh." } },
        ],
        sentences: [
          { en: "What are your symptoms", vi: "Bạn có triệu chứng gì" },
          { en: "I have a pain in my back", vi: "Tôi bị đau lưng" },
          { en: "I made an appointment", vi: "Tôi đã đặt lịch hẹn" },
          { en: "The pharmacy is next door", vi: "Hiệu thuốc ở ngay bên cạnh" },
        ]
      },
      {
        id: "b1u3l2", title: "Môi trường",
        goal: "10 từ về môi trường và khí hậu.",
        teach: [
          { t: "intro", title: "Bài này bạn sẽ học gì?", body: "Chủ đề này ra thi rất nhiều, mà cũng là chuyện cả thế giới đang bàn.", bullets: ["10 từ môi trường", "Nói về nguyên nhân và hậu quả", "Từ ghép: air pollution"] },
          { t: "vocab", en: "environment", vi: "môi trường", pos: "Danh từ", ipa: "/ɪnˈvaɪrənmənt/", note: "Hầu như luôn đi với the: the environment.", ex: { en: "We must protect the environment.", vi: "Chúng ta phải bảo vệ môi trường." } },
          { t: "vocab", en: "pollution", vi: "ô nhiễm", pos: "Danh từ", ipa: "/pəˈluːʃn/", note: "Ô nhiễm không khí là air pollution.", ex: { en: "Air pollution is a big problem.", vi: "Ô nhiễm không khí là vấn đề lớn." } },
          { t: "vocab", en: "rubbish", vi: "rác thải", pos: "Danh từ", ipa: "/ˈrʌbɪʃ/", note: "Không đếm được. Mỹ dùng trash.", ex: { en: "Do not throw rubbish here.", vi: "Đừng vứt rác ở đây." } },
          { t: "vocab", en: "recycle", vi: "tái chế", pos: "Động từ", ipa: "/ˌriːˈsaɪkl/", note: "re (lại) + cycle (vòng). Danh từ là recycling.", ex: { en: "We recycle paper and glass.", vi: "Chúng tôi tái chế giấy và thuỷ tinh." } },
          { t: "vocab", en: "protect", vi: "bảo vệ", pos: "Động từ", ipa: "/prəˈtekt/", note: "Bảo vệ khỏi cái gì: protect FROM.", ex: { en: "We protect the forest.", vi: "Chúng tôi bảo vệ rừng." } },
          { t: "vocab", en: "forest", vi: "rừng", pos: "Danh từ", ipa: "/ˈfɔːrɪst/", note: "Phá rừng là deforestation.", ex: { en: "The forest is very old.", vi: "Khu rừng rất lâu đời." } },
          { t: "vocab", en: "climate", vi: "khí hậu", pos: "Danh từ", ipa: "/ˈklaɪmət/", note: "Khác weather: climate là cả vùng, cả năm.", ex: { en: "Climate change affects us all.", vi: "Biến đổi khí hậu ảnh hưởng tất cả." } },
          { t: "vocab", en: "energy", vi: "năng lượng", pos: "Danh từ", ipa: "/ˈenərdʒi/", note: "Năng lượng sạch là clean energy.", ex: { en: "We need clean energy.", vi: "Chúng ta cần năng lượng sạch." } },
          { t: "vocab", en: "waste", vi: "lãng phí", pos: "Động từ", ipa: "/weɪst/", note: "Vừa là lãng phí vừa là chất thải.", ex: { en: "Do not waste water.", vi: "Đừng lãng phí nước." } },
          { t: "vocab", en: "plastic", vi: "nhựa", pos: "Danh từ", ipa: "/ˈplæstɪk/", note: "Túi ni lông là a plastic bag.", ex: { en: "Plastic bags harm the sea.", vi: "Túi ni lông hại biển." } },
        ],
        sentences: [
          { en: "We must protect the environment", vi: "Chúng ta phải bảo vệ môi trường" },
          { en: "Air pollution is a big problem", vi: "Ô nhiễm không khí là vấn đề lớn" },
          { en: "Do not waste water", vi: "Đừng lãng phí nước" },
          { en: "We recycle paper and glass", vi: "Chúng tôi tái chế giấy và thuỷ tinh" },
        ]
      },
      {
        id: "b1u3l3", title: "Công nghệ",
        goal: "10 từ công nghệ dùng hằng ngày.",
        teach: [
          { t: "intro", title: "Bài này bạn sẽ học gì?", body: "Điện thoại, mạng, ứng dụng — mấy từ này đọc gặp mỗi ngày mà nhiều người vẫn đoán nghĩa.", bullets: ["10 từ công nghệ", "Động từ máy tính: download, upload", "Nói về thói quen dùng mạng"] },
          { t: "vocab", en: "device", vi: "thiết bị", pos: "Danh từ", ipa: "/dɪˈvaɪs/", note: "Chỉ chung điện thoại, máy tính bảng, laptop.", ex: { en: "This device is very fast.", vi: "Thiết bị này rất nhanh." } },
          { t: "vocab", en: "screen", vi: "màn hình", pos: "Danh từ", ipa: "/skriːn/", note: "Thời gian dùng màn hình là screen time.", ex: { en: "The screen is too bright.", vi: "Màn hình sáng quá." } },
          { t: "vocab", en: "password", vi: "mật khẩu", pos: "Danh từ", ipa: "/ˈpæswɜːrd/", note: "Ghép pass + word.", ex: { en: "I forgot my password.", vi: "Tôi quên mật khẩu." } },
          { t: "vocab", en: "download", vi: "tải xuống", pos: "Động từ", ipa: "/ˌdaʊnˈloʊd/", note: "Ngược lại là upload (tải lên).", ex: { en: "Download the app first.", vi: "Tải ứng dụng về trước đã." } },
          { t: "vocab", en: "update", vi: "cập nhật", pos: "Động từ", ipa: "/ˌʌpˈdeɪt/", note: "Vừa là động từ vừa là danh từ.", ex: { en: "Please update the app.", vi: "Hãy cập nhật ứng dụng." } },
          { t: "vocab", en: "battery", vi: "pin", pos: "Danh từ", ipa: "/ˈbætəri/", note: "Hết pin là the battery is dead.", ex: { en: "My battery is low.", vi: "Máy tôi sắp hết pin." } },
          { t: "vocab", en: "charge", vi: "sạc", pos: "Động từ", ipa: "/tʃɑːrdʒ/", note: "Cũng có nghĩa tính phí.", ex: { en: "I need to charge my phone.", vi: "Tôi cần sạc điện thoại." } },
          { t: "vocab", en: "network", vi: "mạng", pos: "Danh từ", ipa: "/ˈnetwɜːrk/", note: "Mạng xã hội là a social network.", ex: { en: "The network is slow today.", vi: "Hôm nay mạng chậm." } },
          { t: "vocab", en: "account", vi: "tài khoản", pos: "Danh từ", ipa: "/əˈkaʊnt/", note: "Tài khoản mạng lẫn tài khoản ngân hàng.", ex: { en: "Create an account first.", vi: "Tạo tài khoản trước đã." } },
          { t: "vocab", en: "message", vi: "tin nhắn", pos: "Danh từ", ipa: "/ˈmesɪdʒ/", note: "Nhắn tin là send a message.", ex: { en: "I sent you a message.", vi: "Tôi đã nhắn tin cho bạn." } },
        ],
        sentences: [
          { en: "I forgot my password", vi: "Tôi quên mật khẩu" },
          { en: "My battery is low", vi: "Máy tôi sắp hết pin" },
          { en: "The network is slow today", vi: "Hôm nay mạng chậm" },
          { en: "I sent you a message", vi: "Tôi đã nhắn tin cho bạn" },
        ]
      },
      {
        id: "b1u3l4", title: "Tiền bạc & Ngân hàng",
        goal: "10 từ về tiền và giao dịch.",
        teach: [
          { t: "intro", title: "Bài này bạn sẽ học gì?", body: "Rút tiền, chuyển khoản, hỏi giá — đi đâu cũng cần.", bullets: ["10 từ tiền bạc, ngân hàng", "Nói về chi tiêu, tiết kiệm", "Lịch sự khi hỏi giá"] },
          { t: "vocab", en: "bank", vi: "ngân hàng", pos: "Danh từ", ipa: "/bæŋk/", note: "Cũng có nghĩa bờ sông.", ex: { en: "The bank opens at eight.", vi: "Ngân hàng mở cửa lúc tám giờ." } },
          { t: "vocab", en: "cash", vi: "tiền mặt", pos: "Danh từ", ipa: "/kæʃ/", note: "Trả tiền mặt là pay in cash.", ex: { en: "I pay in cash.", vi: "Tôi trả tiền mặt." } },
          { t: "vocab", en: "card", vi: "thẻ", pos: "Danh từ", ipa: "/kɑːrd/", note: "Thẻ ngân hàng, thẻ tín dụng là a credit card.", ex: { en: "Can I pay by card?", vi: "Tôi trả bằng thẻ được không?" } },
          { t: "vocab", en: "save", vi: "tiết kiệm", pos: "Động từ", ipa: "/seɪv/", note: "Cũng có nghĩa cứu, và lưu tệp.", ex: { en: "I save money every month.", vi: "Tháng nào tôi cũng tiết kiệm." } },
          { t: "vocab", en: "spend", vi: "tiêu tiền", pos: "Động từ", ipa: "/spend/", note: "Tiêu vào việc gì: spend money ON something.", ex: { en: "I spend too much on food.", vi: "Tôi tiêu quá nhiều vào ăn uống." } },
          { t: "vocab", en: "borrow", vi: "mượn, vay", pos: "Động từ", ipa: "/ˈbɑːroʊ/", note: "Borrow là mình lấy về; lend là mình cho mượn.", ex: { en: "Can I borrow some money?", vi: "Cho tôi vay ít tiền được không?" } },
          { t: "vocab", en: "lend", vi: "cho vay", pos: "Động từ", ipa: "/lend/", note: "Ngược với borrow. Rất hay nhầm hai từ này.", ex: { en: "He lent me his book.", vi: "Anh ấy cho tôi mượn sách." } },
          { t: "vocab", en: "account", vi: "tài khoản", pos: "Danh từ", ipa: "/əˈkaʊnt/", note: "Mở tài khoản là open an account.", ex: { en: "I opened a bank account.", vi: "Tôi đã mở tài khoản ngân hàng." } },
          { t: "vocab", en: "discount", vi: "giảm giá", pos: "Danh từ", ipa: "/ˈdɪskaʊnt/", note: "Xin giảm giá: Can I have a discount?", ex: { en: "Is there a discount?", vi: "Có giảm giá không ạ?" } },
          { t: "vocab", en: "receipt", vi: "hoá đơn", pos: "Danh từ", ipa: "/rɪˈsiːt/", note: "Chữ p CÂM. Đọc là ri-XÍT.", ex: { en: "Can I have the receipt?", vi: "Cho tôi xin hoá đơn." } },
        ],
        sentences: [
          { en: "Can I pay by card", vi: "Tôi trả bằng thẻ được không" },
          { en: "I save money every month", vi: "Tháng nào tôi cũng tiết kiệm" },
          { en: "Is there a discount", vi: "Có giảm giá không" },
          { en: "Can I have the receipt", vi: "Cho tôi xin hoá đơn" },
        ]
      },
      { id: "b1u3cp", title: "Ôn tập chương 3", checkpoint: true },
    ]
  },

  {
    id: "b1u4", title: "Thiên nhiên & Giao thông",
    goal: "Phong cảnh thiên nhiên và vốn từ đi lại, du lịch ở mức sâu hơn.",
    lessons: [
      {
        id: "b1u4l1", title: "Phong cảnh thiên nhiên",
        goal: "10 từ tả cảnh quan tự nhiên.",
        teach: [
          { t: "intro", title: "Bài này bạn sẽ học gì?", body: "Tả một chuyến đi, một bức ảnh phong cảnh — cần vốn từ về núi non sông biển chứ không chỉ nói 'nature'.", bullets: ["10 từ phong cảnh", "Giới từ đi kèm: in the mountains, at the beach", "Tính từ tả cảnh: beautiful, peaceful"] },
          { t: "vocab", en: "river", vi: "dòng sông", pos: "Danh từ", ipa: "/ˈrɪvər/", note: "Bờ sông là a riverbank.", ex: { en: "The river is very long.", vi: "Dòng sông rất dài." } },
          { t: "vocab", en: "sea", vi: "biển", pos: "Danh từ", ipa: "/siː/", note: "Đại dương rộng lớn hơn là ocean.", ex: { en: "We swim in the sea.", vi: "Chúng tôi bơi ở biển." } },
          { t: "vocab", en: "lake", vi: "hồ", pos: "Danh từ", ipa: "/leɪk/", note: "Hồ Gươm tiếng Anh là Hoan Kiem Lake.", ex: { en: "The lake is very calm.", vi: "Mặt hồ rất tĩnh lặng." } },
          { t: "vocab", en: "sky", vi: "bầu trời", pos: "Danh từ", ipa: "/skaɪ/", note: "Trời quang là a clear sky.", ex: { en: "The sky is clear today.", vi: "Hôm nay trời quang." } },
          { t: "vocab", en: "island", vi: "hòn đảo", pos: "Danh từ", ipa: "/ˈaɪlənd/", note: "Chữ s CÂM, đọc là AI-lần.", ex: { en: "Phu Quoc is a famous island.", vi: "Phú Quốc là hòn đảo nổi tiếng." } },
          { t: "vocab", en: "valley", vi: "thung lũng", pos: "Danh từ", ipa: "/ˈvæli/", note: "Vùng đất thấp giữa hai dãy núi.", ex: { en: "The valley is full of flowers.", vi: "Thung lũng đầy hoa." } },
          { t: "vocab", en: "waterfall", vi: "thác nước", pos: "Danh từ", ipa: "/ˈwɔːtərfɔːl/", note: "Ghép water + fall.", ex: { en: "The waterfall is beautiful.", vi: "Thác nước rất đẹp." } },
          { t: "vocab", en: "cave", vi: "hang động", pos: "Danh từ", ipa: "/keɪv/", note: "Việt Nam có Sơn Đoòng, hang động lớn nhất thế giới.", ex: { en: "We explored a big cave.", vi: "Chúng tôi khám phá một hang động lớn." } },
          { t: "vocab", en: "coast", vi: "bờ biển", pos: "Danh từ", ipa: "/koʊst/", note: "Vùng đất dọc theo biển.", ex: { en: "The coast is very long.", vi: "Bờ biển rất dài." } },
          { t: "vocab", en: "peaceful", vi: "yên bình", pos: "Tính từ", ipa: "/ˈpiːsfl/", note: "Thường dùng tả phong cảnh làng quê, núi rừng.", ex: { en: "The countryside is peaceful.", vi: "Miền quê rất yên bình." } },
        ],
        sentences: [
          { en: "The river is very long", vi: "Dòng sông rất dài" },
          { en: "We swim in the sea", vi: "Chúng tôi bơi ở biển" },
          { en: "Phu Quoc is a famous island", vi: "Phú Quốc là hòn đảo nổi tiếng" },
          { en: "The countryside is peaceful", vi: "Miền quê rất yên bình" },
        ]
      },
      {
        id: "b1u4l2", title: "Đi lại & Du lịch",
        goal: "10 từ về phương tiện và thủ tục đi lại.",
        teach: [
          { t: "intro", title: "Bài này bạn sẽ học gì?", body: "Ra sân bay, ra bến xe, đặt vé — vốn từ giao thông ở mức sâu hơn chỉ gọi tên xe cộ.", bullets: ["10 từ đi lại, du lịch", "Đặt vé: book a ticket", "Vé một chiều / khứ hồi"] },
          { t: "vocab", en: "journey", vi: "hành trình", pos: "Danh từ", ipa: "/ˈdʒɜːrni/", note: "Chuyến đi dài, trang trọng hơn trip.", ex: { en: "It was a long journey.", vi: "Đó là một hành trình dài." } },
          { t: "vocab", en: "passenger", vi: "hành khách", pos: "Danh từ", ipa: "/ˈpæsɪndʒər/", note: "Người đi trên xe/tàu/máy bay, không phải người lái.", ex: { en: "The bus was full of passengers.", vi: "Xe buýt đầy hành khách." } },
          { t: "vocab", en: "luggage", vi: "hành lý", pos: "Danh từ", ipa: "/ˈlʌɡɪdʒ/", note: "KHÔNG đếm được, không nói luggages.", ex: { en: "My luggage is heavy.", vi: "Hành lý của tôi nặng." } },
          { t: "vocab", en: "platform", vi: "sân ga", pos: "Danh từ", ipa: "/ˈplætfɔːrm/", note: "Nơi đứng chờ tàu ở nhà ga.", ex: { en: "The train is on platform 2.", vi: "Tàu ở sân ga số 2." } },
          { t: "vocab", en: "motorbike", vi: "xe máy", pos: "Danh từ", ipa: "/ˈmoʊtərbaɪk/", note: "Mỹ hay gọi là motorcycle.", ex: { en: "I go to work by motorbike.", vi: "Tôi đi làm bằng xe máy." } },
          { t: "vocab", en: "taxi", vi: "xe taxi", pos: "Danh từ", ipa: "/ˈtæksi/", note: "Gọi taxi là call a taxi.", ex: { en: "Let's take a taxi.", vi: "Mình bắt taxi đi." } },
          { t: "vocab", en: "book a ticket", vi: "đặt vé", pos: "Cụm động từ", ipa: "/bʊk ə ˈtɪkɪt/", note: "Book ở đây là động từ đặt trước, không phải quyển sách.", ex: { en: "I booked a ticket online.", vi: "Tôi đã đặt vé qua mạng." } },
          { t: "vocab", en: "one-way ticket", vi: "vé một chiều", pos: "Danh từ", ipa: "/wʌn weɪ ˈtɪkɪt/", note: "Ngược lại là a return ticket / round-trip ticket.", ex: { en: "I need a one-way ticket.", vi: "Tôi cần một vé một chiều." } },
          { t: "vocab", en: "passport", vi: "hộ chiếu", pos: "Danh từ", ipa: "/ˈpæspɔːrt/", note: "Đi nước ngoài bắt buộc phải mang theo.", ex: { en: "Do not forget your passport.", vi: "Đừng quên mang hộ chiếu." } },
          { t: "vocab", en: "depart", vi: "khởi hành", pos: "Động từ", ipa: "/dɪˈpɑːrt/", note: "Trang trọng hơn leave. Danh từ là departure.", ex: { en: "The train departs at nine.", vi: "Tàu khởi hành lúc chín giờ." } },
        ],
        sentences: [
          { en: "It was a long journey", vi: "Đó là một hành trình dài" },
          { en: "My luggage is heavy", vi: "Hành lý của tôi nặng" },
          { en: "I booked a ticket online", vi: "Tôi đã đặt vé qua mạng" },
          { en: "There was a two-hour delay", vi: "Chuyến đi bị chậm hai tiếng" },
        ]
      },
      { id: "b1u4cp", title: "Ôn tập chương 4", checkpoint: true },
    ]
  },
]
};
