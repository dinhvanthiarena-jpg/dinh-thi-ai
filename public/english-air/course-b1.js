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
  }

  ]
};
