/* ============================================================
   BiBi History — khung chương trình lớp 4 → lớp 12
   Mục lục chương/bài lấy theo SGK "Kết nối tri thức với cuộc sống"
   (NXB Giáo dục Việt Nam, Chương trình GDPT 2018). Hai bộ sách
   Chân trời sáng tạo / Cánh diều có thể khác tên bài đôi chút
   nhưng mốc kiến thức bắt buộc theo Bộ GD&ĐT là giống nhau.

   scope của mỗi chương: "vn" | "tg" | "both" — chỉ mang tính ghi
   chú (chấm màu trên app), KHÔNG dùng để tách app thành hai nhánh,
   vì SGK thật dạy Việt Nam và thế giới đan xen theo thời gian.

   Bài nào đã có nội dung thật (slides) thì đặt authored:true và
   nội dung nằm ở file course-lopN.js tương ứng, khoá theo id.
   ============================================================ */
(function(){
"use strict";

const CAP = {
  th:   { label:"Tiểu học", color:"#3D8B5F" },
  thcs: { label:"THCS",     color:"#7C2FB8" },
  thpt: { label:"THPT",     color:"#C22D82" },
};

const GRADES = [
  { id:4, cap:"th", title:"Lớp 4",
    note:"Môn Lịch sử và Địa lí — học theo từng vùng miền của Việt Nam, chưa có lịch sử thế giới.",
    chapters:[
      { title:"6 chủ đề theo vùng miền đất nước", scope:"vn", nodes:[
        {id:"g4-0-0", title:"Địa phương em", authored:true},
        {id:"g4-0-1", title:"Trung du và miền núi Bắc Bộ", authored:true},
        {id:"g4-0-2", title:"Đồng bằng Bắc Bộ — Văn Lang, Âu Lạc", authored:true},
        {id:"g4-0-3", title:"Duyên hải miền Trung — Chăm-pa, cố đô Huế", authored:true},
        {id:"g4-0-4", title:"Tây Nguyên", authored:true},
        {id:"g4-0-5", title:"Nam Bộ", authored:true},
      ]},
    ]},
  { id:5, cap:"th", title:"Lớp 5",
    note:"Bắt đầu học lịch sử Việt Nam theo dòng thời gian (chưa có lịch sử thế giới).",
    chapters:[
      { title:"Đất nước và con người Việt Nam", scope:"vn", nodes:[
        {id:"g5-0-0", title:"Vị trí địa lí, lãnh thổ, Quốc kì, Quốc ca", authored:true},
        {id:"g5-0-1", title:"Thiên nhiên Việt Nam", authored:true},
        {id:"g5-0-2", title:"Biển, đảo Việt Nam", authored:true},
        {id:"g5-0-3", title:"Dân cư và dân tộc ở Việt Nam", authored:true},
      ]},
      { title:"Những quốc gia đầu tiên trên lãnh thổ Việt Nam", scope:"vn", nodes:[
        {id:"g5-1-0", title:"Nhà nước Văn Lang, Nhà nước Âu Lạc", authored:true},
        {id:"g5-1-1", title:"Vương quốc Phù Nam", authored:true},
        {id:"g5-1-2", title:"Vương quốc Chăm-pa", authored:true},
        {id:"g5-1-3", title:"Đấu tranh giành độc lập thời kì Bắc thuộc", authored:true},
        {id:"g5-1-4", title:"Ôn tập", review:true},
      ]},
    ]},
  { id:6, cap:"thcs", title:"Lớp 6",
    note:"Từ lớp 6, lịch sử thế giới và Việt Nam học song song, đan xen theo thời gian.",
    chapters:[
      { title:"Vì sao phải học lịch sử?", scope:"both", nodes:[
        {id:"g6-0-0", title:"Lịch sử và cuộc sống", authored:true},
        {id:"g6-0-1", title:"Dựa vào đâu để biết và phục dựng lại lịch sử?", authored:true},
        {id:"g6-0-2", title:"Thời gian trong lịch sử", authored:true},
        {id:"g6-0-3", title:"Ôn tập", review:true},
      ]},
      { title:"Xã hội nguyên thuỷ", scope:"tg", nodes:[
        {id:"g6-1-0", title:"Nguồn gốc loài người", authored:true},
        {id:"g6-1-1", title:"Xã hội nguyên thuỷ", authored:true},
        {id:"g6-1-2", title:"Sự chuyển biến và phân hoá của xã hội nguyên thuỷ", authored:true},
        {id:"g6-1-3", title:"Ôn tập", review:true},
      ]},
      { title:"Xã hội cổ đại", scope:"tg", nodes:[
        {id:"g6-2-0", title:"Ai Cập và Lưỡng Hà cổ đại", authored:true},
        {id:"g6-2-1", title:"Ấn Độ cổ đại", authored:true},
        {id:"g6-2-2", title:"Trung Quốc từ thời cổ đại đến thế kỉ VII", authored:true},
        {id:"g6-2-3", title:"Hy Lạp và La Mã cổ đại", authored:true},
        {id:"g6-2-4", title:"Ôn tập", review:true},
      ]},
      { title:"Đông Nam Á (đầu Công nguyên đến thế kỉ X)", scope:"tg", nodes:[
        {id:"g6-3-0", title:"Các quốc gia sơ kì ở Đông Nam Á", authored:true},
        {id:"g6-3-1", title:"Các vương quốc phong kiến Đông Nam Á (TK VII–X)", authored:true},
        {id:"g6-3-2", title:"Giao lưu văn hoá ở Đông Nam Á", authored:true},
        {id:"g6-3-3", title:"Ôn tập", review:true},
      ]},
      { title:"Việt Nam từ khoảng TK VII TCN đến đầu TK X", scope:"vn", nodes:[
        {id:"g6-4-0", title:"Nhà nước Văn Lang, Âu Lạc", authored:true},
        {id:"g6-4-1", title:"Chính sách cai trị của phong kiến phương Bắc", authored:true},
        {id:"g6-4-2", title:"Các cuộc khởi nghĩa tiêu biểu trước thế kỉ X", authored:true},
        {id:"g6-4-3", title:"Đấu tranh bảo tồn văn hoá dân tộc", authored:true},
        {id:"g6-4-4", title:"Bước ngoặt lịch sử đầu thế kỉ X", authored:true},
        {id:"g6-4-5", title:"Vương quốc Chăm-pa (TK II–X)", authored:true},
        {id:"g6-4-6", title:"Ôn tập", review:true},
      ]},
    ]},
  { id:7, cap:"thcs", title:"Lớp 7",
    note:"Trung đại thế giới đan xen Đại Việt thời Ngô – Đinh – Tiền Lê – Lý – Trần – Hồ.",
    chapters:[
      { title:"Tây Âu (TK V – nửa đầu TK XVI)", scope:"tg", nodes:[
        {id:"g7-0-0", title:"Quá trình hình thành chế độ phong kiến Tây Âu", authored:true},
        {id:"g7-0-1", title:"Phát kiến địa lí & CNTB Tây Âu", authored:true},
        {id:"g7-0-2", title:"Văn hoá Phục hưng & cải cách tôn giáo", authored:true},
      ]},
      { title:"Trung Quốc và Ấn Độ thời trung đại", scope:"tg", nodes:[
        {id:"g7-1-0", title:"Trung Quốc (TK VII – giữa TK XIX)", authored:true},
        {id:"g7-1-1", title:"Ấn Độ (TK IV – giữa TK XIX)", authored:true},
      ]},
      { title:"Đông Nam Á (nửa sau TK X – nửa đầu TK XVI)", scope:"tg", nodes:[
        {id:"g7-2-0", title:"Các vương quốc phong kiến Đông Nam Á", authored:true},
        {id:"g7-2-1", title:"Vương quốc Lào", authored:true},
        {id:"g7-2-2", title:"Vương quốc Campuchia", authored:true},
      ]},
      { title:"Ngô – Đinh – Tiền Lê (939–1009)", scope:"vn", nodes:[
        {id:"g7-3-0", title:"Đất nước buổi đầu độc lập (939–967)", authored:true},
        {id:"g7-3-1", title:"Đại Cồ Việt thời Đinh và Tiền Lê (968–1009)", authored:true},
      ]},
      { title:"Đại Việt thời Lý – Trần – Hồ (1009–1407)", scope:"vn", nodes:[
        {id:"g7-4-0", title:"Nhà Lý (1009–1225)", authored:true},
        {id:"g7-4-1", title:"Kháng chiến chống Tống (1075–1077)", authored:true},
        {id:"g7-4-2", title:"Đại Việt thời Trần (1226–1400)", authored:true},
        {id:"g7-4-3", title:"Ba lần kháng chiến chống Mông – Nguyên", authored:true},
        {id:"g7-4-4", title:"Nước Đại Ngu thời Hồ (1400–1407)", authored:true},
      ]},
      { title:"Khởi nghĩa Lam Sơn & Đại Việt thời Lê sơ (1418–1527)", scope:"vn", nodes:[
        {id:"g7-5-0", title:"Khởi nghĩa Lam Sơn", authored:true},
        {id:"g7-5-1", title:"Đại Việt thời Lê sơ", authored:true},
        {id:"g7-5-2", title:"Chăm-pa & vùng đất Nam Bộ (TK X–XVI)", authored:true},
      ]},
    ]},
  { id:8, cap:"thcs", title:"Lớp 8",
    note:"Cận đại thế giới (cách mạng tư sản, CNTB, cách mạng công nghiệp) đan xen Việt Nam TK XIX – đầu XX.",
    chapters:[
      { title:"Cách mạng tư sản & sự xác lập CNTB", scope:"tg", nodes:[
        {id:"g8-0-0", title:"Cách mạng tư sản Anh & 13 thuộc địa Bắc Mỹ", authored:true},
        {id:"g8-0-1", title:"Cách mạng tư sản Pháp cuối TK XVIII", authored:true},
      ]},
      { title:"Chủ nghĩa đế quốc & phong trào công nhân", scope:"tg", nodes:[
        {id:"g8-1-0", title:"Sự hình thành CNĐQ ở Âu – Mỹ", authored:true},
        {id:"g8-1-1", title:"Phong trào công nhân & CNXH khoa học", authored:true},
        {id:"g8-1-2", title:"Chiến tranh thế giới thứ nhất & CM Tháng Mười Nga", authored:true},
      ]},
      { title:"Khoa học – kĩ thuật – văn hoá TK XVIII–XIX", scope:"tg", nodes:[
        {id:"g8-2-0", title:"Thành tựu khoa học, kĩ thuật, văn học, nghệ thuật", authored:true},
      ]},
      { title:"Châu Á & Việt Nam (nửa sau TK XIX – đầu TK XX)", scope:"both", nodes:[
        {id:"g8-3-0", title:"Châu Á trước làn sóng xâm lược phương Tây", authored:true},
        {id:"g8-3-1", title:"Việt Nam nửa cuối TK XIX — Pháp xâm lược, triều Nguyễn", authored:true},
        {id:"g8-3-2", title:"Phong trào Cần Vương & khởi nghĩa nông dân Yên Thế", authored:true},
        {id:"g8-3-3", title:"Việt Nam đầu TK XX — phong trào Đông Du, Duy Tân", authored:true},
      ]},
    ]},
  { id:9, cap:"thcs", title:"Lớp 9",
    note:"Thế giới và Việt Nam giai đoạn 1918–1945, khép lại bằng cách mạng KHKT & toàn cầu hoá.",
    chapters:[
      { title:"Nước Nga và Liên Xô (1918–1945)", scope:"tg", nodes:[
        {id:"g9-0-0", title:"Nước Nga sau Cách mạng tháng Mười", authored:true},
        {id:"g9-0-1", title:"Liên Xô xây dựng CNXH", authored:true},
      ]},
      { title:"Châu Âu, nước Mỹ và châu Á (1918–1945)", scope:"tg", nodes:[
        {id:"g9-1-0", title:"Châu Âu giữa hai cuộc chiến tranh", authored:true},
        {id:"g9-1-1", title:"Nước Mỹ giữa hai cuộc chiến tranh", authored:true},
        {id:"g9-1-2", title:"Châu Á giữa hai cuộc chiến tranh", authored:true},
      ]},
      { title:"Chiến tranh thế giới thứ hai (1939–1945)", scope:"tg", nodes:[
        {id:"g9-2-0", title:"Nguyên nhân, diễn biến chính, kết cục", authored:true},
      ]},
      { title:"Việt Nam (1918–1945)", scope:"vn", nodes:[
        {id:"g9-3-0", title:"Phong trào dân tộc dân chủ (1918–1930)", authored:true},
        {id:"g9-3-1", title:"Nguyễn Ái Quốc & thành lập Đảng Cộng sản Việt Nam", authored:true},
        {id:"g9-3-2", title:"Phong trào cách mạng (1930–1939)", authored:true},
      ]},
      { title:"Cách mạng khoa học – kĩ thuật & toàn cầu hoá", scope:"both", nodes:[
        {id:"g9-4-0", title:"Tác động tới thế giới và Việt Nam hiện nay", authored:true},
      ]},
      { title:"Chủ đề chung", scope:"vn", nodes:[
        {id:"g9-5-0", title:"Đô thị: Lịch sử và hiện tại", authored:true},
        {id:"g9-5-1", title:"Văn minh châu thổ sông Hồng và sông Cửu Long", authored:true},
        {id:"g9-5-2", title:"Bảo vệ chủ quyền của Việt Nam ở Biển Đông", authored:true},
      ]},
    ]},
  { id:10, cap:"thpt", title:"Lớp 10",
    note:"Môn Lịch sử riêng — bắt đầu học về bản thân Sử học, rồi văn minh thế giới & Việt Nam cổ trung đại.",
    chapters:[
      { title:"Lịch sử và Sử học, vai trò của Sử học", scope:"both", nodes:[
        {id:"g10-0-0", title:"Hiện thực lịch sử và nhận thức lịch sử"},
        {id:"g10-0-1", title:"Tri thức lịch sử và cuộc sống"},
        {id:"g10-0-2", title:"Sử học với các lĩnh vực khoa học & ngành nghề hiện đại"},
      ]},
      { title:"Văn minh thế giới cổ – trung đại", scope:"tg", nodes:[
        {id:"g10-1-0", title:"Văn minh phương Đông cổ – trung đại"},
        {id:"g10-1-1", title:"Văn minh phương Tây cổ – trung đại"},
      ]},
      { title:"Các cuộc cách mạng công nghiệp", scope:"tg", nodes:[
        {id:"g10-2-0", title:"Cách mạng công nghiệp thời cận đại"},
        {id:"g10-2-1", title:"Cách mạng công nghiệp thời hiện đại"},
      ]},
      { title:"Văn minh Đông Nam Á", scope:"tg", nodes:[
        {id:"g10-3-0", title:"Cơ sở hình thành văn minh Đông Nam Á"},
        {id:"g10-3-1", title:"Hành trình phát triển & thành tựu"},
      ]},
      { title:"Văn minh Việt Nam (trước 1858) & cộng đồng dân tộc", scope:"vn", nodes:[
        {id:"g10-4-0", title:"Các nền văn minh cổ trên đất nước Việt Nam"},
        {id:"g10-4-1", title:"Văn minh Đại Việt", authored:true},
        {id:"g10-4-2", title:"Đời sống cộng đồng các dân tộc Việt Nam"},
      ]},
    ]},
  { id:11, cap:"thpt", title:"Lớp 11",
    note:"Cách mạng tư sản & CNXH thế giới, Đông Nam Á giành độc lập, chiến tranh bảo vệ Tổ quốc & cải cách lớn trong sử Việt.",
    chapters:[
      { title:"Cách mạng tư sản & chủ nghĩa xã hội", scope:"tg", nodes:[
        {id:"g11-0-0", title:"Một số vấn đề chung về cách mạng tư sản"},
        {id:"g11-0-1", title:"Sự xác lập chủ nghĩa tư bản"},
        {id:"g11-0-2", title:"Liên bang Cộng hoà XHCN Xô Viết"},
        {id:"g11-0-3", title:"Chủ nghĩa xã hội từ sau Chiến tranh thế giới thứ hai đến nay"},
      ]},
      { title:"Đông Nam Á giành độc lập", scope:"tg", nodes:[
        {id:"g11-1-0", title:"Quá trình xâm lược & cai trị của thực dân ở Đông Nam Á"},
        {id:"g11-1-1", title:"Hành trình đi đến độc lập dân tộc"},
      ]},
      { title:"Chiến tranh bảo vệ Tổ quốc (trước Cách mạng tháng Tám 1945)", scope:"vn", nodes:[
        {id:"g11-2-0", title:"Khái quát chiến tranh bảo vệ Tổ quốc trong lịch sử Việt Nam"},
        {id:"g11-2-1", title:"Một số cuộc khởi nghĩa & chiến tranh giải phóng"},
      ]},
      { title:"Các cuộc cải cách lớn trong lịch sử Việt Nam", scope:"vn", nodes:[
        {id:"g11-3-0", title:"Cải cách của Hồ Quý Ly & triều Hồ (đầu TK XV)"},
        {id:"g11-3-1", title:"Cải cách của Lê Thánh Tông (TK XV)", authored:true},
        {id:"g11-3-2", title:"Cải cách của Minh Mạng (nửa đầu TK XIX)"},
      ]},
      { title:"Làng xã Việt Nam & Biển Đông", scope:"vn", nodes:[
        {id:"g11-4-0", title:"Làng xã Việt Nam trong lịch sử"},
        {id:"g11-4-1", title:"Vị trí và tầm quan trọng của Biển Đông"},
        {id:"g11-4-2", title:"Việt Nam và Biển Đông"},
      ]},
    ]},
  { id:12, cap:"thpt", title:"Lớp 12",
    note:"Trọng tâm lịch sử Việt Nam hiện đại (CMT8, hai cuộc kháng chiến, Đổi mới) trong bối cảnh thế giới & khu vực, khép lại bằng Hồ Chí Minh.",
    chapters:[
      { title:"Thế giới sau Chiến tranh lạnh & ASEAN", scope:"both", nodes:[
        {id:"g12-0-0", title:"Trật tự thế giới sau Chiến tranh lạnh", authored:true},
        {id:"g12-0-1", title:"Sự ra đời và phát triển của ASEAN", authored:true},
        {id:"g12-0-2", title:"Cộng đồng ASEAN: từ ý tưởng đến hiện thực", authored:true},
      ]},
      { title:"CMT8 1945, kháng chiến & bảo vệ Tổ quốc", scope:"vn", nodes:[
        {id:"g12-1-0", title:"Cách mạng tháng Tám năm 1945", authored:true},
        {id:"g12-1-1", title:"Kháng chiến chống thực dân Pháp (1945–1954)", authored:true},
        {id:"g12-1-2", title:"Kháng chiến chống Mỹ, cứu nước (1954–1975)", authored:true},
        {id:"g12-1-3", title:"Đấu tranh bảo vệ Tổ quốc từ sau 4/1975 đến nay", authored:true},
      ]},
      { title:"Công cuộc Đổi mới ở Việt Nam", scope:"vn", nodes:[
        {id:"g12-2-0", title:"Khái quát công cuộc Đổi mới từ năm 1986", authored:true},
        {id:"g12-2-1", title:"Thành tựu & bài học của công cuộc Đổi mới", authored:true},
      ]},
      { title:"Đối ngoại Việt Nam thời cận – hiện đại", scope:"vn", nodes:[
        {id:"g12-3-0", title:"Đối ngoại trong đấu tranh giành độc lập (đầu TK XX – CMT8 1945)", authored:true},
        {id:"g12-3-1", title:"Đối ngoại trong kháng chiến chống Pháp & Mỹ", authored:true},
        {id:"g12-3-2", title:"Đối ngoại từ năm 1975 đến nay", authored:true},
      ]},
      { title:"Hồ Chí Minh trong lịch sử Việt Nam", scope:"vn", nodes:[
        {id:"g12-4-0", title:"Khái quát cuộc đời và sự nghiệp", authored:true},
        {id:"g12-4-1", title:"Hồ Chí Minh — Anh hùng giải phóng dân tộc", authored:true},
        {id:"g12-4-2", title:"Dấu ấn Hồ Chí Minh trong lòng nhân dân thế giới & Việt Nam", authored:true},
      ]},
    ]},
];

window.CAP = CAP;
window.GRADES = GRADES;
})();
