/* ============================================================
   ON-Language — Trình độ B2 (Trên trung cấp, khung CEFR)
   SINH TỰ ĐỘNG từ scratchpad/soan_b2_*.js — đừng sửa tay file này.
   Phiên âm IPA do espeak-ng tra, không gõ tay.
   ============================================================ */

const B2 = {
  "id": "b2",
  "code": "B2",
  "name": "Trên trung cấp",
  "desc": "Nói được ý mình có sắc thái: bị động, tường thuật, điều kiện, cụm động từ.",
  "units": [
    {
      "id": "b2u1",
      "title": "Công việc & Sự nghiệp",
      "goal": "Nói về công việc, phỏng vấn và thăng tiến như người đi làm thật.",
      "lessons": [
        {
          "id": "b2u1l1",
          "title": "Xin việc",
          "goal": "Từ vựng tuyển dụng và thì hiện tại hoàn thành trong hồ sơ.",
          "teach": [
            {
              "t": "intro",
              "title": "Hồ sơ xin việc nói bằng thì gì?",
              "body": "Người Anh viết CV gần như toàn bộ bằng hiện tại hoàn thành và quá khứ đơn. Hiểu được lúc nào dùng cái nào là hồ sơ của bạn nghe ra dân chuyên nghiệp ngay.",
              "bullets": [
                "Từ vựng tuyển dụng",
                "have worked hay worked",
                "Cách nói kinh nghiệm"
              ]
            },
            {
              "t": "vocab",
              "en": "apply",
              "vi": "nộp đơn, ứng tuyển",
              "pos": "Động từ",
              "ipa": "/əˈplaɪ/",
              "note": "Luôn đi với for: apply FOR a job. Apply TO a company.",
              "ex": {
                "en": "I applied for three jobs last week.",
                "vi": "Tuần trước tôi nộp đơn ba chỗ."
              }
            },
            {
              "t": "vocab",
              "en": "candidate",
              "vi": "ứng viên",
              "pos": "Danh từ",
              "ipa": "/ˈkændɪˌdeɪt/",
              "note": "Người đang xin việc. Trong bầu cử thì là ứng cử viên.",
              "ex": {
                "en": "We interviewed six candidates.",
                "vi": "Chúng tôi phỏng vấn sáu ứng viên."
              }
            },
            {
              "t": "vocab",
              "en": "experience",
              "vi": "kinh nghiệm",
              "pos": "Danh từ",
              "ipa": "/ɛkˈspiərɪəns/",
              "note": "Không đếm được khi nói kinh nghiệm làm việc: nói much experience, không nói many experiences.",
              "ex": {
                "en": "She has ten years of experience.",
                "vi": "Cô ấy có mười năm kinh nghiệm."
              }
            },
            {
              "t": "vocab",
              "en": "qualification",
              "vi": "bằng cấp, trình độ",
              "pos": "Danh từ",
              "ipa": "/ˌkwɔlɪfɪˈkeɪʃən/",
              "note": "Người Anh hay dùng số nhiều: What qualifications do you have?",
              "ex": {
                "en": "The job requires a teaching qualification.",
                "vi": "Công việc này đòi hỏi bằng sư phạm."
              }
            },
            {
              "t": "vocab",
              "en": "salary",
              "vi": "lương",
              "pos": "Danh từ",
              "ipa": "/ˈsæləri/",
              "note": "Lương tháng của người làm văn phòng. Lương công nhật tính theo giờ là wage.",
              "ex": {
                "en": "The salary is negotiable.",
                "vi": "Lương có thể thương lượng."
              }
            },
            {
              "t": "vocab",
              "en": "colleague",
              "vi": "đồng nghiệp",
              "pos": "Danh từ",
              "ipa": "/ˈkɑːliːɡ/",
              "note": "Trang trọng hơn workmate. Đọc là /ˈkɒliːɡ/, không đọc chữ ea.",
              "ex": {
                "en": "My colleagues are very helpful.",
                "vi": "Đồng nghiệp của tôi rất nhiệt tình."
              }
            },
            {
              "t": "vocab",
              "en": "promotion",
              "vi": "sự thăng chức",
              "pos": "Danh từ",
              "ipa": "/prəˈmoʊʃən/",
              "note": "Get a promotion là được thăng chức. Cũng có nghĩa là khuyến mãi.",
              "ex": {
                "en": "He got a promotion after two years.",
                "vi": "Sau hai năm anh ấy được thăng chức."
              }
            },
            {
              "t": "vocab",
              "en": "deadline",
              "vi": "hạn chót",
              "pos": "Danh từ",
              "ipa": "/ˈdɛdlaɪn/",
              "note": "Meet a deadline là kịp hạn; miss a deadline là trễ hạn.",
              "ex": {
                "en": "We must meet the deadline.",
                "vi": "Chúng ta phải kịp hạn chót."
              }
            },
            {
              "t": "grammar",
              "title": "Hiện tại hoàn thành hay quá khứ đơn?",
              "body": "Đây là chỗ người Việt sai nhiều nhất khi viết CV. Quy tắc gọn: việc ĐÃ KẾT THÚC HẲN, có mốc thời gian rõ thì dùng quá khứ đơn. Việc còn nối tới hiện tại, hoặc không nêu mốc, thì dùng hiện tại hoàn thành.",
              "rows": [
                [
                  "Còn đang làm",
                  "I have worked here for 3 years.",
                  "và vẫn đang làm"
                ],
                [
                  "Đã nghỉ rồi",
                  "I worked there from 2019 to 2022.",
                  "đã xong hẳn"
                ],
                [
                  "Không nêu mốc",
                  "I have managed a team.",
                  "kinh nghiệm nói chung"
                ],
                [
                  "Có nêu mốc",
                  "I managed a team in 2021.",
                  "có năm cụ thể"
                ]
              ],
              "tip": "Hễ câu có since hoặc for thì gần như chắc chắn là hiện tại hoàn thành."
            },
            {
              "t": "dialogue",
              "title": "Phỏng vấn xin việc",
              "lines": [
                {
                  "who": "A",
                  "en": "Tell me about your experience.",
                  "vi": "Hãy kể về kinh nghiệm của bạn."
                },
                {
                  "who": "B",
                  "en": "I have worked as a teacher for five years.",
                  "vi": "Tôi làm giáo viên được năm năm rồi."
                },
                {
                  "who": "A",
                  "en": "Why did you apply for this position?",
                  "vi": "Vì sao bạn ứng tuyển vị trí này?"
                },
                {
                  "who": "B",
                  "en": "I am looking for a new challenge.",
                  "vi": "Tôi đang tìm một thử thách mới."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "I have worked here for three years",
              "vi": "Tôi làm ở đây được ba năm rồi"
            },
            {
              "en": "She applied for the manager position",
              "vi": "Cô ấy đã nộp đơn vị trí quản lý"
            },
            {
              "en": "We must meet the deadline on Friday",
              "vi": "Chúng ta phải kịp hạn chót vào thứ Sáu"
            }
          ]
        },
        {
          "id": "b2u1l2",
          "title": "Ở nơi làm việc",
          "goal": "Câu bị động — cách nói của văn bản công việc.",
          "teach": [
            {
              "t": "intro",
              "title": "Vì sao dân văn phòng hay nói bị động",
              "body": "Tiếng Anh công sở đầy câu bị động, không phải vì họ thích vòng vo mà vì nhiều khi ai làm không quan trọng bằng việc gì đã được làm — hoặc người ta cố tình không muốn chỉ tên ai.",
              "bullets": [
                "Cấu trúc bị động",
                "Khi nào nên dùng",
                "by + người làm"
              ]
            },
            {
              "t": "vocab",
              "en": "meeting",
              "vi": "cuộc họp",
              "pos": "Danh từ",
              "ipa": "/ˈmiːtɪŋ/",
              "note": "Hold a meeting là tổ chức họp; attend a meeting là dự họp.",
              "ex": {
                "en": "The meeting was postponed.",
                "vi": "Cuộc họp đã bị hoãn."
              }
            },
            {
              "t": "vocab",
              "en": "report",
              "vi": "báo cáo",
              "pos": "Danh từ",
              "ipa": "/rɪˈpɔːrt/",
              "note": "Vừa là danh từ vừa là động từ: to report to someone là báo cáo cho ai.",
              "ex": {
                "en": "The report was sent yesterday.",
                "vi": "Báo cáo đã được gửi hôm qua."
              }
            },
            {
              "t": "vocab",
              "en": "schedule",
              "vi": "lịch trình",
              "pos": "Danh từ",
              "ipa": "/ˈskɛdʒuːl/",
              "note": "Người Anh đọc /ˈʃedjuːl/, người Mỹ đọc /ˈskedʒuːl/. Cả hai đều đúng.",
              "ex": {
                "en": "The schedule has been changed.",
                "vi": "Lịch trình đã bị đổi."
              }
            },
            {
              "t": "vocab",
              "en": "responsible",
              "vi": "chịu trách nhiệm",
              "pos": "Tính từ",
              "ipa": "/rɪˈspɑːnsɪbəl/",
              "note": "Luôn đi với for: responsible FOR something.",
              "ex": {
                "en": "I am responsible for the team.",
                "vi": "Tôi chịu trách nhiệm về đội này."
              }
            },
            {
              "t": "vocab",
              "en": "client",
              "vi": "khách hàng",
              "pos": "Danh từ",
              "ipa": "/ˈklaɪənt/",
              "note": "Khách của dịch vụ chuyên môn. Khách mua hàng ở cửa hàng là customer.",
              "ex": {
                "en": "The client approved the design.",
                "vi": "Khách hàng đã duyệt bản thiết kế."
              }
            },
            {
              "t": "vocab",
              "en": "budget",
              "vi": "ngân sách",
              "pos": "Danh từ",
              "ipa": "/ˈbʌdʒɪt/",
              "note": "On budget là đúng ngân sách; over budget là vượt.",
              "ex": {
                "en": "The budget was cut this year.",
                "vi": "Ngân sách năm nay bị cắt."
              }
            },
            {
              "t": "vocab",
              "en": "overtime",
              "vi": "làm thêm giờ",
              "pos": "Danh từ",
              "ipa": "/ˈoʊvərˌtaɪm/",
              "note": "Work overtime. Không nói work overtimes.",
              "ex": {
                "en": "She works overtime every Friday.",
                "vi": "Thứ Sáu nào cô ấy cũng làm thêm giờ."
              }
            },
            {
              "t": "vocab",
              "en": "achieve",
              "vi": "đạt được",
              "pos": "Động từ",
              "ipa": "/əˈtʃiːv/",
              "note": "Đi với mục tiêu, kết quả: achieve a goal. Không dùng cho đồ vật.",
              "ex": {
                "en": "We achieved our target.",
                "vi": "Chúng tôi đã đạt chỉ tiêu."
              }
            },
            {
              "t": "grammar",
              "title": "Câu bị động: be + phân từ hai",
              "body": "Lấy tân ngữ đem lên đầu câu, đổi động từ thành be + phân từ hai. Muốn nêu ai làm thì thêm by ở cuối — nhưng phần lớn câu bị động KHÔNG có by, vì đó chính là lý do người ta dùng bị động.",
              "rows": [
                [
                  "Chủ động",
                  "They sent the report.",
                  "Họ đã gửi báo cáo."
                ],
                [
                  "Bị động",
                  "The report was sent.",
                  "Báo cáo đã được gửi."
                ],
                [
                  "Hiện tại",
                  "The office is cleaned every day.",
                  "Văn phòng được dọn hằng ngày."
                ],
                [
                  "Hoàn thành",
                  "The budget has been cut.",
                  "Ngân sách đã bị cắt."
                ],
                [
                  "Có nêu người",
                  "The design was approved by the client.",
                  "Bản thiết kế được khách duyệt."
                ]
              ],
              "tip": "Tiếng Việt dùng ĐƯỢC khi là việc tốt, BỊ khi là việc xấu. Tiếng Anh chỉ có một dạng cho cả hai."
            }
          ],
          "sentences": [
            {
              "en": "The report was sent yesterday",
              "vi": "Báo cáo đã được gửi hôm qua"
            },
            {
              "en": "The meeting has been postponed",
              "vi": "Cuộc họp đã bị hoãn"
            },
            {
              "en": "I am responsible for the whole team",
              "vi": "Tôi chịu trách nhiệm cả đội"
            }
          ]
        },
        {
          "id": "b2u1l3",
          "title": "Phỏng vấn",
          "goal": "Mệnh đề quan hệ — gộp hai câu thành một.",
          "teach": [
            {
              "t": "intro",
              "title": "Gộp hai ý thành một câu",
              "body": "Người mới học nói từng câu ngắn rời nhau. Người ở trình độ B2 gộp lại bằng who, which, that — nghe liền mạch và trưởng thành hơn hẳn.",
              "bullets": [
                "who cho người, which cho vật",
                "Khi nào bỏ được that",
                "Dấu phẩy đổi cả nghĩa"
              ]
            },
            {
              "t": "vocab",
              "en": "strength",
              "vi": "điểm mạnh",
              "pos": "Danh từ",
              "ipa": "/ˈstrɛŋθ/",
              "note": "Trong phỏng vấn luôn hỏi strengths and weaknesses.",
              "ex": {
                "en": "My strength is patience.",
                "vi": "Điểm mạnh của tôi là kiên nhẫn."
              }
            },
            {
              "t": "vocab",
              "en": "weakness",
              "vi": "điểm yếu",
              "pos": "Danh từ",
              "ipa": "/ˈwiːknəs/",
              "note": "Trả lời khéo là nêu điểm yếu rồi nói mình đang sửa.",
              "ex": {
                "en": "Everyone has weaknesses.",
                "vi": "Ai cũng có điểm yếu."
              }
            },
            {
              "t": "vocab",
              "en": "confident",
              "vi": "tự tin",
              "pos": "Tính từ",
              "ipa": "/ˈkɑːnfɪdənt/",
              "note": "Confident ABOUT something hoặc confident IN someone.",
              "ex": {
                "en": "She seems very confident.",
                "vi": "Cô ấy trông rất tự tin."
              }
            },
            {
              "t": "vocab",
              "en": "reliable",
              "vi": "đáng tin cậy",
              "pos": "Tính từ",
              "ipa": "/rɪˈlaɪəbəl/",
              "note": "Từ mà nhà tuyển dụng nào cũng muốn nghe.",
              "ex": {
                "en": "He is a reliable worker.",
                "vi": "Anh ấy là người làm việc đáng tin."
              }
            },
            {
              "t": "vocab",
              "en": "flexible",
              "vi": "linh hoạt",
              "pos": "Tính từ",
              "ipa": "/ˈflɛksɪbəl/",
              "note": "Flexible hours là giờ làm linh hoạt.",
              "ex": {
                "en": "We need flexible staff.",
                "vi": "Chúng tôi cần nhân viên linh hoạt."
              }
            },
            {
              "t": "vocab",
              "en": "opportunity",
              "vi": "cơ hội",
              "pos": "Danh từ",
              "ipa": "/ɑːpərˈtuːnɪti/",
              "note": "Trang trọng hơn chance. An opportunity TO do something.",
              "ex": {
                "en": "This is a great opportunity.",
                "vi": "Đây là một cơ hội lớn."
              }
            },
            {
              "t": "vocab",
              "en": "challenge",
              "vi": "thử thách",
              "pos": "Danh từ",
              "ipa": "/ˈtʃælɪndʒ/",
              "note": "Nói mình thích challenge là câu trả lời phỏng vấn an toàn.",
              "ex": {
                "en": "I enjoy a challenge.",
                "vi": "Tôi thích thử thách."
              }
            },
            {
              "t": "vocab",
              "en": "teamwork",
              "vi": "làm việc nhóm",
              "pos": "Danh từ",
              "ipa": "/ˈtiːmwɜːk/",
              "note": "Không đếm được, không có số nhiều.",
              "ex": {
                "en": "Teamwork is essential here.",
                "vi": "Ở đây làm việc nhóm là thiết yếu."
              }
            },
            {
              "t": "grammar",
              "title": "who, which, that — mệnh đề quan hệ",
              "body": "Đặt ngay sau danh từ nó bổ nghĩa. Đây là chỗ khác tiếng Việt nhất: tiếng Việt đặt phần bổ nghĩa TRƯỚC, tiếng Anh đặt SAU.",
              "rows": [
                [
                  "Người",
                  "The man who called is my boss.",
                  "Người gọi điện là sếp tôi."
                ],
                [
                  "Vật",
                  "The report which arrived is long.",
                  "Báo cáo vừa tới thì dài."
                ],
                [
                  "Dùng chung",
                  "The job that I applied for.",
                  "that thay được cả hai"
                ],
                [
                  "Bỏ được",
                  "The job I applied for.",
                  "bỏ that khi nó là tân ngữ"
                ]
              ],
              "tip": "Mẹo: nếu sau who/which/that là một động từ thì KHÔNG bỏ được; nếu là một chủ ngữ mới thì bỏ được."
            },
            {
              "t": "dialogue",
              "title": "Trả lời câu hỏi khó",
              "lines": [
                {
                  "who": "A",
                  "en": "What is your greatest weakness?",
                  "vi": "Điểm yếu lớn nhất của bạn là gì?"
                },
                {
                  "who": "B",
                  "en": "I used to take on too much work.",
                  "vi": "Tôi từng nhận quá nhiều việc."
                },
                {
                  "who": "A",
                  "en": "And how did you deal with it?",
                  "vi": "Bạn xử lý ra sao?"
                },
                {
                  "who": "B",
                  "en": "I learned to say no politely.",
                  "vi": "Tôi học cách từ chối lịch sự."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "The man who called is my manager",
              "vi": "Người gọi điện là quản lý của tôi"
            },
            {
              "en": "This is the job that I applied for",
              "vi": "Đây là công việc tôi đã nộp đơn"
            },
            {
              "en": "I enjoy a challenge at work",
              "vi": "Tôi thích thử thách trong công việc"
            }
          ]
        },
        {
          "id": "b2u1l4",
          "title": "Thăng tiến",
          "goal": "Động từ nguyên mẫu hay V-ing — chỗ sai kinh điển.",
          "teach": [
            {
              "t": "intro",
              "title": "want to do hay enjoy doing?",
              "body": "Tiếng Anh có động từ đi với to + V, có động từ đi với V-ing, không theo quy luật nào cả. Phải thuộc. Nhưng chỉ khoảng hai chục động từ là dùng hết ngày thường.",
              "bullets": [
                "Nhóm đi với to",
                "Nhóm đi với V-ing",
                "Vài từ đi được cả hai, đổi nghĩa"
              ]
            },
            {
              "t": "vocab",
              "en": "ambitious",
              "vi": "tham vọng",
              "pos": "Tính từ",
              "ipa": "/æmˈbɪʃəs/",
              "note": "Ở phương Tây đây là lời khen; nói về mình là được.",
              "ex": {
                "en": "She is very ambitious.",
                "vi": "Cô ấy rất tham vọng."
              }
            },
            {
              "t": "vocab",
              "en": "career",
              "vi": "sự nghiệp",
              "pos": "Danh từ",
              "ipa": "/kəˈrɪr/",
              "note": "Đừng lẫn với course. Career là cả đời làm nghề.",
              "ex": {
                "en": "He changed career at forty.",
                "vi": "Bốn mươi tuổi ông ấy đổi nghề."
              }
            },
            {
              "t": "vocab",
              "en": "skill",
              "vi": "kỹ năng",
              "pos": "Danh từ",
              "ipa": "/ˈskɪl/",
              "note": "Soft skills là kỹ năng mềm, hard skills là kỹ năng chuyên môn.",
              "ex": {
                "en": "Communication is a key skill.",
                "vi": "Giao tiếp là kỹ năng then chốt."
              }
            },
            {
              "t": "vocab",
              "en": "training",
              "vi": "sự đào tạo",
              "pos": "Danh từ",
              "ipa": "/ˈtreɪnɪŋ/",
              "note": "Không đếm được. On-the-job training là đào tạo tại chỗ.",
              "ex": {
                "en": "The company offers training.",
                "vi": "Công ty có đào tạo."
              }
            },
            {
              "t": "vocab",
              "en": "improve",
              "vi": "cải thiện",
              "pos": "Động từ",
              "ipa": "/ɪmˈpruːv/",
              "note": "Improve luôn đi thẳng với tân ngữ, không cần giới từ.",
              "ex": {
                "en": "I want to improve my English.",
                "vi": "Tôi muốn cải thiện tiếng Anh."
              }
            },
            {
              "t": "vocab",
              "en": "manage",
              "vi": "quản lý, xoay xở",
              "pos": "Động từ",
              "ipa": "/ˈmænɪdʒ/",
              "note": "Hai nghĩa: quản lý, và cố gắng làm được. Manage TO do something.",
              "ex": {
                "en": "She manages a small team.",
                "vi": "Cô ấy quản lý một nhóm nhỏ."
              }
            },
            {
              "t": "vocab",
              "en": "succeed",
              "vi": "thành công",
              "pos": "Động từ",
              "ipa": "/səkˈsiːd/",
              "note": "Succeed IN doing something. Danh từ là success.",
              "ex": {
                "en": "He succeeded in getting the job.",
                "vi": "Anh ấy xin được việc."
              }
            },
            {
              "t": "vocab",
              "en": "retire",
              "vi": "nghỉ hưu",
              "pos": "Động từ",
              "ipa": "/rɪˈtaɪər/",
              "note": "Retire FROM a job, retire AT sixty.",
              "ex": {
                "en": "My father retired last year.",
                "vi": "Bố tôi nghỉ hưu năm ngoái."
              }
            },
            {
              "t": "grammar",
              "title": "to + V hay V-ing",
              "body": "Không có quy luật, phải thuộc. Nhưng thuộc hai danh sách ngắn này là đủ dùng gần hết.",
              "rows": [
                [
                  "Đi với to + V",
                  "want, need, decide, hope, plan, agree, promise",
                  "I decided to leave."
                ],
                [
                  "Đi với V-ing",
                  "enjoy, finish, avoid, suggest, mind, practise",
                  "I enjoy working here."
                ],
                [
                  "Sau giới từ luôn V-ing",
                  "good at / interested in / instead of",
                  "She is good at writing."
                ],
                [
                  "Đổi nghĩa",
                  "stop to smoke ≠ stop smoking",
                  "dừng LẠI ĐỂ hút ≠ bỏ hút"
                ]
              ],
              "tip": "Mẹo nhớ: động từ nói về Ý ĐỊNH TƯƠNG LAI thì đi với to; động từ nói về VIỆC ĐANG/ĐÃ LÀM thì đi với V-ing."
            }
          ],
          "sentences": [
            {
              "en": "I want to improve my English skills",
              "vi": "Tôi muốn cải thiện kỹ năng tiếng Anh"
            },
            {
              "en": "She enjoys working with young people",
              "vi": "Cô ấy thích làm việc với người trẻ"
            },
            {
              "en": "He succeeded in getting a promotion",
              "vi": "Anh ấy đã được thăng chức"
            }
          ]
        },
        {
          "id": "b2u1l5",
          "title": "Email công việc",
          "goal": "Viết email trang trọng và các cụm cố định.",
          "teach": [
            {
              "t": "intro",
              "title": "Email tiếng Anh chạy bằng câu mẫu",
              "body": "Email công việc tiếng Anh gần như là ghép các câu mẫu có sẵn. Thuộc mươi câu là viết được email tử tế, không cần nghĩ.",
              "bullets": [
                "Mở đầu và kết thúc",
                "Câu đề nghị lịch sự",
                "Trang trọng và thân mật"
              ]
            },
            {
              "t": "vocab",
              "en": "attach",
              "vi": "đính kèm",
              "pos": "Động từ",
              "ipa": "/əˈtætʃ/",
              "note": "Please find attached là câu cố định trong email, nghe hơi cổ nhưng ai cũng dùng.",
              "ex": {
                "en": "I have attached the report.",
                "vi": "Tôi đã đính kèm báo cáo."
              }
            },
            {
              "t": "vocab",
              "en": "confirm",
              "vi": "xác nhận",
              "pos": "Động từ",
              "ipa": "/kənˈfɜːm/",
              "note": "Confirm that + mệnh đề. Rất hay dùng trong email.",
              "ex": {
                "en": "Please confirm your attendance.",
                "vi": "Vui lòng xác nhận bạn sẽ dự."
              }
            },
            {
              "t": "vocab",
              "en": "arrange",
              "vi": "sắp xếp",
              "pos": "Động từ",
              "ipa": "/əˈreɪndʒ/",
              "note": "Arrange a meeting. Danh từ là arrangement.",
              "ex": {
                "en": "Can we arrange a call?",
                "vi": "Ta sắp xếp một cuộc gọi được không?"
              }
            },
            {
              "t": "vocab",
              "en": "postpone",
              "vi": "hoãn lại",
              "pos": "Động từ",
              "ipa": "/poʊstˈpoʊn/",
              "note": "Trang trọng hơn put off. Hoãn sang lúc khác, không phải huỷ.",
              "ex": {
                "en": "The meeting was postponed.",
                "vi": "Cuộc họp đã bị hoãn."
              }
            },
            {
              "t": "vocab",
              "en": "urgent",
              "vi": "khẩn cấp",
              "pos": "Tính từ",
              "ipa": "/ˈɜːdʒənt/",
              "note": "Dùng dè thôi; email nào cũng urgent thì không cái nào urgent.",
              "ex": {
                "en": "This is an urgent matter.",
                "vi": "Đây là việc khẩn."
              }
            },
            {
              "t": "vocab",
              "en": "regarding",
              "vi": "về việc",
              "pos": "Giới từ",
              "ipa": "/rɪˈɡɑːrdɪŋ/",
              "note": "Trang trọng, dùng ở dòng chủ đề. Thân mật thì about.",
              "ex": {
                "en": "Regarding your email of Monday…",
                "vi": "Về email của bạn hôm thứ Hai…"
              }
            },
            {
              "t": "vocab",
              "en": "apologise",
              "vi": "xin lỗi",
              "pos": "Động từ",
              "ipa": "/əˈpɑːləˌdʒaɪz/",
              "note": "Anh viết apologise, Mỹ viết apologize. Apologise FOR something.",
              "ex": {
                "en": "I apologise for the delay.",
                "vi": "Tôi xin lỗi vì đã chậm trễ."
              }
            },
            {
              "t": "vocab",
              "en": "available",
              "vi": "rảnh, có sẵn",
              "pos": "Tính từ",
              "ipa": "/əˈveɪləbəl/",
              "note": "Hỏi lịch: Are you available on Tuesday?",
              "ex": {
                "en": "I am available after three.",
                "vi": "Sau ba giờ tôi rảnh."
              }
            },
            {
              "t": "grammar",
              "title": "Câu mẫu trong email công việc",
              "body": "Ghép các câu này lại là ra một email đàng hoàng. Trang trọng dùng cột giữa, thân mật dùng cột phải.",
              "rows": [
                [
                  "Mở đầu",
                  "Dear Mr Nam,",
                  "Hi Nam,"
                ],
                [
                  "Lý do viết",
                  "I am writing to ask about…",
                  "Just a quick question about…"
                ],
                [
                  "Đề nghị",
                  "Could you please send…?",
                  "Can you send…?"
                ],
                [
                  "Đính kèm",
                  "Please find attached…",
                  "I have attached…"
                ],
                [
                  "Kết",
                  "Best regards,",
                  "Thanks,"
                ]
              ],
              "tip": "Chưa biết tên người nhận thì viết Dear Sir or Madam và kết bằng Yours faithfully."
            }
          ],
          "sentences": [
            {
              "en": "I am writing to confirm our meeting",
              "vi": "Tôi viết để xác nhận cuộc họp"
            },
            {
              "en": "Could you please send me the report",
              "vi": "Bạn gửi giúp tôi báo cáo được không"
            },
            {
              "en": "I apologise for the delay in replying",
              "vi": "Tôi xin lỗi vì trả lời chậm"
            }
          ]
        },
        {
          "id": "b2u1c",
          "title": "Ôn tập chương 1",
          "goal": "Ôn lại cả chương công việc.",
          "checkpoint": true
        }
      ]
    },
    {
      "id": "b2u2",
      "title": "Truyền thông & Ý kiến",
      "goal": "Dẫn lời người khác, nêu quan điểm và tranh luận có lý lẽ.",
      "lessons": [
        {
          "id": "b2u2l1",
          "title": "Tin tức & Báo chí",
          "goal": "Từ vựng truyền thông và câu tường thuật.",
          "teach": [
            {
              "t": "intro",
              "title": "Dẫn lại lời người khác",
              "body": "Muốn kể lại ai nói gì thì tiếng Anh phải lùi thì một bậc — chỗ này tiếng Việt không có nên người Việt hay quên.",
              "bullets": [
                "Lùi thì một bậc",
                "Đổi đại từ và trạng từ",
                "Khi nào KHÔNG phải lùi"
              ]
            },
            {
              "t": "vocab",
              "en": "headline",
              "vi": "tiêu đề báo",
              "pos": "Danh từ",
              "ipa": "/ˈhɛdlaɪn/",
              "note": "Dòng chữ to trên đầu bài báo. Tiêu đề nói chung là title.",
              "ex": {
                "en": "The headline was misleading.",
                "vi": "Tiêu đề gây hiểu nhầm."
              }
            },
            {
              "t": "vocab",
              "en": "article",
              "vi": "bài báo",
              "pos": "Danh từ",
              "ipa": "/ˈɑːrtɪkəl/",
              "note": "Cũng là mạo từ trong ngữ pháp — hai nghĩa khác hẳn nhau.",
              "ex": {
                "en": "I read an interesting article.",
                "vi": "Tôi đọc một bài báo thú vị."
              }
            },
            {
              "t": "vocab",
              "en": "journalist",
              "vi": "nhà báo",
              "pos": "Danh từ",
              "ipa": "/ˈdʒɜːnəˌlɪst/",
              "note": "Reporter là phóng viên đi lấy tin; journalist rộng hơn.",
              "ex": {
                "en": "She works as a journalist.",
                "vi": "Cô ấy làm nhà báo."
              }
            },
            {
              "t": "vocab",
              "en": "broadcast",
              "vi": "phát sóng",
              "pos": "Động từ",
              "ipa": "/ˈbrɔːdkæst/",
              "note": "Quá khứ vẫn là broadcast, không thêm ed.",
              "ex": {
                "en": "The match was broadcast live.",
                "vi": "Trận đấu được phát trực tiếp."
              }
            },
            {
              "t": "vocab",
              "en": "source",
              "vi": "nguồn tin",
              "pos": "Danh từ",
              "ipa": "/ˈsɔːrs/",
              "note": "Check your sources là câu cửa miệng của nghề báo.",
              "ex": {
                "en": "The story has no reliable source.",
                "vi": "Tin này không có nguồn đáng tin."
              }
            },
            {
              "t": "vocab",
              "en": "biased",
              "vi": "thiên vị",
              "pos": "Tính từ",
              "ipa": "/ˈbaɪəst/",
              "note": "Biased TOWARDS hoặc AGAINST. Danh từ là bias.",
              "ex": {
                "en": "The report seems biased.",
                "vi": "Bài viết có vẻ thiên vị."
              }
            },
            {
              "t": "vocab",
              "en": "evidence",
              "vi": "bằng chứng",
              "pos": "Danh từ",
              "ipa": "/ˈɛvɪdəns/",
              "note": "Không đếm được: nói much evidence, không nói many evidences.",
              "ex": {
                "en": "There is no evidence for that.",
                "vi": "Không có bằng chứng nào cho việc đó."
              }
            },
            {
              "t": "vocab",
              "en": "rumour",
              "vi": "tin đồn",
              "pos": "Danh từ",
              "ipa": "/ˈruːmər/",
              "note": "Anh viết rumour, Mỹ viết rumor.",
              "ex": {
                "en": "It is only a rumour.",
                "vi": "Đó chỉ là tin đồn."
              }
            },
            {
              "t": "grammar",
              "title": "Câu tường thuật — lùi thì một bậc",
              "body": "Khi kể lại lời ai đó, động từ lùi về quá khứ một bậc, và các từ chỉ thời gian, nơi chốn cũng đổi theo.",
              "rows": [
                [
                  "Hiện tại đơn → quá khứ đơn",
                  "“I work here.” → He said he worked there.",
                  ""
                ],
                [
                  "Hiện tại tiếp diễn → quá khứ tiếp diễn",
                  "“I am working.” → She said she was working.",
                  ""
                ],
                [
                  "Quá khứ đơn → quá khứ hoàn thành",
                  "“I saw it.” → He said he had seen it.",
                  ""
                ],
                [
                  "will → would",
                  "“I will come.” → She said she would come.",
                  ""
                ],
                [
                  "Đổi từ chỉ lúc",
                  "today → that day · tomorrow → the next day",
                  ""
                ]
              ],
              "tip": "KHÔNG phải lùi thì khi điều đó vẫn còn đúng: He said the earth is round."
            }
          ],
          "sentences": [
            {
              "en": "She said she was working late",
              "vi": "Cô ấy nói đang làm muộn"
            },
            {
              "en": "He told me he had seen the article",
              "vi": "Anh ấy bảo đã đọc bài báo đó"
            },
            {
              "en": "There is no evidence for this rumour",
              "vi": "Không có bằng chứng nào cho tin đồn này"
            }
          ]
        },
        {
          "id": "b2u2l2",
          "title": "Mạng xã hội",
          "goal": "Nói về mạng xã hội và cách nêu ý kiến.",
          "teach": [
            {
              "t": "intro",
              "title": "Nêu ý kiến mà không áp đặt",
              "body": "Người Anh rất ít khi nói thẳng “You are wrong”. Họ bọc ý kiến trong mấy cụm làm mềm. Không học mấy cụm đó thì nói đúng ngữ pháp mà vẫn mất lòng.",
              "bullets": [
                "Cụm nêu ý kiến",
                "Cách phản đối lịch sự",
                "Đồng ý một phần"
              ]
            },
            {
              "t": "vocab",
              "en": "addicted",
              "vi": "nghiện",
              "pos": "Tính từ",
              "ipa": "/əˈdɪktɪd/",
              "note": "Addicted TO something. Danh từ là addiction.",
              "ex": {
                "en": "He is addicted to his phone.",
                "vi": "Anh ấy nghiện điện thoại."
              }
            },
            {
              "t": "vocab",
              "en": "influence",
              "vi": "ảnh hưởng",
              "pos": "Danh từ",
              "ipa": "/ˈɪnfluːəns/",
              "note": "Vừa danh từ vừa động từ. Influence ON somebody.",
              "ex": {
                "en": "Social media has a big influence.",
                "vi": "Mạng xã hội có ảnh hưởng lớn."
              }
            },
            {
              "t": "vocab",
              "en": "privacy",
              "vi": "quyền riêng tư",
              "pos": "Danh từ",
              "ipa": "/ˈpraɪvəsi/",
              "note": "Anh đọc /ˈprɪvəsi/, Mỹ đọc /ˈpraɪvəsi/.",
              "ex": {
                "en": "I worry about my privacy.",
                "vi": "Tôi lo về quyền riêng tư."
              }
            },
            {
              "t": "vocab",
              "en": "post",
              "vi": "bài đăng",
              "pos": "Danh từ",
              "ipa": "/ˈpoʊst/",
              "note": "Vừa là bài đăng vừa là động từ đăng. Cũng là bưu điện.",
              "ex": {
                "en": "Her post went viral.",
                "vi": "Bài của cô ấy lan rất nhanh."
              }
            },
            {
              "t": "vocab",
              "en": "comment",
              "vi": "bình luận",
              "pos": "Danh từ",
              "ipa": "/ˈkɑːmɛnt/",
              "note": "Comment ON something.",
              "ex": {
                "en": "Read the comments below.",
                "vi": "Đọc phần bình luận bên dưới."
              }
            },
            {
              "t": "vocab",
              "en": "share",
              "vi": "chia sẻ",
              "pos": "Động từ",
              "ipa": "/ˈʃɛr/",
              "note": "Share something WITH someone.",
              "ex": {
                "en": "She shared the photo with friends.",
                "vi": "Cô ấy chia sẻ ảnh với bạn bè."
              }
            },
            {
              "t": "vocab",
              "en": "harmful",
              "vi": "có hại",
              "pos": "Tính từ",
              "ipa": "/ˈhɑːrmfəl/",
              "note": "Harmful TO somebody. Trái nghĩa là harmless.",
              "ex": {
                "en": "Too much screen time is harmful.",
                "vi": "Nhìn màn hình quá nhiều thì có hại."
              }
            },
            {
              "t": "vocab",
              "en": "connect",
              "vi": "kết nối",
              "pos": "Động từ",
              "ipa": "/kəˈnɛkt/",
              "note": "Connect WITH people, connect TO the internet.",
              "ex": {
                "en": "It connects people worldwide.",
                "vi": "Nó kết nối mọi người khắp nơi."
              }
            },
            {
              "t": "grammar",
              "title": "Nêu ý kiến kiểu người Anh",
              "body": "Ba mức, từ nhẹ tới mạnh. Người Anh dùng mức nhẹ nhiều gấp mấy lần mức mạnh.",
              "rows": [
                [
                  "Nêu ý kiến",
                  "I think… / In my opinion… / It seems to me that…",
                  ""
                ],
                [
                  "Đồng ý",
                  "I couldn’t agree more. / You have a point there.",
                  ""
                ],
                [
                  "Đồng ý một phần",
                  "I see what you mean, but… / That may be true, however…",
                  ""
                ],
                [
                  "Phản đối nhẹ",
                  "I’m not sure I agree. / I see it differently.",
                  ""
                ],
                [
                  "Phản đối thẳng",
                  "I totally disagree.",
                  "hiếm dùng, nghe gay gắt"
                ]
              ],
              "tip": "Một chữ “but” đặt sau lời đồng ý làm cả câu phản đối nghe dễ chịu hơn hẳn."
            },
            {
              "t": "dialogue",
              "title": "Tranh luận về mạng xã hội",
              "lines": [
                {
                  "who": "A",
                  "en": "I think social media is harmful for teenagers.",
                  "vi": "Tôi nghĩ mạng xã hội có hại cho tuổi teen."
                },
                {
                  "who": "B",
                  "en": "I see what you mean, but it also connects people.",
                  "vi": "Tôi hiểu ý bạn, nhưng nó cũng kết nối mọi người."
                },
                {
                  "who": "A",
                  "en": "That may be true, however many become addicted.",
                  "vi": "Có thể đúng, nhưng nhiều em thành nghiện."
                },
                {
                  "who": "B",
                  "en": "You have a point there.",
                  "vi": "Chỗ đó bạn nói có lý."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "I think social media has a big influence",
              "vi": "Tôi nghĩ mạng xã hội có ảnh hưởng lớn"
            },
            {
              "en": "Many young people are addicted to their phones",
              "vi": "Nhiều bạn trẻ nghiện điện thoại"
            },
            {
              "en": "I see what you mean but I disagree",
              "vi": "Tôi hiểu ý bạn nhưng tôi không đồng ý"
            }
          ]
        },
        {
          "id": "b2u2l3",
          "title": "Phim ảnh & Giải trí",
          "goal": "Bình luận phim và dùng tính từ mạnh.",
          "teach": [
            {
              "t": "intro",
              "title": "Đừng nói very good mãi",
              "body": "Ở trình độ B2, thay very + tính từ thường bằng một tính từ mạnh là câu nói lên hẳn một bậc. Và tính từ mạnh thì KHÔNG đi với very.",
              "bullets": [
                "Tính từ mạnh",
                "absolutely thay cho very",
                "Từ vựng phim ảnh"
              ]
            },
            {
              "t": "vocab",
              "en": "plot",
              "vi": "cốt truyện",
              "pos": "Danh từ",
              "ipa": "/ˈplɑːt/",
              "note": "Cũng có nghĩa là âm mưu. Đừng lẫn với story.",
              "ex": {
                "en": "The plot was confusing.",
                "vi": "Cốt truyện khó hiểu."
              }
            },
            {
              "t": "vocab",
              "en": "character",
              "vi": "nhân vật",
              "pos": "Danh từ",
              "ipa": "/ˈkærɪktər/",
              "note": "Cũng có nghĩa là tính cách, và là ký tự.",
              "ex": {
                "en": "The main character is a doctor.",
                "vi": "Nhân vật chính là bác sĩ."
              }
            },
            {
              "t": "vocab",
              "en": "director",
              "vi": "đạo diễn",
              "pos": "Danh từ",
              "ipa": "/dɪˈrɛktər/",
              "note": "Cũng là giám đốc công ty — nhìn ngữ cảnh mà hiểu.",
              "ex": {
                "en": "Who is the director?",
                "vi": "Ai là đạo diễn?"
              }
            },
            {
              "t": "vocab",
              "en": "scene",
              "vi": "cảnh phim",
              "pos": "Danh từ",
              "ipa": "/ˈsiːn/",
              "note": "Đọc là /siːn/, giống hệt seen.",
              "ex": {
                "en": "The final scene was moving.",
                "vi": "Cảnh cuối rất cảm động."
              }
            },
            {
              "t": "vocab",
              "en": "boring",
              "vi": "chán",
              "pos": "Tính từ",
              "ipa": "/ˈbɔːrɪŋ/",
              "note": "boring là thứ gây chán; bored là mình thấy chán. Sai chỗ này là câu thành buồn cười.",
              "ex": {
                "en": "The film was boring.",
                "vi": "Bộ phim chán."
              }
            },
            {
              "t": "vocab",
              "en": "hilarious",
              "vi": "cười vỡ bụng",
              "pos": "Tính từ",
              "ipa": "/hɪˈlɛriəs/",
              "note": "Đây là dạng mạnh của funny. Không nói very hilarious.",
              "ex": {
                "en": "The ending was hilarious.",
                "vi": "Đoạn kết cười vỡ bụng."
              }
            },
            {
              "t": "vocab",
              "en": "moving",
              "vi": "cảm động",
              "pos": "Tính từ",
              "ipa": "/ˈmuːvɪŋ/",
              "note": "Nghĩa bóng của move là làm ai xúc động.",
              "ex": {
                "en": "It is a very moving story.",
                "vi": "Đó là một câu chuyện rất cảm động."
              }
            },
            {
              "t": "vocab",
              "en": "overrated",
              "vi": "được khen quá mức",
              "pos": "Tính từ",
              "ipa": "/ˌoʊvəˈreɪtɪd/",
              "note": "Trái nghĩa là underrated. Rất hay dùng khi chê phim.",
              "ex": {
                "en": "I think it is overrated.",
                "vi": "Tôi thấy phim đó được khen quá mức."
              }
            },
            {
              "t": "grammar",
              "title": "Tính từ thường và tính từ mạnh",
              "body": "Tính từ mạnh đã mang sẵn nghĩa “rất”, nên không đi với very. Muốn nhấn thêm thì dùng absolutely hoặc really.",
              "rows": [
                [
                  "good → ",
                  "great, excellent, fantastic",
                  "absolutely fantastic ✓"
                ],
                [
                  "bad → ",
                  "awful, terrible, dreadful",
                  "absolutely awful ✓"
                ],
                [
                  "funny → ",
                  "hilarious",
                  "very hilarious ✗"
                ],
                [
                  "big → ",
                  "huge, enormous",
                  "very enormous ✗"
                ],
                [
                  "tired → ",
                  "exhausted",
                  "absolutely exhausted ✓"
                ]
              ],
              "tip": "Quy tắc gọn: very đi với tính từ thường, absolutely đi với tính từ mạnh."
            }
          ],
          "sentences": [
            {
              "en": "The plot was confusing but the acting was great",
              "vi": "Cốt truyện khó hiểu nhưng diễn xuất tuyệt"
            },
            {
              "en": "I found the ending absolutely hilarious",
              "vi": "Tôi thấy đoạn kết cười vỡ bụng"
            },
            {
              "en": "That film is completely overrated",
              "vi": "Bộ phim đó được khen quá mức"
            }
          ]
        },
        {
          "id": "b2u2l4",
          "title": "Quảng cáo",
          "goal": "Câu điều kiện loại 2 — nói chuyện giả định.",
          "teach": [
            {
              "t": "intro",
              "title": "Nếu tôi là bạn…",
              "body": "Điều kiện loại 2 dùng cho chuyện KHÔNG CÓ THẬT ở hiện tại. Đây là cách lịch sự nhất để khuyên ai điều gì trong tiếng Anh.",
              "bullets": [
                "Cấu trúc loại 2",
                "If I were — không phải was",
                "Dùng để khuyên"
              ]
            },
            {
              "t": "vocab",
              "en": "advertisement",
              "vi": "quảng cáo",
              "pos": "Danh từ",
              "ipa": "/ˌædvərˈtaɪzmənt/",
              "note": "Nói tắt là advert (Anh) hoặc ad (Mỹ).",
              "ex": {
                "en": "I saw the advertisement online.",
                "vi": "Tôi thấy quảng cáo trên mạng."
              }
            },
            {
              "t": "vocab",
              "en": "brand",
              "vi": "thương hiệu",
              "pos": "Danh từ",
              "ipa": "/ˈbrænd/",
              "note": "Brand name là tên thương hiệu.",
              "ex": {
                "en": "It is a well-known brand.",
                "vi": "Đó là thương hiệu có tiếng."
              }
            },
            {
              "t": "vocab",
              "en": "consumer",
              "vi": "người tiêu dùng",
              "pos": "Danh từ",
              "ipa": "/kənˈsuːmər/",
              "note": "Trang trọng hơn customer, dùng khi nói chung.",
              "ex": {
                "en": "Consumers want lower prices.",
                "vi": "Người tiêu dùng muốn giá rẻ hơn."
              }
            },
            {
              "t": "vocab",
              "en": "persuade",
              "vi": "thuyết phục",
              "pos": "Động từ",
              "ipa": "/pərˈsweɪd/",
              "note": "Persuade somebody TO do something.",
              "ex": {
                "en": "The ad persuaded me to buy it.",
                "vi": "Quảng cáo làm tôi mua nó."
              }
            },
            {
              "t": "vocab",
              "en": "misleading",
              "vi": "gây hiểu nhầm",
              "pos": "Tính từ",
              "ipa": "/mɪˈsliːdɪŋ/",
              "note": "Nhẹ hơn “nói dối” nhưng vẫn là lời chê nặng.",
              "ex": {
                "en": "The claim was misleading.",
                "vi": "Lời quảng cáo gây hiểu nhầm."
              }
            },
            {
              "t": "vocab",
              "en": "discount",
              "vi": "giảm giá",
              "pos": "Danh từ",
              "ipa": "/ˈdɪskaʊnt/",
              "note": "A ten percent discount. Đừng lẫn với sale.",
              "ex": {
                "en": "They offer a big discount.",
                "vi": "Họ giảm giá nhiều."
              }
            },
            {
              "t": "vocab",
              "en": "target",
              "vi": "nhắm tới",
              "pos": "Động từ",
              "ipa": "/ˈtɑːrɡɪt/",
              "note": "Target audience là đối tượng nhắm tới.",
              "ex": {
                "en": "The ad targets young people.",
                "vi": "Quảng cáo nhắm vào người trẻ."
              }
            },
            {
              "t": "vocab",
              "en": "afford",
              "vi": "đủ tiền mua",
              "pos": "Động từ",
              "ipa": "/əˈfɔːrd/",
              "note": "Hầu như luôn đi với can/could. Can afford TO buy.",
              "ex": {
                "en": "I cannot afford a new car.",
                "vi": "Tôi không đủ tiền mua xe mới."
              }
            },
            {
              "t": "grammar",
              "title": "Điều kiện loại 2: If + quá khứ, would + V",
              "body": "Dùng cho việc không có thật ở hiện tại, hoặc rất khó xảy ra. Vế if lùi về quá khứ nhưng nghĩa vẫn là hiện tại.",
              "rows": [
                [
                  "Cấu trúc",
                  "If I had more money, I would travel.",
                  "Nếu tôi có nhiều tiền hơn, tôi sẽ đi du lịch."
                ],
                [
                  "Khuyên nhủ",
                  "If I were you, I would wait.",
                  "Nếu tôi là bạn, tôi sẽ chờ."
                ],
                [
                  "Đảo vế được",
                  "I would travel if I had more money.",
                  "bỏ dấu phẩy khi if đứng sau"
                ],
                [
                  "Luôn were",
                  "If he were here…",
                  "không dùng was ở dạng trang trọng"
                ]
              ],
              "tip": "Phân biệt với loại 1: If it rains, I will stay — chuyện CÓ THỂ xảy ra thật."
            }
          ],
          "sentences": [
            {
              "en": "If I were you I would not buy it",
              "vi": "Nếu tôi là bạn tôi sẽ không mua"
            },
            {
              "en": "If we had a bigger budget we would advertise more",
              "vi": "Nếu ngân sách lớn hơn chúng tôi sẽ quảng cáo nhiều hơn"
            },
            {
              "en": "I cannot afford that brand",
              "vi": "Tôi không đủ tiền mua thương hiệu đó"
            }
          ]
        },
        {
          "id": "b2u2l5",
          "title": "Sách & Đọc",
          "goal": "Nói về sách và dùng liên từ nối ý.",
          "teach": [
            {
              "t": "intro",
              "title": "Nối ý cho câu trôi",
              "body": "Ở B2, cái làm câu nghe mượt không phải từ khó mà là từ NỐI. However, although, therefore — mấy chữ này biến các câu rời thành một đoạn văn.",
              "bullets": [
                "although và but",
                "however đứng đâu",
                "Dấu câu đi kèm"
              ]
            },
            {
              "t": "vocab",
              "en": "novel",
              "vi": "tiểu thuyết",
              "pos": "Danh từ",
              "ipa": "/ˈnɑːvəl/",
              "note": "Cũng là tính từ nghĩa là mới lạ.",
              "ex": {
                "en": "She wrote her first novel at thirty.",
                "vi": "Ba mươi tuổi cô ấy viết tiểu thuyết đầu tay."
              }
            },
            {
              "t": "vocab",
              "en": "author",
              "vi": "tác giả",
              "pos": "Danh từ",
              "ipa": "/ˈɔːθər/",
              "note": "Writer rộng hơn; author gắn với một tác phẩm cụ thể.",
              "ex": {
                "en": "Who is the author of this book?",
                "vi": "Ai là tác giả cuốn sách này?"
              }
            },
            {
              "t": "vocab",
              "en": "chapter",
              "vi": "chương sách",
              "pos": "Danh từ",
              "ipa": "/ˈtʃæptər/",
              "note": "Đọc là /ˈtʃæptər/, chữ ch đọc như church.",
              "ex": {
                "en": "The first chapter is slow.",
                "vi": "Chương đầu hơi chậm."
              }
            },
            {
              "t": "vocab",
              "en": "fiction",
              "vi": "truyện hư cấu",
              "pos": "Danh từ",
              "ipa": "/ˈfɪkʃən/",
              "note": "Trái nghĩa là non-fiction. Không đếm được.",
              "ex": {
                "en": "I prefer fiction to history.",
                "vi": "Tôi thích truyện hơn sách sử."
              }
            },
            {
              "t": "vocab",
              "en": "recommend",
              "vi": "giới thiệu, khuyên đọc",
              "pos": "Động từ",
              "ipa": "/ˌrɛkəˈmɛnd/",
              "note": "Recommend DOING something, không phải recommend to do.",
              "ex": {
                "en": "I recommend reading it.",
                "vi": "Tôi khuyên nên đọc nó."
              }
            },
            {
              "t": "vocab",
              "en": "review",
              "vi": "bài đánh giá",
              "pos": "Danh từ",
              "ipa": "/rɪvˈjuː/",
              "note": "Vừa danh từ vừa động từ. Cũng có nghĩa là ôn tập.",
              "ex": {
                "en": "The reviews were excellent.",
                "vi": "Các bài đánh giá rất tốt."
              }
            },
            {
              "t": "vocab",
              "en": "translate",
              "vi": "dịch",
              "pos": "Động từ",
              "ipa": "/trænˈsleɪt/",
              "note": "Translate FROM English INTO Vietnamese.",
              "ex": {
                "en": "It was translated into ten languages.",
                "vi": "Nó được dịch ra mười thứ tiếng."
              }
            },
            {
              "t": "vocab",
              "en": "publish",
              "vi": "xuất bản",
              "pos": "Động từ",
              "ipa": "/ˈpʌblɪʃ/",
              "note": "Danh từ chỉ người là publisher — nhà xuất bản.",
              "ex": {
                "en": "The book was published in 2020.",
                "vi": "Sách xuất bản năm 2020."
              }
            },
            {
              "t": "grammar",
              "title": "Từ nối: although, however, therefore",
              "body": "Ba từ này cùng nối ý nhưng ĐỨNG KHÁC CHỖ và dùng dấu câu khác nhau — đó mới là chỗ hay sai.",
              "rows": [
                [
                  "although + mệnh đề",
                  "Although it was late, we continued.",
                  "trong cùng một câu"
                ],
                [
                  "but + mệnh đề",
                  "It was late, but we continued.",
                  "trong cùng một câu"
                ],
                [
                  "however + dấu phẩy",
                  "It was late. However, we continued.",
                  "đầu câu MỚI"
                ],
                [
                  "therefore",
                  "It was late. Therefore, we stopped.",
                  "chỉ kết quả"
                ],
                [
                  "despite + danh từ",
                  "Despite the rain, we walked.",
                  "sau despite KHÔNG có mệnh đề"
                ]
              ],
              "tip": "Sai kinh điển: “Although it was late, but we continued.” Tiếng Anh chỉ được dùng MỘT trong hai."
            }
          ],
          "sentences": [
            {
              "en": "Although the book is long it is very good",
              "vi": "Tuy sách dài nhưng rất hay"
            },
            {
              "en": "I would recommend reading the first chapter",
              "vi": "Tôi khuyên nên đọc chương đầu"
            },
            {
              "en": "The novel was translated into ten languages",
              "vi": "Cuốn tiểu thuyết được dịch ra mười thứ tiếng"
            }
          ]
        },
        {
          "id": "b2u2c",
          "title": "Ôn tập chương 2",
          "goal": "Ôn lại cả chương truyền thông.",
          "checkpoint": true
        }
      ]
    },
    {
      "id": "b2u3",
      "title": "Xã hội & Môi trường",
      "goal": "Bàn chuyện xã hội, nói về việc đã lỡ và phỏng đoán có căn cứ.",
      "lessons": [
        {
          "id": "b2u3l1",
          "title": "Biến đổi khí hậu",
          "goal": "Điều kiện loại 3 — tiếc nuối chuyện đã rồi.",
          "teach": [
            {
              "t": "intro",
              "title": "Giá mà hồi đó…",
              "body": "Loại 3 nói về chuyện ĐÃ QUA và KHÔNG THỂ đổi được nữa. Đây là câu dài nhất trong ngữ pháp phổ thông, nhưng chỉ có một khuôn duy nhất.",
              "bullets": [
                "Khuôn của loại 3",
                "Khác loại 2 chỗ nào",
                "Nói lời tiếc nuối"
              ]
            },
            {
              "t": "vocab",
              "en": "climate",
              "vi": "khí hậu",
              "pos": "Danh từ",
              "ipa": "/ˈklaɪmət/",
              "note": "Khí hậu là nhiều năm; thời tiết hôm nay là weather.",
              "ex": {
                "en": "Climate change affects everyone.",
                "vi": "Biến đổi khí hậu ảnh hưởng tới tất cả."
              }
            },
            {
              "t": "vocab",
              "en": "pollution",
              "vi": "ô nhiễm",
              "pos": "Danh từ",
              "ipa": "/pəˈluːʃən/",
              "note": "Không đếm được. Động từ là pollute.",
              "ex": {
                "en": "Air pollution is getting worse.",
                "vi": "Ô nhiễm không khí ngày càng nặng."
              }
            },
            {
              "t": "vocab",
              "en": "emission",
              "vi": "khí thải",
              "pos": "Danh từ",
              "ipa": "/ɪˈmɪʃən/",
              "note": "Hay dùng số nhiều: carbon emissions.",
              "ex": {
                "en": "We must cut emissions.",
                "vi": "Chúng ta phải cắt giảm khí thải."
              }
            },
            {
              "t": "vocab",
              "en": "renewable",
              "vi": "tái tạo được",
              "pos": "Tính từ",
              "ipa": "/rɪˈnuːəbəl/",
              "note": "Renewable energy là năng lượng tái tạo.",
              "ex": {
                "en": "Solar power is renewable.",
                "vi": "Điện mặt trời là năng lượng tái tạo."
              }
            },
            {
              "t": "vocab",
              "en": "waste",
              "vi": "rác thải, lãng phí",
              "pos": "Danh từ",
              "ipa": "/ˈweɪst/",
              "note": "Vừa là rác vừa là động từ lãng phí: waste time.",
              "ex": {
                "en": "We produce too much waste.",
                "vi": "Chúng ta thải ra quá nhiều rác."
              }
            },
            {
              "t": "vocab",
              "en": "reduce",
              "vi": "giảm bớt",
              "pos": "Động từ",
              "ipa": "/rɪˈduːs/",
              "note": "Bộ ba nổi tiếng: reduce, reuse, recycle.",
              "ex": {
                "en": "We should reduce plastic use.",
                "vi": "Nên giảm dùng nhựa."
              }
            },
            {
              "t": "vocab",
              "en": "endangered",
              "vi": "có nguy cơ tuyệt chủng",
              "pos": "Tính từ",
              "ipa": "/ɛnˈdeɪndʒərd/",
              "note": "An endangered species là loài nguy cấp.",
              "ex": {
                "en": "Tigers are an endangered species.",
                "vi": "Hổ là loài nguy cấp."
              }
            },
            {
              "t": "vocab",
              "en": "sustainable",
              "vi": "bền vững",
              "pos": "Tính từ",
              "ipa": "/səˈsteɪnəbəl/",
              "note": "Từ khoá của mọi bài viết môi trường hiện nay.",
              "ex": {
                "en": "We need sustainable solutions.",
                "vi": "Ta cần giải pháp bền vững."
              }
            },
            {
              "t": "grammar",
              "title": "Điều kiện loại 3: If + had + V3, would have + V3",
              "body": "Chuyện đã qua, không sửa được nữa. Cả hai vế đều lùi về quá khứ hoàn thành.",
              "rows": [
                [
                  "Loại 3",
                  "If we had acted sooner, we would have saved the forest.",
                  "Nếu hành động sớm hơn thì đã cứu được rừng."
                ],
                [
                  "Loại 2 (hiện tại)",
                  "If we acted now, we would save it.",
                  "vẫn còn kịp"
                ],
                [
                  "Loại 3 (quá khứ)",
                  "If we had acted then, we would have saved it.",
                  "không kịp nữa"
                ],
                [
                  "Tiếc nuối",
                  "I wish I had studied harder.",
                  "Giá mà hồi đó tôi học chăm hơn."
                ]
              ],
              "tip": "Mẹo phân biệt: thấy had + V3 ở vế if thì chắc chắn là loại 3, tức chuyện đã lỡ."
            }
          ],
          "sentences": [
            {
              "en": "If we had acted sooner we would have saved the forest",
              "vi": "Nếu hành động sớm hơn ta đã cứu được rừng"
            },
            {
              "en": "We must reduce our carbon emissions",
              "vi": "Chúng ta phải giảm khí thải các-bon"
            },
            {
              "en": "Solar power is a sustainable solution",
              "vi": "Điện mặt trời là giải pháp bền vững"
            }
          ]
        },
        {
          "id": "b2u3l2",
          "title": "Sức khoẻ cộng đồng",
          "goal": "Modal suy đoán — must be, might be, can't be.",
          "teach": [
            {
              "t": "intro",
              "title": "Đoán mà vẫn nghe chắc chắn",
              "body": "Tiếng Anh phân biệt rất rõ ba mức chắc chắn khi phỏng đoán. Dùng đúng mức là người nghe biết ngay bạn chắc tới đâu, không cần giải thích thêm.",
              "bullets": [
                "must be — gần như chắc",
                "might be — có thể",
                "can’t be — chắc chắn không"
              ]
            },
            {
              "t": "vocab",
              "en": "symptom",
              "vi": "triệu chứng",
              "pos": "Danh từ",
              "ipa": "/ˈsɪmptəm/",
              "note": "Đọc là /ˈsɪmptəm/, chữ p có phát âm.",
              "ex": {
                "en": "Fever is a common symptom.",
                "vi": "Sốt là triệu chứng thường gặp."
              }
            },
            {
              "t": "vocab",
              "en": "treatment",
              "vi": "cách điều trị",
              "pos": "Danh từ",
              "ipa": "/ˈtriːtmənt/",
              "note": "Treatment FOR a disease.",
              "ex": {
                "en": "There is no treatment yet.",
                "vi": "Chưa có cách điều trị."
              }
            },
            {
              "t": "vocab",
              "en": "prevent",
              "vi": "phòng ngừa",
              "pos": "Động từ",
              "ipa": "/prɪˈvɛnt/",
              "note": "Prevent somebody FROM doing something.",
              "ex": {
                "en": "Washing hands prevents infection.",
                "vi": "Rửa tay phòng ngừa lây nhiễm."
              }
            },
            {
              "t": "vocab",
              "en": "vaccine",
              "vi": "vắc-xin",
              "pos": "Danh từ",
              "ipa": "/vækˈsiːn/",
              "note": "Đọc là /ˈvæksiːn/. Động từ là vaccinate.",
              "ex": {
                "en": "The vaccine is free.",
                "vi": "Vắc-xin miễn phí."
              }
            },
            {
              "t": "vocab",
              "en": "infection",
              "vi": "sự nhiễm trùng",
              "pos": "Danh từ",
              "ipa": "/ɪnˈfɛkʃən/",
              "note": "Tính từ infectious nghĩa là dễ lây.",
              "ex": {
                "en": "The infection spread quickly.",
                "vi": "Nhiễm trùng lan nhanh."
              }
            },
            {
              "t": "vocab",
              "en": "recover",
              "vi": "hồi phục",
              "pos": "Động từ",
              "ipa": "/rɪˈkʌvər/",
              "note": "Recover FROM an illness. Danh từ là recovery.",
              "ex": {
                "en": "He recovered in two weeks.",
                "vi": "Anh ấy hồi phục sau hai tuần."
              }
            },
            {
              "t": "vocab",
              "en": "diet",
              "vi": "chế độ ăn",
              "pos": "Danh từ",
              "ipa": "/ˈdaɪət/",
              "note": "Không chỉ là ăn kiêng — a healthy diet là chế độ ăn lành mạnh.",
              "ex": {
                "en": "A balanced diet is important.",
                "vi": "Chế độ ăn cân bằng rất quan trọng."
              }
            },
            {
              "t": "vocab",
              "en": "exhausted",
              "vi": "kiệt sức",
              "pos": "Tính từ",
              "ipa": "/ɛɡˈzɔːstɪd/",
              "note": "Dạng mạnh của tired, nên không đi với very.",
              "ex": {
                "en": "The doctors were exhausted.",
                "vi": "Các bác sĩ kiệt sức."
              }
            },
            {
              "t": "grammar",
              "title": "must, might, can’t — ba mức phỏng đoán",
              "body": "Đây không phải nói về bổn phận mà là nói về mức chắc chắn của mình.",
              "rows": [
                [
                  "Gần như chắc chắn CÓ",
                  "He must be ill.",
                  "Chắc anh ấy ốm rồi."
                ],
                [
                  "Có thể",
                  "He might be ill. / He may be ill.",
                  "Có thể anh ấy ốm."
                ],
                [
                  "Ít khả năng",
                  "He could be ill.",
                  "Biết đâu anh ấy ốm."
                ],
                [
                  "Chắc chắn KHÔNG",
                  "He can’t be ill, I saw him running.",
                  "Không thể ốm được."
                ],
                [
                  "Đoán chuyện đã qua",
                  "She must have forgotten.",
                  "Chắc cô ấy quên rồi."
                ]
              ],
              "tip": "Lưu ý: phủ định của must be (chắc là) KHÔNG phải mustn’t be mà là can’t be."
            },
            {
              "t": "dialogue",
              "title": "Ở phòng khám",
              "lines": [
                {
                  "who": "A",
                  "en": "She has a fever and a headache.",
                  "vi": "Cô ấy sốt và đau đầu."
                },
                {
                  "who": "B",
                  "en": "It might be the flu.",
                  "vi": "Có thể là cúm."
                },
                {
                  "who": "A",
                  "en": "Could it be serious?",
                  "vi": "Có nghiêm trọng không?"
                },
                {
                  "who": "B",
                  "en": "It can’t be serious if she is still eating well.",
                  "vi": "Không nghiêm trọng đâu nếu vẫn ăn tốt."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "He must be ill because he never misses work",
              "vi": "Chắc anh ấy ốm vì chưa bao giờ nghỉ làm"
            },
            {
              "en": "A balanced diet prevents many illnesses",
              "vi": "Chế độ ăn cân bằng phòng được nhiều bệnh"
            },
            {
              "en": "She recovered from the infection quickly",
              "vi": "Cô ấy hồi phục nhanh sau nhiễm trùng"
            }
          ]
        },
        {
          "id": "b2u3l3",
          "title": "Giáo dục",
          "goal": "used to và would — thói quen ngày xưa.",
          "teach": [
            {
              "t": "intro",
              "title": "Hồi đó tôi thường…",
              "body": "Kể chuyện ngày xưa mà cứ dùng quá khứ đơn mãi thì nghe khô. used to và would làm câu chuyện có màu hồi tưởng.",
              "bullets": [
                "used to cho mọi thứ đã qua",
                "would chỉ cho hành động",
                "Đừng lẫn với be used to"
              ]
            },
            {
              "t": "vocab",
              "en": "curriculum",
              "vi": "chương trình học",
              "pos": "Danh từ",
              "ipa": "/kɜːˈrɪkjʊləm/",
              "note": "Số nhiều trang trọng là curricula.",
              "ex": {
                "en": "The curriculum was updated.",
                "vi": "Chương trình học được cập nhật."
              }
            },
            {
              "t": "vocab",
              "en": "compulsory",
              "vi": "bắt buộc",
              "pos": "Tính từ",
              "ipa": "/kəmˈpʌlsəri/",
              "note": "Trái nghĩa là optional. Mỹ hay dùng mandatory.",
              "ex": {
                "en": "English is compulsory here.",
                "vi": "Ở đây tiếng Anh là môn bắt buộc."
              }
            },
            {
              "t": "vocab",
              "en": "tuition",
              "vi": "học phí",
              "pos": "Danh từ",
              "ipa": "/tuːˈɪʃən/",
              "note": "Anh còn dùng để chỉ việc dạy kèm.",
              "ex": {
                "en": "Tuition fees have risen.",
                "vi": "Học phí đã tăng."
              }
            },
            {
              "t": "vocab",
              "en": "degree",
              "vi": "bằng đại học",
              "pos": "Danh từ",
              "ipa": "/dɪˈɡriː/",
              "note": "Cũng là độ trong nhiệt độ và góc.",
              "ex": {
                "en": "She has a degree in law.",
                "vi": "Cô ấy có bằng luật."
              }
            },
            {
              "t": "vocab",
              "en": "graduate",
              "vi": "tốt nghiệp",
              "pos": "Động từ",
              "ipa": "/ˈɡrædʒuːət/",
              "note": "Graduate FROM a university. Danh từ đọc khác động từ.",
              "ex": {
                "en": "He graduated last June.",
                "vi": "Anh ấy tốt nghiệp tháng Sáu vừa rồi."
              }
            },
            {
              "t": "vocab",
              "en": "discipline",
              "vi": "kỷ luật",
              "pos": "Danh từ",
              "ipa": "/ˈdɪsɪˌplɪn/",
              "note": "Cũng có nghĩa là ngành học.",
              "ex": {
                "en": "The school has strict discipline.",
                "vi": "Trường này kỷ luật nghiêm."
              }
            },
            {
              "t": "vocab",
              "en": "motivate",
              "vi": "tạo động lực",
              "pos": "Động từ",
              "ipa": "/ˈmoʊtɪˌveɪt/",
              "note": "Danh từ motivation. Tính từ motivated.",
              "ex": {
                "en": "Good teachers motivate students.",
                "vi": "Thầy giỏi tạo động lực cho trò."
              }
            },
            {
              "t": "vocab",
              "en": "assessment",
              "vi": "sự đánh giá",
              "pos": "Danh từ",
              "ipa": "/əˈsɛsmənt/",
              "note": "Trang trọng hơn test. Continuous assessment là đánh giá liên tục.",
              "ex": {
                "en": "Assessment is based on projects.",
                "vi": "Đánh giá dựa trên bài tập lớn."
              }
            },
            {
              "t": "grammar",
              "title": "used to, would, và be used to",
              "body": "Ba thứ nhìn giống nhau mà nghĩa khác hẳn. Đây là bẫy kinh điển.",
              "rows": [
                [
                  "used to + V",
                  "I used to walk to school.",
                  "Hồi đó tôi hay đi bộ tới trường — giờ không nữa."
                ],
                [
                  "would + V",
                  "Every summer we would visit my grandmother.",
                  "chỉ dùng cho HÀNH ĐỘNG lặp lại"
                ],
                [
                  "Không dùng would cho trạng thái",
                  "I used to have long hair. ✓ / I would have long hair. ✗",
                  ""
                ],
                [
                  "be used to + V-ing",
                  "I am used to waking up early.",
                  "Tôi ĐÃ QUEN dậy sớm — nghĩa khác hẳn"
                ]
              ],
              "tip": "Nhớ: used to + động từ nguyên mẫu là chuyện xưa; be used to + V-ing là đã quen."
            }
          ],
          "sentences": [
            {
              "en": "I used to walk to school every day",
              "vi": "Hồi đó ngày nào tôi cũng đi bộ tới trường"
            },
            {
              "en": "English is compulsory in most schools",
              "vi": "Tiếng Anh là môn bắt buộc ở hầu hết các trường"
            },
            {
              "en": "She graduated from university last year",
              "vi": "Cô ấy tốt nghiệp đại học năm ngoái"
            }
          ]
        },
        {
          "id": "b2u3l4",
          "title": "Thành phố & Nông thôn",
          "goal": "Lượng từ — much, many, few, little.",
          "teach": [
            {
              "t": "intro",
              "title": "Đếm được hay không đếm được",
              "body": "Tiếng Việt không phân biệt, tiếng Anh phân biệt rất gắt. Dùng sai lượng từ là lỗi lộ ngay trình độ, dù câu vẫn hiểu được.",
              "bullets": [
                "much và many",
                "few và a few — khác nhau hẳn",
                "Từ dùng được cho cả hai"
              ]
            },
            {
              "t": "vocab",
              "en": "population",
              "vi": "dân số",
              "pos": "Danh từ",
              "ipa": "/ˌpɑːpjʊˈleɪʃən/",
              "note": "Số ít nhưng chỉ cả đám đông.",
              "ex": {
                "en": "The population is growing.",
                "vi": "Dân số đang tăng."
              }
            },
            {
              "t": "vocab",
              "en": "traffic",
              "vi": "giao thông",
              "pos": "Danh từ",
              "ipa": "/ˈtræfɪk/",
              "note": "KHÔNG đếm được. Không nói many traffics.",
              "ex": {
                "en": "There is too much traffic.",
                "vi": "Giao thông quá đông."
              }
            },
            {
              "t": "vocab",
              "en": "accommodation",
              "vi": "chỗ ở",
              "pos": "Danh từ",
              "ipa": "/əˌkɑːməˈdeɪʃən/",
              "note": "Ở Anh là không đếm được. Mỹ dùng accommodations.",
              "ex": {
                "en": "Accommodation is expensive.",
                "vi": "Chỗ ở đắt đỏ."
              }
            },
            {
              "t": "vocab",
              "en": "facility",
              "vi": "tiện ích",
              "pos": "Danh từ",
              "ipa": "/fəˈsɪlɪti/",
              "note": "Hầu như luôn dùng số nhiều: sports facilities.",
              "ex": {
                "en": "The town has good facilities.",
                "vi": "Thị trấn có tiện ích tốt."
              }
            },
            {
              "t": "vocab",
              "en": "crowded",
              "vi": "đông đúc",
              "pos": "Tính từ",
              "ipa": "/ˈkraʊdɪd/",
              "note": "Crowded WITH people.",
              "ex": {
                "en": "The bus was crowded.",
                "vi": "Xe buýt đông nghịt."
              }
            },
            {
              "t": "vocab",
              "en": "rural",
              "vi": "thuộc nông thôn",
              "pos": "Tính từ",
              "ipa": "/ˈrʊrəl/",
              "note": "Trái nghĩa là urban.",
              "ex": {
                "en": "Rural areas are quieter.",
                "vi": "Vùng nông thôn yên tĩnh hơn."
              }
            },
            {
              "t": "vocab",
              "en": "commute",
              "vi": "đi làm xa",
              "pos": "Động từ",
              "ipa": "/kəmˈjuːt/",
              "note": "Vừa động từ vừa danh từ: a long commute.",
              "ex": {
                "en": "I commute for an hour.",
                "vi": "Tôi đi làm mất một tiếng."
              }
            },
            {
              "t": "vocab",
              "en": "neighbourhood",
              "vi": "khu dân cư",
              "pos": "Danh từ",
              "ipa": "/ˈneɪbərˌhʊd/",
              "note": "Anh viết neighbourhood, Mỹ viết neighborhood.",
              "ex": {
                "en": "It is a quiet neighbourhood.",
                "vi": "Đó là khu yên tĩnh."
              }
            },
            {
              "t": "grammar",
              "title": "Lượng từ: đếm được và không đếm được",
              "body": "Chia làm ba cột. Cột giữa dùng được cho cả hai loại nên khi lưỡng lự thì dùng cột giữa cho an toàn.",
              "rows": [
                [
                  "Đếm được",
                  "many, few, a few, a number of",
                  "many cars"
                ],
                [
                  "Dùng chung",
                  "a lot of, plenty of, some, any",
                  "a lot of cars / a lot of traffic"
                ],
                [
                  "Không đếm được",
                  "much, little, a little, an amount of",
                  "much traffic"
                ],
                [
                  "few ≠ a few",
                  "few friends = gần như không có ai",
                  "a few friends = có vài người"
                ],
                [
                  "little ≠ a little",
                  "little time = gần như không kịp",
                  "a little time = còn chút thời gian"
                ]
              ],
              "tip": "Chữ “a” nhỏ xíu ấy đổi hẳn nghĩa từ bi quan sang lạc quan. Đừng bỏ sót."
            }
          ],
          "sentences": [
            {
              "en": "There is too much traffic in the city",
              "vi": "Trong thành phố giao thông quá đông"
            },
            {
              "en": "A few people prefer living in rural areas",
              "vi": "Vài người thích sống ở nông thôn"
            },
            {
              "en": "I commute for an hour every morning",
              "vi": "Sáng nào tôi cũng đi làm mất một tiếng"
            }
          ]
        },
        {
          "id": "b2u3l5",
          "title": "Tình nguyện",
          "goal": "Nói về việc thiện nguyện và cách đề nghị giúp đỡ.",
          "teach": [
            {
              "t": "intro",
              "title": "Ngỏ lời giúp cho khéo",
              "body": "Tiếng Anh có cả một thang từ nhẹ tới mạnh để ngỏ lời giúp. Dùng đúng mức thì lời đề nghị nghe chân thành chứ không xăng xái.",
              "bullets": [
                "Shall I và Would you like me to",
                "Nhận và từ chối lời giúp",
                "Từ vựng thiện nguyện"
              ]
            },
            {
              "t": "vocab",
              "en": "volunteer",
              "vi": "tình nguyện viên",
              "pos": "Danh từ",
              "ipa": "/ˌvɑːlənˈtɪr/",
              "note": "Vừa danh từ vừa động từ: volunteer TO do something.",
              "ex": {
                "en": "She volunteers at a shelter.",
                "vi": "Cô ấy tình nguyện ở một mái ấm."
              }
            },
            {
              "t": "vocab",
              "en": "charity",
              "vi": "tổ chức từ thiện",
              "pos": "Danh từ",
              "ipa": "/ˈtʃærɪti/",
              "note": "A charity là một tổ chức; charity là lòng từ thiện.",
              "ex": {
                "en": "The charity helps homeless people.",
                "vi": "Tổ chức này giúp người vô gia cư."
              }
            },
            {
              "t": "vocab",
              "en": "donate",
              "vi": "quyên góp",
              "pos": "Động từ",
              "ipa": "/doʊˈneɪt/",
              "note": "Donate something TO somebody. Danh từ là donation.",
              "ex": {
                "en": "They donated food and clothes.",
                "vi": "Họ quyên góp đồ ăn và quần áo."
              }
            },
            {
              "t": "vocab",
              "en": "community",
              "vi": "cộng đồng",
              "pos": "Danh từ",
              "ipa": "/kəmˈjuːnɪti/",
              "note": "Community service là phục vụ cộng đồng.",
              "ex": {
                "en": "The whole community helped.",
                "vi": "Cả cộng đồng chung tay."
              }
            },
            {
              "t": "vocab",
              "en": "support",
              "vi": "hỗ trợ",
              "pos": "Động từ",
              "ipa": "/səˈpɔːrt/",
              "note": "Support somebody, không cần giới từ.",
              "ex": {
                "en": "We support local families.",
                "vi": "Chúng tôi hỗ trợ các gia đình quanh đây."
              }
            },
            {
              "t": "vocab",
              "en": "homeless",
              "vi": "vô gia cư",
              "pos": "Tính từ",
              "ipa": "/ˈhoʊmləs/",
              "note": "The homeless là những người vô gia cư nói chung.",
              "ex": {
                "en": "He was homeless for a year.",
                "vi": "Anh ấy vô gia cư suốt một năm."
              }
            },
            {
              "t": "vocab",
              "en": "fundraising",
              "vi": "gây quỹ",
              "pos": "Danh từ",
              "ipa": "/fʌnˈdreɪzɪŋ/",
              "note": "A fundraising event là sự kiện gây quỹ.",
              "ex": {
                "en": "The fundraising went well.",
                "vi": "Việc gây quỹ diễn ra tốt."
              }
            },
            {
              "t": "vocab",
              "en": "grateful",
              "vi": "biết ơn",
              "pos": "Tính từ",
              "ipa": "/ˈɡreɪtfəl/",
              "note": "Grateful TO somebody FOR something.",
              "ex": {
                "en": "They were very grateful.",
                "vi": "Họ rất biết ơn."
              }
            },
            {
              "t": "grammar",
              "title": "Ngỏ lời giúp và đáp lại",
              "body": "Từ suồng sã tới trang trọng. Chọn đúng mức theo mức thân sơ.",
              "rows": [
                [
                  "Thân mật",
                  "Shall I carry that?",
                  "Để tôi xách cho nhé?"
                ],
                [
                  "Thường dùng",
                  "Would you like me to help?",
                  "Bạn có muốn tôi giúp không?"
                ],
                [
                  "Trang trọng",
                  "Would you mind if I helped?",
                  "Tôi giúp một tay có phiền không?"
                ],
                [
                  "Nhận lời",
                  "That would be great, thank you.",
                  ""
                ],
                [
                  "Từ chối khéo",
                  "That’s very kind, but I can manage.",
                  ""
                ]
              ],
              "tip": "Would you mind if I helped? — chú ý, trả lời “No” ở đây nghĩa là ĐỒNG Ý cho giúp."
            }
          ],
          "sentences": [
            {
              "en": "Would you like me to help with the fundraising",
              "vi": "Bạn có muốn tôi giúp việc gây quỹ không"
            },
            {
              "en": "They donated food to the local charity",
              "vi": "Họ quyên góp đồ ăn cho tổ chức từ thiện địa phương"
            },
            {
              "en": "The whole community was very grateful",
              "vi": "Cả cộng đồng đều rất biết ơn"
            }
          ]
        },
        {
          "id": "b2u3c",
          "title": "Ôn tập chương 3",
          "goal": "Ôn lại cả chương xã hội.",
          "checkpoint": true
        }
      ]
    },
    {
      "id": "b2u4",
      "title": "Du lịch & Trải nghiệm",
      "goal": "Kể trải nghiệm, so sánh sâu và nói điều mình ước.",
      "lessons": [
        {
          "id": "b2u4l1",
          "title": "Lên kế hoạch đi",
          "goal": "Tương lai hoàn thành và tương lai tiếp diễn.",
          "teach": [
            {
              "t": "intro",
              "title": "Nói về một mốc trong tương lai",
              "body": "Hai thì này nghe khó nhưng dùng rất đời thường: “đến lúc đó tôi sẽ đang…” và “đến lúc đó tôi sẽ đã xong…”.",
              "bullets": [
                "will be doing",
                "will have done",
                "Khi nào cần tới chúng"
              ]
            },
            {
              "t": "vocab",
              "en": "itinerary",
              "vi": "lịch trình chuyến đi",
              "pos": "Danh từ",
              "ipa": "/aɪˈtɪnəˌrɛri/",
              "note": "Đọc là /aɪˈtɪnərəri/. Trang trọng hơn plan.",
              "ex": {
                "en": "Send me the itinerary.",
                "vi": "Gửi tôi lịch trình nhé."
              }
            },
            {
              "t": "vocab",
              "en": "accommodation",
              "vi": "chỗ ở",
              "pos": "Danh từ",
              "ipa": "/əˌkɑːməˈdeɪʃən/",
              "note": "Nhắc lại từ chương trước — chỗ này gặp lại trong ngữ cảnh du lịch.",
              "ex": {
                "en": "Have you booked accommodation?",
                "vi": "Bạn đặt chỗ ở chưa?"
              }
            },
            {
              "t": "vocab",
              "en": "departure",
              "vi": "sự khởi hành",
              "pos": "Danh từ",
              "ipa": "/dɪˈpɑːrtʃər/",
              "note": "Trái nghĩa là arrival. Trên bảng sân bay ghi Departures.",
              "ex": {
                "en": "Departure is at six.",
                "vi": "Khởi hành lúc sáu giờ."
              }
            },
            {
              "t": "vocab",
              "en": "delay",
              "vi": "sự chậm trễ",
              "pos": "Danh từ",
              "ipa": "/dɪˈleɪ/",
              "note": "Vừa danh từ vừa động từ. The flight was delayed.",
              "ex": {
                "en": "There was a two-hour delay.",
                "vi": "Chuyến bị trễ hai tiếng."
              }
            },
            {
              "t": "vocab",
              "en": "insurance",
              "vi": "bảo hiểm",
              "pos": "Danh từ",
              "ipa": "/ɪnˈʃʊrəns/",
              "note": "Travel insurance. Không đếm được.",
              "ex": {
                "en": "Travel insurance is essential.",
                "vi": "Bảo hiểm du lịch là thiết yếu."
              }
            },
            {
              "t": "vocab",
              "en": "book",
              "vi": "đặt chỗ",
              "pos": "Động từ",
              "ipa": "/ˈbʊk/",
              "note": "Vừa là quyển sách vừa là đặt trước — hai nghĩa khác hẳn.",
              "ex": {
                "en": "I booked the flight online.",
                "vi": "Tôi đặt vé máy bay trên mạng."
              }
            },
            {
              "t": "vocab",
              "en": "destination",
              "vi": "điểm đến",
              "pos": "Danh từ",
              "ipa": "/ˌdɛstɪˈneɪʃən/",
              "note": "A popular destination là điểm đến nổi tiếng.",
              "ex": {
                "en": "Da Nang is a popular destination.",
                "vi": "Đà Nẵng là điểm đến nổi tiếng."
              }
            },
            {
              "t": "vocab",
              "en": "luggage",
              "vi": "hành lý",
              "pos": "Danh từ",
              "ipa": "/ˈlʌɡɪdʒ/",
              "note": "KHÔNG đếm được. Nói two pieces of luggage.",
              "ex": {
                "en": "My luggage was lost.",
                "vi": "Hành lý của tôi bị thất lạc."
              }
            },
            {
              "t": "grammar",
              "title": "Tương lai tiếp diễn và tương lai hoàn thành",
              "body": "Cả hai đều gắn với một MỐC trong tương lai. Khác nhau ở chỗ lúc đó việc đang diễn ra hay đã xong.",
              "rows": [
                [
                  "will be + V-ing",
                  "This time tomorrow I will be flying to Tokyo.",
                  "Giờ này ngày mai tôi sẽ đang bay tới Tokyo."
                ],
                [
                  "will have + V3",
                  "By Friday I will have finished the report.",
                  "Đến thứ Sáu tôi sẽ xong báo cáo."
                ],
                [
                  "Hay đi với",
                  "this time tomorrow, at ten o’clock",
                  "cho thì tiếp diễn"
                ],
                [
                  "Hay đi với",
                  "by then, by Friday, by the time you arrive",
                  "cho thì hoàn thành"
                ]
              ],
              "tip": "Thấy chữ BY trước mốc thời gian thì gần như chắc chắn là tương lai hoàn thành."
            }
          ],
          "sentences": [
            {
              "en": "By Friday I will have finished the report",
              "vi": "Đến thứ Sáu tôi sẽ làm xong báo cáo"
            },
            {
              "en": "This time tomorrow we will be flying to Da Nang",
              "vi": "Giờ này ngày mai chúng ta sẽ đang bay tới Đà Nẵng"
            },
            {
              "en": "My luggage was lost at the airport",
              "vi": "Hành lý của tôi bị thất lạc ở sân bay"
            }
          ]
        },
        {
          "id": "b2u4l2",
          "title": "Ở khách sạn",
          "goal": "Cụm động từ — chỗ tiếng Anh khó nhất với người Việt.",
          "teach": [
            {
              "t": "intro",
              "title": "Vì sao cụm động từ khó đến thế",
              "body": "check in, put up with, get away with — nghĩa của cụm KHÔNG suy ra được từ các từ thành phần. Phải học nguyên cụm như một từ mới.",
              "bullets": [
                "Cụm tách được và không tách được",
                "Cụm du lịch hay gặp",
                "Mẹo học"
              ]
            },
            {
              "t": "phrase",
              "en": "check in",
              "vi": "làm thủ tục nhận phòng",
              "pos": "Cụm động từ",
              "ipa": "/ˈtʃɛk ˈɪn/",
              "note": "Trái nghĩa là check out. Ở sân bay cũng dùng từ này.",
              "ex": {
                "en": "We checked in at noon.",
                "vi": "Chúng tôi nhận phòng lúc trưa."
              }
            },
            {
              "t": "phrase",
              "en": "look forward to",
              "vi": "mong chờ",
              "pos": "Cụm động từ",
              "ipa": "/ˈlʊk ˈfɔːrwərd tuː/",
              "note": "Sau to là V-ing, KHÔNG phải nguyên mẫu. Đây là bẫy.",
              "ex": {
                "en": "I look forward to seeing you.",
                "vi": "Tôi mong được gặp bạn."
              }
            },
            {
              "t": "phrase",
              "en": "put up with",
              "vi": "chịu đựng",
              "pos": "Cụm động từ",
              "ipa": "/ˌpʊt ˈʌp wɪð/",
              "note": "Ba chữ liền, không tách ra được.",
              "ex": {
                "en": "I cannot put up with the noise.",
                "vi": "Tôi không chịu nổi tiếng ồn."
              }
            },
            {
              "t": "phrase",
              "en": "get on with",
              "vi": "hợp tính, thân với",
              "pos": "Cụm động từ",
              "ipa": "/ɡɛt ˈɔn wɪð/",
              "note": "Get on with somebody. Mỹ nói get along with.",
              "ex": {
                "en": "I get on well with my neighbours.",
                "vi": "Tôi hợp tính với hàng xóm."
              }
            },
            {
              "t": "phrase",
              "en": "run out of",
              "vi": "hết sạch",
              "pos": "Cụm động từ",
              "ipa": "/ˈrʌn ˌaʊtəv/",
              "note": "Run out OF something.",
              "ex": {
                "en": "We ran out of water.",
                "vi": "Chúng tôi hết sạch nước."
              }
            },
            {
              "t": "phrase",
              "en": "set off",
              "vi": "lên đường",
              "pos": "Cụm động từ",
              "ipa": "/ˈsɛt ˈɔf/",
              "note": "Đồng nghĩa leave nhưng đời thường hơn.",
              "ex": {
                "en": "We set off at dawn.",
                "vi": "Chúng tôi lên đường lúc rạng sáng."
              }
            },
            {
              "t": "phrase",
              "en": "turn down",
              "vi": "từ chối, vặn nhỏ",
              "pos": "Cụm động từ",
              "ipa": "/ˈtɜːn ˈdaʊn/",
              "note": "Hai nghĩa: từ chối lời mời, và vặn nhỏ âm lượng.",
              "ex": {
                "en": "He turned down the offer.",
                "vi": "Anh ấy từ chối lời mời."
              }
            },
            {
              "t": "phrase",
              "en": "sort out",
              "vi": "giải quyết",
              "pos": "Cụm động từ",
              "ipa": "/ˈsɔːrt ˈaʊt/",
              "note": "Rất hay dùng ở Anh, nghĩa là xử lý cho xong.",
              "ex": {
                "en": "We sorted out the problem.",
                "vi": "Chúng tôi đã xử lý xong vấn đề."
              }
            },
            {
              "t": "grammar",
              "title": "Cụm tách được và không tách được",
              "body": "Có cụm cho phép chen tân ngữ vào giữa, có cụm thì không. Và nếu tân ngữ là đại từ thì BẮT BUỘC chen vào giữa.",
              "rows": [
                [
                  "Tách được",
                  "turn down the offer / turn the offer down",
                  "cả hai đều đúng"
                ],
                [
                  "Đại từ phải chen giữa",
                  "turn it down ✓ / turn down it ✗",
                  ""
                ],
                [
                  "Không tách được",
                  "put up with the noise",
                  "put the noise up with ✗"
                ],
                [
                  "Ba chữ thì không tách",
                  "look forward to, run out of, get on with",
                  ""
                ]
              ],
              "tip": "Mẹo: cụm ba chữ gần như luôn KHÔNG tách được. Cụm hai chữ thì tuỳ từ, phải nhớ."
            },
            {
              "t": "dialogue",
              "title": "Nhận phòng khách sạn",
              "lines": [
                {
                  "who": "A",
                  "en": "I would like to check in, please.",
                  "vi": "Tôi muốn nhận phòng."
                },
                {
                  "who": "B",
                  "en": "Certainly. Could I see your passport?",
                  "vi": "Vâng. Cho tôi xem hộ chiếu được không?"
                },
                {
                  "who": "A",
                  "en": "Here you are. What time is check-out?",
                  "vi": "Đây ạ. Mấy giờ phải trả phòng?"
                },
                {
                  "who": "B",
                  "en": "Twelve o’clock. Let me know if you need anything sorted out.",
                  "vi": "Mười hai giờ. Cần xử lý gì cứ báo tôi."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "I am looking forward to seeing you again",
              "vi": "Tôi mong được gặp lại bạn"
            },
            {
              "en": "We could not put up with the noise",
              "vi": "Chúng tôi không chịu nổi tiếng ồn"
            },
            {
              "en": "They ran out of rooms last night",
              "vi": "Tối qua họ hết phòng"
            }
          ]
        },
        {
          "id": "b2u4l3",
          "title": "Món ăn nước ngoài",
          "goal": "So sánh nâng cao — không chỉ có -er và -est.",
          "teach": [
            {
              "t": "intro",
              "title": "So sánh cho có sắc thái",
              "body": "Ở B2, so sánh không dừng ở “to hơn”. Có “to hơn nhiều”, “không to bằng”, “càng… càng…”. Mấy cấu trúc này làm câu nói giàu hẳn lên.",
              "bullets": [
                "much/far + so sánh",
                "not as … as",
                "the more … the more"
              ]
            },
            {
              "t": "vocab",
              "en": "cuisine",
              "vi": "nền ẩm thực",
              "pos": "Danh từ",
              "ipa": "/kwɪˈziːn/",
              "note": "Đọc là /kwɪˈziːn/, gốc tiếng Pháp.",
              "ex": {
                "en": "Vietnamese cuisine is famous.",
                "vi": "Ẩm thực Việt nổi tiếng."
              }
            },
            {
              "t": "vocab",
              "en": "ingredient",
              "vi": "nguyên liệu",
              "pos": "Danh từ",
              "ipa": "/ɪŋˈɡriːdiənt/",
              "note": "Đọc là /ɪnˈɡriːdiənt/.",
              "ex": {
                "en": "Fresh ingredients matter most.",
                "vi": "Nguyên liệu tươi là quan trọng nhất."
              }
            },
            {
              "t": "vocab",
              "en": "spicy",
              "vi": "cay",
              "pos": "Tính từ",
              "ipa": "/ˈspaɪsi/",
              "note": "Hot cũng có nghĩa là cay — nhìn ngữ cảnh mà hiểu.",
              "ex": {
                "en": "This soup is too spicy.",
                "vi": "Món canh này cay quá."
              }
            },
            {
              "t": "vocab",
              "en": "flavour",
              "vi": "hương vị",
              "pos": "Tính từ",
              "ipa": "/ˈfleɪvər/",
              "note": "Anh viết flavour, Mỹ viết flavor.",
              "ex": {
                "en": "It has a strong flavour.",
                "vi": "Nó có vị đậm."
              }
            },
            {
              "t": "vocab",
              "en": "recipe",
              "vi": "công thức nấu ăn",
              "pos": "Danh từ",
              "ipa": "/ˈrɛsɪˌpiː/",
              "note": "Đọc là /ˈresɪpi/, ba âm tiết. Đừng lẫn với receipt (hoá đơn).",
              "ex": {
                "en": "Can you share the recipe?",
                "vi": "Cho mình xin công thức được không?"
              }
            },
            {
              "t": "vocab",
              "en": "vegetarian",
              "vi": "người ăn chay",
              "pos": "Danh từ",
              "ipa": "/ˌvɛdʒɪˈtɛriən/",
              "note": "Vegan là ăn thuần chay, khắt khe hơn.",
              "ex": {
                "en": "I am a vegetarian.",
                "vi": "Tôi ăn chay."
              }
            },
            {
              "t": "vocab",
              "en": "portion",
              "vi": "khẩu phần",
              "pos": "Danh từ",
              "ipa": "/ˈpɔːrʃən/",
              "note": "A large portion là suất lớn.",
              "ex": {
                "en": "The portions are huge.",
                "vi": "Suất ăn rất to."
              }
            },
            {
              "t": "vocab",
              "en": "delicious",
              "vi": "ngon tuyệt",
              "pos": "Tính từ",
              "ipa": "/dɪˈlɪʃəs/",
              "note": "Đây là tính từ mạnh, đừng nói very delicious.",
              "ex": {
                "en": "The food was absolutely delicious.",
                "vi": "Đồ ăn ngon tuyệt."
              }
            },
            {
              "t": "grammar",
              "title": "So sánh nâng cao",
              "body": "Bốn cấu trúc này dùng được ngay, và làm câu nói khác hẳn mức A2.",
              "rows": [
                [
                  "Nhấn mạnh",
                  "much cheaper / far better",
                  "rẻ hơn nhiều / tốt hơn hẳn"
                ],
                [
                  "Bằng nhau",
                  "as spicy as",
                  "cay bằng"
                ],
                [
                  "Không bằng",
                  "not as expensive as",
                  "không đắt bằng"
                ],
                [
                  "Càng… càng…",
                  "The more you cook, the better you get.",
                  "Càng nấu càng giỏi."
                ],
                [
                  "Dần dần",
                  "It is getting colder and colder.",
                  "Trời càng lúc càng lạnh."
                ]
              ],
              "tip": "Lưu ý: nói “more cheaper” là sai. Đã có -er thì thôi more."
            }
          ],
          "sentences": [
            {
              "en": "This dish is much spicier than I expected",
              "vi": "Món này cay hơn tôi tưởng nhiều"
            },
            {
              "en": "Vietnamese food is not as heavy as European food",
              "vi": "Đồ ăn Việt không nặng bụng bằng đồ Âu"
            },
            {
              "en": "The more you practise the better you get",
              "vi": "Càng luyện càng giỏi"
            }
          ]
        },
        {
          "id": "b2u4l4",
          "title": "Sự cố khi đi",
          "goal": "wish và if only — nói điều mình ước.",
          "teach": [
            {
              "t": "intro",
              "title": "Ước gì…",
              "body": "wish là cách tiếng Anh nói điều trái với thực tế. Nó lùi thì giống câu điều kiện, nên học xong loại 2 và loại 3 thì phần này gần như tự hiểu.",
              "bullets": [
                "wish + quá khứ",
                "wish + had + V3",
                "wish + would"
              ]
            },
            {
              "t": "vocab",
              "en": "cancel",
              "vi": "huỷ",
              "pos": "Động từ",
              "ipa": "/ˈkænsəl/",
              "note": "Anh viết cancelled hai chữ l, Mỹ viết canceled.",
              "ex": {
                "en": "The flight was cancelled.",
                "vi": "Chuyến bay bị huỷ."
              }
            },
            {
              "t": "vocab",
              "en": "refund",
              "vi": "hoàn tiền",
              "pos": "Danh từ",
              "ipa": "/rɪˈfʌnd/",
              "note": "Vừa danh từ vừa động từ. Get a refund.",
              "ex": {
                "en": "I asked for a refund.",
                "vi": "Tôi yêu cầu hoàn tiền."
              }
            },
            {
              "t": "vocab",
              "en": "complain",
              "vi": "phàn nàn",
              "pos": "Động từ",
              "ipa": "/kəmˈpleɪn/",
              "note": "Complain ABOUT something TO somebody. Danh từ là complaint.",
              "ex": {
                "en": "We complained to the manager.",
                "vi": "Chúng tôi phàn nàn với quản lý."
              }
            },
            {
              "t": "vocab",
              "en": "lost",
              "vi": "bị mất, lạc",
              "pos": "Tính từ",
              "ipa": "/ˈlɔst/",
              "note": "Get lost là bị lạc đường.",
              "ex": {
                "en": "My passport is lost.",
                "vi": "Hộ chiếu của tôi bị mất."
              }
            },
            {
              "t": "vocab",
              "en": "emergency",
              "vi": "trường hợp khẩn cấp",
              "pos": "Danh từ",
              "ipa": "/ɪˈmɜːdʒənsi/",
              "note": "In an emergency, call 115.",
              "ex": {
                "en": "This is an emergency.",
                "vi": "Đây là trường hợp khẩn cấp."
              }
            },
            {
              "t": "vocab",
              "en": "embassy",
              "vi": "đại sứ quán",
              "pos": "Danh từ",
              "ipa": "/ˈɛmbəsi/",
              "note": "Consulate là lãnh sự quán, nhỏ hơn.",
              "ex": {
                "en": "Contact your embassy.",
                "vi": "Hãy liên hệ đại sứ quán của bạn."
              }
            },
            {
              "t": "vocab",
              "en": "stranded",
              "vi": "mắc kẹt",
              "pos": "Tính từ",
              "ipa": "/ˈstrændɪd/",
              "note": "Kẹt lại không đi tiếp được.",
              "ex": {
                "en": "We were stranded at the airport.",
                "vi": "Chúng tôi mắc kẹt ở sân bay."
              }
            },
            {
              "t": "vocab",
              "en": "reschedule",
              "vi": "dời lịch",
              "pos": "Động từ",
              "ipa": "/rɪˈskɛdʒuːl/",
              "note": "Trang trọng hơn change the date.",
              "ex": {
                "en": "They rescheduled the flight.",
                "vi": "Họ dời lịch chuyến bay."
              }
            },
            {
              "t": "grammar",
              "title": "wish — ước điều trái thực tế",
              "body": "Ba dạng, tuỳ ước về hiện tại, quá khứ hay ước người khác đổi cách cư xử.",
              "rows": [
                [
                  "Ước hiện tại",
                  "I wish I spoke French.",
                  "Ước gì tôi nói được tiếng Pháp — thực tế là không."
                ],
                [
                  "Ước quá khứ",
                  "I wish I had booked earlier.",
                  "Giá mà tôi đặt sớm hơn — nhưng đã lỡ."
                ],
                [
                  "Ước người khác đổi",
                  "I wish they would stop shouting.",
                  "Ước gì họ thôi la hét."
                ],
                [
                  "If only — mạnh hơn",
                  "If only I had listened!",
                  "Giá mà lúc đó tôi nghe lời!"
                ]
              ],
              "tip": "Lưu ý: I wish I was và I wish I were đều gặp, nhưng were trang trọng và chuẩn hơn."
            }
          ],
          "sentences": [
            {
              "en": "I wish I had booked the tickets earlier",
              "vi": "Giá mà tôi đặt vé sớm hơn"
            },
            {
              "en": "We were stranded because the flight was cancelled",
              "vi": "Chúng tôi mắc kẹt vì chuyến bay bị huỷ"
            },
            {
              "en": "She complained to the manager and got a refund",
              "vi": "Cô ấy phàn nàn với quản lý và được hoàn tiền"
            }
          ]
        },
        {
          "id": "b2u4l5",
          "title": "Kể lại chuyến đi",
          "goal": "Gộp mọi thứ đã học để kể một câu chuyện.",
          "teach": [
            {
              "t": "intro",
              "title": "Kể một chuyến đi cho ra chuyện",
              "body": "Bài cuối của trình độ này không dạy ngữ pháp mới. Nó dạy cách xâu mọi thứ đã học thành một mạch kể liền: mở đầu, diễn biến, cao trào, kết.",
              "bullets": [
                "Trình tự thời gian",
                "Xen cảm xúc vào",
                "Kết chuyện"
              ]
            },
            {
              "t": "vocab",
              "en": "memorable",
              "vi": "đáng nhớ",
              "pos": "Tính từ",
              "ipa": "/ˈmɛmərəbəl/",
              "note": "A memorable trip. Mạnh hơn nice nhiều.",
              "ex": {
                "en": "It was a memorable journey.",
                "vi": "Đó là chuyến đi đáng nhớ."
              }
            },
            {
              "t": "vocab",
              "en": "adventure",
              "vi": "cuộc phiêu lưu",
              "pos": "Danh từ",
              "ipa": "/ədˈvɛntʃər/",
              "note": "Tính từ adventurous là ưa mạo hiểm.",
              "ex": {
                "en": "It turned into an adventure.",
                "vi": "Nó hoá thành một cuộc phiêu lưu."
              }
            },
            {
              "t": "vocab",
              "en": "scenery",
              "vi": "phong cảnh",
              "pos": "Danh từ",
              "ipa": "/ˈsiːnəri/",
              "note": "KHÔNG đếm được. Không nói sceneries.",
              "ex": {
                "en": "The scenery was breathtaking.",
                "vi": "Phong cảnh đẹp nghẹt thở."
              }
            },
            {
              "t": "vocab",
              "en": "local",
              "vi": "thuộc địa phương",
              "pos": "Tính từ",
              "ipa": "/ˈloʊkəl/",
              "note": "The locals là dân địa phương.",
              "ex": {
                "en": "We ate at a local market.",
                "vi": "Chúng tôi ăn ở chợ địa phương."
              }
            },
            {
              "t": "vocab",
              "en": "eventually",
              "vi": "cuối cùng thì",
              "pos": "Trạng từ",
              "ipa": "/ɪˈvɛntʃuːəli/",
              "note": "Đừng lẫn với finally. Eventually hàm ý sau một hồi lâu.",
              "ex": {
                "en": "Eventually we found the hotel.",
                "vi": "Cuối cùng chúng tôi cũng tìm được khách sạn."
              }
            },
            {
              "t": "vocab",
              "en": "surprisingly",
              "vi": "đáng ngạc nhiên là",
              "pos": "Trạng từ",
              "ipa": "/sərˈpraɪzɪŋli/",
              "note": "Đặt đầu câu, có dấu phẩy theo sau.",
              "ex": {
                "en": "Surprisingly, it was cheap.",
                "vi": "Đáng ngạc nhiên là nó rẻ."
              }
            },
            {
              "t": "vocab",
              "en": "worth",
              "vi": "đáng giá",
              "pos": "Tính từ",
              "ipa": "/ˈwɜːθ/",
              "note": "Worth + V-ing: worth visiting. Không phải worth to visit.",
              "ex": {
                "en": "The trip was worth every penny.",
                "vi": "Chuyến đi đáng từng đồng."
              }
            },
            {
              "t": "vocab",
              "en": "unforgettable",
              "vi": "không thể quên",
              "pos": "Tính từ",
              "ipa": "/ʌnfərˈɡɛtəbəl/",
              "note": "Tính từ mạnh, không đi với very.",
              "ex": {
                "en": "An unforgettable experience.",
                "vi": "Một trải nghiệm không thể quên."
              }
            },
            {
              "t": "grammar",
              "title": "Từ nối để kể chuyện",
              "body": "Xâu chuỗi câu chuyện bằng mấy từ này là người nghe theo được mạch ngay.",
              "rows": [
                [
                  "Mở đầu",
                  "Last summer… / A couple of years ago…",
                  ""
                ],
                [
                  "Tiếp diễn",
                  "At first… / Then… / After that…",
                  ""
                ],
                [
                  "Bất ngờ",
                  "Suddenly… / All of a sudden…",
                  ""
                ],
                [
                  "Cao trào",
                  "To make matters worse… / Luckily…",
                  ""
                ],
                [
                  "Kết",
                  "In the end… / Eventually… / Looking back…",
                  ""
                ]
              ],
              "tip": "Mẹo kể chuyện hay: dùng quá khứ tiếp diễn làm nền (I was walking…) rồi quá khứ đơn cho biến cố (…when I saw…)."
            },
            {
              "t": "dialogue",
              "title": "Kể lại chuyến đi",
              "lines": [
                {
                  "who": "A",
                  "en": "How was your trip to Sapa?",
                  "vi": "Chuyến đi Sa Pa thế nào?"
                },
                {
                  "who": "B",
                  "en": "Unforgettable. We were walking when it started to snow.",
                  "vi": "Không thể quên. Đang đi bộ thì trời đổ tuyết."
                },
                {
                  "who": "A",
                  "en": "Really? What did you do?",
                  "vi": "Thật à? Rồi bạn làm gì?"
                },
                {
                  "who": "B",
                  "en": "Eventually we found a small guesthouse. It was worth it.",
                  "vi": "Cuối cùng cũng tìm được nhà nghỉ nhỏ. Đáng lắm."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Last summer I went on an unforgettable trip",
              "vi": "Hè năm ngoái tôi có một chuyến đi không thể quên"
            },
            {
              "en": "We were walking when it suddenly started to rain",
              "vi": "Chúng tôi đang đi bộ thì trời bỗng đổ mưa"
            },
            {
              "en": "Looking back it was worth every difficulty",
              "vi": "Nhìn lại thì mọi vất vả đều đáng"
            }
          ]
        },
        {
          "id": "b2u4c",
          "title": "Ôn tập chương 4",
          "goal": "Ôn lại cả chương du lịch.",
          "checkpoint": true
        }
      ]
    }
  ]
};
