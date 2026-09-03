// Nội dung khoá "Địa Lý Việt Nam". Cấp Lớp 4-5 làm mẫu đầy đủ; 6-9 và 10-12 để trống,
// hiển thị "sắp ra mắt" trên ứng dụng cho tới khi có nội dung thật.
//
// Bố cục mỗi địa điểm đi theo đúng mạch một bài địa lý thật (không rập khuôn app học
// ngoại ngữ): Vị trí & hành chính -> Địa hình & khí hậu -> Dân cư & kinh tế -> Văn hoá,
// để vừa nhiều kiến thức vừa đúng bản chất môn học.

export const VN_LEVELS = [
  { id: "l45", label: "Lớp 4–5",  sub: "Làm quen",       ready: true  },
  { id: "l6",  label: "Lớp 6",    sub: "VN trên bản đồ", ready: true  },
  { id: "l7",  label: "Lớp 7",    sub: "VN trong châu Á",ready: true  },
  { id: "l8",  label: "Lớp 8",    sub: "Tự nhiên VN",     ready: true  },
  { id: "l9",  label: "Lớp 9",    sub: "Dân cư & kinh tế",ready: true  },
  { id: "l10", label: "Lớp 10",   sub: "Hội nhập KT",    ready: true  },
  { id: "l11", label: "Lớp 11",   sub: "Đối tác toàn cầu",ready: true  },
  { id: "l12", label: "Lớp 12",   sub: "VN chuyên sâu",   ready: true  },
];

function place(id, title, subtitle, body, facts) {
  return { t: "place", id, title, subtitle, body, facts };
}
function topic(kicker, title, body, facts) {
  return { t: "topic", kicker, title, body, facts };
}
function culture(title, body) {
  return { t: "culture", title, body };
}

const c1 = {
  id: "vn-l45-c1",
  title: "Tổng quan & 6 thành phố lớn",
  icon: "pin",
  lessons: [
    {
      id: "vn-l45-c1-l1",
      title: "Vị trí & 3 miền",
      goal: "Việt Nam nằm ở đâu và chia thành mấy miền",
      teach: [
        { t: "intro", title: "Việt Nam ở đâu?",
          body: "Việt Nam nằm ở rìa đông của bán đảo Đông Dương, thuộc khu vực Đông Nam Á. Đất nước có hình chữ S, trải dài khoảng 1.650km theo hướng Bắc – Nam nhưng nơi hẹp nhất theo chiều Đông – Tây chưa tới 50km.",
          bullets: ["Phía Bắc giáp Trung Quốc", "Phía Tây giáp Lào và Campuchia", "Phía Đông và Nam là Biển Đông, có hơn 3.260km bờ biển"] },
        { t: "region", title: "Miền Bắc", region: "bac",
          body: "Có Thủ đô Hà Nội, trung tâm là đồng bằng sông Hồng bồi đắp bởi phù sa, bao quanh là vùng núi và trung du. Khí hậu có 4 mùa rõ rệt: Xuân, Hạ, Thu, Đông — nơi duy nhất ở Việt Nam có mùa đông lạnh thật sự." },
        { t: "region", title: "Miền Trung", region: "trung",
          body: "Dải đất hẹp nhất nước, kẹp giữa dãy Trường Sơn phía Tây và biển phía Đông nên rất dễ chịu lũ lụt, bão vào mùa mưa. Nổi tiếng với nhiều bãi biển đẹp và di sản văn hoá lâu đời như Huế, Đà Nẵng, Hội An." },
        { t: "region", title: "Miền Nam", region: "nam",
          body: "Có TP. Hồ Chí Minh và đồng bằng sông Cửu Long — vựa lúa lớn nhất cả nước nhờ phù sa sông Mê Kông. Khí hậu chỉ có 2 mùa: mùa mưa và mùa khô, nóng quanh năm." },
      ],
      quiz: [
        { t: "choice", q: "Việt Nam thuộc khu vực nào trên thế giới?",
          options: ["Đông Nam Á", "Nam Á", "Đông Á", "Trung Á"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào khu vực MIỀN BẮC trên bản đồ.", targetType: "region", targetId: "bac", hint: "Miền Bắc nằm ở phía trên bản đồ." },
        { t: "mapclick", q: "Hãy bấm vào khu vực MIỀN NAM trên bản đồ.", targetType: "region", targetId: "nam", hint: "Miền Nam nằm ở phía dưới bản đồ." },
        { t: "blank", q: "Việt Nam có hình chữ ___, trải dài từ Bắc vào Nam.", answer: "S", options: ["S", "L", "C", "N"] },
        { t: "choice", q: "Nước nào sau đây giáp Việt Nam ở phía Tây?",
          options: ["Lào", "Nhật Bản", "Hàn Quốc", "Ấn Độ"], answer: 0 },
        { t: "truefalse", q: "Miền Nam Việt Nam có 4 mùa Xuân, Hạ, Thu, Đông rõ rệt như miền Bắc.", answer: false },
        { t: "choice", q: "Đồng bằng nào được xem là vựa lúa lớn nhất Việt Nam?",
          options: ["Đồng bằng sông Cửu Long", "Đồng bằng sông Hồng", "Đồng bằng ven biển miền Trung", "Cao nguyên Tây Nguyên"], answer: 0 },
        { t: "choice", q: "Vì sao miền Trung dễ bị lũ lụt, bão vào mùa mưa?",
          options: ["Dải đất hẹp, kẹp giữa núi và biển", "Không có sông ngòi", "Ở quá xa biển", "Địa hình toàn cao nguyên"], answer: 0 },
      ],
    },
    {
      id: "vn-l45-c1-l2",
      title: "Miền Bắc: Hà Nội & Hải Phòng",
      goal: "Vị trí, tự nhiên, dân cư – kinh tế và văn hoá hai thành phố lớn miền Bắc",
      teach: [
        place("ha-noi", "Hà Nội", "Thủ đô của cả nước · Miền Bắc",
          "Hà Nội là Thủ đô, trung tâm chính trị của Việt Nam, nằm ở trung tâm đồng bằng sông Hồng, hai bên bờ sông Hồng.",
          [{ label: "Vai trò", value: "Thủ đô" }, { label: "Miền", value: "Bắc" }, { label: "Vùng", value: "Đồng bằng sông Hồng" }]),
        topic("Địa hình & khí hậu", "Địa hình, khí hậu Hà Nội",
          "Địa hình chủ yếu là đồng bằng bằng phẳng, phía Bắc và Tây có vùng đồi núi thấp (Ba Vì, Sóc Sơn). Khí hậu nhiệt đới gió mùa với 4 mùa rõ rệt: mùa đông lạnh và khô, mùa hè nóng ẩm mưa nhiều.",
          [{ label: "Sông chính", value: "Sông Hồng" }, { label: "Khí hậu", value: "4 mùa rõ rệt" }]),
        topic("Dân cư & kinh tế", "Dân cư, kinh tế Hà Nội",
          "Là nơi tập trung dân cư và mật độ dân số cao nhất cả nước. Kinh tế thiên về dịch vụ, công nghệ và hành chính, có nhiều trường đại học lớn nhất Việt Nam.",
          [{ label: "Diện tích", value: "3.360 km²" }, { label: "Dân số", value: "~8,8 triệu" }, { label: "Kinh tế", value: "Dịch vụ, công nghệ" }]),
        culture("Văn hoá Hà Nội",
          "Hồ Gươm với Tháp Rùa, Văn Miếu – Quốc Tử Giám (trường đại học đầu tiên của Việt Nam), khu Phố cổ 36 phố phường, và ẩm thực nổi tiếng như phở, bún chả."),
        place("hai-phong", "Hải Phòng", "Thành phố cảng lớn nhất miền Bắc",
          "Hải Phòng nằm ven biển Đông Bắc Bộ, là cửa ngõ ra biển quan trọng nhất của miền Bắc. Từ năm 2025, Hải Phòng sáp nhập thêm tỉnh Hải Dương, trở thành thành phố trực thuộc Trung ương rộng hơn trước.",
          [{ label: "Vai trò", value: "Thành phố cảng" }, { label: "Miền", value: "Bắc" }, { label: "2025", value: "Sáp nhập Hải Dương" }]),
        topic("Địa hình & khí hậu", "Địa hình, khí hậu Hải Phòng",
          "Đồng bằng ven biển xen vùng đồi núi thấp phía nội địa (thuộc Hải Dương cũ), có nhiều đảo như Cát Bà, Bạch Long Vĩ. Khí hậu nhiệt đới gió mùa, mùa hè – thu hay chịu ảnh hưởng của bão.",
          [{ label: "Sông chính", value: "Sông Cấm, Lạch Tray" }, { label: "Đặc điểm", value: "Nhiều đảo ven bờ" }]),
        topic("Dân cư & kinh tế", "Dân cư, kinh tế Hải Phòng",
          "Kinh tế dựa vào cảng biển, công nghiệp và logistics — cảng Hải Phòng là một trong những cảng nhộn nhịp nhất cả nước.",
          [{ label: "Diện tích", value: "3.195 km²" }, { label: "Dân số", value: "~4,7 triệu" }, { label: "Kinh tế", value: "Cảng biển, công nghiệp" }]),
        culture("Văn hoá Hải Phòng",
          "Đảo Cát Bà là Khu dự trữ sinh quyển thế giới. Hải Phòng được gọi là \"Thành phố Hoa Phượng Đỏ\" vì hoa phượng nở rực mỗi mùa hè. Đặc sản nổi tiếng: bánh đa cua."),
      ],
      quiz: [
        { t: "choice", q: "Thủ đô của Việt Nam là thành phố nào?",
          options: ["Hà Nội", "Hải Phòng", "Đà Nẵng", "Huế"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào Hà Nội trên bản đồ.", targetType: "province", targetId: "ha-noi" },
        { t: "mapclick", q: "Hãy bấm vào Hải Phòng trên bản đồ.", targetType: "province", targetId: "hai-phong" },
        { t: "match", q: "Nối thành phố với đặc điểm đúng.",
          pairs: [["Hà Nội", "Có Hồ Gươm, là Thủ đô"], ["Hải Phòng", "Thành phố cảng lớn nhất miền Bắc"]] },
        { t: "type", q: "Sông nào chảy qua Hà Nội? (gõ không dấu cũng được)", answer: "Sông Hồng", accept: ["sông hồng", "song hong"] },
        { t: "choice", q: "Hải Phòng sáp nhập thêm tỉnh nào từ năm 2025?",
          options: ["Hải Dương", "Bắc Ninh", "Quảng Ninh", "Thái Bình"], answer: 0 },
        { t: "truefalse", q: "Hà Nội là nơi có mật độ dân số cao nhất cả nước.", answer: true },
        { t: "order", q: "Sắp xếp theo diện tích tăng dần (nhỏ đến lớn).", items: ["Hải Phòng", "Hà Nội"] },
        { t: "choice", q: "Kinh tế Hải Phòng nổi bật nhất ở lĩnh vực nào?",
          options: ["Cảng biển, công nghiệp", "Trồng cà phê", "Khai thác dầu khí", "Chăn nuôi bò sữa"], answer: 0 },
      ],
    },
    {
      id: "vn-l45-c1-l3",
      title: "Miền Trung: Đà Nẵng & Huế",
      goal: "Vị trí, tự nhiên, dân cư – kinh tế và văn hoá hai thành phố lớn miền Trung",
      teach: [
        place("da-nang", "Đà Nẵng", "Thành phố biển miền Trung",
          "Đà Nẵng nằm ở duyên hải Nam Trung Bộ. Từ năm 2025, Đà Nẵng sáp nhập thêm tỉnh Quảng Nam, trở thành thành phố rộng nhất trong 6 thành phố trực thuộc Trung ương.",
          [{ label: "Vai trò", value: "Thành phố biển" }, { label: "Miền", value: "Trung" }, { label: "2025", value: "Sáp nhập Quảng Nam" }]),
        topic("Địa hình & khí hậu", "Địa hình, khí hậu Đà Nẵng",
          "Đồng bằng ven biển hẹp, phía Tây là dãy Trường Sơn với khu du lịch Bà Nà Hills. Bờ biển dài, nhiều bãi tắm đẹp. Khí hậu nhiệt đới gió mùa, mưa tập trung vào cuối năm.",
          [{ label: "Sông chính", value: "Sông Hàn, Thu Bồn" }, { label: "Địa hình", value: "Ven biển & núi Trường Sơn" }]),
        topic("Dân cư & kinh tế", "Dân cư, kinh tế Đà Nẵng",
          "Kinh tế mạnh về du lịch biển và công nghệ. Là thành phố rộng nhất trong 6 thành phố trực thuộc Trung ương nhờ sáp nhập thêm Quảng Nam.",
          [{ label: "Diện tích", value: "11.913 km²" }, { label: "Dân số", value: "~3,1 triệu" }, { label: "Kinh tế", value: "Du lịch, công nghệ" }]),
        culture("Văn hoá Đà Nẵng",
          "Cầu Rồng phun lửa, bãi biển Mỹ Khê. Từ khi sáp nhập Quảng Nam, Đà Nẵng còn có phố cổ Hội An và Thánh địa Mỹ Sơn — cả hai đều là Di sản Văn hoá Thế giới UNESCO."),
        place("hue", "Huế", "Cố đô của Việt Nam",
          "Huế nằm ở Bắc Trung Bộ, bên dòng sông Hương thơ mộng đổ ra phá Tam Giang. Huế từng là kinh đô của triều Nguyễn — triều đại phong kiến cuối cùng của Việt Nam.",
          [{ label: "Vai trò", value: "Cố đô" }, { label: "Miền", value: "Trung" }, { label: "Di sản", value: "UNESCO" }]),
        topic("Địa hình & khí hậu", "Địa hình, khí hậu Huế",
          "Đồng bằng hẹp ven sông Hương, phía Tây giáp dãy Trường Sơn. Khí hậu chuyển tiếp giữa hai miền Bắc – Nam, mưa nhiều vào mùa thu – đông, hay có lũ.",
          [{ label: "Sông chính", value: "Sông Hương" }, { label: "Mùa mưa", value: "Thu – Đông" }]),
        topic("Dân cư & kinh tế", "Dân cư, kinh tế Huế",
          "Là thành phố ít dân nhất trong 6 thành phố trực thuộc Trung ương. Kinh tế chủ yếu dựa vào du lịch di sản – văn hoá.",
          [{ label: "Diện tích", value: "4.947 km²" }, { label: "Dân số", value: "~1,4 triệu" }, { label: "Kinh tế", value: "Du lịch di sản" }]),
        culture("Văn hoá Huế",
          "Quần thể di tích Cố đô Huế (Đại Nội, các lăng tẩm vua Nguyễn) được UNESCO công nhận Di sản Thế giới. Nhã nhạc cung đình Huế là Di sản văn hoá phi vật thể UNESCO. Ẩm thực cung đình Huế rất cầu kỳ, tinh tế."),
      ],
      quiz: [
        { t: "choice", q: "Thành phố nào từng là kinh đô của triều Nguyễn?",
          options: ["Huế", "Đà Nẵng", "Cần Thơ", "Hà Nội"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào Đà Nẵng trên bản đồ.", targetType: "province", targetId: "da-nang" },
        { t: "mapclick", q: "Hãy bấm vào Huế trên bản đồ.", targetType: "province", targetId: "hue" },
        { t: "choice", q: "Cầu Rồng là biểu tượng nổi tiếng của thành phố nào?",
          options: ["Đà Nẵng", "Huế", "Hà Nội", "Cần Thơ"], answer: 0 },
        { t: "blank", q: "Quần thể di tích Cố đô Huế được ___ công nhận là Di sản Thế giới.", answer: "UNESCO", options: ["UNESCO", "ASEAN", "WHO", "FIFA"] },
        { t: "truefalse", q: "Đà Nẵng là thành phố có diện tích lớn nhất trong 6 thành phố trực thuộc Trung ương.", answer: true },
        { t: "choice", q: "Con sông nào chảy qua thành phố Huế?",
          options: ["Sông Hương", "Sông Hàn", "Sông Hồng", "Sông Hậu"], answer: 0 },
        { t: "order", q: "Sắp xếp theo dân số tăng dần (ít đến nhiều).", items: ["Huế", "Đà Nẵng"] },
        { t: "choice", q: "Phố cổ Hội An và Thánh địa Mỹ Sơn nay thuộc thành phố nào?",
          options: ["Đà Nẵng", "Huế", "Cần Thơ", "Hà Nội"], answer: 0 },
      ],
    },
    {
      id: "vn-l45-c1-l4",
      title: "Miền Nam: TP.HCM & Cần Thơ",
      goal: "Vị trí, tự nhiên, dân cư – kinh tế và văn hoá hai thành phố lớn miền Nam",
      teach: [
        place("tp-ho-chi-minh", "TP. Hồ Chí Minh", "Thành phố đông dân nhất nước",
          "TP. Hồ Chí Minh nằm ở Đông Nam Bộ, là cửa ngõ giao thương lớn nhất phía Nam. Từ 2025, thành phố sáp nhập thêm Bình Dương và Bà Rịa – Vũng Tàu.",
          [{ label: "Vai trò", value: "Trung tâm kinh tế" }, { label: "Miền", value: "Nam" }, { label: "2025", value: "Sáp nhập Bình Dương, BR-VT" }]),
        topic("Địa hình & khí hậu", "Địa hình, khí hậu TP. Hồ Chí Minh",
          "Đồng bằng thấp xen vùng đồi thấp (Bình Dương cũ) và vùng ven biển (Vũng Tàu cũ). Khí hậu nhiệt đới gió mùa cận xích đạo, chỉ có mùa mưa và mùa khô, nóng quanh năm.",
          [{ label: "Sông chính", value: "Sông Sài Gòn, Đồng Nai" }, { label: "Khí hậu", value: "2 mùa mưa – khô" }]),
        topic("Dân cư & kinh tế", "Dân cư, kinh tế TP. Hồ Chí Minh",
          "Là trung tâm kinh tế – tài chính – công nghiệp lớn nhất Việt Nam, có cảng biển nước sâu Cái Mép – Thị Vải (thuộc Vũng Tàu cũ).",
          [{ label: "Diện tích", value: "6.781 km²" }, { label: "Dân số", value: "~14,7 triệu" }, { label: "Kinh tế", value: "Tài chính, công nghiệp" }]),
        culture("Văn hoá TP. Hồ Chí Minh",
          "Bến Nhà Rồng, Dinh Độc Lập, chợ Bến Thành ngay trung tâm thành phố. Từ khi sáp nhập, thành phố còn có các bãi biển Vũng Tàu nổi tiếng."),
        place("can-tho", "Cần Thơ", "Trung tâm Đồng bằng sông Cửu Long",
          "Cần Thơ nằm bên sông Hậu, là trung tâm của vùng Đồng bằng sông Cửu Long. Từ 2025, Cần Thơ sáp nhập thêm Sóc Trăng và Hậu Giang.",
          [{ label: "Vai trò", value: "Trung tâm miền Tây" }, { label: "Miền", value: "Nam" }, { label: "2025", value: "Sáp nhập Sóc Trăng, Hậu Giang" }]),
        topic("Địa hình & khí hậu", "Địa hình, khí hậu Cần Thơ",
          "Đồng bằng thấp, kênh rạch chằng chịt, có cả đoạn bờ biển (thuộc Sóc Trăng cũ). Khí hậu nhiệt đới cận xích đạo, mùa mưa – khô rõ rệt.",
          [{ label: "Sông chính", value: "Sông Hậu" }, { label: "Địa hình", value: "Đồng bằng, kênh rạch" }]),
        topic("Dân cư & kinh tế", "Dân cư, kinh tế Cần Thơ",
          "Là trung tâm nông nghiệp – thuỷ sản của cả vùng Đồng bằng sông Cửu Long: lúa gạo, cá tra, tôm.",
          [{ label: "Diện tích", value: "6.362 km²" }, { label: "Dân số", value: "~4,2 triệu" }, { label: "Kinh tế", value: "Nông nghiệp, thuỷ sản" }]),
        culture("Văn hoá Cần Thơ",
          "Chợ nổi Cái Răng — nơi mua bán trên sông nước nổi tiếng miền Tây. Bến Ninh Kiều bên sông Hậu, nghệ thuật đờn ca tài tử Nam Bộ."),
      ],
      quiz: [
        { t: "choice", q: "Thành phố nào đông dân nhất Việt Nam hiện nay?",
          options: ["TP. Hồ Chí Minh", "Hà Nội", "Hải Phòng", "Cần Thơ"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào TP. Hồ Chí Minh trên bản đồ.", targetType: "province", targetId: "tp-ho-chi-minh" },
        { t: "mapclick", q: "Hãy bấm vào Cần Thơ trên bản đồ.", targetType: "province", targetId: "can-tho" },
        { t: "choice", q: "Chợ nổi Cái Răng nằm ở thành phố nào?",
          options: ["Cần Thơ", "TP. Hồ Chí Minh", "Đà Nẵng", "Hà Nội"], answer: 0 },
        { t: "match", q: "Nối thành phố với đặc điểm đúng.",
          pairs: [["TP. Hồ Chí Minh", "Trung tâm kinh tế lớn nhất nước"], ["Cần Thơ", "Trung tâm Đồng bằng sông Cửu Long"]] },
        { t: "truefalse", q: "TP. Hồ Chí Minh chỉ có 2 mùa mưa và khô trong năm.", answer: true },
        { t: "choice", q: "Kinh tế Cần Thơ nổi bật nhất ở lĩnh vực nào?",
          options: ["Nông nghiệp, thuỷ sản", "Công nghệ phần mềm", "Khai khoáng", "Đóng tàu"], answer: 0 },
        { t: "order", q: "Sắp xếp theo dân số tăng dần (ít đến nhiều).", items: ["Cần Thơ", "TP. Hồ Chí Minh"] },
        { t: "type", q: "Gõ tên con sông chảy qua Cần Thơ.", answer: "Sông Hậu", accept: ["sông hậu", "song hau"] },
      ],
    },
    {
      id: "vn-l45-c1-l5",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại 3 miền và 6 thành phố lớn",
      quiz: [
        { t: "mapclick", q: "Bấm vào Hà Nội.", targetType: "province", targetId: "ha-noi" },
        { t: "mapclick", q: "Bấm vào Hải Phòng.", targetType: "province", targetId: "hai-phong" },
        { t: "mapclick", q: "Bấm vào Đà Nẵng.", targetType: "province", targetId: "da-nang" },
        { t: "mapclick", q: "Bấm vào Huế.", targetType: "province", targetId: "hue" },
        { t: "mapclick", q: "Bấm vào TP. Hồ Chí Minh.", targetType: "province", targetId: "tp-ho-chi-minh" },
        { t: "mapclick", q: "Bấm vào Cần Thơ.", targetType: "province", targetId: "can-tho" },
        { t: "match", q: "Nối thành phố với miền của nó.",
          pairs: [["Hà Nội", "Miền Bắc"], ["Huế", "Miền Trung"], ["Cần Thơ", "Miền Nam"]] },
        { t: "drag", q: "Kéo mỗi thành phố vào đúng miền.",
          buckets: ["Miền Bắc", "Miền Trung", "Miền Nam"],
          items: [
            { label: "Hà Nội", bucket: 0 }, { label: "Hải Phòng", bucket: 0 },
            { label: "Đà Nẵng", bucket: 1 }, { label: "Huế", bucket: 1 },
            { label: "TP. Hồ Chí Minh", bucket: 2 }, { label: "Cần Thơ", bucket: 2 },
          ] },
        { t: "choice", q: "Thành phố nào từng là kinh đô triều Nguyễn?", options: ["Huế", "Hải Phòng", "Cần Thơ", "TP.HCM"], answer: 0 },
        { t: "choice", q: "Thành phố nào đông dân nhất Việt Nam?", options: ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Huế"], answer: 0 },
        { t: "order", q: "Sắp xếp 3 thành phố sau theo diện tích tăng dần.", items: ["Hà Nội", "Cần Thơ", "Đà Nẵng"] },
        { t: "truefalse", q: "Cả 6 thành phố trực thuộc Trung ương đều được mở rộng thêm địa giới từ năm 2025.", answer: false },
        { t: "choice", q: "Thành phố nào là trung tâm nông nghiệp – thuỷ sản của Đồng bằng sông Cửu Long?",
          options: ["Cần Thơ", "Đà Nẵng", "Hải Phòng", "Huế"], answer: 0 },
        { t: "type", q: "Gõ tên Thủ đô của Việt Nam.", answer: "Hà Nội", accept: ["hà nội", "ha noi"] },
      ],
    },
  ],
};

// ===== Lớp 6-9 — nội dung tổng hợp theo mạch chương trình Địa lí 8 (tự nhiên Việt Nam)
// và Địa lí 9 (dân cư, kinh tế Việt Nam), viết lại theo cách hiểu riêng, không sao chép
// nguyên văn từ bất kỳ trang giáo án nào.

const c2 = {
  id: "vn-l8-c1",
  title: "Tự nhiên Việt Nam",
  icon: "pin",
  lessons: [
    {
      id: "vn-l8-c1-l1",
      title: "Vị trí & phạm vi lãnh thổ",
      goal: "Vị trí địa lí và ý nghĩa của nó với tự nhiên, kinh tế",
      teach: [
        { t: "intro", title: "Việt Nam nằm ở đâu trên bản đồ thế giới?",
          body: "Việt Nam nằm ở rìa đông bán đảo Đông Dương, gần trung tâm khu vực Đông Nam Á — nơi tiếp giáp giữa lục địa Á-Âu và Thái Bình Dương, trên đường hàng hải và hàng không quốc tế quan trọng.",
          bullets: ["4 điểm cực: Bắc (Hà Giang), Nam (Cà Mau), Tây (Điện Biên), Đông (Khánh Hoà)", "Vừa gắn với lục địa vừa thông ra biển", "Nằm trong vùng nội chí tuyến bán cầu Bắc"] },
        { t: "topic", kicker: "Ý nghĩa tự nhiên", title: "Vị trí quyết định khí hậu và sinh vật",
          body: "Nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc nên Việt Nam nhận lượng bức xạ Mặt Trời lớn quanh năm — nền tảng của khí hậu nhiệt đới. Vị trí giáp biển rộng lại mang đến lượng mưa và độ ẩm dồi dào, khác hẳn các nước cùng vĩ độ nhưng nằm sâu trong lục địa.",
          facts: [{ label: "Vùng khí hậu", value: "Nhiệt đới ẩm" }, { label: "Ảnh hưởng biển", value: "Rất lớn" }] },
        { t: "topic", kicker: "Ý nghĩa kinh tế", title: "Cầu nối giao thương",
          body: "Vị trí nằm trên các tuyến hàng hải, hàng không quốc tế nối liền các nền kinh tế lớn của châu Á, cùng đường bờ biển dài, giúp Việt Nam thuận lợi giao lưu, buôn bán với nhiều quốc gia và phát triển kinh tế biển.",
          facts: [{ label: "Bờ biển", value: "~3.260 km" }, { label: "Thuận lợi", value: "Giao thương quốc tế" }] },
      ],
      quiz: [
        { t: "choice", q: "Việt Nam nằm trong đới khí hậu nào theo vị trí địa lí?",
          options: ["Nhiệt đới", "Ôn đới", "Hàn đới", "Cận cực"], answer: 0 },
        { t: "choice", q: "Điểm cực Bắc của Việt Nam thuộc tỉnh nào?", options: ["Hà Giang", "Điện Biên", "Cà Mau", "Khánh Hoà"], answer: 0 },
        { t: "mapclick", q: "Bấm vào khu vực chứa điểm cực Nam của Việt Nam (Cà Mau).", targetType: "region", targetId: "nam" },
        { t: "truefalse", q: "Việt Nam vừa gắn liền với lục địa Á-Âu vừa thông ra Thái Bình Dương.", answer: true },
        { t: "blank", q: "Việt Nam nằm gần trung tâm khu vực ___.", answer: "Đông Nam Á", options: ["Đông Nam Á", "Nam Á", "Đông Á", "Trung Á"] },
        { t: "choice", q: "Vị trí giáp biển rộng mang lại điều gì cho khí hậu Việt Nam?", options: ["Độ ẩm và lượng mưa lớn", "Khô hạn quanh năm", "Nhiệt độ rất thấp", "Không có gió"], answer: 0 },
      ],
    },
    {
      id: "vn-l8-c1-l2",
      title: "Địa hình Việt Nam",
      goal: "Đặc điểm chung và các khu vực địa hình",
      teach: [
        { t: "intro", title: "3/4 diện tích là đồi núi",
          body: "Địa hình Việt Nam đa dạng nhưng đồi núi chiếm khoảng 3/4 diện tích lãnh thổ, chủ yếu là núi thấp và trung bình. Đồng bằng chỉ chiếm 1/4 nhưng lại là nơi tập trung dân cư đông đúc nhất.",
          bullets: ["Hướng núi chính: Tây Bắc – Đông Nam và vòng cung", "Đỉnh cao nhất: Fansipan, 3.143m (Hoàng Liên Sơn)", "Địa hình trẻ lại, phân bậc rõ do vận động Tân kiến tạo"] },
        { t: "topic", kicker: "Khu vực đồi núi", title: "Bốn vùng núi chính",
          body: "Vùng núi Đông Bắc có địa hình núi thấp với các cánh cung lớn. Vùng núi Tây Bắc hiểm trở nhất, có Hoàng Liên Sơn — nóc nhà Đông Dương. Trường Sơn Bắc thấp, hẹp ngang; Trường Sơn Nam có các cao nguyên badan rộng lớn ở Tây Nguyên.",
          facts: [{ label: "Cao nhất", value: "Fansipan 3.143m" }, { label: "Cao nguyên", value: "Tây Nguyên (badan)" }] },
        { t: "topic", kicker: "Khu vực đồng bằng", title: "Hai đồng bằng châu thổ lớn",
          body: "Đồng bằng sông Hồng và đồng bằng sông Cửu Long do phù sa sông bồi đắp, đất đai màu mỡ, là hai vựa lúa lớn nhất cả nước. Dải đồng bằng ven biển miền Trung nhỏ, hẹp, kém màu mỡ hơn do các dãy núi ăn lan sát ra biển.",
          facts: [{ label: "Lớn nhất", value: "ĐB sông Cửu Long" }, { label: "Đặc điểm", value: "Đất phù sa màu mỡ" }] },
      ],
      quiz: [
        { t: "choice", q: "Địa hình Việt Nam chủ yếu là dạng nào?", options: ["Đồi núi thấp", "Núi cao trên 3.000m", "Đồng bằng", "Cao nguyên đá vôi"], answer: 0 },
        { t: "choice", q: "Đỉnh núi cao nhất Việt Nam là gì?", options: ["Fansipan", "Bà Nà", "Lang Biang", "Yên Tử"], answer: 0 },
        { t: "truefalse", q: "Đồng bằng chiếm phần lớn diện tích lãnh thổ Việt Nam.", answer: false },
        { t: "choice", q: "Đồng bằng nào lớn nhất Việt Nam?", options: ["Đồng bằng sông Cửu Long", "Đồng bằng sông Hồng", "Đồng bằng Thanh Hoá", "Đồng bằng Nghệ An"], answer: 0 },
        { t: "blank", q: "Tây Nguyên có địa hình đặc trưng là các cao nguyên ___.", answer: "badan", options: ["badan", "đá vôi", "cát", "phù sa"] },
        { t: "order", q: "Sắp xếp theo diện tích tăng dần.", items: ["Đồng bằng ven biển miền Trung", "Đồng bằng sông Hồng", "Đồng bằng sông Cửu Long"] },
      ],
    },
    {
      id: "vn-l8-c1-l3",
      title: "Khí hậu, sông ngòi & biển đảo",
      goal: "Nhiệt đới ẩm gió mùa, mạng lưới sông và Biển Đông",
      teach: [
        { t: "topic", kicker: "Khí hậu", title: "Nhiệt đới ẩm gió mùa",
          body: "Khí hậu Việt Nam nóng ẩm quanh năm nhưng có sự phân hoá theo mùa nhờ gió mùa. Gió mùa Đông Bắc mang không khí lạnh, khô tới miền Bắc vào mùa đông; gió mùa mùa hạ mang hơi ẩm gây mưa lớn trên cả nước.",
          facts: [{ label: "Kiểu khí hậu", value: "Nhiệt đới ẩm gió mùa" }, { label: "Lượng mưa TB", value: "1.500–2.000 mm/năm" }] },
        { t: "topic", kicker: "Sông ngòi", title: "Mạng lưới sông dày đặc",
          body: "Việt Nam có mạng lưới sông ngòi dày đặc nhưng phần lớn là sông nhỏ, ngắn và dốc do lãnh thổ hẹp ngang, núi ăn sát biển — trừ hai hệ thống lớn là sông Hồng và sông Mê Kông (Cửu Long) bắt nguồn từ ngoài lãnh thổ. Sông có chế độ nước theo mùa, mùa lũ trùng mùa mưa.",
          facts: [{ label: "Sông lớn nhất", value: "Sông Mê Kông (Cửu Long)" }, { label: "Chế độ nước", value: "Theo mùa" }] },
        { t: "culture", title: "Biển Đông và hai quần đảo",
          body: "Biển Đông rộng lớn mang lại nguồn hải sản, dầu khí và tuyến giao thông biển quan trọng. Việt Nam có hai quần đảo xa bờ là Hoàng Sa (thuộc Đà Nẵng) và Trường Sa (thuộc Khánh Hoà) — đây là chủ quyền thiêng liêng cần được bảo vệ." },
      ],
      quiz: [
        { t: "choice", q: "Khí hậu Việt Nam thuộc kiểu nào?", options: ["Nhiệt đới ẩm gió mùa", "Ôn đới lục địa", "Hàn đới", "Hoang mạc"], answer: 0 },
        { t: "choice", q: "Gió mùa Đông Bắc mang tới miền Bắc điều gì vào mùa đông?", options: ["Không khí lạnh, khô", "Mưa rào nhiệt đới", "Nắng nóng gay gắt", "Bão lớn"], answer: 0 },
        { t: "truefalse", q: "Phần lớn sông ngòi Việt Nam là sông nhỏ, ngắn và dốc.", answer: true },
        { t: "choice", q: "Hai hệ thống sông lớn bắt nguồn từ ngoài lãnh thổ Việt Nam là?", options: ["Sông Hồng và sông Mê Kông", "Sông Hàn và sông Hương", "Sông Sài Gòn và sông Hậu", "Sông Cấm và sông Mã"], answer: 0 },
        { t: "match", q: "Nối quần đảo với tỉnh, thành quản lí.", pairs: [["Hoàng Sa", "Đà Nẵng"], ["Trường Sa", "Khánh Hoà"]] },
        { t: "blank", q: "Mùa lũ của sông ngòi Việt Nam trùng với mùa ___.", answer: "mưa", options: ["mưa", "khô", "đông", "xuân"] },
      ],
    },
    {
      id: "vn-l8-c1-l3b",
      title: "Khoáng sản Việt Nam",
      goal: "Các loại khoáng sản chính và sự phân bố",
      teach: [
        { t: "intro", title: "Việt Nam có nhiều loại khoáng sản",
          body: "Nhờ lịch sử địa chất lâu dài và phức tạp, Việt Nam có nguồn khoáng sản khá phong phú về chủng loại, tuy phần lớn có trữ lượng vừa và nhỏ. Một số khoáng sản có trữ lượng lớn, mang tầm cỡ khu vực và thế giới.",
          bullets: ["Than đá: tập trung nhiều nhất ở Quảng Ninh", "Dầu khí: chủ yếu ở thềm lục địa phía Nam", "Bô-xít: trữ lượng lớn ở Tây Nguyên", "Sắt, apatit, đá vôi: phân bố ở nhiều tỉnh miền núi phía Bắc"] },
        { t: "topic", kicker: "Nhiên liệu", title: "Than đá & dầu khí — nguồn năng lượng chủ lực",
          body: "Quảng Ninh là vùng than đá lớn nhất cả nước, khai thác từ hơn 100 năm nay. Dầu khí được khai thác chủ yếu ở thềm lục địa phía Nam, đóng góp quan trọng cho ngân sách và xuất khẩu.",
          facts: [{ label: "Than đá", value: "Quảng Ninh" }, { label: "Dầu khí", value: "Thềm lục địa phía Nam" }] },
        { t: "topic", kicker: "Kim loại", title: "Bô-xít Tây Nguyên",
          body: "Tây Nguyên có trữ lượng bô-xít (nguyên liệu sản xuất nhôm) vào loại lớn hàng đầu thế giới, hình thành từ quá trình phong hoá đá badan trong điều kiện khí hậu nhiệt đới ẩm.",
          facts: [{ label: "Bô-xít", value: "Tây Nguyên, trữ lượng lớn" }] },
      ],
      quiz: [
        { t: "choice", q: "Vùng than đá lớn nhất Việt Nam ở đâu?", options: ["Quảng Ninh", "Tây Nguyên", "Cà Mau", "Lâm Đồng"], answer: 0 },
        { t: "choice", q: "Dầu khí Việt Nam khai thác chủ yếu ở đâu?", options: ["Thềm lục địa phía Nam", "Miền núi phía Bắc", "Tây Nguyên", "Đồng bằng sông Hồng"], answer: 0 },
        { t: "choice", q: "Bô-xít — nguyên liệu sản xuất nhôm — tập trung nhiều nhất ở đâu?", options: ["Tây Nguyên", "Quảng Ninh", "Đồng bằng sông Cửu Long", "Hải Phòng"], answer: 0 },
        { t: "truefalse", q: "Việt Nam có nguồn khoáng sản khá phong phú về chủng loại.", answer: true },
        { t: "drag", q: "Kéo mỗi khoáng sản vào đúng vùng khai thác chính.",
          buckets: ["Quảng Ninh", "Tây Nguyên", "Thềm lục địa phía Nam"],
          items: [{ label: "Than đá", bucket: 0 }, { label: "Bô-xít", bucket: 1 }, { label: "Dầu khí", bucket: 2 }] },
      ],
    },
    {
      id: "vn-l8-c1-l3c",
      title: "Thổ nhưỡng & sinh vật Việt Nam",
      goal: "Đặc điểm đất và sinh vật nhiệt đới",
      teach: [
        { t: "topic", kicker: "Thổ nhưỡng", title: "Đất feralit chiếm phần lớn diện tích",
          body: "Trong điều kiện khí hậu nhiệt đới ẩm, đất feralit (đất đỏ vàng) hình thành phổ biến ở vùng đồi núi, khá nghèo dinh dưỡng nhưng thích hợp trồng cây công nghiệp lâu năm. Đất phù sa màu mỡ hơn nhiều, tập trung ở các đồng bằng, thích hợp trồng lúa nước.",
          facts: [{ label: "Đất đồi núi", value: "Feralit (đỏ vàng)" }, { label: "Đất đồng bằng", value: "Phù sa màu mỡ" }] },
        { t: "culture", title: "Sinh vật nhiệt đới phong phú",
          body: "Việt Nam có hệ sinh vật nhiệt đới rất đa dạng, nhiều loài đặc hữu quý hiếm. Rừng nhiệt đới gió mùa là kiểu rừng phổ biến nhất, tuy diện tích rừng tự nhiên đã suy giảm nhiều do khai thác, cần được bảo vệ và phục hồi." },
      ],
      quiz: [
        { t: "choice", q: "Loại đất phổ biến nhất ở vùng đồi núi Việt Nam là gì?", options: ["Đất feralit (đỏ vàng)", "Đất phù sa", "Đất cát", "Đất mặn"], answer: 0 },
        { t: "choice", q: "Đất phù sa màu mỡ tập trung chủ yếu ở đâu?", options: ["Các đồng bằng", "Vùng núi cao", "Cao nguyên", "Ven biển miền Trung"], answer: 0 },
        { t: "truefalse", q: "Việt Nam có hệ sinh vật nhiệt đới rất đa dạng, nhiều loài đặc hữu.", answer: true },
        { t: "choice", q: "Kiểu rừng phổ biến nhất ở Việt Nam là gì?", options: ["Rừng nhiệt đới gió mùa", "Rừng lá kim ôn đới", "Rừng ngập mặn duy nhất", "Không có rừng"], answer: 0 },
      ],
    },
    {
      id: "vn-l8-c1-l4",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại vị trí, địa hình, khí hậu, sông ngòi, khoáng sản và sinh vật Việt Nam",
      quiz: [
        { t: "choice", q: "Việt Nam nằm trong đới khí hậu nào?", options: ["Nhiệt đới", "Ôn đới", "Hàn đới", "Cận nhiệt"], answer: 0 },
        { t: "choice", q: "Địa hình Việt Nam chủ yếu là gì?", options: ["Đồi núi thấp", "Núi cao", "Cao nguyên đá vôi", "Đồng bằng"], answer: 0 },
        { t: "choice", q: "Đỉnh núi cao nhất Việt Nam?", options: ["Fansipan", "Bà Nà", "Lang Biang", "Bạch Mã"], answer: 0 },
        { t: "truefalse", q: "Đồng bằng sông Cửu Long là đồng bằng lớn nhất Việt Nam.", answer: true },
        { t: "match", q: "Nối đặc điểm với đúng khu vực.",
          pairs: [["Fansipan", "Vùng núi Tây Bắc"], ["Cao nguyên badan", "Trường Sơn Nam"], ["Quần đảo Hoàng Sa", "Đà Nẵng"]] },
        { t: "choice", q: "Sông ngòi Việt Nam có chế độ nước như thế nào?", options: ["Theo mùa", "Không đổi quanh năm", "Chỉ có nước vào mùa đông", "Không có lũ"], answer: 0 },
        { t: "order", q: "Sắp xếp theo diện tích tăng dần.", items: ["Đồng bằng ven biển miền Trung", "Đồng bằng sông Hồng", "Đồng bằng sông Cửu Long"] },
        { t: "drag", q: "Kéo mỗi địa danh vào đúng miền.",
          buckets: ["Miền Bắc", "Miền Trung", "Miền Nam"],
          items: [
            { label: "Sông Hồng", bucket: 0 }, { label: "Fansipan", bucket: 0 },
            { label: "Sông Hương", bucket: 1 }, { label: "Quần đảo Hoàng Sa", bucket: 1 },
            { label: "Sông Hậu", bucket: 2 }, { label: "Đồng bằng sông Cửu Long", bucket: 2 },
          ] },
        { t: "choice", q: "Vùng than đá lớn nhất Việt Nam ở đâu?", options: ["Quảng Ninh", "Tây Nguyên", "Cà Mau", "Điện Biên"], answer: 0 },
        { t: "choice", q: "Loại đất phổ biến ở vùng đồi núi Việt Nam là gì?", options: ["Đất feralit", "Đất phù sa", "Đất cát trắng", "Đất than bùn"], answer: 0 },
      ],
    },
  ],
};

const c3 = {
  id: "vn-l9-c1",
  title: "Dân cư & Kinh tế Việt Nam",
  icon: "pin",
  lessons: [
    {
      id: "vn-l9-c1-l1",
      title: "Dân cư Việt Nam",
      goal: "Số dân, phân bố và các dân tộc",
      teach: [
        { t: "intro", title: "Hơn 100 triệu người, 54 dân tộc",
          body: "Việt Nam là quốc gia đông dân, dân số đã vượt mốc 100 triệu người — đứng thứ 3 Đông Nam Á sau Indonesia và Philippines. Đất nước có 54 dân tộc anh em cùng sinh sống, trong đó dân tộc Kinh chiếm khoảng 85% dân số.",
          bullets: ["Dân số đông, đang ở giai đoạn cơ cấu dân số vàng", "54 dân tộc, dân tộc Kinh chiếm đa số", "Phân bố dân cư rất không đều"] },
        { t: "topic", kicker: "Phân bố dân cư", title: "Đông ở đồng bằng, thưa ở miền núi",
          body: "Dân cư tập trung rất đông đúc ở hai đồng bằng châu thổ (sông Hồng, sông Cửu Long) và các thành phố lớn, trong khi vùng núi và cao nguyên dân cư thưa thớt hơn nhiều dù diện tích rộng lớn.",
          facts: [{ label: "Nơi đông dân nhất", value: "Đồng bằng sông Hồng" }, { label: "Nơi thưa dân", value: "Miền núi, Tây Nguyên" }] },
        { t: "culture", title: "Đô thị hoá đang tăng",
          body: "Tỉ lệ dân số sống ở thành thị của Việt Nam đang tăng dần nhưng vẫn còn thấp hơn nhiều nước trong khu vực. Hà Nội và TP. Hồ Chí Minh là hai đô thị đặc biệt, quy mô dân số và kinh tế lớn nhất cả nước." },
      ],
      quiz: [
        { t: "choice", q: "Dân số Việt Nam hiện nay khoảng bao nhiêu?", options: ["Hơn 100 triệu người", "Khoảng 50 triệu người", "Khoảng 20 triệu người", "Hơn 500 triệu người"], answer: 0 },
        { t: "choice", q: "Việt Nam có bao nhiêu dân tộc?", options: ["54", "20", "100", "10"], answer: 0 },
        { t: "truefalse", q: "Dân cư Việt Nam phân bố đều khắp cả nước.", answer: false },
        { t: "choice", q: "Nơi nào tập trung dân cư đông đúc nhất?", options: ["Đồng bằng sông Hồng", "Tây Nguyên", "Trung du miền núi Bắc Bộ", "Vùng núi Tây Bắc"], answer: 0 },
        { t: "blank", q: "Dân tộc chiếm đa số ở Việt Nam là dân tộc ___.", answer: "Kinh", options: ["Kinh", "Tày", "Thái", "Mường"] },
      ],
    },
    {
      id: "vn-l9-c1-l2",
      title: "Các ngành kinh tế",
      goal: "Nông nghiệp, công nghiệp và dịch vụ",
      teach: [
        { t: "topic", kicker: "Nông nghiệp", title: "Lúa gạo và cây công nghiệp",
          body: "Hai đồng bằng châu thổ là vựa lúa của cả nước, trong đó Đồng bằng sông Cửu Long là vùng xuất khẩu gạo chủ lực. Tây Nguyên nổi tiếng với các cây công nghiệp lâu năm như cà phê, cao su, hồ tiêu nhờ đất badan màu mỡ.",
          facts: [{ label: "Vựa lúa lớn nhất", value: "ĐB sông Cửu Long" }, { label: "Cây công nghiệp", value: "Cà phê, cao su, hồ tiêu" }] },
        { t: "topic", kicker: "Công nghiệp", title: "Chế biến, chế tạo phát triển nhanh",
          body: "Công nghiệp chế biến, chế tạo (điện tử, dệt may, cơ khí) phát triển mạnh, tập trung nhiều ở Đông Nam Bộ và Đồng bằng sông Hồng. Công nghiệp khai khoáng và năng lượng (than, dầu khí, thuỷ điện) cũng đóng vai trò quan trọng.",
          facts: [{ label: "Trung tâm lớn", value: "Đông Nam Bộ" }, { label: "Ngành mũi nhọn", value: "Chế biến, chế tạo" }] },
        { t: "topic", kicker: "Dịch vụ", title: "Ngành tăng tỉ trọng nhanh nhất",
          body: "Dịch vụ (thương mại, du lịch, giao thông vận tải, tài chính – ngân hàng) đang chiếm tỉ trọng ngày càng cao trong nền kinh tế, đặc biệt tại các thành phố lớn và các điểm du lịch nổi tiếng trên cả nước.",
          facts: [{ label: "Gồm", value: "Thương mại, du lịch, tài chính" }] },
      ],
      quiz: [
        { t: "choice", q: "Vùng nào là vựa lúa xuất khẩu chủ lực của Việt Nam?", options: ["Đồng bằng sông Cửu Long", "Tây Nguyên", "Đông Bắc", "Tây Bắc"], answer: 0 },
        { t: "choice", q: "Tây Nguyên nổi tiếng với loại cây trồng nào?", options: ["Cà phê", "Lúa nước", "Dừa", "Chè shan tuyết"], answer: 0 },
        { t: "truefalse", q: "Ngành dịch vụ đang chiếm tỉ trọng ngày càng thấp trong kinh tế Việt Nam.", answer: false },
        { t: "choice", q: "Trung tâm công nghiệp chế biến, chế tạo lớn nhất cả nước nằm ở vùng nào?", options: ["Đông Nam Bộ", "Tây Bắc", "Tây Nguyên", "Bắc Trung Bộ"], answer: 0 },
        { t: "match", q: "Nối ngành kinh tế với ví dụ.", pairs: [["Nông nghiệp", "Trồng lúa, cà phê"], ["Công nghiệp", "Chế biến, chế tạo"], ["Dịch vụ", "Du lịch, thương mại"]] },
      ],
    },
    {
      id: "vn-l9-c1-l3",
      title: "Các vùng kinh tế – xã hội",
      goal: "6 vùng kinh tế của Việt Nam",
      teach: [
        { t: "intro", title: "Cả nước chia thành 6 vùng",
          body: "Để thuận lợi cho quy hoạch và phát triển, Việt Nam được chia thành 6 vùng kinh tế – xã hội, mỗi vùng có thế mạnh tự nhiên và kinh tế riêng.",
          bullets: ["Trung du và miền núi Bắc Bộ", "Đồng bằng sông Hồng", "Bắc Trung Bộ và Duyên hải miền Trung", "Tây Nguyên · Đông Nam Bộ · Đồng bằng sông Cửu Long"] },
        { t: "topic", kicker: "Miền Bắc", title: "3 vùng phía Bắc",
          body: "Trung du và miền núi Bắc Bộ mạnh về khoáng sản, thuỷ điện, cây công nghiệp lâu năm. Đồng bằng sông Hồng là vùng kinh tế trọng điểm, mạnh về lúa gạo, công nghiệp và dịch vụ quanh Hà Nội. Bắc Trung Bộ và Duyên hải miền Trung có thế mạnh kinh tế biển, du lịch.",
          facts: [{ label: "Trọng điểm", value: "Đồng bằng sông Hồng" }] },
        { t: "topic", kicker: "Miền Nam", title: "3 vùng phía Nam",
          body: "Tây Nguyên mạnh về cây công nghiệp và thuỷ điện. Đông Nam Bộ là vùng kinh tế năng động, phát triển nhất cả nước với TP. Hồ Chí Minh làm trung tâm. Đồng bằng sông Cửu Long là vựa lúa, thuỷ sản lớn nhất cả nước.",
          facts: [{ label: "Phát triển nhất", value: "Đông Nam Bộ" }] },
      ],
      quiz: [
        { t: "choice", q: "Việt Nam được chia thành mấy vùng kinh tế – xã hội?", options: ["6", "3", "8", "63"], answer: 0 },
        { t: "choice", q: "Vùng nào phát triển kinh tế năng động nhất cả nước?", options: ["Đông Nam Bộ", "Tây Bắc", "Tây Nguyên", "Trung du miền núi Bắc Bộ"], answer: 0 },
        { t: "choice", q: "Vùng nào là vựa lúa, thuỷ sản lớn nhất cả nước?", options: ["Đồng bằng sông Cửu Long", "Đồng bằng sông Hồng", "Tây Nguyên", "Đông Nam Bộ"], answer: 0 },
        { t: "match", q: "Nối vùng với thế mạnh nổi bật.",
          pairs: [["Tây Nguyên", "Cây công nghiệp, thuỷ điện"], ["Đông Nam Bộ", "Công nghiệp, dịch vụ"], ["Đồng bằng sông Cửu Long", "Lúa gạo, thuỷ sản"]] },
        { t: "truefalse", q: "TP. Hồ Chí Minh là trung tâm của vùng Đông Nam Bộ.", answer: true },
      ],
    },
    {
      id: "vn-l9-c1-l4",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại dân cư, kinh tế và các vùng kinh tế Việt Nam",
      quiz: [
        { t: "choice", q: "Dân số Việt Nam hiện nay khoảng bao nhiêu?", options: ["Hơn 100 triệu người", "50 triệu người", "20 triệu người", "300 triệu người"], answer: 0 },
        { t: "choice", q: "Vùng nào là vựa lúa xuất khẩu chủ lực?", options: ["Đồng bằng sông Cửu Long", "Tây Nguyên", "Tây Bắc", "Đông Bắc"], answer: 0 },
        { t: "choice", q: "Việt Nam có bao nhiêu vùng kinh tế – xã hội?", options: ["6", "3", "63", "34"], answer: 0 },
        { t: "truefalse", q: "Ngành dịch vụ đang chiếm tỉ trọng ngày càng cao trong kinh tế Việt Nam.", answer: true },
        { t: "match", q: "Nối vùng với thế mạnh.",
          pairs: [["Tây Nguyên", "Cà phê, cao su"], ["Đông Nam Bộ", "Công nghiệp năng động nhất"], ["Đồng bằng sông Hồng", "Vùng kinh tế trọng điểm phía Bắc"]] },
        { t: "choice", q: "Dân tộc nào chiếm đa số dân cư Việt Nam?", options: ["Kinh", "Tày", "Thái", "Khơ-me"], answer: 0 },
        { t: "drag", q: "Kéo mỗi vùng kinh tế vào đúng miền.",
          buckets: ["Miền Bắc", "Miền Trung", "Miền Nam"],
          items: [
            { label: "Trung du miền núi Bắc Bộ", bucket: 0 }, { label: "Đồng bằng sông Hồng", bucket: 0 },
            { label: "Bắc Trung Bộ và DH miền Trung", bucket: 1 }, { label: "Tây Nguyên", bucket: 1 },
            { label: "Đông Nam Bộ", bucket: 2 }, { label: "Đồng bằng sông Cửu Long", bucket: 2 },
          ] },
      ],
    },
  ],
};

// ===== Lớp 12 — theo mạch phần "Địa lí tự nhiên" (thiên nhiên phân hoá, sử dụng tài nguyên)
// và "Địa lí các vùng kinh tế" của Địa lí 12: các vùng kinh tế trọng điểm.

const c4 = {
  id: "vn-l12-c1",
  title: "Thiên nhiên phân hoá & Vùng kinh tế trọng điểm",
  icon: "pin",
  lessons: [
    {
      id: "vn-l12-c1-l1",
      title: "Thiên nhiên phân hoá đa dạng",
      goal: "Sự khác biệt tự nhiên theo Bắc – Nam, Đông – Tây và theo độ cao",
      teach: [
        { t: "intro", title: "Vì sao thiên nhiên Việt Nam không giống nhau khắp nơi?",
          body: "Do lãnh thổ trải dài trên nhiều vĩ độ và có địa hình phức tạp, thiên nhiên Việt Nam phân hoá rất đa dạng theo nhiều chiều khác nhau, không nơi nào giống hệt nơi nào.",
          bullets: ["Phân hoá Bắc – Nam: miền Bắc có mùa đông lạnh, miền Nam nóng quanh năm", "Phân hoá Đông – Tây: đồng bằng, trung du, miền núi khác biệt rõ rệt", "Phân hoá theo độ cao: càng lên cao khí hậu càng mát, xuất hiện đai cận nhiệt, ôn đới trên núi cao"] },
        { t: "topic", kicker: "Phân hoá Bắc – Nam", title: "Ranh giới là dãy Bạch Mã",
          body: "Dãy núi Bạch Mã (Thừa Thiên Huế cũ) được xem là ranh giới khí hậu quan trọng: phía Bắc chịu ảnh hưởng gió mùa Đông Bắc rõ rệt có mùa đông lạnh, phía Nam gió mùa Đông Bắc suy yếu, khí hậu nóng quanh năm.",
          facts: [{ label: "Ranh giới", value: "Dãy Bạch Mã" }] },
        { t: "topic", kicker: "Phân hoá theo độ cao", title: "Càng lên cao càng mát",
          body: "Ở vùng núi cao như Hoàng Liên Sơn, khí hậu thay đổi rõ rệt theo độ cao: chân núi nhiệt đới, lên cao dần chuyển sang cận nhiệt rồi ôn đới núi cao — vì vậy Sa Pa, Đà Lạt có khí hậu mát mẻ quanh năm dù nằm trong vùng nhiệt đới.",
          facts: [{ label: "Ví dụ", value: "Sa Pa, Đà Lạt mát quanh năm" }] },
      ],
      quiz: [
        { t: "choice", q: "Dãy núi nào được xem là ranh giới khí hậu Bắc – Nam của Việt Nam?", options: ["Bạch Mã", "Hoàng Liên Sơn", "Trường Sơn Bắc", "Tam Đảo"], answer: 0 },
        { t: "choice", q: "Vì sao Sa Pa, Đà Lạt mát mẻ quanh năm dù ở vùng nhiệt đới?", options: ["Vì nằm ở địa hình núi cao", "Vì gần biển", "Vì có nhiều hồ", "Vì nhiều gió mùa Đông Bắc"], answer: 0 },
        { t: "truefalse", q: "Thiên nhiên Việt Nam phân hoá đa dạng theo cả Bắc – Nam, Đông – Tây và độ cao.", answer: true },
        { t: "choice", q: "Phía Nam dãy Bạch Mã có đặc điểm khí hậu gì?", options: ["Nóng quanh năm, ít chịu ảnh hưởng gió mùa Đông Bắc", "Có mùa đông lạnh rõ rệt", "Băng tuyết quanh năm", "Khô hạn quanh năm"], answer: 0 },
      ],
    },
    {
      id: "vn-l12-c1-l2",
      title: "Sử dụng hợp lí tài nguyên & bảo vệ môi trường",
      goal: "Vấn đề khai thác tài nguyên thiên nhiên bền vững",
      teach: [
        { t: "topic", kicker: "Tài nguyên đất & rừng", title: "Khai thác đi đôi với bảo vệ",
          body: "Đất và rừng là hai tài nguyên quan trọng nhưng đang chịu áp lực suy giảm do khai thác quá mức, chuyển đổi mục đích sử dụng. Trồng rừng, phủ xanh đất trống đồi trọc là giải pháp quan trọng để phục hồi tài nguyên.",
          facts: [{ label: "Thách thức", value: "Suy giảm diện tích rừng" }, { label: "Giải pháp", value: "Trồng rừng, phủ xanh" }] },
        { t: "topic", kicker: "Tài nguyên nước & biển", title: "Bảo vệ nguồn nước, khai thác biển bền vững",
          body: "Ô nhiễm nguồn nước và khai thác hải sản quá mức đang là vấn đề đáng lo ngại. Phát triển kinh tế biển gắn với bảo vệ môi trường biển, hạn chế đánh bắt gần bờ, đẩy mạnh đánh bắt xa bờ và nuôi trồng bền vững.",
          facts: [{ label: "Vấn đề", value: "Ô nhiễm nước, đánh bắt quá mức" }] },
      ],
      quiz: [
        { t: "choice", q: "Giải pháp nào giúp phục hồi tài nguyên rừng đã suy giảm?", options: ["Trồng rừng, phủ xanh đất trống đồi trọc", "Chặt thêm rừng", "Đốt rừng làm rẫy", "Không cần giải pháp gì"], answer: 0 },
        { t: "truefalse", q: "Khai thác hải sản quá mức gần bờ là vấn đề đáng lo ngại hiện nay.", answer: true },
        { t: "choice", q: "Phát triển kinh tế biển bền vững cần đi kèm với điều gì?", options: ["Bảo vệ môi trường biển", "Khai thác không giới hạn", "Bỏ qua ô nhiễm", "Ngừng đánh bắt hoàn toàn"], answer: 0 },
      ],
    },
    {
      id: "vn-l12-c1-l3",
      title: "Các vùng kinh tế trọng điểm",
      goal: "Ba vùng kinh tế trọng điểm dẫn dắt tăng trưởng cả nước",
      teach: [
        { t: "intro", title: "Đầu tàu kinh tế của cả nước",
          body: "Vùng kinh tế trọng điểm là khu vực hội tụ đầy đủ điều kiện thuận lợi, có tốc độ tăng trưởng kinh tế nhanh, đóng góp lớn vào GDP cả nước, giữ vai trò đầu tàu lôi kéo các vùng khác cùng phát triển.",
          bullets: ["Vùng kinh tế trọng điểm Bắc Bộ (quanh Hà Nội, Hải Phòng, Quảng Ninh)", "Vùng kinh tế trọng điểm miền Trung (quanh Đà Nẵng, Huế)", "Vùng kinh tế trọng điểm phía Nam (quanh TP.HCM — lớn và năng động nhất)"] },
        { t: "topic", kicker: "Trọng điểm phía Nam", title: "Vùng có quy mô kinh tế lớn nhất cả nước",
          body: "Vùng kinh tế trọng điểm phía Nam, hạt nhân là TP. Hồ Chí Minh, đóng góp tỉ trọng GDP lớn nhất trong ba vùng trọng điểm, mạnh về công nghiệp, dịch vụ và thu hút đầu tư nước ngoài.",
          facts: [{ label: "Hạt nhân", value: "TP. Hồ Chí Minh" }, { label: "Đặc điểm", value: "Quy mô lớn nhất" }] },
      ],
      quiz: [
        { t: "choice", q: "Việt Nam hiện có mấy vùng kinh tế trọng điểm?", options: ["3", "6", "63", "1"], answer: 0 },
        { t: "choice", q: "Vùng kinh tế trọng điểm phía Nam có hạt nhân là thành phố nào?", options: ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"], answer: 0 },
        { t: "match", q: "Nối vùng kinh tế trọng điểm với thành phố hạt nhân.",
          pairs: [["Trọng điểm Bắc Bộ", "Hà Nội"], ["Trọng điểm miền Trung", "Đà Nẵng"], ["Trọng điểm phía Nam", "TP. Hồ Chí Minh"]] },
        { t: "truefalse", q: "Vùng kinh tế trọng điểm phía Nam có quy mô kinh tế lớn nhất trong ba vùng.", answer: true },
      ],
    },
    {
      id: "vn-l12-c1-l4",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại thiên nhiên phân hoá và các vùng kinh tế trọng điểm",
      quiz: [
        { t: "choice", q: "Dãy núi nào là ranh giới khí hậu Bắc – Nam?", options: ["Bạch Mã", "Hoàng Liên Sơn", "Trường Sơn", "Tam Đảo"], answer: 0 },
        { t: "choice", q: "Việt Nam có mấy vùng kinh tế trọng điểm?", options: ["3", "6", "34", "63"], answer: 0 },
        { t: "choice", q: "Vùng kinh tế trọng điểm phía Nam có hạt nhân là đâu?", options: ["TP. Hồ Chí Minh", "Hà Nội", "Cần Thơ", "Huế"], answer: 0 },
        { t: "truefalse", q: "Càng lên núi cao, khí hậu càng mát mẻ hơn.", answer: true },
        { t: "choice", q: "Giải pháp nào giúp phục hồi tài nguyên rừng?", options: ["Trồng rừng, phủ xanh đất trống", "Khai thác thêm", "Đốt rừng", "Không làm gì"], answer: 0 },
        { t: "drag", q: "Kéo mỗi thành phố vào đúng vùng kinh tế trọng điểm.",
          buckets: ["Trọng điểm Bắc Bộ", "Trọng điểm miền Trung", "Trọng điểm phía Nam"],
          items: [
            { label: "Hà Nội", bucket: 0 }, { label: "Hải Phòng", bucket: 0 },
            { label: "Đà Nẵng", bucket: 1 }, { label: "Huế", bucket: 1 },
            { label: "TP. Hồ Chí Minh", bucket: 2 }, { label: "Cần Thơ", bucket: 2 },
          ] },
      ],
    },
  ],
};

// ===== Lớp 6, 7, 10, 11 — phần Việt Nam. Chương trình thật của các lớp này thiên về Trái
// Đất/bản đồ (lớp 6), các châu lục (lớp 7), đại cương KT-XH thế giới (lớp 10) và các cường
// quốc/khu vực (lớp 11) — xem ở phân môn Thế giới cùng lớp. Ở đây soạn thêm nội dung song
// song, áp dụng đúng kỹ năng/khái niệm của từng lớp vào chính nước mình, để bài học không
// trống và có liên hệ thực tế Việt Nam.

const c5 = {
  id: "vn-l6-c1",
  title: "Việt Nam trên bản đồ",
  icon: "pin",
  lessons: [
    {
      id: "vn-l6-c1-l1",
      title: "Đọc bản đồ hành chính Việt Nam",
      goal: "Áp dụng kỹ năng đọc bản đồ vào bản đồ nước mình",
      teach: [
        { t: "intro", title: "Bản đồ hành chính là gì?",
          body: "Bản đồ hành chính thể hiện ranh giới các tỉnh, thành phố cùng vị trí thủ đô và trung tâm hành chính. Nhìn vào bản đồ, em có thể biết một tỉnh nằm ở miền nào, giáp những tỉnh nào.",
          bullets: ["Mỗi màu trên bản đồ thường là một tỉnh, thành khác nhau", "Kí hiệu ngôi sao hoặc chấm tròn lớn thường là thủ đô, trung tâm tỉnh", "Việt Nam hiện có 34 tỉnh, thành sau đợt sáp nhập năm 2025"] },
        { t: "topic", kicker: "Thực hành đọc bản đồ", title: "Xác định vị trí một tỉnh",
          body: "Để xác định một tỉnh nằm ở đâu, em nhìn vào vị trí trên bản đồ so với các mốc quen thuộc: gần biển hay trong nội địa, ở phía Bắc/Trung/Nam, giáp tỉnh nào và giáp nước nào (nếu có đường biên giới).",
          facts: [{ label: "Số tỉnh, thành", value: "34 (sau 2025)" }] },
      ],
      quiz: [
        { t: "choice", q: "Việt Nam hiện có bao nhiêu tỉnh, thành sau sáp nhập 2025?", options: ["34", "63", "6", "20"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào Hà Nội trên bản đồ.", targetType: "province", targetId: "ha-noi" },
        { t: "mapclick", q: "Hãy bấm vào TP. Hồ Chí Minh trên bản đồ.", targetType: "province", targetId: "tp-ho-chi-minh" },
        { t: "truefalse", q: "Bản đồ hành chính thể hiện ranh giới các tỉnh, thành.", answer: true },
      ],
    },
    {
      id: "vn-l6-c1-l2",
      title: "Việt Nam trong Đông Nam Á",
      goal: "Vị trí Việt Nam so với các nước láng giềng",
      teach: [
        { t: "topic", kicker: "So sánh vị trí", title: "Việt Nam nằm ở rìa đông Đông Nam Á lục địa",
          body: "So với các nước Đông Nam Á khác, Việt Nam có đường bờ biển dài nhất trong khối các nước lục địa (Lào, Campuchia, Thái Lan, Myanmar, Việt Nam), trải dài theo hướng Bắc – Nam kéo qua nhiều vĩ độ.",
          facts: [{ label: "Bờ biển", value: "~3.260 km" }, { label: "Láng giềng", value: "Trung Quốc, Lào, Campuchia" }] },
        { t: "culture", title: "Cầu nối trên bản đồ khu vực",
          body: "Nhờ vị trí ở rìa đông bán đảo Đông Dương, Việt Nam vừa có thể giao lưu với các nước Đông Nam Á lục địa qua đường bộ, vừa thông thương với thế giới qua Biển Đông — một vị trí địa lí rất thuận lợi." },
      ],
      quiz: [
        { t: "choice", q: "Việt Nam giáp những nước nào trong Đông Nam Á?", options: ["Lào, Campuchia", "Thái Lan, Myanmar", "Singapore, Malaysia", "Indonesia, Philippines"], answer: 0 },
        { t: "truefalse", q: "Việt Nam có đường bờ biển dài nhất trong nhóm nước Đông Nam Á lục địa.", answer: true },
        { t: "choice", q: "Việt Nam thông thương ra thế giới chủ yếu qua đâu?", options: ["Biển Đông", "Sa mạc", "Dãy Himalaya", "Bắc Băng Dương"], answer: 0 },
      ],
    },
    {
      id: "vn-l6-c1-l2b",
      title: "Tỉ lệ và kí hiệu trên bản đồ Việt Nam",
      goal: "Áp dụng kỹ năng tỉ lệ, kí hiệu vào bản đồ nước mình",
      teach: [
        { t: "topic", kicker: "Tỉ lệ bản đồ", title: "Đo khoảng cách thật từ bản đồ Việt Nam",
          body: "Trên bản đồ tỉ lệ 1:10.000.000 (1cm = 100km), khoảng cách từ Hà Nội tới TP. Hồ Chí Minh đo được khoảng 14cm trên bản đồ — tức khoảng 1.400km ngoài thực tế, đúng với chiều dài đất nước theo hướng Bắc – Nam.",
          facts: [{ label: "Hà Nội – TP.HCM", value: "~1.400 km theo đường chim bay" }] },
        { t: "topic", kicker: "Kí hiệu bản đồ", title: "Mỗi kí hiệu kể một câu chuyện",
          body: "Trên bản đồ Việt Nam, kí hiệu ngôi sao thường là Thủ đô Hà Nội, chấm tròn đậm là các thành phố lớn, đường màu xanh là sông, vùng màu xanh dương là biển. Biết đọc kí hiệu giúp em hiểu bản đồ nhanh hơn nhiều lần.",
          facts: [{ label: "Ngôi sao", value: "Thủ đô Hà Nội" }] },
      ],
      quiz: [
        { t: "choice", q: "Trên bản đồ tỉ lệ 1:10.000.000, 1cm tương ứng bao nhiêu km ngoài thực tế?", options: ["100 km", "10 km", "1.000 km", "1 km"], answer: 0 },
        { t: "choice", q: "Trên bản đồ Việt Nam, kí hiệu ngôi sao thường chỉ điều gì?", options: ["Thủ đô Hà Nội", "Một ngọn núi", "Một con sông", "Một sân bay"], answer: 0 },
        { t: "truefalse", q: "Khoảng cách Hà Nội – TP. Hồ Chí Minh theo đường chim bay khoảng 1.400km.", answer: true },
      ],
    },
    {
      id: "vn-l6-c1-l3",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại cách đọc bản đồ và vị trí Việt Nam trong khu vực",
      quiz: [
        { t: "choice", q: "Việt Nam có bao nhiêu tỉnh, thành hiện nay?", options: ["34", "63", "10", "6"], answer: 0 },
        { t: "mapclick", q: "Bấm vào Đà Nẵng.", targetType: "province", targetId: "da-nang" },
        { t: "choice", q: "Việt Nam giáp nước nào ở phía Bắc?", options: ["Trung Quốc", "Lào", "Thái Lan", "Nhật Bản"], answer: 0 },
        { t: "drag", q: "Kéo mỗi thành phố vào đúng miền.",
          buckets: ["Miền Bắc", "Miền Trung", "Miền Nam"],
          items: [{ label: "Hà Nội", bucket: 0 }, { label: "Huế", bucket: 1 }, { label: "Cần Thơ", bucket: 2 }] },
      ],
    },
  ],
};

const c6 = {
  id: "vn-l7-c1",
  title: "Việt Nam trong châu Á",
  icon: "pin",
  lessons: [
    {
      id: "vn-l7-c1-l1",
      title: "Việt Nam — một phần của châu Á",
      goal: "So sánh quy mô Việt Nam với châu Á",
      teach: [
        { t: "intro", title: "Một điểm nhỏ trên châu lục lớn nhất",
          body: "Châu Á rất rộng lớn với gần 50 quốc gia. Việt Nam là một quốc gia thuộc khu vực Đông Nam Á của châu Á, có diện tích và dân số ở mức trung bình so với các nước châu Á khác nhưng có vị trí địa – chiến lược quan trọng.",
          bullets: ["Việt Nam thuộc khu vực Đông Nam Á", "Châu Á có gần 50 quốc gia và vùng lãnh thổ", "Việt Nam có hơn 100 triệu dân — đông dân so với mặt bằng chung Đông Nam Á"] },
        { t: "topic", kicker: "So sánh khu vực", title: "Đông Nam Á trong lòng châu Á",
          body: "Đông Nam Á là một trong các khu vực của châu Á (cùng với Đông Á, Nam Á, Tây Nam Á, Trung Á), gồm phần lục địa (bán đảo Trung Ấn — có Việt Nam) và phần hải đảo (Indonesia, Philippines...).",
          facts: [{ label: "Khu vực", value: "Đông Nam Á" }, { label: "Thuộc phần", value: "Lục địa (bán đảo Trung Ấn)" }] },
      ],
      quiz: [
        { t: "choice", q: "Việt Nam thuộc khu vực nào của châu Á?", options: ["Đông Nam Á", "Nam Á", "Tây Nam Á", "Trung Á"], answer: 0 },
        { t: "choice", q: "Việt Nam thuộc phần nào của Đông Nam Á?", options: ["Phần lục địa", "Phần hải đảo", "Cả hai như nhau", "Không thuộc phần nào"], answer: 0 },
        { t: "truefalse", q: "Châu Á có gần 50 quốc gia và vùng lãnh thổ.", answer: true },
      ],
    },
    {
      id: "vn-l7-c1-l2",
      title: "Việt Nam và cộng đồng ASEAN",
      goal: "Vai trò của Việt Nam trong khối ASEAN",
      teach: [
        { t: "culture", title: "Thành viên tích cực của ASEAN",
          body: "Việt Nam gia nhập ASEAN năm 1995, trở thành thành viên tích cực trong các hoạt động hợp tác kinh tế, văn hoá, an ninh khu vực. Việt Nam từng đảm nhiệm vai trò Chủ tịch ASEAN, cho thấy vị thế ngày càng quan trọng trong khu vực." },
      ],
      quiz: [
        { t: "choice", q: "Việt Nam gia nhập ASEAN vào năm nào?", options: ["1995", "1975", "2000", "2010"], answer: 0 },
        { t: "truefalse", q: "Việt Nam từng đảm nhiệm vai trò Chủ tịch ASEAN.", answer: true },
        { t: "choice", q: "ASEAN là tổ chức hợp tác của khu vực nào?", options: ["Đông Nam Á", "Châu Âu", "Bắc Mỹ", "Châu Phi"], answer: 0 },
      ],
    },
    {
      id: "vn-l7-c1-l2b",
      title: "Việt Nam so với các nước châu Á",
      goal: "So sánh diện tích, dân số Việt Nam với một số nước châu Á",
      teach: [
        { t: "topic", kicker: "So sánh diện tích", title: "Việt Nam ở mức trung bình về diện tích",
          body: "Việt Nam có diện tích khoảng 331.000 km² — nhỏ hơn nhiều so với Trung Quốc hay Ấn Độ (mỗi nước rộng gần 30 lần Việt Nam), nhưng lớn hơn nhiều nước láng giềng như Lào hay Campuchia.",
          facts: [{ label: "Diện tích VN", value: "~331.000 km²" }] },
        { t: "topic", kicker: "So sánh dân số", title: "Việt Nam đông dân trong khu vực",
          body: "Với hơn 100 triệu dân, Việt Nam là một trong những nước đông dân nhất Đông Nam Á, chỉ sau Indonesia và Philippines, nhiều hơn hẳn Lào, Campuchia hay Singapore.",
          facts: [{ label: "Dân số VN", value: "Hơn 100 triệu người" }] },
      ],
      quiz: [
        { t: "choice", q: "Diện tích Việt Nam khoảng bao nhiêu km²?", options: ["331.000 km²", "3.310 km²", "3.310.000 km²", "33.100 km²"], answer: 0 },
        { t: "choice", q: "Việt Nam đông dân thứ mấy Đông Nam Á?", options: ["Thứ 3, sau Indonesia và Philippines", "Đông dân nhất", "Ít dân nhất", "Thứ 10"], answer: 0 },
        { t: "truefalse", q: "Việt Nam có diện tích nhỏ hơn nhiều so với Trung Quốc.", answer: true },
      ],
    },
    {
      id: "vn-l7-c1-l3",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại vị trí Việt Nam trong châu Á và ASEAN",
      quiz: [
        { t: "choice", q: "Việt Nam thuộc khu vực nào của châu Á?", options: ["Đông Nam Á", "Đông Á", "Nam Á", "Tây Á"], answer: 0 },
        { t: "choice", q: "Việt Nam gia nhập ASEAN năm nào?", options: ["1995", "1986", "2007", "1945"], answer: 0 },
        { t: "truefalse", q: "Việt Nam thuộc phần hải đảo của Đông Nam Á.", answer: false },
      ],
    },
  ],
};

const c7 = {
  id: "vn-l10-c1",
  title: "Việt Nam trong nền kinh tế toàn cầu",
  icon: "pin",
  lessons: [
    {
      id: "vn-l10-c1-l1",
      title: "Chuyển dịch cơ cấu kinh tế Việt Nam",
      goal: "Xu hướng thay đổi tỉ trọng các ngành kinh tế",
      teach: [
        { t: "topic", kicker: "Xu hướng chuyển dịch", title: "Từ nông nghiệp sang công nghiệp, dịch vụ",
          body: "Trong quá trình phát triển, tỉ trọng ngành nông nghiệp trong nền kinh tế Việt Nam giảm dần, trong khi tỉ trọng công nghiệp và dịch vụ ngày càng tăng — đây là xu hướng chuyển dịch cơ cấu kinh tế theo hướng công nghiệp hoá, hiện đại hoá.",
          facts: [{ label: "Xu hướng", value: "Giảm nông nghiệp, tăng CN-DV" }] },
      ],
      quiz: [
        { t: "choice", q: "Xu hướng chuyển dịch cơ cấu kinh tế Việt Nam là gì?", options: ["Giảm nông nghiệp, tăng công nghiệp - dịch vụ", "Chỉ phát triển nông nghiệp", "Không thay đổi", "Giảm cả 3 ngành"], answer: 0 },
        { t: "truefalse", q: "Công nghiệp hoá, hiện đại hoá là mục tiêu chuyển dịch cơ cấu kinh tế Việt Nam.", answer: true },
      ],
    },
    {
      id: "vn-l10-c1-l2",
      title: "Việt Nam hội nhập kinh tế quốc tế",
      goal: "Các tổ chức và hiệp định Việt Nam tham gia",
      teach: [
        { t: "culture", title: "Mở cửa và hội nhập",
          body: "Việt Nam tham gia nhiều tổ chức và hiệp định thương mại quốc tế như ASEAN, WTO (Tổ chức Thương mại Thế giới) và các hiệp định thương mại tự do (FTA) với nhiều đối tác, giúp hàng hoá Việt Nam xuất khẩu đi khắp thế giới." },
      ],
      quiz: [
        { t: "choice", q: "WTO là viết tắt của tổ chức nào?", options: ["Tổ chức Thương mại Thế giới", "Tổ chức Y tế Thế giới", "Liên minh châu Âu", "Ngân hàng Thế giới"], answer: 0 },
        { t: "truefalse", q: "Việt Nam đã kí nhiều hiệp định thương mại tự do (FTA) với các đối tác.", answer: true },
      ],
    },
    {
      id: "vn-l10-c1-l2b",
      title: "Đô thị hoá ở Việt Nam",
      goal: "Quá trình đô thị hoá và các đô thị lớn",
      teach: [
        { t: "topic", kicker: "Đô thị hoá", title: "Tốc độ đô thị hoá đang tăng nhanh",
          body: "Tỉ lệ dân số đô thị của Việt Nam đang tăng nhanh qua từng năm nhưng vẫn thấp hơn nhiều nước trong khu vực. Hà Nội và TP. Hồ Chí Minh là hai đô thị đặc biệt, tập trung dân cư và hoạt động kinh tế lớn nhất cả nước.",
          facts: [{ label: "Đô thị đặc biệt", value: "Hà Nội, TP. Hồ Chí Minh" }] },
        { t: "culture", title: "Cơ hội và áp lực",
          body: "Đô thị hoá mang lại việc làm, thu nhập tốt hơn cho người dân, nhưng cũng gây áp lực lớn về nhà ở, giao thông, hạ tầng và môi trường tại các thành phố lớn." },
      ],
      quiz: [
        { t: "choice", q: "Hai đô thị đặc biệt của Việt Nam là gì?", options: ["Hà Nội và TP. Hồ Chí Minh", "Huế và Cần Thơ", "Hải Phòng và Đà Nẵng", "Không có đô thị đặc biệt"], answer: 0 },
        { t: "truefalse", q: "Đô thị hoá nhanh có thể gây áp lực về nhà ở, giao thông.", answer: true },
      ],
    },
    {
      id: "vn-l10-c1-l3",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại chuyển dịch cơ cấu và hội nhập kinh tế Việt Nam",
      quiz: [
        { t: "choice", q: "Xu hướng chuyển dịch cơ cấu kinh tế Việt Nam là gì?", options: ["Giảm nông nghiệp, tăng công nghiệp - dịch vụ", "Chỉ trồng lúa", "Không đổi", "Tăng nông nghiệp"], answer: 0 },
        { t: "choice", q: "Việt Nam là thành viên của tổ chức thương mại thế giới nào?", options: ["WTO", "NATO", "EU", "OPEC"], answer: 0 },
      ],
    },
  ],
};

const c8 = {
  id: "vn-l11-c1",
  title: "Việt Nam và các đối tác toàn cầu",
  icon: "pin",
  lessons: [
    {
      id: "vn-l11-c1-l1",
      title: "Việt Nam trong ASEAN",
      goal: "Hợp tác kinh tế, chính trị của Việt Nam với khối ASEAN",
      teach: [
        { t: "topic", kicker: "Hợp tác khu vực", title: "Việt Nam — mắt xích quan trọng của ASEAN",
          body: "Việt Nam tích cực tham gia Cộng đồng ASEAN trên cả ba trụ cột: chính trị – an ninh, kinh tế và văn hoá – xã hội, góp phần giữ vững hoà bình, ổn định và thúc đẩy hợp tác phát triển trong khu vực.",
          facts: [{ label: "Ba trụ cột ASEAN", value: "Chính trị-an ninh, Kinh tế, Văn hoá-xã hội" }] },
      ],
      quiz: [
        { t: "choice", q: "Cộng đồng ASEAN có mấy trụ cột hợp tác?", options: ["3", "1", "5", "10"], answer: 0 },
        { t: "truefalse", q: "Việt Nam tham gia tích cực vào Cộng đồng ASEAN.", answer: true },
      ],
    },
    {
      id: "vn-l11-c1-l2",
      title: "Việt Nam trong chuỗi cung ứng toàn cầu",
      goal: "Các đối tác thương mại lớn của Việt Nam",
      teach: [
        { t: "culture", title: "Mắt xích trong chuỗi sản xuất thế giới",
          body: "Việt Nam trở thành điểm đến sản xuất quan trọng trong chuỗi cung ứng toàn cầu, với các đối tác thương mại và đầu tư lớn như Hoa Kỳ, Trung Quốc, Nhật Bản, Hàn Quốc và Liên minh châu Âu (EU)." },
      ],
      quiz: [
        { t: "choice", q: "Đâu là một trong những đối tác thương mại lớn của Việt Nam?", options: ["Hoa Kỳ", "Nam Cực", "Không quốc gia nào", "Mặt Trăng"], answer: 0 },
        { t: "truefalse", q: "Việt Nam là một điểm đến sản xuất quan trọng trong chuỗi cung ứng toàn cầu.", answer: true },
      ],
    },
    {
      id: "vn-l11-c1-l2b",
      title: "Việt Nam thu hút đầu tư nước ngoài",
      goal: "Vai trò của vốn đầu tư trực tiếp nước ngoài (FDI)",
      teach: [
        { t: "topic", kicker: "Đầu tư nước ngoài", title: "FDI — động lực quan trọng của kinh tế Việt Nam",
          body: "Vốn đầu tư trực tiếp nước ngoài (FDI) đổ vào Việt Nam ngày càng nhiều, tập trung chủ yếu ở các khu công nghiệp thuộc Đông Nam Bộ và Đồng bằng sông Hồng, giúp tạo việc làm, chuyển giao công nghệ và thúc đẩy xuất khẩu.",
          facts: [{ label: "FDI viết tắt", value: "Đầu tư trực tiếp nước ngoài" }, { label: "Tập trung", value: "Đông Nam Bộ, ĐB sông Hồng" }] },
      ],
      quiz: [
        { t: "choice", q: "FDI là viết tắt của gì?", options: ["Đầu tư trực tiếp nước ngoài", "Đầu tư trong nước", "Đầu tư chứng khoán", "Đầu tư công"], answer: 0 },
        { t: "choice", q: "FDI vào Việt Nam tập trung nhiều nhất ở đâu?", options: ["Đông Nam Bộ, ĐB sông Hồng", "Tây Bắc", "Tây Nguyên", "Vùng núi phía Bắc"], answer: 0 },
      ],
    },
    {
      id: "vn-l11-c1-l3",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại quan hệ của Việt Nam với ASEAN và các đối tác toàn cầu",
      quiz: [
        { t: "choice", q: "Cộng đồng ASEAN có mấy trụ cột?", options: ["3", "2", "5", "7"], answer: 0 },
        { t: "choice", q: "Việt Nam có quan hệ thương mại lớn với đối tác nào?", options: ["Hoa Kỳ, Trung Quốc, Nhật Bản, EU", "Chỉ có Lào", "Không có đối tác nào", "Chỉ có Campuchia"], answer: 0 },
      ],
    },
  ],
};

// ===== Lớp 4-5, chương 2 — 28 tỉnh, thành còn lại (cùng 6 thành phố đã học ở chương 1 là
// đủ 34 đơn vị hành chính sau sáp nhập 2025). Số liệu diện tích, dân số, sáp nhập lấy đúng
// từ dữ liệu bản đồ (Free-GIS-Data), không phải ước lượng.

function p2(id, name, mien, dienTich, danSo, sapNhap) {
  return { t: "place", id, title: name, subtitle: `${REGION_NAME[mien]}`,
    body: `${name} là tỉnh thuộc ${REGION_NAME[mien].toLowerCase()}, được thành lập từ việc sáp nhập ${sapNhap} vào năm 2025.`,
    facts: [{ label: "Miền", value: REGION_NAME[mien] }, { label: "Diện tích", value: `${dienTich.toLocaleString("vi-VN")} km²` }, { label: "Dân số", value: `~${(danSo / 1000000).toFixed(1)} triệu` }] };
}
const REGION_NAME = { bac: "Miền Bắc", trung: "Miền Trung", nam: "Miền Nam" };

const c1b = {
  id: "vn-l45-c2",
  title: "34 tỉnh, thành Việt Nam",
  icon: "pin",
  lessons: [
    {
      id: "vn-l45-c2-l1",
      title: "Miền Bắc (phần 1)",
      goal: "Bắc Ninh, Cao Bằng, Hưng Yên, Lai Châu, Lào Cai, Lạng Sơn, Ninh Bình",
      teach: [
        p2("bac-ninh", "Bắc Ninh", "bac", 4718, 3619433, "Bắc Ninh, Bắc Giang"),
        p2("cao-bang", "Cao Bằng", "bac", 6701, 573119, "Cao Bằng (giữ nguyên)"),
        p2("hung-yen", "Hưng Yên", "bac", 2515, 3567943, "Hưng Yên, Thái Bình"),
        p2("lai-chau", "Lai Châu", "bac", 9069, 512601, "Lai Châu (giữ nguyên)"),
        p2("lao-cai", "Lào Cai", "bac", 13256, 1770645, "Lào Cai, Yên Bái"),
        p2("lang-son", "Lạng Sơn", "bac", 8310, 881384, "Lạng Sơn (giữ nguyên)"),
        p2("ninh-binh", "Ninh Bình", "bac", 3821, 4412264, "Hà Nam, Ninh Bình, Nam Định"),
      ],
      quiz: [
        { t: "mapclick", q: "Hãy bấm vào Bắc Ninh trên bản đồ.", targetType: "province", targetId: "bac-ninh" },
        { t: "mapclick", q: "Hãy bấm vào Lào Cai trên bản đồ.", targetType: "province", targetId: "lao-cai" },
        { t: "choice", q: "Tỉnh nào được sáp nhập từ Hà Nam, Ninh Bình và Nam Định?", options: ["Ninh Bình", "Bắc Ninh", "Cao Bằng", "Lạng Sơn"], answer: 0 },
        { t: "order", q: "Sắp xếp theo diện tích tăng dần.", items: ["Hưng Yên", "Bắc Ninh", "Lào Cai"] },
        { t: "truefalse", q: "Cao Bằng và Lai Châu là hai tỉnh giữ nguyên địa giới, không sáp nhập năm 2025.", answer: true },
      ],
    },
    {
      id: "vn-l45-c2-l2",
      title: "Miền Bắc (phần 2)",
      goal: "Phú Thọ, Quảng Ninh, Sơn La, Thái Nguyên, Tuyên Quang, Điện Biên",
      teach: [
        p2("phu-tho", "Phú Thọ", "bac", 9362, 4022493, "Phú Thọ, Vĩnh Phúc, Hoà Bình"),
        p2("quang-ninh", "Quảng Ninh", "bac", 6155, 1497447, "Quảng Ninh (giữ nguyên)"),
        p2("son-la", "Sơn La", "bac", 14109, 1404587, "Sơn La (giữ nguyên)"),
        p2("thai-nguyen", "Thái Nguyên", "bac", 8376, 1799489, "Thái Nguyên, Bắc Kạn"),
        p2("tuyen-quang", "Tuyên Quang", "bac", 13796, 1865270, "Tuyên Quang, Hà Giang"),
        p2("dien-bien", "Điện Biên", "bac", 9539, 673091, "Điện Biên (giữ nguyên)"),
      ],
      quiz: [
        { t: "mapclick", q: "Hãy bấm vào Quảng Ninh trên bản đồ.", targetType: "province", targetId: "quang-ninh" },
        { t: "mapclick", q: "Hãy bấm vào Điện Biên trên bản đồ.", targetType: "province", targetId: "dien-bien" },
        { t: "choice", q: "Tỉnh nào được sáp nhập từ Phú Thọ, Vĩnh Phúc và Hoà Bình?", options: ["Phú Thọ", "Sơn La", "Tuyên Quang", "Thái Nguyên"], answer: 0 },
        { t: "drag", q: "Kéo mỗi tỉnh vào đúng nhóm sáp nhập hay giữ nguyên năm 2025.",
          buckets: ["Có sáp nhập", "Giữ nguyên"],
          items: [{ label: "Phú Thọ", bucket: 0 }, { label: "Thái Nguyên", bucket: 0 }, { label: "Sơn La", bucket: 1 }, { label: "Điện Biên", bucket: 1 }] },
      ],
    },
    {
      id: "vn-l45-c2-l3",
      title: "Miền Trung (phần 1)",
      goal: "Gia Lai, Hà Tĩnh, Khánh Hoà, Lâm Đồng",
      teach: [
        p2("gia-lai", "Gia Lai", "trung", 21577, 3583691, "Gia Lai, Bình Định"),
        p2("ha-tinh", "Hà Tĩnh", "trung", 5995, 1617938, "Hà Tĩnh (giữ nguyên)"),
        p2("khanh-hoa", "Khánh Hoà", "trung", 8556, 2243553, "Khánh Hoà, Ninh Thuận"),
        p2("lam-dong", "Lâm Đồng", "trung", 24244, 3872999, "Lâm Đồng, Đắk Nông, Bình Thuận"),
      ],
      quiz: [
        { t: "mapclick", q: "Hãy bấm vào Gia Lai trên bản đồ.", targetType: "province", targetId: "gia-lai" },
        { t: "mapclick", q: "Hãy bấm vào Lâm Đồng trên bản đồ.", targetType: "province", targetId: "lam-dong" },
        { t: "choice", q: "Tỉnh nào được sáp nhập từ 3 tỉnh Lâm Đồng, Đắk Nông và Bình Thuận?", options: ["Lâm Đồng", "Gia Lai", "Khánh Hoà", "Hà Tĩnh"], answer: 0 },
        { t: "order", q: "Sắp xếp theo diện tích tăng dần.", items: ["Hà Tĩnh", "Khánh Hoà", "Lâm Đồng"] },
      ],
    },
    {
      id: "vn-l45-c2-l4",
      title: "Miền Trung (phần 2)",
      goal: "Nghệ An, Quảng Ngãi, Quảng Trị, Thanh Hoá, Đắk Lắk",
      teach: [
        p2("nghe-an", "Nghệ An", "trung", 16487, 3831694, "Nghệ An (giữ nguyên)"),
        p2("quang-ngai", "Quảng Ngãi", "trung", 14832, 2161735, "Quảng Ngãi, Kon Tum"),
        p2("quang-tri", "Quảng Trị", "trung", 12700, 1870844, "Quảng Trị, Quảng Bình"),
        p2("thanh-hoa", "Thanh Hoá", "trung", 11115, 4320947, "Thanh Hoá (giữ nguyên)"),
        p2("dak-lak", "Đắk Lắk", "trung", 18096, 3346853, "Đắk Lắk, Phú Yên"),
      ],
      quiz: [
        { t: "mapclick", q: "Hãy bấm vào Nghệ An trên bản đồ.", targetType: "province", targetId: "nghe-an" },
        { t: "mapclick", q: "Hãy bấm vào Đắk Lắk trên bản đồ.", targetType: "province", targetId: "dak-lak" },
        { t: "choice", q: "Tỉnh nào là tỉnh có diện tích lớn nhất trong 5 tỉnh vừa học?", options: ["Đắk Lắk", "Nghệ An", "Thanh Hoá", "Quảng Trị"], answer: 0 },
        { t: "truefalse", q: "Quảng Trị được sáp nhập từ Quảng Trị và Quảng Bình.", answer: true },
      ],
    },
    {
      id: "vn-l45-c2-l5",
      title: "Miền Nam (phần còn lại)",
      goal: "An Giang, Cà Mau, Tây Ninh, Vĩnh Long, Đồng Nai",
      teach: [
        p2("an-giang", "An Giang", "nam", 9987, 4995214, "An Giang, Kiên Giang"),
        p2("ca-mau", "Cà Mau", "nam", 6311, 1988464, "Cà Mau, Bạc Liêu"),
        p2("tay-ninh", "Tây Ninh", "nam", 8537, 3254170, "Tây Ninh, Long An"),
        p2("vinh-long", "Vĩnh Long", "nam", 6243, 4257581, "Vĩnh Long, Trà Vinh, Bến Tre"),
        p2("dong-nai", "Đồng Nai", "nam", 12737, 4491408, "Đồng Nai, Bình Phước"),
      ],
      quiz: [
        { t: "mapclick", q: "Hãy bấm vào An Giang trên bản đồ.", targetType: "province", targetId: "an-giang" },
        { t: "mapclick", q: "Hãy bấm vào Cà Mau trên bản đồ.", targetType: "province", targetId: "ca-mau" },
        { t: "choice", q: "Tỉnh nào được sáp nhập từ 3 tỉnh Vĩnh Long, Trà Vinh và Bến Tre?", options: ["Vĩnh Long", "An Giang", "Tây Ninh", "Cà Mau"], answer: 0 },
        { t: "order", q: "Sắp xếp theo dân số tăng dần.", items: ["Cà Mau", "Tây Ninh", "An Giang"] },
      ],
    },
    {
      id: "vn-l45-c2-l6",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại toàn bộ 34 tỉnh, thành Việt Nam",
      quiz: [
        { t: "mapclick", q: "Bấm vào Phú Thọ.", targetType: "province", targetId: "phu-tho" },
        { t: "mapclick", q: "Bấm vào Khánh Hoà.", targetType: "province", targetId: "khanh-hoa" },
        { t: "mapclick", q: "Bấm vào Đồng Nai.", targetType: "province", targetId: "dong-nai" },
        { t: "choice", q: "Việt Nam có tất cả bao nhiêu tỉnh, thành sau sáp nhập 2025?", options: ["34", "63", "6", "28"], answer: 0 },
        { t: "drag", q: "Kéo mỗi tỉnh vào đúng miền.",
          buckets: ["Miền Bắc", "Miền Trung", "Miền Nam"],
          items: [
            { label: "Lào Cai", bucket: 0 }, { label: "Quảng Ninh", bucket: 0 },
            { label: "Nghệ An", bucket: 1 }, { label: "Lâm Đồng", bucket: 1 },
            { label: "An Giang", bucket: 2 }, { label: "Đồng Nai", bucket: 2 },
          ] },
        { t: "truefalse", q: "Một số tỉnh như Cao Bằng, Lai Châu, Sơn La giữ nguyên địa giới, không sáp nhập năm 2025.", answer: true },
      ],
    },
  ],
};

export const VN_COURSE = {
  subject: "vn",
  levels: {
    l45: { chapters: [c1, c1b] },
    l6:  { chapters: [c5] },
    l7:  { chapters: [c6] },
    l8:  { chapters: [c2] },
    l9:  { chapters: [c3] },
    l10: { chapters: [c7] },
    l11: { chapters: [c8] },
    l12: { chapters: [c4] },
  },
};
