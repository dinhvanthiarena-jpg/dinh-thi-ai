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

});
})();
