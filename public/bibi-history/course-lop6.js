/* ============================================================
   BiBi History — nội dung Lớp 6, Chương 1: "Vì sao phải học lịch sử?"
   Bám sát SGK Lịch sử và Địa lí 6 (Kết nối tri thức), Bài 1–3.
   ============================================================ */
(function(){
"use strict";

window.LESSONS = window.LESSONS || {};

Object.assign(window.LESSONS, {

  "g6-0-0": { title:"Lịch sử và cuộc sống", slides:[
    {type:"intro", text:"Chào bạn! Trước khi ngược dòng thời gian, BiBi muốn hỏi: lịch sử là gì, và vì sao chúng ta phải học nó? Cùng tìm hiểu nhé."},
    {type:"fact", icon:"book", meta:"Khái niệm", title:"Lịch sử là gì?", text:"Lịch sử là những gì đã diễn ra trong quá khứ, bao gồm mọi hoạt động của con người từ khi xuất hiện đến nay. Lịch sử còn là một khoa học tìm hiểu, khôi phục lại quá khứ đó một cách trung thực nhất — gọi là Sử học."},
    {type:"fact", icon:"compass", meta:"Ý nghĩa", title:"Vì sao phải học lịch sử?", text:"Học lịch sử giúp ta biết được cội nguồn của bản thân, gia đình, dòng họ, dân tộc; hiểu được tổ tiên đã lao động, sáng tạo và đấu tranh như thế nào để có được đất nước hôm nay. Từ đó, ta rút ra bài học kinh nghiệm cho hiện tại và tương lai."},
    {type:"marker", tag:"Biển sử liệu", text:["Người xưa có câu: \"Dân ta phải biết sử ta / Cho tường gốc tích nước nhà Việt Nam\" (Hồ Chí Minh).", "Học lịch sử không phải để ghi nhớ ngày tháng, mà để hiểu ý nghĩa của những gì đã xảy ra và biết ơn những người đi trước."]},
    {type:"quiz-mc", q:"Học lịch sử đem lại điều gì cho mỗi người?", options:["Biết cội nguồn, rút bài học cho hiện tại và tương lai","Chỉ để phục vụ thi cử","Chỉ dành riêng cho nhà nghiên cứu","Không có nhiều ý nghĩa thực tế"], correct:0},
  ]},

  "g6-0-1": { title:"Dựa vào đâu để biết và phục dựng lại lịch sử?", slides:[
    {type:"intro", text:"Không ai sống ở thời Vua Hùng để kể lại cho chúng ta. Vậy các nhà sử học dựa vào đâu để biết chuyện đã xảy ra hàng nghìn năm trước?"},
    {type:"fact", icon:"artifact", meta:"Tư liệu hiện vật", title:"Di tích, đồ vật còn lại", text:"Đó là các di tích, đồ vật của người xưa còn lưu giữ được như trống đồng Đông Sơn, thành Cổ Loa, bia đá, công cụ lao động... Đây là nguồn sử liệu \"nói\" trực tiếp bằng chất liệu, hình dáng của chính nó."},
    {type:"fact", icon:"scroll", meta:"Tư liệu chữ viết", title:"Sách sử, văn bản, bia kí", text:"Là các bản ghi, sách sử được viết lại như Đại Việt sử ký toàn thư, văn bia Văn Miếu, sắc phong... Tư liệu chữ viết cho biết thông tin cụ thể, chi tiết hơn về đời sống và các sự kiện."},
    {type:"fact", icon:"chat", meta:"Tư liệu truyền miệng", title:"Truyền thuyết, ca dao, cổ tích", text:"Là những câu chuyện, truyền thuyết được kể truyền đời từ thế hệ này sang thế hệ khác, như truyền thuyết Con Rồng Cháu Tiên, Thánh Gióng, Sơn Tinh — Thuỷ Tinh."},
    {type:"marker", tag:"Biển sử liệu", text:["Trong ba loại trên, tư liệu gốc — ra đời vào đúng thời điểm sự kiện diễn ra (ví dụ một chiếc trống đồng đúc thời Đông Sơn) — được coi là nguồn đáng tin cậy nhất.", "Nhà sử học thường phải đối chiếu nhiều nguồn tư liệu khác nhau mới phục dựng được sự thật lịch sử chính xác."]},
    {type:"quiz-mc", q:"Truyền thuyết Con Rồng Cháu Tiên thuộc loại tư liệu lịch sử nào?", options:["Tư liệu truyền miệng","Tư liệu chữ viết","Tư liệu hiện vật","Tư liệu gốc duy nhất"], correct:0},
    {type:"quiz-fill", sentence:["Ba loại tư liệu lịch sử chính là tư liệu ",", tư liệu chữ viết và tư liệu ","."], blanks:["hiện vật","truyền miệng"], bank:["hiện vật","truyền miệng","gốc","số liệu"]},
  ]},

  "g6-0-2": { title:"Thời gian trong lịch sử", slides:[
    {type:"intro", text:"Sự kiện nào cũng gắn với một mốc thời gian cụ thể. Vậy người xưa và ngày nay tính thời gian như thế nào?"},
    {type:"fact", icon:"moon", meta:"Cách tính cổ truyền", title:"Âm lịch và Dương lịch", text:"Âm lịch tính theo chu kì Mặt Trăng quay quanh Trái Đất — người xưa ở phương Đông (trong đó có Việt Nam) thường dùng loại lịch này. Dương lịch tính theo chu kì Trái Đất quay quanh Mặt Trời, phổ biến ở phương Tây."},
    {type:"fact", icon:"sun", meta:"Cách tính chung", title:"Công lịch", text:"Công lịch (dương lịch cải tiến) được cả thế giới dùng chung, lấy năm ra đời của Chúa Giê-su làm năm đầu tiên. Những năm trước đó gọi là \"trước Công nguyên\" (viết tắt TCN), những năm sau gọi là \"Công nguyên\" (CN)."},
    {type:"marker", tag:"Biển sử liệu", text:["1 thế kỉ = 100 năm; 1 thiên niên kỉ = 1.000 năm.", "Thời gian trước Công nguyên tính ngược: số càng lớn thì càng xa xưa (ví dụ năm 700 TCN xảy ra trước năm 300 TCN)."]},
    {type:"quiz-mc", q:"Một thế kỉ có bao nhiêu năm?", options:["100 năm","10 năm","1.000 năm","50 năm"], correct:0},
    {type:"quiz-fill", sentence:["Những năm trước mốc Công lịch được gọi là năm ",", viết tắt là ","."], blanks:["trước Công nguyên","TCN"], bank:["trước Công nguyên","TCN","sau Công nguyên","SCN"]},
  ]},

  "g6-1-0": { title:"Nguồn gốc loài người", slides:[
    {type:"intro", text:"Con người từ đâu mà có? Đây là câu hỏi các nhà khảo cổ đã mất hàng trăm năm đi tìm câu trả lời. Cùng BiBi lần theo dấu vết nhé!"},
    {type:"fact", icon:"group", meta:"Người tối cổ", title:"Bước đi đầu tiên", text:"Khoảng 4–6 triệu năm trước, ở châu Phi, một loài vượn cổ đã tiến hoá thành Người tối cổ: biết đứng thẳng và đi bằng hai chân, hai tay được giải phóng để cầm nắm, biết ghè đẽo đá làm công cụ thô sơ."},
    {type:"fact", icon:"axe", meta:"Người tinh khôn", title:"Hoàn thiện dần qua thời gian", text:"Khoảng 150.000 năm trước, Người tinh khôn (Homo sapiens) xuất hiện, có cấu tạo cơ thể gần giống con người ngày nay: hộp sọ lớn hơn, biết chế tác công cụ tinh xảo, có tiếng nói và đời sống tinh thần phong phú hơn hẳn Người tối cổ."},
    {type:"marker", tag:"Biển sử liệu", text:["Từ châu Phi, Người tối cổ rồi Người tinh khôn dần di cư và lan toả ra khắp các châu lục khác — đây là lý do vì sao dấu tích của họ được tìm thấy ở nhiều nơi trên thế giới.", "Bằng chứng chủ yếu đến từ hoá thạch xương và công cụ đá tìm được qua khảo cổ học."]},
    {type:"quiz-mc", q:"Người tối cổ khác biệt gì so với loài vượn trước đó?", options:["Đã biết đứng thẳng, đi bằng hai chân và ghè đẽo đá làm công cụ","Đã biết trồng lúa nước","Đã biết luyện kim loại","Đã biết xây thành quách"], correct:0},
  ]},

  "g6-1-1": { title:"Xã hội nguyên thuỷ", slides:[
    {type:"intro", text:"Khi chưa có nhà nước, chưa có vua quan, con người nguyên thuỷ đã sống và lao động cùng nhau như thế nào?"},
    {type:"fact", icon:"group", meta:"Tổ chức xã hội", title:"Từ bầy người đến thị tộc", text:"Ban đầu con người sống theo bầy (bầy người nguyên thuỷ), sau đó tiến lên thị tộc — một nhóm người có chung dòng máu, cùng nhau lao động và cùng hưởng thành quả. Nhiều thị tộc sống gần nhau hợp thành bộ lạc."},
    {type:"fact", icon:"axe", meta:"Đời sống kinh tế", title:"Hái lượm và săn bắt", text:"Công cụ lao động chủ yếu làm bằng đá (nên giai đoạn này gọi là thời đại đồ đá). Con người sống chủ yếu bằng hái lượm quả, rễ cây và săn bắt thú rừng, biết dùng lửa để sưởi ấm và nướng chín thức ăn."},
    {type:"marker", tag:"Biển sử liệu", text:["Xã hội nguyên thuỷ chưa có của riêng (tư hữu): thức ăn kiếm được đem chia đều cho mọi thành viên trong thị tộc.", "Vì vậy, đây còn được gọi là xã hội \"công bằng, bình đẳng nguyên thuỷ\"."]},
    {type:"quiz-mc", q:"Thị tộc là gì?", options:["Nhóm người có chung dòng máu, cùng lao động và hưởng thành quả","Một triều đại phong kiến","Một thành phố cổ đại","Một loại công cụ bằng đá"], correct:0},
    {type:"quiz-fill", sentence:["Trong xã hội nguyên thuỷ, của cải làm ra được ",", vì xã hội chưa có ","."], blanks:["chia đều","tư hữu"], bank:["chia đều","tư hữu","cất giữ riêng","vua quan"]},
  ]},

  "g6-1-2": { title:"Sự chuyển biến và phân hoá của xã hội nguyên thuỷ", slides:[
    {type:"intro", text:"Điều gì đã khiến xã hội nguyên thuỷ - vốn công bằng, chia đều của cải - dần tan rã? Câu trả lời nằm ở một phát minh quan trọng."},
    {type:"fact", icon:"axe", meta:"Phát minh quan trọng", title:"Công cụ bằng kim loại", text:"Khoảng 4.000 năm TCN, con người phát hiện ra cách chế tác công cụ bằng kim loại (đồng, sau đó là sắt) thay cho đá. Công cụ kim loại bền và sắc hơn nhiều, giúp việc khai hoang, cày cấy, chăn nuôi trở nên dễ dàng và hiệu quả hơn hẳn."},
    {type:"fact", icon:"coins", meta:"Hệ quả xã hội", title:"Của cải dư thừa và tư hữu", text:"Năng suất lao động tăng lên khiến của cải làm ra ngày càng dư thừa. Một số người đứng đầu thị tộc, bộ lạc chiếm phần của cải dư thừa đó làm của riêng — chế độ tư hữu xuất hiện."},
    {type:"marker", tag:"Biển sử liệu", text:["Khi có người giàu, người nghèo, xã hội nguyên thuỷ dựa trên sự bình đẳng dần tan rã.", "Đây chính là bước ngoặt dẫn tới sự ra đời của giai cấp và nhà nước — mở đầu cho các nền văn minh cổ đại mà chúng ta sẽ học ở chương tiếp theo."]},
    {type:"quiz-mc", q:"Điều gì đã làm xuất hiện chế độ tư hữu, chấm dứt sự bình đẳng của xã hội nguyên thuỷ?", options:["Của cải dư thừa nhờ công cụ kim loại","Sự xuất hiện của chữ viết","Việc xây dựng các kim tự tháp","Các cuộc chiến tranh giữa bộ lạc"], correct:0},
    {type:"quiz-fill", sentence:["Công cụ bằng ","xuất hiện khoảng 4.000 năm TCN đã giúp tăng năng suất lao động, dẫn tới của cải dư thừa và chế độ ","."], blanks:["kim loại","tư hữu"], bank:["kim loại","tư hữu","đá","chung"]},
  ]},

  "g6-2-0": { title:"Ai Cập và Lưỡng Hà cổ đại", slides:[
    {type:"intro", text:"Hai nền văn minh cổ xưa nhất loài người đều mọc lên bên những dòng sông lớn. Cùng BiBi ghé thăm Ai Cập và Lưỡng Hà nhé!"},
    {type:"fact", icon:"pyramid", meta:"Ai Cập cổ đại", title:"Quà tặng của sông Nin", text:"Hình thành khoảng 3200 TCN bên sông Nin. Lũ sông hằng năm bồi phù sa màu mỡ cho nông nghiệp. Đứng đầu nhà nước là Pharaon nắm quyền lực tối cao. Người Ai Cập giỏi kiến trúc (kim tự tháp, tượng Nhân sư) và sáng tạo chữ tượng hình khắc trên giấy Pa-pi-rút."},
    {type:"fact", icon:"scroll", meta:"Lưỡng Hà cổ đại", title:"Vùng đất giữa hai dòng sông", text:"Lưỡng Hà nằm giữa sông Ti-grơ và Ơ-phrát (nay thuộc I-rắc), hình thành nhà nước từ khoảng 3500 TCN. Người Lưỡng Hà sáng tạo chữ hình nêm khắc trên đất sét và bộ luật thành văn cổ nhất thế giới — Luật Ha-mu-ra-bi."},
    {type:"marker", tag:"Biển sử liệu", text:["Cả Ai Cập và Lưỡng Hà đều là \"văn minh lưu vực sông\": nông nghiệp phát triển nhờ phù sa màu mỡ, nên nhà nước ra đời rất sớm để tổ chức làm thuỷ lợi, đắp đê.", "Đây là hai trong số những nhà nước đầu tiên của loài người, sớm hơn cả nước Văn Lang của người Việt hàng nghìn năm."]},
    {type:"quiz-mc", q:"Luật Ha-mu-ra-bi — bộ luật thành văn cổ nhất thế giới — thuộc về nền văn minh nào?", options:["Lưỡng Hà","Ai Cập","Hy Lạp","Trung Quốc"], correct:0},
  ]},

  "g6-2-1": { title:"Ấn Độ cổ đại", slides:[
    {type:"intro", text:"Vì sao ngày nay cả thế giới dùng chung một bộ chữ số? Câu trả lời bắt đầu từ Ấn Độ cổ đại đấy."},
    {type:"fact", icon:"wave", meta:"Vị trí hình thành", title:"Lưu vực sông Ấn, sông Hằng", text:"Văn minh Ấn Độ cổ đại hình thành khoảng 2500 TCN bên hai con sông lớn: sông Ấn và sông Hằng. Đứng đầu nhà nước là vua, được cho là có nguồn gốc thần thánh."},
    {type:"fact", icon:"group", meta:"Xã hội", title:"Chế độ đẳng cấp Vác-na", text:"Xã hội Ấn Độ cổ chia thành 4 đẳng cấp (Vác-na) rất khắc nghiệt: Brahman (tăng lữ), Ksatriya (quý tộc, chiến binh), Vaisya (nông dân, thợ thủ công, thương nhân) và Shudra (người làm thuê, nô lệ) — người đẳng cấp dưới không được kết hôn hay đổi nghề sang đẳng cấp trên."},
    {type:"heritage", icon:"temple", title:"Chữ số 0 và hai tôn giáo lớn", text:"Người Ấn Độ cổ đại phát minh ra hệ chữ số ta dùng ngày nay (gồm cả số 0!) mà thế giới hay gọi nhầm là \"chữ số Ả Rập\". Đây cũng là quê hương của Hin-đu giáo và Phật giáo — hai tôn giáo có ảnh hưởng sâu rộng tới nhiều nước châu Á, trong đó có Việt Nam."},
    {type:"quiz-mc", q:"Người Ấn Độ cổ đại có đóng góp đặc biệt nào cho toán học thế giới?", options:["Phát minh ra hệ chữ số, gồm cả số 0","Xây dựng kim tự tháp","Sáng tạo chữ hình nêm","Đặt ra Luật Ha-mu-ra-bi"], correct:0},
    {type:"quiz-fill", sentence:["Xã hội Ấn Độ cổ đại chia thành 4 đẳng cấp gọi là ",", đây cũng là quê hương của Hin-đu giáo và ","."], blanks:["Vác-na","Phật giáo"], bank:["Vác-na","Phật giáo","Nho giáo","bộ lạc"]},
  ]},

  "g6-2-2": { title:"Trung Quốc từ thời cổ đại đến thế kỉ VII", slides:[
    {type:"intro", text:"Vạn Lý Trường Thành, la bàn, giấy viết... rất nhiều thứ quen thuộc hôm nay bắt nguồn từ Trung Quốc cổ đại. Khám phá cùng BiBi nào!"},
    {type:"fact", icon:"crown", meta:"Nhân vật · Tần Thuỷ Hoàng", title:"Người thống nhất Trung Quốc", text:"Sau các triều Hạ, Thương, Chu, năm 221 TCN Tần Thuỷ Hoàng thống nhất Trung Quốc, tự xưng là hoàng đế đầu tiên. Ông cho nối liền và xây dựng Vạn Lý Trường Thành để ngăn các bộ tộc phương Bắc xâm lấn."},
    {type:"fact", icon:"scroll", meta:"Thành tựu", title:"Con đường tơ lụa & phát minh lớn", text:"Sang thời Hán, \"Con đường tơ lụa\" hình thành, kết nối buôn bán giữa Trung Quốc với phương Tây. Người Trung Quốc cổ đại còn để lại chữ Hán, kĩ thuật làm giấy và la bàn — những phát minh ảnh hưởng tới cả thế giới."},
    {type:"marker", tag:"Biển sử liệu", text:["Giai đoạn này kết thúc khi nhà Tuỳ thống nhất Trung Quốc năm 581, mở đầu thời kì trung đại.", "Trong hơn 1.000 năm Bắc thuộc, các triều đại Trung Quốc thời kì này (Hán, Ngô, Đường...) từng đô hộ nước ta — nội dung này Việt Nam sẽ học kĩ ở chương 5."]},
    {type:"quiz-mc", q:"Ai là người thống nhất Trung Quốc và xưng là hoàng đế đầu tiên?", options:["Tần Thuỷ Hoàng","Hán Vũ Đế","Chu Văn Vương","Đường Thái Tông"], correct:0},
  ]},

  "g6-2-3": { title:"Hy Lạp và La Mã cổ đại", slides:[
    {type:"intro", text:"Olympic, nền dân chủ, những đấu trường hùng vĩ — tất cả đều bắt nguồn từ Hy Lạp và La Mã cổ đại. Cùng BiBi khám phá châu Âu thời cổ đại nhé!"},
    {type:"fact", icon:"temple", meta:"Hy Lạp cổ đại", title:"Thành bang và nền dân chủ", text:"Hy Lạp hình thành trên bán đảo và nhiều đảo ở Địa Trung Hải, địa hình chia cắt nên có nhiều thành bang (như A-ten, Xpác-ta) độc lập với nhau. A-ten là nơi ra đời nền dân chủ đầu tiên trong lịch sử — công dân nam tự do được tham gia bầu cử, biểu quyết việc nước."},
    {type:"fact", icon:"temple", meta:"La Mã cổ đại", title:"Từ thành bang tới đế chế", text:"Bắt đầu từ một thành bang nhỏ ở bán đảo I-ta-li-a, La Mã lớn mạnh thành đế chế rộng khắp Địa Trung Hải. Người La Mã giỏi về luật pháp (nền tảng cho luật pháp châu Âu sau này) và xây dựng: đường sá, hệ thống dẫn nước, đấu trường Cô-li-dê."},
    {type:"marker", tag:"Biển sử liệu", text:["Đại hội thể thao Ô-lim-pích ngày nay bắt nguồn từ lễ hội thể thao cổ Hy Lạp tổ chức 4 năm một lần để tôn vinh thần Dớt.", "Nhiều nền dân chủ hiện đại trên thế giới vẫn lấy cảm hứng từ mô hình dân chủ thành bang A-ten hơn 2.000 năm trước."]},
    {type:"quiz-mc", q:"Thành bang nào của Hy Lạp cổ đại được coi là nơi khai sinh nền dân chủ?", options:["A-ten","Xpác-ta","Rô-ma","Tơ-roa"], correct:0},
    {type:"quiz-fill", sentence:["Người ","xây đấu trường Cô-li-dê nổi tiếng, còn người Hy Lạp mở ra đại hội thể thao ","đầu tiên."], blanks:["La Mã","Ô-lim-pích"], bank:["La Mã","Ô-lim-pích","Ai Cập","bóng đá"]},
  ]},

  "g6-3-0": { title:"Các quốc gia sơ kì ở Đông Nam Á", slides:[
    {type:"intro", text:"Vì sao Đông Nam Á được ví như \"ngã tư đường\" của thế giới cổ đại? Cùng BiBi tìm hiểu vùng đất mà Việt Nam là một phần trong đó."},
    {type:"fact", icon:"wave", meta:"Vị trí đặc biệt", title:"Ngã tư đường hàng hải", text:"Đông Nam Á nằm trên con đường biển nối liền Ấn Độ Dương và Thái Bình Dương, là nơi giao thoa của các nền văn minh Ấn Độ và Trung Quốc — thuận lợi cho giao lưu buôn bán và văn hoá từ rất sớm."},
    {type:"fact", icon:"crown", meta:"Các quốc gia sơ kì", title:"Những nhà nước đầu tiên", text:"Từ đầu Công nguyên, nhờ nông nghiệp lúa nước phát triển, cư dân Đông Nam Á đã lập nên các quốc gia sơ kì đầu tiên: Văn Lang – Âu Lạc và Chăm-pa (trên đất Việt Nam), Phù Nam (hạ lưu sông Mê Công), cùng nhiều tiểu quốc trên các đảo Gia-va, Xu-ma-tơ-ra."},
    {type:"quiz-mc", q:"Nhờ điều gì mà các quốc gia sơ kì ở Đông Nam Á hình thành từ đầu Công nguyên?", options:["Nông nghiệp lúa nước phát triển và giao thương đường biển thuận lợi","Phát minh ra chữ số 0","Xây dựng Vạn Lý Trường Thành","Chế độ đẳng cấp Vác-na"], correct:0},
  ]},

  "g6-3-1": { title:"Các vương quốc phong kiến Đông Nam Á (TK VII–X)", slides:[
    {type:"intro", text:"Từ những quốc gia nhỏ ban đầu, Đông Nam Á dần lớn mạnh thành các vương quốc thịnh vượng. Cùng xem điều gì đã thay đổi nhé."},
    {type:"fact", icon:"wave", meta:"Sự phát triển", title:"Vương quốc lớn mạnh hơn", text:"Từ thế kỉ VII đến X, các quốc gia sơ kì phát triển thành những vương quốc phong kiến rộng lớn và thịnh vượng hơn, tiêu biểu như Sri Vi-giay-a (đảo Xu-ma-tơ-ra) và Chân Lạp (tiền thân Cam-pu-chia ngày nay)."},
    {type:"fact", icon:"coins", meta:"Kinh tế", title:"Con đường tơ lụa trên biển", text:"Kinh tế nông nghiệp kết hợp buôn bán đường biển phát triển mạnh. Nhiều vương quốc Đông Nam Á trở thành điểm dừng chân sầm uất trên tuyến hàng hải nối Ấn Độ với Trung Quốc, được ví như \"con đường tơ lụa trên biển\"."},
    {type:"quiz-mc", q:"Vương quốc nào ở đảo Xu-ma-tơ-ra phát triển thịnh vượng nhờ buôn bán đường biển (TK VII–X)?", options:["Sri Vi-giay-a","Chăm-pa","Phù Nam","Âu Lạc"], correct:0},
  ]},

  "g6-3-2": { title:"Giao lưu văn hoá ở Đông Nam Á", slides:[
    {type:"intro", text:"Đông Nam Á tiếp nhận rất nhiều từ văn hoá Ấn Độ và Trung Quốc, nhưng tại sao mỗi nước trong khu vực vẫn giữ được bản sắc riêng?"},
    {type:"fact", icon:"scroll", meta:"Ảnh hưởng bên ngoài", title:"Tiếp nhận từ Ấn Độ và Trung Quốc", text:"Qua con đường buôn bán, Đông Nam Á tiếp thu chữ Phạn và tôn giáo Hin-đu, Phật giáo từ Ấn Độ; chữ Hán, Nho giáo và một số kĩ thuật từ Trung Quốc."},
    {type:"heritage", icon:"temple", title:"Tiếp biến chứ không rập khuôn", text:"Điều đặc biệt là các dân tộc Đông Nam Á không sao chép nguyên xi mà \"tiếp biến\" — chọn lọc, biến đổi cho phù hợp với văn hoá bản địa. Đó là lý do vì sao đền tháp Chăm, chùa Việt hay đền Ăng-co ở Cam-pu-chia dù chịu ảnh hưởng Ấn Độ vẫn mang phong cách rất riêng."},
    {type:"quiz-mc", q:"\"Tiếp biến văn hoá\" ở Đông Nam Á nghĩa là gì?", options:["Tiếp nhận có chọn lọc rồi biến đổi cho phù hợp với văn hoá bản địa","Sao chép y nguyên văn hoá nước ngoài","Không tiếp nhận bất cứ ảnh hưởng nào từ bên ngoài","Chỉ tiếp nhận văn hoá Trung Quốc"], correct:0},
  ]},

  "g6-4-0": { title:"Nhà nước Văn Lang, Âu Lạc", slides:[
    {type:"intro", text:"Ai là vị vua đầu tiên của người Việt? Bài này BiBi đưa bạn về thời lập quốc — Văn Lang rồi Âu Lạc."},
    {type:"fact", icon:"crown", meta:"Nhân vật · Hùng Vương", title:"Nhà nước Văn Lang", text:"Vua Hùng lập ra nước Văn Lang — nhà nước đầu tiên của người Việt, kinh đô ở Phong Châu (nay thuộc Phú Thọ). Vua chia đất nước làm 15 bộ; đứng đầu mỗi bộ là Lạc tướng, giúp việc vua ở trung ương có các Lạc hầu."},
    {type:"fact", icon:"pyramid", meta:"Sự kiện · An Dương Vương", title:"Nước Âu Lạc và thành Cổ Loa", text:"Năm 208 TCN, Thục Phán hợp nhất bộ lạc Âu Việt và Lạc Việt, lập nước Âu Lạc, xưng là An Dương Vương, đóng đô ở Cổ Loa (nay thuộc Đông Anh, Hà Nội) — một thành có cấu trúc ba vòng hình xoáy trôn ốc rất độc đáo thời cổ đại."},
    {type:"heritage", icon:"drum", title:"Giỗ Tổ Hùng Vương", text:"\"Dù ai đi ngược về xuôi / Nhớ ngày giỗ Tổ mùng mười tháng ba.\" Mỗi năm vào 10/3 âm lịch, người Việt khắp nơi hướng về Đền Hùng (Phú Thọ) tưởng nhớ công lao dựng nước của các Vua Hùng — Tín ngưỡng thờ cúng Hùng Vương đã được UNESCO công nhận là Di sản văn hoá phi vật thể đại diện của nhân loại."},
    {type:"quiz-mc", q:"Kinh đô của nước Văn Lang đặt ở đâu?", options:["Phong Châu","Cổ Loa","Thăng Long","Hoa Lư"], correct:0},
    {type:"quiz-fill", sentence:["Thục Phán hợp nhất Âu Việt và Lạc Việt, lập nước ",", đóng đô ở thành ","."], blanks:["Âu Lạc","Cổ Loa"], bank:["Âu Lạc","Cổ Loa","Văn Lang","Phong Châu"]},
  ]},

  "g6-4-1": { title:"Chính sách cai trị của phong kiến phương Bắc", slides:[
    {type:"intro", text:"Sau khi Âu Lạc rơi vào tay Triệu Đà (179 TCN), nước ta bước vào hơn 1.000 năm bị các triều đại phương Bắc đô hộ. Họ đã cai trị dân ta như thế nào?"},
    {type:"fact", icon:"scroll", meta:"Bộ máy cai trị", title:"Chia quận huyện để cai trị", text:"Các triều đại phong kiến phương Bắc (Hán, Ngô, Tấn, Tuỳ, Đường...) lần lượt chia nước ta thành các quận, huyện, đặt quan lại người Hán cai trị trực tiếp đến tận cấp huyện."},
    {type:"fact", icon:"coins", meta:"Bóc lột kinh tế", title:"Thuế khoá và cống nạp nặng nề", text:"Chính quyền đô hộ đặt ra nhiều thứ thuế, bắt nhân dân ta cống nạp những sản vật quý như ngọc trai, sừng tê, ngà voi, và đưa người sang khai thác vàng bạc, hương liệu."},
    {type:"marker", tag:"Biển sử liệu", text:["Song song với bóc lột kinh tế, chính quyền đô hộ còn thực hiện chính sách đồng hoá: đưa người Hán sang ở lẫn, bắt dân ta theo phong tục, học chữ Hán, nhằm xoá bỏ bản sắc dân tộc Việt.", "Chính sách hà khắc này chính là nguyên nhân bùng nổ hàng loạt cuộc khởi nghĩa mà chúng ta sẽ học ở bài tiếp theo."]},
    {type:"quiz-mc", q:"Ngoài bóc lột thuế khoá, chính quyền đô hộ phương Bắc còn thực hiện chính sách gì với văn hoá người Việt?", options:["Đồng hoá — bắt theo phong tục, học chữ Hán","Khuyến khích giữ nguyên bản sắc Việt","Cho tự trị hoàn toàn","Xây trường học riêng cho người Việt"], correct:0},
  ]},

  "g6-4-2": { title:"Các cuộc khởi nghĩa tiêu biểu trước thế kỉ X", slides:[
    {type:"intro", text:"Hơn 1.000 năm Bắc thuộc không dập tắt được ý chí quật cường của người Việt. Hàng loạt cuộc khởi nghĩa đã nổ ra — cùng điểm qua những cái tên tiêu biểu nhé."},
    {type:"fact", icon:"sword", meta:"Năm 40", title:"Khởi nghĩa Hai Bà Trưng", text:"Trưng Trắc và Trưng Nhị phất cờ khởi nghĩa năm 40, đánh đuổi quân Đông Hán, giành lại độc lập trong 3 năm — cuộc khởi nghĩa lớn đầu tiên của người Việt thời Bắc thuộc, do phụ nữ lãnh đạo."},
    {type:"fact", icon:"sword", meta:"Năm 248 và 542", title:"Bà Triệu và Lý Bí", text:"Năm 248, Bà Triệu khởi nghĩa ở Thanh Hoá với câu nói nổi tiếng về ý chí không cúi đầu. Năm 542, Lý Bí khởi nghĩa thắng lợi, lập ra nước Vạn Xuân — nhà nước độc lập đầu tiên sau Âu Lạc, dù chỉ tồn tại một thời gian."},
    {type:"marker", tag:"Biển sử liệu", text:["Ngoài Hai Bà Trưng, Bà Triệu, Lý Bí, sử sách còn ghi nhận khởi nghĩa Mai Thúc Loan (722) và Phùng Hưng (cuối TK VIII).", "Dù phần lớn các cuộc khởi nghĩa cuối cùng đều bị đàn áp, chúng cho thấy tinh thần đấu tranh bền bỉ chưa từng dứt của người Việt suốt hơn 1.000 năm Bắc thuộc."]},
    {type:"quiz-mc", q:"Ai là người lãnh đạo cuộc khởi nghĩa năm 40, đánh đuổi quân Đông Hán?", options:["Hai Bà Trưng","Bà Triệu","Lý Bí","Ngô Quyền"], correct:0},
    {type:"quiz-fill", sentence:["Năm 542, ","khởi nghĩa thắng lợi và lập ra nước ","— nhà nước độc lập đầu tiên sau Âu Lạc."], blanks:["Lý Bí","Vạn Xuân"], bank:["Lý Bí","Vạn Xuân","Bà Triệu","Văn Lang"]},
  ]},

  "g6-4-3": { title:"Đấu tranh bảo tồn văn hoá dân tộc", slides:[
    {type:"intro", text:"Hơn 1.000 năm bị đô hộ và ép buộc đồng hoá, vì sao người Việt vẫn giữ được tiếng nói và bản sắc riêng của mình?"},
    {type:"fact", icon:"group", meta:"Giữ gìn bản sắc", title:"Tiếng Việt và phong tục vẫn còn", text:"Suốt thời Bắc thuộc, người Việt vẫn kiên trì giữ tiếng nói của dân tộc, duy trì các phong tục như ăn trầu, nhuộm răng đen, thờ cúng tổ tiên, thờ các Vua Hùng — không để bị đồng hoá hoàn toàn."},
    {type:"fact", icon:"scroll", meta:"Tiếp thu có chọn lọc", title:"Việt hoá những gì tiếp nhận được", text:"Người Việt có tiếp thu một số yếu tố như chữ Hán hay kĩ thuật làm giấy, nhưng luôn Việt hoá cho phù hợp với văn hoá bản địa, chứ không rập khuôn theo phương Bắc."},
    {type:"marker", tag:"Biển sử liệu", text:["Sức sống bền bỉ của tiếng Việt và phong tục dân tộc trong hơn 1.000 năm Bắc thuộc là nền tảng quan trọng để Ngô Quyền và các triều đại sau này xây dựng một quốc gia độc lập, có bản sắc riêng."]},
    {type:"quiz-mc", q:"Vì sao người Việt không bị đồng hoá hoàn toàn sau hơn 1.000 năm Bắc thuộc?", options:["Kiên trì giữ tiếng nói, phong tục và chỉ tiếp thu có chọn lọc rồi Việt hoá","Vì chính quyền đô hộ không có chính sách đồng hoá","Vì người Việt sống biệt lập, không tiếp xúc với người Hán","Vì được nhà Hán cho phép tự trị"], correct:0},
  ]},

  "g6-4-4": { title:"Bước ngoặt lịch sử đầu thế kỉ X", slides:[
    {type:"intro", text:"Sau hơn 1.000 năm, thời khắc người Việt giành lại độc lập trọn vẹn đã đến. Đây là một trong những bài học quan trọng nhất của lịch sử dân tộc."},
    {type:"fact", icon:"crown", meta:"Năm 905", title:"Khúc Thừa Dụ giành quyền tự chủ", text:"Năm 905, nhân lúc nhà Đường suy yếu, Khúc Thừa Dụ nổi dậy chiếm thành, xây dựng chính quyền tự chủ của người Việt, mở đầu thời kì tự chủ trước khi giành độc lập hoàn toàn."},
    {type:"fact", icon:"sword", meta:"Năm 938", title:"Chiến thắng Bạch Đằng của Ngô Quyền", text:"Năm 938, Ngô Quyền cho đóng cọc nhọn ngầm dưới lòng sông Bạch Đằng, lợi dụng thuỷ triều đánh tan quân Nam Hán. Chiến thắng này chính thức chấm dứt hơn 1.000 năm Bắc thuộc, mở ra thời kì độc lập tự chủ lâu dài cho dân tộc."},
    {type:"marker", tag:"Biển sử liệu", text:["Sử gia Ngô Thì Sĩ và Lê Văn Hưu sau này đều đánh giá chiến thắng Bạch Đằng năm 938 là mốc \"mở nước\", chấm dứt nghìn năm Bắc thuộc.", "Sau Ngô Quyền, người Việt bước sang thời kì xây dựng và bảo vệ các triều đại độc lập — nội dung các em sẽ học tiếp ở lớp 7."]},
    {type:"quiz-mc", q:"Ai là người đánh tan quân Nam Hán trên sông Bạch Đằng năm 938, chấm dứt hơn 1.000 năm Bắc thuộc?", options:["Ngô Quyền","Khúc Thừa Dụ","Lý Bí","Triệu Đà"], correct:0},
    {type:"quiz-fill", sentence:["Năm 938, Ngô Quyền dùng kế đóng cọc nhọn trên sông ",", đánh tan quân ","."], blanks:["Bạch Đằng","Nam Hán"], bank:["Bạch Đằng","Nam Hán","Cửu Long","Đông Hán"]},
  ]},

  "g6-4-5": { title:"Vương quốc Chăm-pa (TK II–X)", slides:[
    {type:"intro", text:"Ở dải đất miền Trung Việt Nam ngày nay, từng tồn tại một vương quốc cổ rực rỡ với những ngôi tháp gạch nung vẫn còn đứng vững tới hôm nay."},
    {type:"fact", icon:"crown", meta:"Ra đời", title:"Nước Lâm Ấp ra đời", text:"Năm 192, Khu Liên lãnh đạo người dân ở huyện Tượng Lâm nổi dậy, lập ra nước Lâm Ấp — về sau đổi tên thành Chăm-pa, trải dài trên vùng đất miền Trung Việt Nam ngày nay."},
    {type:"heritage", icon:"temple", title:"Đền tháp Chăm và tín ngưỡng Hin-đu", text:"Chịu ảnh hưởng văn hoá Ấn Độ, Chăm-pa theo Hin-đu giáo và để lại nhiều đền tháp bằng gạch nung độc đáo (tiêu biểu như khu di tích Mỹ Sơn), cùng chữ viết Chăm cổ dựa trên chữ Phạn."},
    {type:"marker", tag:"Biển sử liệu", text:["Chăm-pa tồn tại song song với các nhà nước của người Việt (Văn Lang, Âu Lạc, thời Bắc thuộc) trên cùng dải đất Việt Nam ngày nay, cùng góp phần tạo nên bức tranh đa dạng của lịch sử dân tộc."]},
    {type:"quiz-mc", q:"Vương quốc Chăm-pa chịu ảnh hưởng sâu sắc từ nền văn minh nào?", options:["Ấn Độ","Trung Quốc","Ai Cập","La Mã"], correct:0},
  ]},

});
})();
