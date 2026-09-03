// Nội dung khoá "Địa Lý Thế Giới". Cấp Lớp 4-5 làm mẫu đầy đủ; 6-9 và 10-12 để trống.
//
// Mỗi quốc gia đi theo mạch: Vị trí & thủ đô -> Tự nhiên & kinh tế -> Văn hoá, gom theo
// khu vực địa lý (láng giềng Đông Nam Á, châu Á - Âu, châu Mỹ, châu Phi - Đại Dương) thay
// vì rập khuôn "từ vựng" như app học ngoại ngữ.

export const WORLD_LEVELS = [
  { id: "l45", label: "Lớp 4–5",  sub: "Làm quen",         ready: true  },
  { id: "l6",  label: "Lớp 6",    sub: "Trái Đất & Bản đồ",ready: true  },
  { id: "l7",  label: "Lớp 7",    sub: "Các châu lục",     ready: true  },
  { id: "l8",  label: "Lớp 8",    sub: "Tự nhiên châu Á",  ready: true  },
  { id: "l9",  label: "Lớp 9",    sub: "Dân cư châu Á",    ready: true  },
  { id: "l10", label: "Lớp 10",   sub: "Kinh tế - xã hội", ready: true  },
  { id: "l11", label: "Lớp 11",   sub: "Khu vực, quốc gia",ready: true  },
  { id: "l12", label: "Lớp 12",   sub: "Thế giới đương đại",ready: true },
];

function place(id, name, capital, note) {
  return { t: "place", id, title: name, subtitle: `${note} · Thủ đô ${capital}`,
    body: `${name} thuộc ${note.toLowerCase()}, có thủ đô là ${capital}.`,
    facts: [{ label: "Thủ đô", value: capital }, { label: "Vị trí", value: note }] };
}
function topic(title, body, facts) {
  return { t: "topic", kicker: "Tự nhiên & kinh tế", title, body, facts };
}
function culture(title, body) {
  return { t: "culture", title, body };
}

const c1 = {
  id: "wd-l45-c1",
  title: "Châu lục & quốc gia tiêu biểu",
  icon: "book",
  lessons: [
    {
      id: "wd-l45-c1-l1",
      title: "Có bao nhiêu châu lục?",
      goal: "Kể tên 6 châu lục trên Trái Đất",
      teach: [
        { t: "intro", title: "6 châu lục trên Trái Đất",
          body: "Đất liền trên Trái Đất được chia thành 6 châu lục lớn. Mỗi châu lục là một vùng đất rộng lớn, có nhiều quốc gia sinh sống bên trong (riêng châu Nam Cực gần như không có người ở).",
          bullets: ["Châu Á — đông dân và rộng nhất", "Châu Âu, Châu Phi, Châu Mỹ", "Châu Đại Dương và Châu Nam Cực"] },
        { t: "region", title: "Châu Á & Châu Âu", region: null, continentPair: ["chau-a", "chau-au"],
          body: "Châu Á là châu lục rộng và đông dân nhất, Việt Nam nằm ở đây. Châu Âu nằm phía tây châu Á, có nhiều quốc gia phát triển lâu đời." },
        { t: "region", title: "Châu Phi & Châu Mỹ", region: null, continentPair: ["chau-phi", "chau-my"],
          body: "Châu Phi có sa mạc Sahara rộng lớn nhất thế giới. Châu Mỹ trải dài từ Bắc xuống Nam, gồm Bắc Mỹ và Nam Mỹ, nối với nhau bằng dải đất hẹp Trung Mỹ." },
        { t: "culture", title: "Châu Đại Dương & Châu Nam Cực",
          body: "Châu Đại Dương gồm Australia và hàng nghìn đảo giữa Thái Bình Dương. Châu Nam Cực quanh năm băng tuyết, là nơi lạnh nhất Trái Đất và hầu như không có ai sinh sống lâu dài ở đó." },
      ],
      quiz: [
        { t: "choice", q: "Trái Đất có tất cả bao nhiêu châu lục?", options: ["6", "4", "5", "8"], answer: 0 },
        { t: "choice", q: "Việt Nam thuộc châu lục nào?", options: ["Châu Á", "Châu Âu", "Châu Phi", "Châu Mỹ"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào một quốc gia bất kỳ thuộc CHÂU Á trên bản đồ.", targetType: "continent", targetId: "chau-a" },
        { t: "mapclick", q: "Hãy bấm vào một quốc gia bất kỳ thuộc CHÂU MỸ trên bản đồ.", targetType: "continent", targetId: "chau-my" },
        { t: "blank", q: "Châu lục lạnh nhất, quanh năm băng tuyết là châu ___.", answer: "Nam Cực", options: ["Nam Cực", "Á", "Phi", "Âu"] },
        { t: "choice", q: "Australia thuộc châu lục nào?", options: ["Châu Đại Dương", "Châu Á", "Châu Phi", "Châu Âu"], answer: 0 },
        { t: "truefalse", q: "Châu Nam Cực có rất đông người sinh sống lâu dài.", answer: false },
        { t: "choice", q: "Sa mạc Sahara — sa mạc lớn nhất thế giới — nằm ở châu lục nào?", options: ["Châu Phi", "Châu Á", "Châu Mỹ", "Châu Âu"], answer: 0 },
      ],
    },
    {
      id: "wd-l45-c1-l2",
      title: "Láng giềng Đông Nam Á",
      goal: "Trung Quốc, Lào, Campuchia, Thái Lan",
      teach: [
        place("cn", "Trung Quốc", "Bắc Kinh", "Đông Á, giáp phía Bắc Việt Nam"),
        topic("Tự nhiên, kinh tế Trung Quốc",
          "Địa hình rất đa dạng: cao nguyên Tây Tạng đồ sộ ở phía Tây, đồng bằng rộng lớn ở phía Đông. Là một trong những nền công nghiệp chế tạo lớn nhất thế giới.",
          [{ label: "Địa hình", value: "Cao nguyên & đồng bằng" }, { label: "Kinh tế", value: "Công nghiệp chế tạo" }]),
        culture("Văn hoá Trung Quốc",
          "Có Vạn Lý Trường Thành — công trình do con người xây dựng dài nhất thế giới, và Tử Cấm Thành ở Bắc Kinh. Tết Nguyên Đán là lễ hội quan trọng nhất trong năm."),
        place("la", "Lào", "Viêng Chăn", "Đông Nam Á, giáp phía Tây Việt Nam"),
        topic("Tự nhiên, kinh tế Lào",
          "Chủ yếu là núi và cao nguyên, sông Mê Kông chảy dọc đất nước. Đây là nước duy nhất ở Đông Nam Á lục địa không giáp biển. Kinh tế dựa vào nông nghiệp và thuỷ điện trên sông Mê Kông.",
          [{ label: "Địa hình", value: "Núi, cao nguyên" }, { label: "Đặc điểm", value: "Không giáp biển" }]),
        culture("Văn hoá Lào",
          "Phật giáo là quốc giáo, ảnh hưởng sâu sắc đến đời sống người Lào. Cố đô Luang Prabang là Di sản Thế giới UNESCO. Lễ hội té nước Bun Pi May mừng năm mới."),
        place("kh", "Campuchia", "Phnôm Pênh", "Đông Nam Á, giáp phía Tây Nam Việt Nam"),
        topic("Tự nhiên, kinh tế Campuchia",
          "Đồng bằng thấp quanh hồ Tonlé Sap — hồ nước ngọt lớn nhất Đông Nam Á, mở rộng gấp nhiều lần vào mùa mưa. Kinh tế chủ yếu là nông nghiệp (lúa gạo) và du lịch di sản.",
          [{ label: "Đặc điểm", value: "Hồ Tonlé Sap" }, { label: "Kinh tế", value: "Nông nghiệp, du lịch" }]),
        culture("Văn hoá Campuchia",
          "Đền Angkor Wat là quần thể đền thờ tôn giáo lớn nhất thế giới, biểu tượng in trên quốc kỳ Campuchia. Múa Apsara là nghệ thuật truyền thống nổi tiếng."),
        place("th", "Thái Lan", "Băng Cốc", "Đông Nam Á, phía Tây Campuchia và Lào"),
        topic("Tự nhiên, kinh tế Thái Lan",
          "Đồng bằng trung tâm quanh sông Chao Phraya, núi ở phía Bắc, bán đảo hẹp ở phía Nam. Là một trong những nước xuất khẩu gạo hàng đầu thế giới, kinh tế còn mạnh về du lịch và công nghiệp ô tô.",
          [{ label: "Địa hình", value: "Đồng bằng, núi, bán đảo" }, { label: "Kinh tế", value: "Xuất khẩu gạo, du lịch" }]),
        culture("Văn hoá Thái Lan",
          "Phật giáo là quốc giáo. Chùa Wat Arun và Wat Pho ở Băng Cốc rất nổi tiếng. Tết té nước Songkran mừng năm mới cổ truyền."),
      ],
      quiz: [
        { t: "choice", q: "Nước nào giáp Việt Nam ở phía Bắc?", options: ["Trung Quốc", "Lào", "Campuchia", "Thái Lan"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào Lào trên bản đồ.", targetType: "country", targetId: "la" },
        { t: "mapclick", q: "Hãy bấm vào Campuchia trên bản đồ.", targetType: "country", targetId: "kh" },
        { t: "mapclick", q: "Hãy bấm vào Thái Lan trên bản đồ.", targetType: "country", targetId: "th" },
        { t: "match", q: "Nối quốc gia với thủ đô.",
          pairs: [["Trung Quốc", "Bắc Kinh"], ["Lào", "Viêng Chăn"], ["Campuchia", "Phnôm Pênh"], ["Thái Lan", "Băng Cốc"]] },
        { t: "truefalse", q: "Lào là nước duy nhất ở Đông Nam Á lục địa không giáp biển.", answer: true },
        { t: "choice", q: "Hồ nước ngọt lớn nhất Đông Nam Á nằm ở nước nào?", options: ["Campuchia", "Lào", "Thái Lan", "Trung Quốc"], answer: 0 },
        { t: "choice", q: "Nước nào xuất khẩu gạo hàng đầu thế giới, có chùa Wat Arun nổi tiếng?", options: ["Thái Lan", "Lào", "Trung Quốc", "Campuchia"], answer: 0 },
        { t: "type", q: "Gõ tên thủ đô của Campuchia.", answer: "Phnôm Pênh", accept: ["phnôm pênh", "phnom penh"] },
      ],
    },
    {
      id: "wd-l45-c1-l3",
      title: "Châu Á xa & Châu Âu",
      goal: "Nhật Bản, Hàn Quốc, Pháp, Anh",
      teach: [
        place("jp", "Nhật Bản", "Tô-ky-ô", "Đông Á, quốc đảo ngoài khơi Thái Bình Dương"),
        topic("Tự nhiên, kinh tế Nhật Bản",
          "Là quần đảo hình thành từ núi lửa, thường xuyên có động đất, khí hậu 4 mùa rõ rệt. Kinh tế rất mạnh về công nghệ cao, ô tô và điện tử.",
          [{ label: "Địa hình", value: "Quần đảo núi lửa" }, { label: "Kinh tế", value: "Công nghệ, ô tô" }]),
        culture("Văn hoá Nhật Bản",
          "Hoa anh đào nở rộ mỗi mùa xuân, núi Phú Sĩ là biểu tượng quốc gia. Trà đạo, kimono và truyện tranh manga là những nét văn hoá nổi tiếng khắp thế giới."),
        place("kr", "Hàn Quốc", "Xê-un", "Đông Á, nửa phía Nam bán đảo Triều Tiên"),
        topic("Tự nhiên, kinh tế Hàn Quốc",
          "Phần lớn diện tích là đồi núi, khí hậu 4 mùa. Kinh tế nổi bật về công nghệ (điện thoại, chip bán dẫn) và công nghiệp giải trí.",
          [{ label: "Địa hình", value: "Đồi núi" }, { label: "Kinh tế", value: "Công nghệ, giải trí" }]),
        culture("Văn hoá Hàn Quốc",
          "Làn sóng Hallyu (K-pop, phim truyền hình Hàn Quốc) nổi tiếng toàn cầu. Trang phục truyền thống Hanbok và món kim chi là biểu tượng văn hoá."),
        place("fr", "Pháp", "Pa-ri", "Tây Âu"),
        topic("Tự nhiên, kinh tế Pháp",
          "Phần lớn là đồng bằng rộng, có dãy núi Alps ở phía Đông Nam, khí hậu ôn đới. Nổi tiếng về rượu vang, thời trang, và là quốc gia được khách du lịch ghé thăm nhiều nhất thế giới.",
          [{ label: "Địa hình", value: "Đồng bằng, núi Alps" }, { label: "Kinh tế", value: "Du lịch, thời trang" }]),
        culture("Văn hoá Pháp",
          "Tháp Eiffel là biểu tượng của Pa-ri và cả nước Pháp. Bảo tàng Louvre là một trong những bảo tàng nghệ thuật lớn nhất thế giới, lưu giữ bức tranh Mona Lisa."),
        place("gb", "Anh", "Luân Đôn", "Tây Âu, đảo quốc"),
        topic("Tự nhiên, kinh tế Anh",
          "Là đảo quốc, địa hình chủ yếu đồi thấp, khí hậu ôn đới hải dương (mưa nhiều, ít nắng gắt). Luân Đôn là một trong những trung tâm tài chính lớn nhất thế giới.",
          [{ label: "Địa hình", value: "Đảo, đồi thấp" }, { label: "Kinh tế", value: "Tài chính" }]),
        culture("Văn hoá Anh",
          "Vương quốc Anh gồm 4 vùng: Anh, Scotland, Wales và Bắc Ireland. Tháp đồng hồ Big Ben, bóng đá Ngoại hạng Anh và văn hoá trà chiều rất nổi tiếng."),
      ],
      quiz: [
        { t: "choice", q: "Núi Phú Sĩ là biểu tượng nổi tiếng của nước nào?", options: ["Nhật Bản", "Hàn Quốc", "Trung Quốc", "Pháp"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào Pháp trên bản đồ.", targetType: "country", targetId: "fr" },
        { t: "mapclick", q: "Hãy bấm vào Nhật Bản trên bản đồ.", targetType: "country", targetId: "jp" },
        { t: "match", q: "Nối quốc gia với thủ đô.",
          pairs: [["Anh", "Luân Đôn"], ["Nhật Bản", "Tô-ky-ô"], ["Hàn Quốc", "Xê-un"]] },
        { t: "choice", q: "Tháp Eiffel nằm ở thành phố nào?", options: ["Pa-ri", "Luân Đôn", "Béc-lin", "Tô-ky-ô"], answer: 0 },
        { t: "choice", q: "Vương quốc Anh gồm mấy vùng?", options: ["4", "2", "3", "6"], answer: 0 },
        { t: "truefalse", q: "Nhật Bản là quốc gia thường xuyên có động đất vì nằm trên vùng núi lửa.", answer: true },
        { t: "choice", q: "Làn sóng Hallyu (K-pop, phim truyền hình) nổi tiếng từ nước nào?", options: ["Hàn Quốc", "Nhật Bản", "Pháp", "Anh"], answer: 0 },
      ],
    },
    {
      id: "wd-l45-c1-l4",
      title: "Châu Âu tiếp & Châu Mỹ",
      goal: "Đức, Hoa Kỳ, Bra-xin",
      teach: [
        place("de", "Đức", "Béc-lin", "Trung Âu"),
        topic("Tự nhiên, kinh tế Đức",
          "Đồng bằng ở phía Bắc, núi rừng ở phía Nam (Rừng Đen, dãy Alps). Có nền kinh tế lớn nhất Châu Âu, đặc biệt mạnh về công nghiệp ô tô và cơ khí chế tạo.",
          [{ label: "Địa hình", value: "Đồng bằng, núi rừng" }, { label: "Kinh tế", value: "Ô tô, cơ khí" }]),
        culture("Văn hoá Đức",
          "Lễ hội bia Oktoberfest lớn nhất thế giới tổ chức hằng năm. Lâu đài Neuschwanstein tuyệt đẹp là nguồn cảm hứng cho nhiều lâu đài trong phim hoạt hình."),
        place("us", "Hoa Kỳ", "Oa-sinh-tơn", "Bắc Mỹ"),
        topic("Tự nhiên, kinh tế Hoa Kỳ",
          "Địa hình rất đa dạng: đồng bằng trung tâm, dãy núi Rocky ở phía Tây, dãy Appalachian ở phía Đông, trải qua nhiều đới khí hậu khác nhau. Kinh tế hàng đầu thế giới về công nghệ, tài chính và điện ảnh.",
          [{ label: "Địa hình", value: "Đồng bằng, núi Rocky" }, { label: "Kinh tế", value: "Công nghệ, tài chính" }]),
        culture("Văn hoá Hoa Kỳ",
          "Tượng Nữ thần Tự do ở New York là biểu tượng nổi tiếng. Hollywood là kinh đô điện ảnh thế giới, bóng rổ NBA rất được yêu thích."),
        place("br", "Bra-xin", "Bra-xi-li-a", "Nam Mỹ"),
        topic("Tự nhiên, kinh tế Bra-xin",
          "Là quốc gia lớn nhất Nam Mỹ, có phần lớn diện tích rừng nhiệt đới Amazon — lá phổi xanh của Trái Đất. Kinh tế mạnh về nông nghiệp (cà phê, đậu nành) và khai khoáng.",
          [{ label: "Địa hình", value: "Rừng Amazon" }, { label: "Kinh tế", value: "Cà phê, đậu nành" }]),
        culture("Văn hoá Bra-xin",
          "Bóng đá là môn thể thao được yêu thích nhất. Lễ hội Carnival với điệu nhảy Samba sôi động diễn ra hằng năm, thu hút khách du lịch khắp thế giới."),
      ],
      quiz: [
        { t: "choice", q: "Rừng Amazon nằm chủ yếu ở quốc gia nào?", options: ["Bra-xin", "Hoa Kỳ", "Đức", "Pháp"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào Hoa Kỳ trên bản đồ.", targetType: "country", targetId: "us" },
        { t: "mapclick", q: "Hãy bấm vào Đức trên bản đồ.", targetType: "country", targetId: "de" },
        { t: "match", q: "Nối quốc gia với thủ đô.",
          pairs: [["Hoa Kỳ", "Oa-sinh-tơn"], ["Bra-xin", "Bra-xi-li-a"], ["Đức", "Béc-lin"]] },
        { t: "truefalse", q: "Đức có nền kinh tế lớn nhất Châu Âu.", answer: true },
        { t: "choice", q: "Quốc gia nào nổi tiếng với lễ hội Carnival và điệu nhảy Samba?", options: ["Bra-xin", "Hoa Kỳ", "Đức", "Nhật Bản"], answer: 0 },
        { t: "choice", q: "Tượng Nữ thần Tự do nằm ở thành phố nào?", options: ["New York", "Oa-sinh-tơn", "Béc-lin", "Pa-ri"], answer: 0 },
      ],
    },
    {
      id: "wd-l45-c1-l5",
      title: "Châu Phi & Châu Đại Dương",
      goal: "Ai Cập, Nam Phi, Ô-xtrây-li-a",
      teach: [
        place("eg", "Ai Cập", "Cai-rô", "Bắc Phi"),
        topic("Tự nhiên, kinh tế Ai Cập",
          "Phần lớn diện tích là sa mạc khô cằn, sông Nile — dòng sông dài bậc nhất thế giới — là nguồn sống chính của cả nước. Kinh tế dựa nhiều vào du lịch di sản và kênh đào Suez, tuyến giao thương quốc tế quan trọng.",
          [{ label: "Địa hình", value: "Sa mạc, sông Nile" }, { label: "Kinh tế", value: "Du lịch, kênh đào Suez" }]),
        culture("Văn hoá Ai Cập",
          "Kim tự tháp Giza và tượng Nhân sư là những công trình cổ đại nổi tiếng bậc nhất thế giới. Người Ai Cập cổ đại sáng tạo ra chữ tượng hình."),
        place("za", "Nam Phi", "Prê-tô-ri-a", "Cực Nam Châu Phi"),
        topic("Tự nhiên, kinh tế Nam Phi",
          "Địa hình chủ yếu là cao nguyên nội địa, bờ biển nằm giữa Đại Tây Dương và Ấn Độ Dương. Kinh tế mạnh về khai khoáng (vàng, kim cương) và du lịch safari ngắm động vật hoang dã.",
          [{ label: "Địa hình", value: "Cao nguyên" }, { label: "Kinh tế", value: "Khai khoáng, du lịch" }]),
        culture("Văn hoá Nam Phi",
          "Là quốc gia hiếm hoi có tới 3 thủ đô cho 3 nhánh quyền lực khác nhau, và có tới 11 ngôn ngữ chính thức. Vườn quốc gia Kruger nổi tiếng với safari ngắm sư tử, voi, tê giác."),
        place("au", "Ô-xtrây-li-a", "Can-be-ra", "Châu Đại Dương"),
        topic("Tự nhiên, kinh tế Ô-xtrây-li-a",
          "Phần lớn trung tâm đất nước là sa mạc khô cằn, dân cư chủ yếu sống tập trung ven biển. Kinh tế mạnh về khai khoáng, chăn nuôi cừu và bò, cùng du lịch.",
          [{ label: "Địa hình", value: "Sa mạc nội địa" }, { label: "Kinh tế", value: "Khai khoáng, chăn nuôi" }]),
        culture("Văn hoá Ô-xtrây-li-a",
          "Nhà hát Con Sò ở Sydney là công trình kiến trúc nổi tiếng thế giới. Rạn san hô Great Barrier Reef là rạn san hô lớn nhất thế giới. Có nhiều loài thú đặc hữu như kangaroo, koala."),
      ],
      quiz: [
        { t: "choice", q: "Kim tự tháp Giza nằm ở quốc gia nào?", options: ["Ai Cập", "Nam Phi", "Ô-xtrây-li-a", "Hoa Kỳ"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào Ai Cập trên bản đồ.", targetType: "country", targetId: "eg" },
        { t: "mapclick", q: "Hãy bấm vào Ô-xtrây-li-a trên bản đồ.", targetType: "country", targetId: "au" },
        { t: "choice", q: "Thủ đô của Ô-xtrây-li-a là thành phố nào?", options: ["Can-be-ra", "Sydney", "Melbourne", "Perth"], answer: 0 },
        { t: "match", q: "Nối quốc gia với thủ đô.",
          pairs: [["Ai Cập", "Cai-rô"], ["Nam Phi", "Prê-tô-ri-a"], ["Ô-xtrây-li-a", "Can-be-ra"]] },
        { t: "choice", q: "Quốc gia nào có tới 3 thủ đô?", options: ["Nam Phi", "Hoa Kỳ", "Ai Cập", "Bra-xin"], answer: 0 },
        { t: "truefalse", q: "Phần lớn trung tâm nước Úc là sa mạc khô cằn.", answer: true },
        { t: "choice", q: "Dòng sông nào là nguồn sống chính của Ai Cập?", options: ["Sông Nile", "Sông Mê Kông", "Sông Hằng", "Sông Amazon"], answer: 0 },
      ],
    },
    {
      id: "wd-l45-c1-l6",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại châu lục và các quốc gia tiêu biểu",
      quiz: [
        { t: "mapclick", q: "Bấm vào Trung Quốc.", targetType: "country", targetId: "cn" },
        { t: "mapclick", q: "Bấm vào Lào.", targetType: "country", targetId: "la" },
        { t: "mapclick", q: "Bấm vào Pháp.", targetType: "country", targetId: "fr" },
        { t: "mapclick", q: "Bấm vào Hoa Kỳ.", targetType: "country", targetId: "us" },
        { t: "mapclick", q: "Bấm vào Ô-xtrây-li-a.", targetType: "country", targetId: "au" },
        { t: "match", q: "Nối quốc gia với châu lục.",
          pairs: [["Nhật Bản", "Châu Á"], ["Đức", "Châu Âu"], ["Ai Cập", "Châu Phi"], ["Bra-xin", "Châu Mỹ"]] },
        { t: "drag", q: "Kéo mỗi quốc gia vào đúng châu lục.",
          buckets: ["Châu Á", "Châu Âu", "Châu Phi", "Châu Mỹ", "Châu Đại Dương"],
          items: [
            { label: "Trung Quốc", bucket: 0 }, { label: "Thái Lan", bucket: 0 },
            { label: "Pháp", bucket: 1 }, { label: "Anh", bucket: 1 },
            { label: "Ai Cập", bucket: 2 }, { label: "Nam Phi", bucket: 2 },
            { label: "Hoa Kỳ", bucket: 3 }, { label: "Bra-xin", bucket: 3 },
            { label: "Ô-xtrây-li-a", bucket: 4 },
          ] },
        { t: "choice", q: "Việt Nam thuộc châu lục nào?", options: ["Châu Á", "Châu Âu", "Châu Mỹ", "Châu Phi"], answer: 0 },
        { t: "choice", q: "Nước nào không giáp biển trong số dưới đây?", options: ["Lào", "Nhật Bản", "Anh", "Ô-xtrây-li-a"], answer: 0 },
        { t: "truefalse", q: "Sông Nile chảy qua Ai Cập là một trong những dòng sông dài nhất thế giới.", answer: true },
        { t: "type", q: "Gõ tên thủ đô của Trung Quốc.", answer: "Bắc Kinh", accept: ["bắc kinh", "bac kinh"] },
        { t: "choice", q: "Trái Đất có bao nhiêu châu lục?", options: ["6", "5", "4", "7"], answer: 0 },
      ],
    },
  ],
};

// ===== Lớp 6-9 — nội dung tổng hợp theo mạch chương trình Địa lí 6 (Trái Đất, bản đồ,
// các thành phần tự nhiên) và Địa lí 7 (các châu lục), viết lại theo cách hiểu riêng,
// không sao chép nguyên văn từ bất kỳ trang giáo án nào.

function topic2(kicker, title, body, facts) {
  return { t: "topic", kicker, title, body, facts };
}

const c2 = {
  id: "wd-l6-c1",
  title: "Trái Đất & Bản đồ",
  icon: "book",
  lessons: [
    {
      id: "wd-l6-c1-l1",
      title: "Trái Đất trong hệ Mặt Trời",
      goal: "Hình dạng, kích thước và các chuyển động của Trái Đất",
      teach: [
        { t: "intro", title: "Hành tinh xanh của chúng ta",
          body: "Trái Đất là hành tinh thứ ba tính từ Mặt Trời, có dạng hình cầu hơi dẹt ở hai cực. Đây là hành tinh duy nhất trong Hệ Mặt Trời được biết có sự sống, nhờ khoảng cách vừa đủ tới Mặt Trời và có bầu khí quyển, nước lỏng.",
          bullets: ["Vị trí thứ 3 tính từ Mặt Trời", "Hình cầu, hơi dẹt ở hai cực", "Có 2 chuyển động chính: tự quay và quay quanh Mặt Trời"] },
        { t: "topic", kicker: "Chuyển động tự quay", title: "Vì sao có ngày và đêm?",
          body: "Trái Đất tự quay quanh trục của mình một vòng hết khoảng 24 giờ. Vì chỉ một nửa Trái Đất được Mặt Trời chiếu sáng tại một thời điểm, nơi được chiếu sáng là ban ngày, nơi khuất là ban đêm — và sự tự quay khiến ngày đêm luân phiên khắp nơi.",
          facts: [{ label: "Thời gian 1 vòng", value: "~24 giờ" }, { label: "Kết quả", value: "Ngày và đêm" }] },
        { t: "topic", kicker: "Chuyển động quanh Mặt Trời", title: "Vì sao có 4 mùa?",
          body: "Trái Đất quay quanh Mặt Trời một vòng hết khoảng 365 ngày, trong khi trục Trái Đất luôn nghiêng một góc so với mặt phẳng quỹ đạo. Chính độ nghiêng này khiến các mùa Xuân, Hạ, Thu, Đông lần lượt xuất hiện ở mỗi bán cầu.",
          facts: [{ label: "Thời gian 1 vòng", value: "~365 ngày" }, { label: "Kết quả", value: "Các mùa trong năm" }] },
      ],
      quiz: [
        { t: "choice", q: "Trái Đất là hành tinh thứ mấy tính từ Mặt Trời?", options: ["Thứ ba", "Thứ nhất", "Thứ năm", "Thứ bảy"], answer: 0 },
        { t: "choice", q: "Trái Đất tự quay quanh trục hết khoảng bao lâu?", options: ["24 giờ", "365 ngày", "1 giờ", "30 ngày"], answer: 0 },
        { t: "truefalse", q: "Hiện tượng ngày và đêm là do Trái Đất tự quay quanh trục.", answer: true },
        { t: "choice", q: "Các mùa trong năm xuất hiện là do đâu?", options: ["Trục Trái Đất nghiêng khi quay quanh Mặt Trời", "Trái Đất đứng yên", "Mặt Trời tự quay", "Mặt Trăng che Mặt Trời"], answer: 0 },
        { t: "blank", q: "Trái Đất quay một vòng quanh Mặt Trời hết khoảng ___ ngày.", answer: "365", options: ["365", "24", "30", "100"] },
      ],
    },
    {
      id: "wd-l6-c1-l2",
      title: "Bản đồ và cách sử dụng",
      goal: "Tỉ lệ, kí hiệu và phương hướng trên bản đồ",
      teach: [
        { t: "intro", title: "Bản đồ là gì?",
          body: "Bản đồ là hình vẽ thu nhỏ một phần hoặc toàn bộ bề mặt Trái Đất lên mặt phẳng, dựa trên các kí hiệu và tỉ lệ nhất định. Biết đọc bản đồ giúp em xác định vị trí, khoảng cách và đặc điểm của một nơi mà không cần tới tận nơi.",
          bullets: ["Tỉ lệ bản đồ: cho biết mức thu nhỏ so với thực tế", "Kí hiệu bản đồ: điểm, đường, vùng diện tích", "Phương hướng: dựa vào lưới kinh – vĩ tuyến"] },
        { t: "topic", kicker: "Tỉ lệ bản đồ", title: "Thu nhỏ bao nhiêu lần?",
          body: "Tỉ lệ bản đồ cho biết một đơn vị đo trên bản đồ tương ứng với bao nhiêu đơn vị đo ngoài thực tế. Ví dụ tỉ lệ 1:1.000.000 nghĩa là 1cm trên bản đồ bằng 1.000.000cm (10km) ngoài thực địa. Tỉ lệ càng nhỏ, bản đồ thể hiện được khu vực càng rộng nhưng càng ít chi tiết.",
          facts: [{ label: "Ví dụ", value: "1:1.000.000 = 1cm → 10km" }] },
        { t: "topic", kicker: "Kí hiệu & phương hướng", title: "Đọc chú giải và xác định hướng",
          body: "Mỗi bản đồ có bảng chú giải giải thích các kí hiệu được dùng (núi, sông, thành phố...). Phương hướng trên bản đồ thường xác định theo quy ước: đầu trên là hướng Bắc, đầu dưới là hướng Nam, bên phải là hướng Đông, bên trái là hướng Tây.",
          facts: [{ label: "Đầu bản đồ (trên)", value: "Hướng Bắc" }] },
      ],
      quiz: [
        { t: "choice", q: "Bản đồ tỉ lệ 1:1.000.000 nghĩa là 1cm trên bản đồ bằng bao nhiêu ngoài thực tế?", options: ["10 km", "1 km", "100 km", "1 m"], answer: 0 },
        { t: "choice", q: "Trên một bản đồ thông thường, hướng Bắc nằm ở đâu?", options: ["Phía trên", "Phía dưới", "Bên trái", "Bên phải"], answer: 0 },
        { t: "truefalse", q: "Tỉ lệ bản đồ càng nhỏ thì thể hiện khu vực càng rộng nhưng càng ít chi tiết.", answer: true },
        { t: "choice", q: "Bảng chú giải trên bản đồ dùng để làm gì?", options: ["Giải thích các kí hiệu", "Đo khoảng cách thực", "Chỉ hướng gió", "Ghi tên người vẽ"], answer: 0 },
        { t: "blank", q: "Bản đồ là hình vẽ ___ bề mặt Trái Đất lên mặt phẳng.", answer: "thu nhỏ", options: ["thu nhỏ", "phóng to", "gập đôi", "tô màu"] },
      ],
    },
    {
      id: "wd-l6-c1-l3",
      title: "Khí quyển, thuỷ quyển, đất & sinh vật",
      goal: "Các lớp bao quanh Trái Đất và vòng tuần hoàn nước",
      teach: [
        { t: "topic", kicker: "Khí quyển", title: "Lớp không khí bao quanh Trái Đất",
          body: "Khí quyển là lớp không khí bao quanh Trái Đất, thành phần chính là khí Nitơ và khí Ôxy. Thời tiết là trạng thái khí quyển tại một nơi trong thời gian ngắn; khí hậu là quy luật lặp lại của thời tiết tại một nơi qua nhiều năm.",
          facts: [{ label: "Thành phần chính", value: "Nitơ, Ôxy" }, { label: "Khác biệt", value: "Thời tiết ≠ khí hậu" }] },
        { t: "topic", kicker: "Thuỷ quyển", title: "Vòng tuần hoàn của nước",
          body: "Thuỷ quyển gồm toàn bộ nước trên Trái Đất: đại dương, sông hồ, băng và hơi nước. Nước bốc hơi lên tạo mây, mây ngưng tụ gây mưa, nước mưa chảy ra sông rồi đổ ra biển — cứ thế lặp lại thành vòng tuần hoàn không ngừng.",
          facts: [{ label: "Phần lớn nước", value: "Ở đại dương" }, { label: "Chu trình", value: "Bốc hơi → mưa → dòng chảy" }] },
        { t: "culture", title: "Đất và các đới thiên nhiên",
          body: "Đất được hình thành từ đá gốc bị phong hoá kết hợp với sinh vật và khí hậu qua thời gian dài. Trên Trái Đất, thiên nhiên phân hoá thành các đới theo vĩ độ: đới nóng gần Xích đạo, đới ôn hoà ở vĩ độ trung bình, và đới lạnh gần hai cực." },
      ],
      quiz: [
        { t: "choice", q: "Hai thành phần chính của khí quyển là gì?", options: ["Nitơ và Ôxy", "Hidro và Heli", "Carbon và Sắt", "Muối và nước"], answer: 0 },
        { t: "choice", q: "Phần lớn nước trên Trái Đất tập trung ở đâu?", options: ["Đại dương", "Sông hồ", "Băng ở hai cực", "Trong đất"], answer: 0 },
        { t: "truefalse", q: "Thời tiết và khí hậu là một khái niệm giống hệt nhau.", answer: false },
        { t: "choice", q: "Đới thiên nhiên nào nằm gần Xích đạo?", options: ["Đới nóng", "Đới lạnh", "Đới ôn hoà", "Đới băng giá"], answer: 0 },
        { t: "order", q: "Sắp xếp đúng thứ tự vòng tuần hoàn nước.", items: ["Nước bốc hơi", "Hơi nước ngưng tụ thành mây", "Mưa rơi xuống", "Nước chảy ra sông, biển"] },
      ],
    },
    {
      id: "wd-l6-c1-l4",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại Trái Đất, bản đồ và các thành phần tự nhiên",
      quiz: [
        { t: "choice", q: "Trái Đất tự quay quanh trục hết khoảng bao lâu?", options: ["24 giờ", "365 ngày", "1 tháng", "1 tuần"], answer: 0 },
        { t: "choice", q: "Các mùa trong năm sinh ra do đâu?", options: ["Trục Trái Đất nghiêng khi quay quanh Mặt Trời", "Trái Đất đứng yên", "Gió mùa", "Nước biển dâng"], answer: 0 },
        { t: "choice", q: "Trên bản đồ thông thường, phía trên là hướng nào?", options: ["Bắc", "Nam", "Đông", "Tây"], answer: 0 },
        { t: "truefalse", q: "Khí quyển là lớp không khí bao quanh Trái Đất.", answer: true },
        { t: "choice", q: "Đới thiên nhiên nào nằm gần hai cực Trái Đất?", options: ["Đới lạnh", "Đới nóng", "Đới ôn hoà", "Đới xích đạo"], answer: 0 },
        { t: "blank", q: "Tỉ lệ bản đồ 1:1.000.000 nghĩa là 1cm trên bản đồ bằng ___ km ngoài thực tế.", answer: "10", options: ["10", "1", "100", "1000"] },
        { t: "drag", q: "Kéo mỗi thành phần vào đúng nhóm.",
          buckets: ["Khí quyển", "Thuỷ quyển"],
          items: [
            { label: "Khí Nitơ", bucket: 0 }, { label: "Khí Ôxy", bucket: 0 }, { label: "Thời tiết", bucket: 0 },
            { label: "Đại dương", bucket: 1 }, { label: "Sông, hồ", bucket: 1 }, { label: "Băng ở hai cực", bucket: 1 },
          ] },
      ],
    },
  ],
};

const c3 = {
  id: "wd-l7-c1",
  title: "Các châu lục",
  icon: "book",
  lessons: [
    {
      id: "wd-l7-c1-l1",
      title: "Châu Á & Châu Âu",
      goal: "Vị trí, tự nhiên và đặc điểm nổi bật hai châu lục",
      teach: [
        topic2("Châu Á", "Châu lục rộng và đông dân nhất",
          "Châu Á là châu lục có diện tích lớn nhất và đông dân nhất thế giới, trải dài từ vùng cực Bắc lạnh giá tới vùng xích đạo nóng ẩm nên thiên nhiên vô cùng đa dạng. Đây cũng là nơi có đỉnh núi cao nhất thế giới.",
          [{ label: "Đặc điểm", value: "Lớn và đông dân nhất" }, { label: "Đỉnh cao nhất TG", value: "Everest" }]),
        topic2("Châu Âu", "Nhiều bán đảo, khí hậu ôn hoà",
          "Châu Âu có đường bờ biển khúc khuỷu với rất nhiều bán đảo và biển ăn sâu vào đất liền. Phần lớn lãnh thổ có khí hậu ôn đới, mức sống và trình độ phát triển kinh tế cao, nhiều quốc gia liên kết chặt chẽ trong Liên minh châu Âu (EU).",
          [{ label: "Đặc điểm", value: "Nhiều bán đảo" }, { label: "Khí hậu", value: "Ôn đới" }]),
      ],
      quiz: [
        { t: "choice", q: "Châu lục nào rộng và đông dân nhất thế giới?", options: ["Châu Á", "Châu Âu", "Châu Phi", "Châu Đại Dương"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào một quốc gia bất kỳ thuộc CHÂU Á trên bản đồ.", targetType: "continent", targetId: "chau-a" },
        { t: "mapclick", q: "Hãy bấm vào một quốc gia bất kỳ thuộc CHÂU ÂU trên bản đồ.", targetType: "continent", targetId: "chau-au" },
        { t: "choice", q: "Đỉnh núi cao nhất thế giới thuộc châu lục nào?", options: ["Châu Á", "Châu Âu", "Châu Phi", "Châu Mỹ"], answer: 0 },
        { t: "truefalse", q: "Châu Âu có đường bờ biển khúc khuỷu với nhiều bán đảo.", answer: true },
      ],
    },
    {
      id: "wd-l7-c1-l2",
      title: "Châu Phi & Châu Mỹ",
      goal: "Vị trí, tự nhiên và đặc điểm nổi bật hai châu lục",
      teach: [
        topic2("Châu Phi", "Lục địa của hoang mạc và xích đạo",
          "Phần lớn lãnh thổ châu Phi nằm giữa hai chí tuyến nên khí hậu nóng quanh năm. Đây là nơi có hoang mạc Sahara — hoang mạc cát nóng lớn nhất thế giới, và sông Nile — dòng sông dài nhất thế giới.",
          [{ label: "Hoang mạc lớn nhất TG", value: "Sahara" }, { label: "Sông dài nhất TG", value: "Sông Nile" }]),
        topic2("Châu Mỹ", "Trải dài từ Bắc xuống Nam",
          "Châu Mỹ gồm Bắc Mỹ và Nam Mỹ, nối với nhau bằng dải đất hẹp Trung Mỹ. Nam Mỹ có rừng nhiệt đới Amazon rộng lớn nhất thế giới và dãy núi Andes — dãy núi trên cạn dài nhất thế giới.",
          [{ label: "Rừng lớn nhất TG", value: "Rừng Amazon" }, { label: "Dãy núi dài nhất TG", value: "Andes" }]),
      ],
      quiz: [
        { t: "choice", q: "Hoang mạc cát lớn nhất thế giới nằm ở châu lục nào?", options: ["Châu Phi", "Châu Á", "Châu Mỹ", "Châu Đại Dương"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào một quốc gia bất kỳ thuộc CHÂU PHI trên bản đồ.", targetType: "continent", targetId: "chau-phi" },
        { t: "mapclick", q: "Hãy bấm vào một quốc gia bất kỳ thuộc CHÂU MỸ trên bản đồ.", targetType: "continent", targetId: "chau-my" },
        { t: "choice", q: "Rừng nhiệt đới lớn nhất thế giới nằm ở đâu?", options: ["Nam Mỹ (rừng Amazon)", "Châu Phi", "Đông Nam Á", "Châu Âu"], answer: 0 },
        { t: "truefalse", q: "Châu Mỹ gồm Bắc Mỹ và Nam Mỹ nối với nhau qua Trung Mỹ.", answer: true },
        { t: "choice", q: "Dòng sông dài nhất thế giới thuộc châu lục nào?", options: ["Châu Phi", "Châu Á", "Châu Mỹ", "Châu Âu"], answer: 0 },
      ],
    },
    {
      id: "wd-l7-c1-l3",
      title: "Châu Đại Dương & Châu Nam Cực",
      goal: "Đặc điểm nổi bật hai châu lục còn lại",
      teach: [
        topic2("Châu Đại Dương", "Lục địa Úc và hàng nghìn hòn đảo",
          "Châu Đại Dương gồm lục địa Australia và hàng nghìn hòn đảo lớn nhỏ rải rác giữa Thái Bình Dương. Đây là châu lục có dân số ít nhất trong số các châu lục có người sinh sống thường xuyên.",
          [{ label: "Lục địa chính", value: "Australia" }, { label: "Đặc điểm", value: "Ít dân nhất" }]),
        { t: "culture", title: "Châu Nam Cực — lục địa băng giá",
          body: "Châu Nam Cực là nơi lạnh nhất, nhiều gió nhất Trái Đất, gần như toàn bộ bề mặt bị bao phủ bởi băng dày. Đây được xem như một hoang mạc lạnh vì lượng mưa rất ít, không có dân cư sinh sống lâu dài, chỉ có các trạm nghiên cứu khoa học của nhiều quốc gia." },
      ],
      quiz: [
        { t: "choice", q: "Lục địa chính của châu Đại Dương là gì?", options: ["Australia", "Greenland", "Madagascar", "New Zealand"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào một quốc gia bất kỳ thuộc CHÂU ĐẠI DƯƠNG trên bản đồ.", targetType: "continent", targetId: "chau-dai-duong" },
        { t: "choice", q: "Châu lục nào lạnh nhất và gần như không có dân cư sinh sống lâu dài?", options: ["Châu Nam Cực", "Châu Á", "Châu Âu", "Châu Phi"], answer: 0 },
        { t: "truefalse", q: "Châu Nam Cực có rất nhiều thành phố lớn.", answer: false },
        { t: "choice", q: "Vì sao châu Nam Cực được xem như một hoang mạc lạnh?", options: ["Vì lượng mưa rất ít", "Vì toàn cát", "Vì rất nóng", "Vì có nhiều rừng"], answer: 0 },
      ],
    },
    {
      id: "wd-l7-c1-l4",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại đặc điểm nổi bật của 6 châu lục",
      quiz: [
        { t: "choice", q: "Châu lục nào rộng và đông dân nhất?", options: ["Châu Á", "Châu Âu", "Châu Phi", "Châu Mỹ"], answer: 0 },
        { t: "choice", q: "Hoang mạc Sahara nằm ở châu lục nào?", options: ["Châu Phi", "Châu Á", "Châu Mỹ", "Châu Âu"], answer: 0 },
        { t: "choice", q: "Rừng Amazon nằm ở châu lục nào?", options: ["Châu Mỹ", "Châu Phi", "Châu Á", "Châu Đại Dương"], answer: 0 },
        { t: "choice", q: "Châu lục nào lạnh nhất, gần như không có dân cư thường trú?", options: ["Châu Nam Cực", "Châu Âu", "Châu Á", "Châu Đại Dương"], answer: 0 },
        { t: "match", q: "Nối châu lục với đặc điểm nổi bật.",
          pairs: [["Châu Á", "Đỉnh núi cao nhất thế giới"], ["Châu Âu", "Nhiều bán đảo"], ["Châu Đại Dương", "Lục địa Australia"]] },
        { t: "truefalse", q: "Trái Đất có 6 châu lục.", answer: true },
        { t: "drag", q: "Kéo mỗi đặc điểm vào đúng châu lục.",
          buckets: ["Châu Á", "Châu Phi", "Châu Mỹ", "Châu Đại Dương"],
          items: [
            { label: "Đỉnh Everest", bucket: 0 }, { label: "Hoang mạc Sahara", bucket: 1 },
            { label: "Rừng Amazon", bucket: 2 }, { label: "Dãy núi Andes", bucket: 2 },
            { label: "Lục địa Australia", bucket: 3 },
          ] },
      ],
    },
  ],
};

// ===== Lớp 7, chương 2 — đào sâu thêm dân cư và kinh tế từng châu lục, đúng mạch SGK thật
// (mỗi châu có riêng phần tự nhiên, dân cư-xã hội, kinh tế — chương 1 mới dừng ở tự nhiên).

const c3b = {
  id: "wd-l7-c2",
  title: "Dân cư & kinh tế các châu lục",
  icon: "book",
  lessons: [
    {
      id: "wd-l7-c2-l1",
      title: "Dân cư, kinh tế châu Á & châu Âu",
      goal: "So sánh dân cư và trình độ phát triển hai châu lục",
      teach: [
        { t: "topic", kicker: "Dân cư châu Á", title: "Đông dân nhất, phân bố không đều",
          body: "Châu Á chiếm hơn một nửa dân số thế giới nhưng phân bố rất không đều: đông đúc ở các đồng bằng châu thổ ven biển (Đông Á, Nam Á, Đông Nam Á), thưa thớt ở vùng núi cao, hoang mạc nội địa (Trung Á, Tây Á).",
          facts: [{ label: "Đặc điểm", value: "Đông dân, phân bố không đều" }] },
        { t: "topic", kicker: "Kinh tế châu Âu", title: "Trình độ phát triển cao, đồng đều",
          body: "Phần lớn các nước châu Âu có trình độ phát triển kinh tế cao, chất lượng cuộc sống tốt. Nhiều nước liên kết chặt chẽ trong Liên minh châu Âu (EU), tạo thành một trong những trung tâm kinh tế lớn nhất thế giới.",
          facts: [{ label: "Đặc điểm", value: "Phát triển cao, liên kết chặt (EU)" }] },
      ],
      quiz: [
        { t: "choice", q: "Dân cư châu Á tập trung đông nhất ở khu vực nào?", options: ["Đồng bằng châu thổ ven biển", "Hoang mạc nội địa", "Núi cao", "Vùng cực"], answer: 0 },
        { t: "choice", q: "Châu Âu có tổ chức liên kết kinh tế nổi tiếng nào?", options: ["EU", "ASEAN", "OPEC", "NATO"], answer: 0 },
        { t: "truefalse", q: "Châu Á chiếm hơn một nửa dân số thế giới.", answer: true },
      ],
    },
    {
      id: "wd-l7-c2-l2",
      title: "Dân cư, kinh tế châu Phi & châu Mỹ",
      goal: "Thách thức và tiềm năng phát triển hai châu lục",
      teach: [
        { t: "topic", kicker: "Châu Phi", title: "Dân số tăng nhanh, kinh tế còn khó khăn",
          body: "Châu Phi có tốc độ tăng dân số nhanh nhất thế giới, dân số trẻ. Kinh tế nhiều nước còn dựa chủ yếu vào nông nghiệp và khai thác khoáng sản thô, thu nhập bình quân đầu người còn thấp so với các châu lục khác.",
          facts: [{ label: "Dân số", value: "Tăng nhanh nhất thế giới" }] },
        { t: "topic", kicker: "Châu Mỹ", title: "Phát triển không đồng đều Bắc – Nam",
          body: "Bắc Mỹ (Hoa Kỳ, Canada) có nền kinh tế rất phát triển, trong khi phần lớn các nước Nam Mỹ và Trung Mỹ vẫn đang phát triển, kinh tế dựa nhiều vào nông sản và khoáng sản xuất khẩu.",
          facts: [{ label: "Đặc điểm", value: "Bắc Mỹ phát triển hơn Nam Mỹ" }] },
      ],
      quiz: [
        { t: "choice", q: "Châu lục nào có tốc độ tăng dân số nhanh nhất thế giới?", options: ["Châu Phi", "Châu Âu", "Châu Đại Dương", "Châu Nam Cực"], answer: 0 },
        { t: "truefalse", q: "Bắc Mỹ có nền kinh tế phát triển hơn phần lớn Nam Mỹ.", answer: true },
        { t: "choice", q: "Kinh tế nhiều nước châu Phi dựa chủ yếu vào đâu?", options: ["Nông nghiệp, khai khoáng", "Công nghệ cao", "Tài chính - ngân hàng", "Du lịch vũ trụ"], answer: 0 },
      ],
    },
    {
      id: "wd-l7-c2-l3",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại dân cư và kinh tế các châu lục",
      quiz: [
        { t: "choice", q: "Châu lục nào đông dân nhất thế giới?", options: ["Châu Á", "Châu Âu", "Châu Phi", "Châu Đại Dương"], answer: 0 },
        { t: "choice", q: "Châu lục nào có tốc độ tăng dân số nhanh nhất?", options: ["Châu Phi", "Châu Âu", "Châu Á", "Châu Nam Cực"], answer: 0 },
        { t: "truefalse", q: "Châu Âu có nhiều nước trình độ phát triển kinh tế cao.", answer: true },
        { t: "match", q: "Nối châu lục với đặc điểm dân cư - kinh tế.",
          pairs: [["Châu Á", "Đông dân nhất"], ["Châu Phi", "Tăng dân số nhanh nhất"], ["Châu Âu", "Phát triển cao, có EU"]] },
      ],
    },
  ],
};

// ===== Lớp 6, chương 2 — mảng còn thiếu của chương trình Địa lí 6 thật: cấu tạo Trái Đất,
// nội - ngoại sinh, núi lửa - động đất, các dạng địa hình và khoáng sản.

const c4 = {
  id: "wd-l6-c2",
  title: "Cấu tạo Trái Đất & Địa hình",
  icon: "book",
  lessons: [
    {
      id: "wd-l6-c2-l1",
      title: "Cấu tạo bên trong Trái Đất",
      goal: "Ba lớp của Trái Đất và các mảng kiến tạo",
      teach: [
        { t: "intro", title: "Trái Đất có mấy lớp?",
          body: "Nếu cắt đôi Trái Đất, em sẽ thấy nó gồm 3 lớp giống như một quả trứng: vỏ ngoài mỏng, lớp giữa dày nhất, và nhân ở trong cùng.",
          bullets: ["Vỏ Trái Đất: mỏng nhất, nơi con người sinh sống", "Lớp Manti (bao Manti): dày nhất, ở trạng thái quánh dẻo", "Nhân Trái Đất: trong cùng, gồm nhân ngoài lỏng và nhân trong rắn"] },
        { t: "topic", kicker: "Vỏ Trái Đất", title: "Vỏ mỏng nhưng quan trọng nhất với con người",
          body: "Vỏ Trái Đất là lớp mỏng nhất nhưng lại là nơi tồn tại toàn bộ núi, đồng bằng, đại dương và sự sống. Vỏ Trái Đất không liền một khối mà bị chia thành nhiều mảng kiến tạo lớn nhỏ.",
          facts: [{ label: "Đặc điểm", value: "Mỏng nhất, ngoài cùng" }] },
        { t: "topic", kicker: "Mảng kiến tạo", title: "Những mảng ghép khổng lồ luôn di chuyển",
          body: "Vỏ Trái Đất gồm nhiều mảng kiến tạo lớn (như mảng Á-Âu, mảng Thái Bình Dương...) luôn di chuyển rất chậm. Nơi các mảng xô vào nhau hoặc tách xa nhau thường xảy ra động đất, núi lửa.",
          facts: [{ label: "Ví dụ", value: "Mảng Á-Âu, Thái Bình Dương" }] },
      ],
      quiz: [
        { t: "choice", q: "Trái Đất gồm mấy lớp chính?", options: ["3", "2", "5", "1"], answer: 0 },
        { t: "choice", q: "Lớp nào của Trái Đất dày nhất?", options: ["Lớp Manti", "Vỏ Trái Đất", "Nhân trong", "Khí quyển"], answer: 0 },
        { t: "truefalse", q: "Vỏ Trái Đất là một khối liền, không chia thành mảng.", answer: false },
        { t: "choice", q: "Nơi các mảng kiến tạo xô vào nhau thường xảy ra hiện tượng gì?", options: ["Động đất, núi lửa", "Mưa đá", "Cầu vồng", "Sương mù"], answer: 0 },
      ],
    },
    {
      id: "wd-l6-c2-l2",
      title: "Núi lửa và động đất",
      goal: "Quá trình nội sinh, ngoại sinh và hiện tượng tạo núi",
      teach: [
        { t: "topic", kicker: "Nội sinh & ngoại sinh", title: "Hai lực đối lập tạo nên bề mặt Trái Đất",
          body: "Quá trình nội sinh (từ bên trong Trái Đất) làm gồ ghề thêm bề mặt như nâng cao địa hình, tạo núi. Quá trình ngoại sinh (gió, nước, nhiệt độ...) lại có xu hướng bào mòn, san bằng địa hình. Hai quá trình này diễn ra đồng thời, tạo nên các dạng địa hình đa dạng ngày nay.",
          facts: [{ label: "Nội sinh", value: "Nâng cao địa hình" }, { label: "Ngoại sinh", value: "Bào mòn địa hình" }] },
        { t: "culture", title: "Núi lửa phun trào",
          body: "Núi lửa hình thành khi mắc-ma nóng chảy từ sâu trong lòng đất phun trào lên bề mặt. Dù nguy hiểm, đất quanh núi lửa sau khi nguội thường rất màu mỡ nên vẫn có người sinh sống gần đó." },
        { t: "culture", title: "Động đất",
          body: "Động đất là hiện tượng lớp vỏ Trái Đất rung chuyển đột ngột do các mảng kiến tạo di chuyển, va chạm với nhau. Động đất mạnh có thể gây thiệt hại lớn về nhà cửa và tính mạng con người." },
      ],
      quiz: [
        { t: "choice", q: "Quá trình nào làm bề mặt Trái Đất được nâng cao, tạo núi?", options: ["Nội sinh", "Ngoại sinh", "Cả hai như nhau", "Không quá trình nào"], answer: 0 },
        { t: "choice", q: "Núi lửa hình thành do đâu?", options: ["Mắc-ma phun trào từ lòng đất", "Gió thổi mạnh", "Mưa lớn", "Nước biển dâng"], answer: 0 },
        { t: "truefalse", q: "Đất quanh núi lửa sau khi nguội thường rất màu mỡ.", answer: true },
        { t: "choice", q: "Động đất xảy ra chủ yếu do đâu?", options: ["Các mảng kiến tạo va chạm, di chuyển", "Gió mùa", "Thuỷ triều", "Nhiệt độ giảm"], answer: 0 },
      ],
    },
    {
      id: "wd-l6-c2-l3",
      title: "Địa hình và khoáng sản",
      goal: "Các dạng địa hình chính và khoáng sản trên Trái Đất",
      teach: [
        { t: "intro", title: "4 dạng địa hình chính",
          body: "Bề mặt Trái Đất có 4 dạng địa hình chính, phân biệt chủ yếu theo độ cao và hình dạng.",
          bullets: ["Núi: nhô cao rõ rệt, thường trên 500m", "Đồi: gò cao, thấp hơn núi, ít dốc", "Cao nguyên: bề mặt tương đối bằng phẳng, sườn dốc", "Đồng bằng: thấp, khá bằng phẳng, thường ven sông, ven biển"] },
        { t: "culture", title: "Khoáng sản — kho báu trong lòng đất",
          body: "Khoáng sản là những khoáng vật, đá có ích được con người khai thác sử dụng, gồm hai nhóm chính: khoáng sản kim loại (sắt, đồng, vàng...) dùng để chế tạo máy móc, và khoáng sản phi kim loại — nhiên liệu (than, dầu mỏ, khí đốt) và vật liệu xây dựng (đá vôi, cát, sét)." },
      ],
      quiz: [
        { t: "choice", q: "Dạng địa hình nào có độ cao trên 500m, nhô lên rõ rệt?", options: ["Núi", "Đồng bằng", "Đồi", "Cao nguyên"], answer: 0 },
        { t: "choice", q: "Cao nguyên có đặc điểm gì nổi bật?", options: ["Bề mặt bằng phẳng, sườn dốc", "Rất thấp, ngập nước quanh năm", "Toàn cát", "Không có thực vật"], answer: 0 },
        { t: "drag", q: "Kéo mỗi khoáng sản vào đúng nhóm.",
          buckets: ["Khoáng sản kim loại", "Khoáng sản phi kim loại"],
          items: [
            { label: "Sắt", bucket: 0 }, { label: "Vàng", bucket: 0 }, { label: "Đồng", bucket: 0 },
            { label: "Than đá", bucket: 1 }, { label: "Dầu mỏ", bucket: 1 }, { label: "Đá vôi", bucket: 1 },
          ] },
        { t: "truefalse", q: "Đồng bằng là dạng địa hình thấp, khá bằng phẳng, thường ở ven sông hoặc ven biển.", answer: true },
      ],
    },
    {
      id: "wd-l6-c2-l4",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại cấu tạo Trái Đất, núi lửa - động đất, địa hình và khoáng sản",
      quiz: [
        { t: "choice", q: "Trái Đất gồm mấy lớp chính?", options: ["3", "2", "4", "5"], answer: 0 },
        { t: "choice", q: "Động đất, núi lửa thường xảy ra ở đâu?", options: ["Nơi các mảng kiến tạo tiếp xúc nhau", "Giữa các đại dương yên tĩnh", "Vùng cực", "Sa mạc"], answer: 0 },
        { t: "choice", q: "Dạng địa hình nào thấp và khá bằng phẳng, thuận lợi cho nông nghiệp?", options: ["Đồng bằng", "Núi", "Cao nguyên", "Đồi"], answer: 0 },
        { t: "truefalse", q: "Quá trình ngoại sinh có xu hướng bào mòn, san bằng địa hình.", answer: true },
        { t: "match", q: "Nối khái niệm với đặc điểm.",
          pairs: [["Nội sinh", "Nâng cao địa hình"], ["Ngoại sinh", "Bào mòn địa hình"], ["Núi lửa", "Mắc-ma phun trào"]] },
      ],
    },
  ],
};

// ===== Lớp 10 — theo mạch phần "Địa lí kinh tế - xã hội" của Địa lí 10: dân số, đô thị hoá,
// và các ngành kinh tế (nông - lâm - thuỷ sản, công nghiệp, dịch vụ).

const c5 = {
  id: "wd-l10-c1",
  title: "Dân số, đô thị hoá & các ngành kinh tế",
  icon: "book",
  lessons: [
    {
      id: "wd-l10-c1-l1",
      title: "Dân số và đô thị hoá thế giới",
      goal: "Quy mô, cơ cấu dân số và quá trình đô thị hoá",
      teach: [
        { t: "topic", kicker: "Dân số", title: "Hơn 8 tỉ người trên Trái Đất",
          body: "Dân số thế giới hiện đã vượt mốc 8 tỉ người, tăng nhanh trong thế kỷ 20-21 nhờ y tế phát triển. Tốc độ tăng dân số khác nhau rõ rệt giữa các nước phát triển (tăng chậm) và đang phát triển (tăng nhanh hơn).",
          facts: [{ label: "Dân số hiện nay", value: "Hơn 8 tỉ người" }] },
        { t: "topic", kicker: "Cơ cấu dân số", title: "Cơ cấu theo tuổi và giới tính",
          body: "Cơ cấu dân số theo tuổi cho biết tỉ lệ trẻ em, người trong độ tuổi lao động và người cao tuổi — quyết định lực lượng lao động của một quốc gia. Các nước phát triển thường có dân số già hơn nước đang phát triển.",
          facts: [{ label: "3 nhóm tuổi", value: "Trẻ em, lao động, cao tuổi" }] },
        { t: "culture", title: "Đô thị hoá toàn cầu",
          body: "Đô thị hoá là quá trình tăng nhanh tỉ lệ dân số sống ở thành thị, kèm theo mở rộng quy mô các đô thị. Hiện hơn một nửa dân số thế giới sống ở thành thị. Đô thị hoá mang lại nhiều cơ hội việc làm nhưng cũng gây áp lực về nhà ở, giao thông, môi trường." },
      ],
      quiz: [
        { t: "choice", q: "Dân số thế giới hiện nay khoảng bao nhiêu?", options: ["Hơn 8 tỉ người", "2 tỉ người", "20 tỉ người", "500 triệu người"], answer: 0 },
        { t: "choice", q: "Nhóm nước nào thường có dân số già hơn?", options: ["Nước phát triển", "Nước đang phát triển", "Cả hai như nhau", "Không nước nào"], answer: 0 },
        { t: "truefalse", q: "Đô thị hoá là quá trình tăng tỉ lệ dân số sống ở thành thị.", answer: true },
        { t: "choice", q: "Đô thị hoá nhanh có thể gây áp lực gì?", options: ["Nhà ở, giao thông, môi trường", "Không có tác động gì", "Giảm việc làm", "Tăng diện tích rừng"], answer: 0 },
      ],
    },
    {
      id: "wd-l10-c1-l2",
      title: "Nông nghiệp, lâm nghiệp & thuỷ sản",
      goal: "Vai trò và các nhân tố ảnh hưởng tới sản xuất",
      teach: [
        { t: "topic", kicker: "Nông nghiệp", title: "Ngành cung cấp lương thực cho nhân loại",
          body: "Nông nghiệp cung cấp lương thực, thực phẩm cho con người và nguyên liệu cho công nghiệp chế biến. Sự phát triển nông nghiệp phụ thuộc nhiều vào điều kiện tự nhiên (đất, khí hậu, nước) và các tiến bộ khoa học kỹ thuật.",
          facts: [{ label: "Vai trò", value: "Cung cấp lương thực, nguyên liệu" }] },
        { t: "topic", kicker: "Lâm nghiệp & thuỷ sản", title: "Rừng và biển — nguồn tài nguyên quý giá",
          body: "Lâm nghiệp cung cấp gỗ và các lâm sản, đồng thời giữ vai trò quan trọng bảo vệ môi trường, chống xói mòn. Thuỷ sản (đánh bắt và nuôi trồng) cung cấp nguồn thực phẩm giàu dinh dưỡng và là ngành xuất khẩu quan trọng của nhiều quốc gia ven biển.",
          facts: [{ label: "Lâm nghiệp", value: "Gỗ, bảo vệ môi trường" }, { label: "Thuỷ sản", value: "Đánh bắt & nuôi trồng" }] },
      ],
      quiz: [
        { t: "choice", q: "Nông nghiệp có vai trò chủ yếu gì?", options: ["Cung cấp lương thực, thực phẩm", "Sản xuất ô tô", "Khai thác dầu khí", "Xây dựng nhà cao tầng"], answer: 0 },
        { t: "choice", q: "Sự phát triển nông nghiệp phụ thuộc nhiều vào yếu tố tự nhiên nào?", options: ["Đất, khí hậu, nước", "Chỉ có nhiệt độ", "Chỉ có gió", "Không phụ thuộc gì"], answer: 0 },
        { t: "truefalse", q: "Lâm nghiệp chỉ có vai trò cung cấp gỗ, không liên quan tới môi trường.", answer: false },
        { t: "choice", q: "Thuỷ sản gồm những hoạt động nào?", options: ["Đánh bắt và nuôi trồng", "Chỉ đánh bắt", "Chỉ nuôi trồng", "Trồng lúa"], answer: 0 },
      ],
    },
    {
      id: "wd-l10-c1-l3",
      title: "Công nghiệp & dịch vụ",
      goal: "Vai trò, cơ cấu ngành công nghiệp và dịch vụ",
      teach: [
        { t: "topic", kicker: "Công nghiệp", title: "Ngành tạo ra tư liệu sản xuất",
          body: "Công nghiệp là ngành tạo ra khối lượng của cải vật chất lớn, đóng vai trò chủ đạo trong nền kinh tế hiện đại. Cơ cấu ngành công nghiệp rất đa dạng: khai khoáng, năng lượng, luyện kim, cơ khí, chế biến, điện tử...",
          facts: [{ label: "Vai trò", value: "Tạo tư liệu sản xuất" }] },
        { t: "topic", kicker: "Dịch vụ", title: "Ngành chiếm tỉ trọng ngày càng lớn",
          body: "Dịch vụ gồm thương mại, giao thông vận tải, du lịch, tài chính – ngân hàng, giáo dục, y tế... Ở các nước phát triển, dịch vụ thường chiếm tỉ trọng lớn nhất trong cơ cấu kinh tế (GDP).",
          facts: [{ label: "Gồm", value: "Thương mại, du lịch, tài chính..." }] },
      ],
      quiz: [
        { t: "choice", q: "Ngành nào tạo ra khối lượng của cải vật chất lớn cho xã hội hiện đại?", options: ["Công nghiệp", "Chỉ nông nghiệp", "Chỉ dịch vụ", "Không ngành nào"], answer: 0 },
        { t: "choice", q: "Ở các nước phát triển, ngành nào thường chiếm tỉ trọng GDP lớn nhất?", options: ["Dịch vụ", "Nông nghiệp", "Lâm nghiệp", "Khai khoáng"], answer: 0 },
        { t: "match", q: "Nối ngành với ví dụ.", pairs: [["Công nghiệp", "Luyện kim, cơ khí"], ["Dịch vụ", "Du lịch, ngân hàng"]] },
      ],
    },
    {
      id: "wd-l10-c1-l4",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại dân số, đô thị hoá và các ngành kinh tế",
      quiz: [
        { t: "choice", q: "Dân số thế giới hiện nay khoảng bao nhiêu?", options: ["Hơn 8 tỉ người", "2 tỉ người", "1 tỉ người", "50 tỉ người"], answer: 0 },
        { t: "choice", q: "Đô thị hoá là gì?", options: ["Tăng tỉ lệ dân số sống ở thành thị", "Giảm dân số", "Trồng thêm rừng", "Xây thêm đập thuỷ điện"], answer: 0 },
        { t: "choice", q: "Ngành nào cung cấp lương thực, thực phẩm chủ yếu?", options: ["Nông nghiệp", "Công nghiệp", "Dịch vụ", "Khai khoáng"], answer: 0 },
        { t: "truefalse", q: "Ở các nước phát triển, dịch vụ thường chiếm tỉ trọng GDP lớn nhất.", answer: true },
        { t: "drag", q: "Kéo mỗi hoạt động vào đúng ngành kinh tế.",
          buckets: ["Nông – lâm – thuỷ sản", "Công nghiệp", "Dịch vụ"],
          items: [
            { label: "Trồng lúa", bucket: 0 }, { label: "Nuôi tôm", bucket: 0 },
            { label: "Luyện kim", bucket: 1 }, { label: "Chế biến thực phẩm", bucket: 1 },
            { label: "Du lịch", bucket: 2 }, { label: "Ngân hàng", bucket: 2 },
          ] },
      ],
    },
  ],
};

// ===== Lớp 11 — theo mạch phần "Một số khu vực, quốc gia" của Địa lí 11: Hoa Kỳ, Liên minh
// châu Âu (đại diện Đức), Liên bang Nga, Nhật Bản, Trung Quốc, khu vực Đông Nam Á.

function place11(id, name, capital, note) {
  return { t: "place", id, title: name, subtitle: `${note} · Thủ đô ${capital}`,
    body: `${name} thuộc ${note.toLowerCase()}, có thủ đô là ${capital}.`,
    facts: [{ label: "Thủ đô", value: capital }, { label: "Vị trí", value: note }] };
}
function topic11(title, body, facts) {
  return { t: "topic", kicker: "Tự nhiên & kinh tế", title, body, facts };
}

const c6 = {
  id: "wd-l11-c1",
  title: "Khu vực & cường quốc tiêu biểu",
  icon: "book",
  lessons: [
    {
      id: "wd-l11-c1-l1",
      title: "Hoa Kỳ",
      goal: "Vị trí, tự nhiên và nền kinh tế hàng đầu thế giới",
      teach: [
        place11("us", "Hoa Kỳ", "Oa-sinh-tơn", "Bắc Mỹ"),
        topic11("Tự nhiên, kinh tế Hoa Kỳ",
          "Lãnh thổ rộng lớn, địa hình đa dạng: đồng bằng trung tâm màu mỡ, núi Rocky ở phía Tây, núi Appalachian ở phía Đông. Là nền kinh tế lớn nhất thế giới, dẫn đầu về công nghệ, tài chính và đổi mới sáng tạo.",
          [{ label: "Địa hình", value: "Đồng bằng, núi Rocky" }, { label: "Kinh tế", value: "Lớn nhất thế giới" }]),
        culture("Văn hoá Hoa Kỳ",
          "Là đất nước đa văn hoá, nơi hội tụ người nhập cư từ khắp thế giới. Hollywood, thung lũng Silicon và các trường đại học hàng đầu là những biểu tượng nổi bật."),
      ],
      quiz: [
        { t: "choice", q: "Hoa Kỳ nằm ở châu lục nào?", options: ["Bắc Mỹ", "Nam Mỹ", "Châu Âu", "Châu Á"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào Hoa Kỳ trên bản đồ.", targetType: "country", targetId: "us" },
        { t: "choice", q: "Hoa Kỳ được đánh giá là nền kinh tế như thế nào trên thế giới?", options: ["Lớn nhất thế giới", "Nhỏ nhất thế giới", "Chỉ phát triển nông nghiệp", "Không có công nghiệp"], answer: 0 },
        { t: "truefalse", q: "Hoa Kỳ là đất nước đa văn hoá, có nhiều người nhập cư.", answer: true },
      ],
    },
    {
      id: "wd-l11-c1-l2",
      title: "Liên minh châu Âu & Cộng hoà Liên bang Đức",
      goal: "EU và quốc gia đại diện tiêu biểu",
      teach: [
        { t: "intro", title: "Liên minh châu Âu (EU)",
          body: "EU là tổ chức liên kết kinh tế – chính trị của nhiều quốc gia châu Âu, cho phép hàng hoá, dịch vụ, vốn và con người di chuyển tự do giữa các nước thành viên. Đây là một trong những trung tâm kinh tế lớn nhất thế giới.",
          bullets: ["Gồm nhiều quốc gia châu Âu liên kết chặt chẽ", "Có đồng tiền chung Euro ở nhiều nước thành viên", "Tự do đi lại, buôn bán giữa các nước thành viên"] },
        place11("de", "Đức", "Béc-lin", "Trung Âu, thành viên EU"),
        topic11("Tự nhiên, kinh tế Đức",
          "Đức là nền kinh tế lớn nhất Liên minh châu Âu, nổi bật với công nghiệp ô tô, cơ khí chế tạo và xuất khẩu công nghệ cao hàng đầu thế giới.",
          [{ label: "Vai trò trong EU", value: "Nền kinh tế lớn nhất" }, { label: "Mạnh về", value: "Ô tô, cơ khí" }]),
      ],
      quiz: [
        { t: "choice", q: "EU là tổ chức liên kết của các quốc gia thuộc châu lục nào?", options: ["Châu Âu", "Châu Á", "Châu Phi", "Châu Mỹ"], answer: 0 },
        { t: "choice", q: "Đồng tiền chung của nhiều nước EU là gì?", options: ["Euro", "Đô la", "Yên", "Nhân dân tệ"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào Đức trên bản đồ.", targetType: "country", targetId: "de" },
        { t: "choice", q: "Đức nổi bật với ngành công nghiệp nào?", options: ["Ô tô, cơ khí", "Trồng lúa", "Đánh bắt cá", "Khai thác vàng"], answer: 0 },
      ],
    },
    {
      id: "wd-l11-c1-l3",
      title: "Liên bang Nga",
      goal: "Quốc gia rộng lớn nhất thế giới",
      teach: [
        place11("ru", "Liên bang Nga", "Mát-xcơ-va", "Trải dài Đông Âu và Bắc Á"),
        topic11("Tự nhiên, kinh tế Nga",
          "Nga là quốc gia có diện tích lớn nhất thế giới, trải dài qua 11 múi giờ, từ đồng bằng Đông Âu tới vùng Xi-bia rộng lớn giàu tài nguyên rừng, khoáng sản, dầu khí. Kinh tế mạnh về khai thác và xuất khẩu năng lượng (dầu mỏ, khí đốt).",
          [{ label: "Diện tích", value: "Lớn nhất thế giới" }, { label: "Kinh tế", value: "Dầu mỏ, khí đốt" }]),
        culture("Văn hoá Nga",
          "Nổi tiếng với nền văn học, âm nhạc cổ điển (Tchaikovsky) và ba-lê. Điện Kremlin và Quảng trường Đỏ ở Mát-xcơ-va là biểu tượng nổi tiếng."),
      ],
      quiz: [
        { t: "choice", q: "Quốc gia nào có diện tích lớn nhất thế giới?", options: ["Liên bang Nga", "Trung Quốc", "Hoa Kỳ", "Canada"], answer: 0 },
        { t: "choice", q: "Kinh tế Nga mạnh nhất ở lĩnh vực nào?", options: ["Dầu mỏ, khí đốt", "Trồng cà phê", "Du lịch biển nhiệt đới", "Đánh bắt cá ngừ"], answer: 0 },
        { t: "truefalse", q: "Lãnh thổ Nga trải dài qua nhiều múi giờ.", answer: true },
        { t: "choice", q: "Quảng trường nổi tiếng ở Mát-xcơ-va là gì?", options: ["Quảng trường Đỏ", "Quảng trường Thời Đại", "Quảng trường Trafalgar", "Quảng trường Thiên An Môn"], answer: 0 },
      ],
    },
    {
      id: "wd-l11-c1-l4",
      title: "Nhật Bản & Trung Quốc",
      goal: "Hai cường quốc kinh tế hàng đầu châu Á",
      teach: [
        topic11("Nhật Bản — cường quốc công nghệ",
          "Nhật Bản gần như không có tài nguyên khoáng sản nhưng vẫn trở thành cường quốc kinh tế nhờ đầu tư mạnh vào khoa học công nghệ, giáo dục và nguồn nhân lực chất lượng cao. Nổi bật ở ngành ô tô, robot, điện tử.",
          [{ label: "Bí quyết", value: "Công nghệ, con người" }, { label: "Mạnh về", value: "Ô tô, điện tử, robot" }]),
        topic11("Trung Quốc — nền kinh tế quy mô lớn",
          "Trung Quốc là quốc gia đông dân và có nền kinh tế quy mô rất lớn, phát triển nhanh chóng từ cải cách mở cửa. Mạnh về sản xuất công nghiệp quy mô lớn, xuất khẩu hàng hoá đi khắp thế giới.",
          [{ label: "Đặc điểm", value: "Đông dân, tăng trưởng nhanh" }, { label: "Mạnh về", value: "Sản xuất công nghiệp" }]),
      ],
      quiz: [
        { t: "choice", q: "Nhật Bản trở thành cường quốc kinh tế nhờ đâu dù ít tài nguyên?", options: ["Công nghệ và nguồn nhân lực", "Nhiều dầu mỏ", "Đất đai rộng lớn", "Khí hậu ôn hoà"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào Nhật Bản trên bản đồ.", targetType: "country", targetId: "jp" },
        { t: "mapclick", q: "Hãy bấm vào Trung Quốc trên bản đồ.", targetType: "country", targetId: "cn" },
        { t: "truefalse", q: "Trung Quốc là quốc gia đông dân với nền kinh tế quy mô rất lớn.", answer: true },
      ],
    },
    {
      id: "wd-l11-c1-l5",
      title: "Khu vực Đông Nam Á",
      goal: "Vị trí, tự nhiên và hợp tác khu vực ASEAN",
      teach: [
        { t: "intro", title: "Cầu nối giữa hai đại dương",
          body: "Đông Nam Á nằm ở vị trí cầu nối giữa châu Á và châu Đại Dương, giữa Thái Bình Dương và Ấn Độ Dương — vị trí địa lí – chiến lược rất quan trọng cho giao thương hàng hải quốc tế.",
          bullets: ["Gồm phần lục địa (bán đảo Trung Ấn) và phần hải đảo", "Khí hậu nhiệt đới gió mùa và xích đạo", "Việt Nam là một thành viên của khu vực này"] },
        { t: "culture", title: "ASEAN — mái nhà chung khu vực",
          body: "Hiệp hội các quốc gia Đông Nam Á (ASEAN) là tổ chức hợp tác kinh tế, chính trị giữa các nước trong khu vực, trong đó có Việt Nam, nhằm thúc đẩy hoà bình, ổn định và phát triển kinh tế chung." },
      ],
      quiz: [
        { t: "choice", q: "Đông Nam Á nằm giữa hai đại dương nào?", options: ["Thái Bình Dương và Ấn Độ Dương", "Đại Tây Dương và Bắc Băng Dương", "Chỉ có Thái Bình Dương", "Chỉ có Ấn Độ Dương"], answer: 0 },
        { t: "choice", q: "Tổ chức hợp tác khu vực Đông Nam Á tên là gì?", options: ["ASEAN", "EU", "NATO", "OPEC"], answer: 0 },
        { t: "truefalse", q: "Việt Nam là một thành viên của ASEAN.", answer: true },
        { t: "choice", q: "Đông Nam Á gồm những bộ phận nào?", options: ["Phần lục địa và phần hải đảo", "Chỉ có phần lục địa", "Chỉ có phần hải đảo", "Không có đảo nào"], answer: 0 },
      ],
    },
    {
      id: "wd-l11-c1-l6",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại các cường quốc và khu vực tiêu biểu",
      quiz: [
        { t: "choice", q: "Quốc gia nào có nền kinh tế lớn nhất thế giới?", options: ["Hoa Kỳ", "Lào", "Campuchia", "Nam Phi"], answer: 0 },
        { t: "choice", q: "Quốc gia nào có diện tích lớn nhất thế giới?", options: ["Liên bang Nga", "Trung Quốc", "Đức", "Nhật Bản"], answer: 0 },
        { t: "choice", q: "Việt Nam là thành viên của tổ chức khu vực nào?", options: ["ASEAN", "EU", "NATO", "Không tổ chức nào"], answer: 0 },
        { t: "match", q: "Nối quốc gia với đặc điểm nổi bật.",
          pairs: [["Nhật Bản", "Cường quốc công nghệ dù ít tài nguyên"], ["Đức", "Nền kinh tế lớn nhất EU"], ["Nga", "Diện tích lớn nhất thế giới"]] },
        { t: "truefalse", q: "EU cho phép hàng hoá và con người di chuyển tự do giữa các nước thành viên.", answer: true },
      ],
    },
  ],
};

// ===== Lớp 8, 9, 12 — phần Thế giới. Chương trình thật của các lớp này thiên về tự nhiên
// Việt Nam (lớp 8), dân cư-kinh tế Việt Nam (lớp 9) và Việt Nam chuyên sâu (lớp 12) — xem ở
// phân môn Việt Nam cùng lớp. Ở đây soạn nội dung song song về châu Á và thế giới đương đại,
// dùng đúng khái niệm của từng lớp để so sánh Việt Nam với khu vực, thế giới.

const c7 = {
  id: "wd-l8-c1",
  title: "Tự nhiên châu Á",
  icon: "book",
  lessons: [
    {
      id: "wd-l8-c1-l1",
      title: "Vị trí, địa hình châu Á",
      goal: "Đặc điểm vị trí và địa hình của châu lục lớn nhất",
      teach: [
        { t: "intro", title: "Châu lục của những kỷ lục",
          body: "Châu Á là châu lục rộng nhất, có địa hình rất đa dạng và chứa nhiều kỷ lục địa lí của thế giới, từ đỉnh núi cao nhất đến hồ sâu nhất.",
          bullets: ["Đỉnh Everest (Hi-ma-lay-a) — cao nhất thế giới, hơn 8.800m", "Cao nguyên Tây Tạng — cao nguyên lớn nhất, cao nhất thế giới", "Đồng bằng Tây Xi-bia và đồng bằng Ấn – Hằng rất rộng lớn"] },
        { t: "topic", kicker: "Địa hình", title: "Núi cao ở trung tâm, đồng bằng ở rìa",
          body: "Địa hình châu Á có xu hướng cao ở trung tâm (dãy Hi-ma-lay-a, cao nguyên Tây Tạng, Pa-mia) rồi thấp dần ra các phía, với nhiều đồng bằng rộng lớn ở rìa lục địa — nơi tập trung dân cư đông đúc.",
          facts: [{ label: "Cao nhất", value: "Đỉnh Everest" }] },
      ],
      quiz: [
        { t: "choice", q: "Đỉnh núi cao nhất thế giới thuộc dãy núi nào của châu Á?", options: ["Hi-ma-lay-a", "Andes", "Alps", "Rocky"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào một quốc gia bất kỳ thuộc CHÂU Á trên bản đồ.", targetType: "continent", targetId: "chau-a" },
        { t: "truefalse", q: "Địa hình châu Á có xu hướng cao ở trung tâm, thấp dần ra rìa.", answer: true },
        { t: "choice", q: "Cao nguyên nào được xem là cao nhất thế giới?", options: ["Tây Tạng", "Tây Nguyên", "Đề-can", "Mông Cổ"], answer: 0 },
      ],
    },
    {
      id: "wd-l8-c1-l2",
      title: "Khí hậu và đới thiên nhiên châu Á",
      goal: "Sự phân hoá khí hậu đa dạng nhất trong các châu lục",
      teach: [
        { t: "topic", kicker: "Khí hậu", title: "Đa dạng nhất trong các châu lục",
          body: "Do lãnh thổ trải dài từ vùng cực tới xích đạo và có địa hình núi cao đồ sộ, châu Á có gần như đầy đủ các đới và kiểu khí hậu trên Trái Đất: từ hàn đới ở phía Bắc, ôn đới, đến nhiệt đới gió mùa và xích đạo ở phía Nam.",
          facts: [{ label: "Đặc điểm", value: "Đa dạng khí hậu nhất" }] },
        { t: "culture", title: "Gió mùa châu Á",
          body: "Khu vực Nam Á, Đông Nam Á và Đông Á (trong đó có Việt Nam) chịu ảnh hưởng mạnh của gió mùa — gió đổi hướng theo mùa, mang mưa lớn vào mùa hè và khô lạnh hoặc mát vào mùa đông." },
      ],
      quiz: [
        { t: "choice", q: "Vì sao khí hậu châu Á rất đa dạng?", options: ["Lãnh thổ trải dài từ cực tới xích đạo", "Toàn bộ nằm trên xích đạo", "Toàn bộ là hoang mạc", "Không có núi"], answer: 0 },
        { t: "choice", q: "Khu vực nào của châu Á chịu ảnh hưởng mạnh của gió mùa?", options: ["Nam Á, Đông Nam Á, Đông Á", "Bắc Á", "Trung Á", "Tây Á"], answer: 0 },
        { t: "truefalse", q: "Việt Nam nằm trong khu vực chịu ảnh hưởng gió mùa châu Á.", answer: true },
      ],
    },
    {
      id: "wd-l8-c1-l2b",
      title: "Sông ngòi châu Á",
      goal: "Các hệ thống sông lớn và vai trò với đời sống con người",
      teach: [
        { t: "topic", kicker: "Sông lớn", title: "Những dòng sông nuôi dưỡng nền văn minh",
          body: "Châu Á có nhiều hệ thống sông lớn bậc nhất thế giới: sông Trường Giang và Hoàng Hà ở Trung Quốc, sông Hằng ở Ấn Độ, sông Mê Kông chảy qua nhiều nước Đông Nam Á trong đó có Việt Nam. Đây đều là những cái nôi của các nền văn minh cổ đại.",
          facts: [{ label: "Sông dài nhất châu Á", value: "Trường Giang" }, { label: "Chảy qua Việt Nam", value: "Sông Mê Kông" }] },
      ],
      quiz: [
        { t: "choice", q: "Sông nào chảy qua nhiều nước Đông Nam Á, trong đó có Việt Nam?", options: ["Sông Mê Kông", "Sông Nile", "Sông Amazon", "Sông Volga"], answer: 0 },
        { t: "truefalse", q: "Sông Hằng là một trong những hệ thống sông lớn của châu Á.", answer: true },
      ],
    },
    {
      id: "wd-l8-c1-l3",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại vị trí, địa hình và khí hậu châu Á",
      quiz: [
        { t: "choice", q: "Đỉnh núi cao nhất thế giới thuộc châu lục nào?", options: ["Châu Á", "Châu Âu", "Châu Phi", "Châu Mỹ"], answer: 0 },
        { t: "choice", q: "Châu Á có đặc điểm khí hậu như thế nào?", options: ["Rất đa dạng", "Chỉ có 1 kiểu khí hậu", "Toàn lạnh giá", "Toàn nóng ẩm"], answer: 0 },
        { t: "truefalse", q: "Địa hình châu Á cao ở trung tâm, thấp dần ra rìa lục địa.", answer: true },
      ],
    },
  ],
};

const c8 = {
  id: "wd-l9-c1",
  title: "Dân cư & kinh tế châu Á",
  icon: "book",
  lessons: [
    {
      id: "wd-l9-c1-l1",
      title: "Dân cư châu Á",
      goal: "Châu lục đông dân và đa dạng nhất thế giới",
      teach: [
        { t: "topic", kicker: "Dân cư", title: "Hơn một nửa dân số thế giới",
          body: "Châu Á là châu lục đông dân nhất, chiếm hơn một nửa dân số thế giới, tập trung đông đúc ở các đồng bằng châu thổ và ven biển như đồng bằng Ấn – Hằng, đồng bằng Hoa Bắc, đồng bằng sông Hồng, sông Cửu Long.",
          facts: [{ label: "Tỉ lệ", value: "Hơn 1/2 dân số thế giới" }] },
        { t: "culture", title: "Đa dạng chủng tộc, tôn giáo, văn hoá",
          body: "Châu Á là nơi khởi nguồn của nhiều tôn giáo lớn như Phật giáo, Hồi giáo, Ấn Độ giáo, và có sự đa dạng chủng tộc, ngôn ngữ, văn hoá bậc nhất thế giới." },
      ],
      quiz: [
        { t: "choice", q: "Châu Á chiếm khoảng bao nhiêu phần dân số thế giới?", options: ["Hơn một nửa", "Một phần mười", "Một phần tư", "Gần như không đáng kể"], answer: 0 },
        { t: "truefalse", q: "Châu Á là nơi khởi nguồn của nhiều tôn giáo lớn trên thế giới.", answer: true },
        { t: "choice", q: "Dân cư châu Á tập trung đông đúc nhất ở đâu?", options: ["Các đồng bằng châu thổ, ven biển", "Sa mạc", "Núi cao", "Vùng cực"], answer: 0 },
      ],
    },
    {
      id: "wd-l9-c1-l2",
      title: "Các nền kinh tế lớn châu Á",
      goal: "Những cường quốc kinh tế châu Á tiêu biểu",
      teach: [
        { t: "topic", kicker: "Kinh tế", title: "Nhiều nền kinh tế hàng đầu thế giới",
          body: "Châu Á có nhiều nền kinh tế lớn và phát triển nhanh: Trung Quốc và Nhật Bản nằm trong nhóm các nền kinh tế lớn nhất thế giới, Hàn Quốc và Singapore nổi bật về công nghệ, còn Ấn Độ đang tăng trưởng rất nhanh với dân số đông đảo.",
          facts: [{ label: "Tiêu biểu", value: "Trung Quốc, Nhật Bản, Hàn Quốc" }] },
      ],
      quiz: [
        { t: "choice", q: "Quốc gia châu Á nào nổi bật về công nghệ, có thu nhập cao dù diện tích nhỏ?", options: ["Hàn Quốc", "Lào", "Mông Cổ", "Nê-pan"], answer: 0 },
        { t: "mapclick", q: "Hãy bấm vào Trung Quốc trên bản đồ.", targetType: "country", targetId: "cn" },
        { t: "truefalse", q: "Nhật Bản nằm trong nhóm các nền kinh tế lớn nhất thế giới.", answer: true },
      ],
    },
    {
      id: "wd-l9-c1-l2b",
      title: "Đô thị hoá châu Á",
      goal: "Các siêu đô thị đông dân nhất châu lục",
      teach: [
        { t: "culture", title: "Nơi tập trung nhiều siêu đô thị nhất thế giới",
          body: "Châu Á có nhiều siêu đô thị (trên 10 triệu dân) nhất thế giới như Tokyo, Thượng Hải, Bắc Kinh, Jakarta, Manila — phản ánh tốc độ đô thị hoá và tăng dân số rất nhanh ở khu vực Đông Á và Đông Nam Á." },
      ],
      quiz: [
        { t: "choice", q: "Siêu đô thị là gì?", options: ["Đô thị có trên 10 triệu dân", "Đô thị có dưới 1.000 dân", "Một loại bản đồ", "Một dãy núi"], answer: 0 },
        { t: "truefalse", q: "Tokyo là một trong những siêu đô thị lớn của châu Á.", answer: true },
      ],
    },
    {
      id: "wd-l9-c1-l3",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại dân cư và các nền kinh tế lớn châu Á",
      quiz: [
        { t: "choice", q: "Châu Á chiếm khoảng bao nhiêu dân số thế giới?", options: ["Hơn một nửa", "Một phần mười", "Rất ít", "Không đáng kể"], answer: 0 },
        { t: "choice", q: "Quốc gia nào ở châu Á có nền kinh tế lớn hàng đầu thế giới?", options: ["Trung Quốc", "Lào", "Mông Cổ", "Bu-tan"], answer: 0 },
        { t: "truefalse", q: "Châu Á là nơi khởi nguồn nhiều tôn giáo lớn.", answer: true },
      ],
    },
  ],
};

const c9 = {
  id: "wd-l12-c1",
  title: "Toàn cầu hoá & thế giới đương đại",
  icon: "book",
  lessons: [
    {
      id: "wd-l12-c1-l1",
      title: "Toàn cầu hoá là gì?",
      goal: "Xu thế liên kết ngày càng chặt chẽ giữa các quốc gia",
      teach: [
        { t: "intro", title: "Thế giới ngày càng gắn kết",
          body: "Toàn cầu hoá là quá trình các quốc gia trên thế giới ngày càng liên kết chặt chẽ về kinh tế, công nghệ, văn hoá. Hàng hoá, vốn đầu tư, thông tin và con người di chuyển giữa các nước dễ dàng hơn bao giờ hết.",
          bullets: ["Thương mại quốc tế phát triển mạnh", "Các công ty đa quốc gia hoạt động ở nhiều nước", "Internet giúp thông tin lan truyền tức thời toàn cầu"] },
        { t: "culture", title: "Cơ hội và thách thức",
          body: "Toàn cầu hoá mang lại cơ hội tiếp cận thị trường rộng lớn, công nghệ mới, nhưng cũng đặt ra thách thức về cạnh tranh kinh tế và giữ gìn bản sắc văn hoá riêng của mỗi quốc gia." },
      ],
      quiz: [
        { t: "choice", q: "Toàn cầu hoá là gì?", options: ["Quá trình các nước liên kết chặt chẽ hơn", "Các nước đóng cửa biên giới", "Ngừng giao thương quốc tế", "Chỉ một nước phát triển"], answer: 0 },
        { t: "truefalse", q: "Toàn cầu hoá giúp hàng hoá, thông tin di chuyển dễ dàng hơn giữa các nước.", answer: true },
        { t: "choice", q: "Công ty hoạt động ở nhiều quốc gia được gọi là gì?", options: ["Công ty đa quốc gia", "Công ty gia đình", "Công ty một người", "Hợp tác xã"], answer: 0 },
      ],
    },
    {
      id: "wd-l12-c1-l2",
      title: "Các vấn đề môi trường toàn cầu",
      goal: "Biến đổi khí hậu và ô nhiễm môi trường",
      teach: [
        { t: "topic", kicker: "Biến đổi khí hậu", title: "Trái Đất đang ấm lên",
          body: "Nhiệt độ trung bình Trái Đất đang tăng lên do khí thải nhà kính từ hoạt động sản xuất, giao thông của con người, gây ra hiện tượng băng tan, nước biển dâng, thời tiết cực đoan ngày càng nhiều.",
          facts: [{ label: "Nguyên nhân chính", value: "Khí thải nhà kính" }] },
        { t: "topic", kicker: "Ô nhiễm môi trường", title: "Rác thải nhựa và ô nhiễm không khí",
          body: "Rác thải nhựa đổ ra đại dương và ô nhiễm không khí ở các đô thị lớn là hai vấn đề môi trường cấp bách, đòi hỏi sự hợp tác của tất cả các quốc gia để giải quyết.",
          facts: [{ label: "Vấn đề nổi bật", value: "Rác nhựa đại dương, ô nhiễm không khí" }] },
      ],
      quiz: [
        { t: "choice", q: "Nguyên nhân chính gây biến đổi khí hậu hiện nay là gì?", options: ["Khí thải nhà kính từ hoạt động con người", "Núi lửa phun trào", "Động đất", "Thuỷ triều"], answer: 0 },
        { t: "truefalse", q: "Băng tan và nước biển dâng là hệ quả của biến đổi khí hậu.", answer: true },
        { t: "choice", q: "Rác thải nhựa gây ô nhiễm chủ yếu ở đâu?", options: ["Đại dương", "Sa mạc", "Núi cao", "Tầng bình lưu"], answer: 0 },
      ],
    },
    {
      id: "wd-l12-c1-l2b",
      title: "Phát triển bền vững",
      goal: "Cân bằng giữa phát triển kinh tế và bảo vệ môi trường",
      teach: [
        { t: "intro", title: "Phát triển cho hôm nay, không quên ngày mai",
          body: "Phát triển bền vững là cách phát triển đáp ứng nhu cầu hiện tại mà không làm tổn hại tới khả năng đáp ứng nhu cầu của các thế hệ tương lai — cân bằng giữa ba mặt: kinh tế, xã hội và môi trường.",
          bullets: ["Kinh tế: tăng trưởng nhưng tiết kiệm tài nguyên", "Xã hội: đảm bảo công bằng, chất lượng sống", "Môi trường: bảo vệ, không khai thác cạn kiệt"] },
      ],
      quiz: [
        { t: "choice", q: "Phát triển bền vững cân bằng giữa mấy mặt?", options: ["3 (kinh tế, xã hội, môi trường)", "1", "5", "10"], answer: 0 },
        { t: "truefalse", q: "Phát triển bền vững nghĩa là chỉ chú trọng tăng trưởng kinh tế, bỏ qua môi trường.", answer: false },
      ],
    },
    {
      id: "wd-l12-c1-l3",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại toàn cầu hoá và các vấn đề môi trường toàn cầu",
      quiz: [
        { t: "choice", q: "Toàn cầu hoá là quá trình gì?", options: ["Các nước liên kết chặt chẽ hơn", "Đóng cửa biên giới", "Ngừng giao thương", "Chia tách lãnh thổ"], answer: 0 },
        { t: "choice", q: "Nguyên nhân chính của biến đổi khí hậu là gì?", options: ["Khí thải nhà kính", "Gió mùa", "Thuỷ triều", "Núi lửa"], answer: 0 },
        { t: "truefalse", q: "Ô nhiễm rác thải nhựa đại dương là vấn đề môi trường toàn cầu cấp bách.", answer: true },
      ],
    },
  ],
};

// ===== Lớp 4-5, chương 2 — thêm 23 quốc gia nữa (23 + 15 nước ở chương 1 = 38 nước), phủ
// rộng hơn khắp các châu lục để bớt "ít bài" — mỗi nước một thẻ gọn: thủ đô, châu lục.

function pw(id, name, capital, continentLabel) {
  return { t: "place", id, title: name, subtitle: `${continentLabel} · Thủ đô ${capital}`,
    body: `${name} thuộc ${continentLabel.toLowerCase()}, có thủ đô là ${capital}.`,
    facts: [{ label: "Thủ đô", value: capital }, { label: "Châu lục", value: continentLabel }] };
}

const c1c = {
  id: "wd-l45-c2",
  title: "38 quốc gia trên thế giới",
  icon: "book",
  lessons: [
    {
      id: "wd-l45-c2-l1",
      title: "Thêm các nước châu Á",
      goal: "Ấn Độ, In-đô-nê-xi-a, Phi-líp-pin, Ma-lai-xi-a, Xin-ga-po, Ả Rập Xê Út, Pa-ki-xtan",
      teach: [
        pw("in", "Ấn Độ", "Niu Đê-li", "Châu Á"),
        pw("id", "In-đô-nê-xi-a", "Gia-các-ta", "Châu Á"),
        pw("ph", "Phi-líp-pin", "Ma-ni-la", "Châu Á"),
        pw("my", "Ma-lai-xi-a", "Cua-la Lăm-pơ", "Châu Á"),
        pw("sg", "Xin-ga-po", "Xin-ga-po", "Châu Á"),
        pw("sa", "Ả Rập Xê Út", "Ri-i-át", "Châu Á"),
        pw("pk", "Pa-ki-xtan", "I-xla-ma-bát", "Châu Á"),
      ],
      quiz: [
        { t: "mapclick", q: "Hãy bấm vào Ấn Độ trên bản đồ.", targetType: "country", targetId: "in" },
        { t: "mapclick", q: "Hãy bấm vào In-đô-nê-xi-a trên bản đồ.", targetType: "country", targetId: "id" },
        { t: "choice", q: "Thủ đô của Ấn Độ là gì?", options: ["Niu Đê-li", "Gia-các-ta", "Ma-ni-la", "Ri-i-át"], answer: 0 },
        { t: "match", q: "Nối quốc gia với thủ đô.",
          pairs: [["Xin-ga-po", "Xin-ga-po"], ["Ma-lai-xi-a", "Cua-la Lăm-pơ"], ["Pa-ki-xtan", "I-xla-ma-bát"]] },
        { t: "truefalse", q: "Ấn Độ, In-đô-nê-xi-a, Phi-líp-pin đều thuộc châu Á.", answer: true },
      ],
    },
    {
      id: "wd-l45-c2-l2",
      title: "Thêm các nước châu Âu",
      goal: "Ý, Tây Ban Nha, Hà Lan, Thuỵ Điển, Thuỵ Sĩ, Bồ Đào Nha, Ba Lan, Hy Lạp",
      teach: [
        pw("it", "Ý", "Rô-ma", "Châu Âu"),
        pw("es", "Tây Ban Nha", "Ma-đrít", "Châu Âu"),
        pw("nl", "Hà Lan", "Am-xtéc-đam", "Châu Âu"),
        pw("se", "Thuỵ Điển", "Xtốc-khôm", "Châu Âu"),
        pw("ch", "Thuỵ Sĩ", "Béc-nơ", "Châu Âu"),
        pw("pt", "Bồ Đào Nha", "Li-xbon", "Châu Âu"),
        pw("pl", "Ba Lan", "Vác-sa-va", "Châu Âu"),
        pw("gr", "Hy Lạp", "A-ten", "Châu Âu"),
      ],
      quiz: [
        { t: "mapclick", q: "Hãy bấm vào Ý trên bản đồ.", targetType: "country", targetId: "it" },
        { t: "mapclick", q: "Hãy bấm vào Tây Ban Nha trên bản đồ.", targetType: "country", targetId: "es" },
        { t: "choice", q: "Thủ đô của Ý là gì?", options: ["Rô-ma", "Ma-đrít", "A-ten", "Béc-nơ"], answer: 0 },
        { t: "match", q: "Nối quốc gia với thủ đô.",
          pairs: [["Hà Lan", "Am-xtéc-đam"], ["Thuỵ Điển", "Xtốc-khôm"], ["Ba Lan", "Vác-sa-va"]] },
        { t: "drag", q: "Kéo mỗi thủ đô vào đúng quốc gia.",
          buckets: ["Bồ Đào Nha", "Hy Lạp", "Thuỵ Sĩ"],
          items: [{ label: "Li-xbon", bucket: 0 }, { label: "A-ten", bucket: 1 }, { label: "Béc-nơ", bucket: 2 }] },
      ],
    },
    {
      id: "wd-l45-c2-l3",
      title: "Thêm các nước châu Mỹ",
      goal: "Ca-na-đa, Mê-hi-cô, Ác-hen-ti-na, Chi-lê",
      teach: [
        pw("ca", "Ca-na-đa", "Ốt-ta-oa", "Châu Mỹ"),
        pw("mx", "Mê-hi-cô", "Mê-hi-cô City", "Châu Mỹ"),
        pw("ar", "Ác-hen-ti-na", "Bu-ê-nốt Ai-rét", "Châu Mỹ"),
        pw("cl", "Chi-lê", "Xan-ti-a-gô", "Châu Mỹ"),
      ],
      quiz: [
        { t: "mapclick", q: "Hãy bấm vào Ca-na-đa trên bản đồ.", targetType: "country", targetId: "ca" },
        { t: "mapclick", q: "Hãy bấm vào Ác-hen-ti-na trên bản đồ.", targetType: "country", targetId: "ar" },
        { t: "choice", q: "Thủ đô của Ca-na-đa là gì?", options: ["Ốt-ta-oa", "Mê-hi-cô City", "Xan-ti-a-gô", "Bu-ê-nốt Ai-rét"], answer: 0 },
        { t: "match", q: "Nối quốc gia với thủ đô.", pairs: [["Mê-hi-cô", "Mê-hi-cô City"], ["Chi-lê", "Xan-ti-a-gô"]] },
      ],
    },
    {
      id: "wd-l45-c2-l4",
      title: "Thêm các nước châu Phi & Đại Dương",
      goal: "Ni-giê-ri-a, Kê-ni-a, Ma-rốc, Niu Di-lân",
      teach: [
        pw("ng", "Ni-giê-ri-a", "A-bu-gia", "Châu Phi"),
        pw("ke", "Kê-ni-a", "Nai-rô-bi", "Châu Phi"),
        pw("ma", "Ma-rốc", "Ra-bát", "Châu Phi"),
        pw("nz", "Niu Di-lân", "Well-ing-tơn", "Châu Đại Dương"),
      ],
      quiz: [
        { t: "mapclick", q: "Hãy bấm vào Ni-giê-ri-a trên bản đồ.", targetType: "country", targetId: "ng" },
        { t: "mapclick", q: "Hãy bấm vào Niu Di-lân trên bản đồ.", targetType: "country", targetId: "nz" },
        { t: "choice", q: "Ni-giê-ri-a là quốc gia đông dân nhất châu lục nào?", options: ["Châu Phi", "Châu Á", "Châu Âu", "Châu Mỹ"], answer: 0 },
        { t: "truefalse", q: "Niu Di-lân thuộc châu Đại Dương.", answer: true },
      ],
    },
    {
      id: "wd-l45-c2-l5",
      title: "Ôn tập chương",
      checkpoint: true,
      goal: "Ôn lại 23 quốc gia vừa học",
      quiz: [
        { t: "mapclick", q: "Bấm vào Ấn Độ.", targetType: "country", targetId: "in" },
        { t: "mapclick", q: "Bấm vào Ý.", targetType: "country", targetId: "it" },
        { t: "mapclick", q: "Bấm vào Ca-na-đa.", targetType: "country", targetId: "ca" },
        { t: "mapclick", q: "Bấm vào Ma-rốc.", targetType: "country", targetId: "ma" },
        { t: "drag", q: "Kéo mỗi quốc gia vào đúng châu lục.",
          buckets: ["Châu Á", "Châu Âu", "Châu Mỹ", "Châu Phi"],
          items: [
            { label: "Xin-ga-po", bucket: 0 }, { label: "Pa-ki-xtan", bucket: 0 },
            { label: "Hà Lan", bucket: 1 }, { label: "Hy Lạp", bucket: 1 },
            { label: "Chi-lê", bucket: 2 }, { label: "Ni-giê-ri-a", bucket: 3 },
          ] },
        { t: "choice", q: "Thủ đô của Ấn Độ là gì?", options: ["Niu Đê-li", "Ma-ni-la", "Rô-ma", "Xtốc-khôm"], answer: 0 },
      ],
    },
  ],
};

export const WORLD_COURSE = {
  subject: "world",
  levels: {
    l45: { chapters: [c1, c1c] },
    l6:  { chapters: [c2, c4] },
    l7:  { chapters: [c3, c3b] },
    l8:  { chapters: [c7] },
    l9:  { chapters: [c8] },
    l10: { chapters: [c5] },
    l11: { chapters: [c6] },
    l12: { chapters: [c9] },
  },
};
