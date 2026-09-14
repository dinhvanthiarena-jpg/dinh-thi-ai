/* ============================================================
   ON-Language — Tieng Trung cho nguoi Viet, trinh do nhap mon
   SINH TU DONG tu scratchpad/soan_zh_*.js — dung sua tay file nay.
   Pinyin do pypinyin tra, khong go tay.

   Giu nguyen quy uoc cua app: en = tieng DANG HOC (o day la chu Han),
   vi = loi GIAI THICH (o day la tieng Viet), ipa = pinyin.
   Cau tieng Trung CO DAU CACH giua cac tu de bon tro choi tach tu duoc.
   ============================================================ */

const ZH1 = {
  "id": "z1",
  "code": "HSK1",
  "name": "Nhập môn",
  "desc": "Chào hỏi, gia đình, ăn uống, số đếm — tiếng Trung cần trước nhất, dạy bằng tiếng Việt.",
  "units": [
    {
      "id": "z1u1",
      "title": "Chào hỏi & Làm quen",
      "goal": "Chào, giới thiệu tên, hỏi thăm — và làm quen với chữ Hán.",
      "lessons": [
        {
          "id": "z1u1l1",
          "title": "Xin chào",
          "goal": "Câu chào đầu tiên và bốn thanh điệu.",
          "teach": [
            {
              "t": "intro",
              "title": "Bốn thanh — tai người Việt có sẵn lợi thế",
              "body": "Tiếng Trung chỉ có 4 thanh, tiếng Việt có 6. Người Âu Mỹ mất cả năm mới nghe ra thanh; bạn thì tai đã quen sẵn. Việc của bạn chỉ là học xem thanh nào ra thanh nào.",
              "bullets": [
                "你好 — câu chào phổ thông nhất",
                "Bốn thanh và cách đọc",
                "Pinyin là gì"
              ]
            },
            {
              "t": "vocab",
              "en": "你好",
              "vi": "xin chào",
              "pos": "Chào hỏi",
              "ipa": "nǐhǎo",
              "pic": "hello",
              "note": "Nghĩa đen là “bạn tốt”. 你 là bạn, 好 là tốt. Dùng được với mọi người, mọi lúc.",
              "ex": {
                "en": "你好！我 是 阿明。",
                "vi": "Xin chào! Tôi là A Minh."
              }
            },
            {
              "t": "vocab",
              "en": "您好",
              "vi": "chào ngài (lịch sự)",
              "pos": "Chào hỏi",
              "ipa": "nínhǎo",
              "note": "您 là dạng lịch sự của 你 — nhìn kỹ có thêm chữ 心 (tâm) bên dưới, ý là để cả tấm lòng vào. Dùng với người lớn tuổi, khách hàng.",
              "ex": {
                "en": "您好，请 进。",
                "vi": "Chào ông, mời vào."
              }
            },
            {
              "t": "vocab",
              "en": "早上好",
              "vi": "chào buổi sáng",
              "pos": "Chào hỏi",
              "ipa": "zǎoshànghǎo",
              "note": "早上 là buổi sáng — Hán-Việt là “tảo thượng”. 早 nghĩa là sớm.",
              "ex": {
                "en": "早上好，老师！",
                "vi": "Chào buổi sáng thầy!"
              }
            },
            {
              "t": "vocab",
              "en": "晚上好",
              "vi": "chào buổi tối",
              "pos": "Chào hỏi",
              "ipa": "wǎnshànghǎo",
              "note": "晚上 là buổi tối, Hán-Việt “vãn thượng”. 晚 là muộn — cùng gốc với “vãn” trong “vãn cảnh”.",
              "ex": {
                "en": "晚上好，大家。",
                "vi": "Chào buổi tối mọi người."
              }
            },
            {
              "t": "vocab",
              "en": "再见",
              "vi": "tạm biệt",
              "pos": "Chào hỏi",
              "ipa": "zàijiàn",
              "note": "Hán-Việt là “tái kiến” — gặp lại. Đúng nghĩa “hẹn gặp lại”.",
              "ex": {
                "en": "再见，明天 见。",
                "vi": "Tạm biệt, mai gặp."
              }
            },
            {
              "t": "vocab",
              "en": "谢谢",
              "vi": "cảm ơn",
              "pos": "Chào hỏi",
              "ipa": "xièxiè",
              "note": "Hán-Việt là “tạ tạ”, cùng gốc với “cảm tạ”. Hai chữ giống hệt nhau, chữ sau đọc nhẹ đi.",
              "ex": {
                "en": "谢谢 你！",
                "vi": "Cảm ơn bạn!"
              }
            },
            {
              "t": "vocab",
              "en": "不客气",
              "vi": "không có gì",
              "pos": "Cụm từ",
              "ipa": "búkèqì",
              "note": "Hán-Việt “bất khách khí” — đừng khách sáo. Câu đáp lại 谢谢.",
              "ex": {
                "en": "不客气，应该 的。",
                "vi": "Không có gì, nên thế mà."
              }
            },
            {
              "t": "vocab",
              "en": "对不起",
              "vi": "xin lỗi",
              "pos": "Cụm từ",
              "ipa": "duìbùqǐ",
              "note": "Nghĩa đen là “không đối diện nổi” — thấy có lỗi nên không dám nhìn thẳng.",
              "ex": {
                "en": "对不起，我 迟到 了。",
                "vi": "Xin lỗi, tôi đến muộn."
              }
            },
            {
              "t": "grammar",
              "title": "Bốn thanh — đối chiếu với thanh tiếng Việt",
              "body": "Đây là bảng đáng học thuộc nhất của cả khoá. Không thanh nào trùng khít với tiếng Việt, nhưng gần đủ để bám vào mà nhớ.",
              "rows": [
                [
                  "Thanh 1 — mā 妈",
                  "cao và bằng, kéo dài",
                  "gần thanh NGANG nhưng cao hơn"
                ],
                [
                  "Thanh 2 — má 麻",
                  "đi lên từ giữa",
                  "gần thanh SẮC"
                ],
                [
                  "Thanh 3 — mǎ 马",
                  "xuống rồi lên",
                  "gần thanh HỎI"
                ],
                [
                  "Thanh 4 — mà 骂",
                  "rơi thẳng từ cao xuống",
                  "gần thanh NẶNG nhưng dài hơn"
                ],
                [
                  "Thanh nhẹ — ma 吗",
                  "đọc lướt, không nhấn",
                  "tiếng Việt không có"
                ]
              ],
              "tip": "Cùng một âm “ma”, đổi thanh là đổi hẳn nghĩa: mẹ, gai, ngựa, mắng. Sai thanh là sai từ, không phải sai giọng."
            },
            {
              "t": "culture",
              "title": "Pinyin là cái gậy, không phải cái đích",
              "body": "Pinyin là cách ghi âm tiếng Trung bằng chữ La-tinh, do Trung Quốc đặt ra năm 1958 để dạy trẻ con đọc. Nó giúp bạn phát âm đúng ngay từ ngày đầu, nhưng người Trung Quốc không viết pinyin trong đời sống — biển hiệu, sách báo, tin nhắn đều là chữ Hán. Hãy dùng pinyin để đọc cho đúng, nhưng đừng dựa vào nó mãi: tập nhìn mặt chữ Hán ngay từ bài đầu."
            },
            {
              "t": "dialogue",
              "title": "Gặp nhau lần đầu",
              "lines": [
                {
                  "who": "A",
                  "en": "你好！",
                  "vi": "Xin chào!"
                },
                {
                  "who": "B",
                  "en": "你好！很 高兴 认识 你。",
                  "vi": "Xin chào! Rất vui được làm quen."
                },
                {
                  "who": "A",
                  "en": "我 也 是。再见！",
                  "vi": "Tôi cũng vậy. Tạm biệt!"
                },
                {
                  "who": "B",
                  "en": "再见！",
                  "vi": "Tạm biệt!"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "你好 老师",
              "vi": "Chào thầy"
            },
            {
              "en": "谢谢 你 的 帮助",
              "vi": "Cảm ơn sự giúp đỡ của bạn"
            },
            {
              "en": "再见 明天 见",
              "vi": "Tạm biệt, mai gặp"
            }
          ]
        },
        {
          "id": "z1u1l2",
          "title": "Tôi là ai",
          "goal": "Động từ 是 và cách nói tên mình.",
          "teach": [
            {
              "t": "intro",
              "title": "是 — đúng là chữ “thị” trong “thị trường”… nhưng nghĩa khác",
              "body": "是 là động từ “là”. Dùng y hệt chữ “là” tiếng Việt: nối hai danh từ. Và giống tiếng Việt, KHÔNG được dùng trước tính từ.",
              "bullets": [
                "是 = là",
                "Hỏi tên bằng 叫",
                "不 để phủ định"
              ]
            },
            {
              "t": "vocab",
              "en": "我",
              "vi": "tôi",
              "pos": "Đại từ",
              "ipa": "wǒ",
              "note": "Một chữ dùng cho mọi vai: tôi, tớ, em, anh… Tiếng Trung không phân vai theo tuổi như tiếng Việt — chỗ này DỄ hơn tiếng Việt nhiều.",
              "ex": {
                "en": "我 是 学生。",
                "vi": "Tôi là học sinh."
              }
            },
            {
              "t": "vocab",
              "en": "你",
              "vi": "bạn",
              "pos": "Đại từ",
              "ipa": "nǐ",
              "note": "Thêm 们 thành 你们 là “các bạn”.",
              "ex": {
                "en": "你 是 老师 吗？",
                "vi": "Bạn là giáo viên phải không?"
              }
            },
            {
              "t": "vocab",
              "en": "他",
              "vi": "anh ấy",
              "pos": "Đại từ",
              "ipa": "tā",
              "note": "她 (cô ấy) đọc y hệt tā, chỉ khác mặt chữ: bên trái là 女 (nữ).",
              "ex": {
                "en": "他 是 我 的 朋友。",
                "vi": "Anh ấy là bạn tôi."
              }
            },
            {
              "t": "vocab",
              "en": "是",
              "vi": "là",
              "pos": "Động từ",
              "ipa": "shì",
              "note": "Hán-Việt là “thị”. Chỉ nối hai DANH TỪ. Nói 我是好 là sai, phải là 我很好.",
              "ex": {
                "en": "我 是 越南人。",
                "vi": "Tôi là người Việt Nam."
              }
            },
            {
              "t": "vocab",
              "en": "叫",
              "vi": "gọi là, tên là",
              "pos": "Động từ",
              "ipa": "jiào",
              "note": "Hỏi tên dùng 叫 chứ không dùng 是. 你叫什么名字？",
              "ex": {
                "en": "我 叫 阿明。",
                "vi": "Tôi tên là A Minh."
              }
            },
            {
              "t": "vocab",
              "en": "名字",
              "vi": "tên",
              "pos": "Danh từ",
              "ipa": "míngzì",
              "note": "Hán-Việt là “danh tự”. 名 là danh, 字 là chữ.",
              "ex": {
                "en": "你 的 名字 很 好听。",
                "vi": "Tên bạn nghe hay lắm."
              }
            },
            {
              "t": "vocab",
              "en": "学生",
              "vi": "học sinh",
              "pos": "Danh từ",
              "ipa": "xuéshēng",
              "pic": "student",
              "note": "Đây chính là “học sinh” Hán-Việt! 学 = học, 生 = sinh. Bạn đã biết từ này từ trước khi học tiếng Trung.",
              "ex": {
                "en": "他 是 大学生。",
                "vi": "Anh ấy là sinh viên."
              }
            },
            {
              "t": "vocab",
              "en": "老师",
              "vi": "giáo viên",
              "pos": "Danh từ",
              "ipa": "lǎoshī",
              "pic": "teacher",
              "note": "老 là lão (già, đáng kính), 师 là sư (thầy). Ghép lại đúng nghĩa “lão sư” — người thầy đáng kính.",
              "ex": {
                "en": "王 老师 很 好。",
                "vi": "Thầy Vương rất tốt."
              }
            },
            {
              "t": "grammar",
              "title": "是 và 不 — câu khẳng định và phủ định",
              "body": "Phủ định đặt 不 ngay trước động từ. Giống hệt chữ “không” tiếng Việt về vị trí.",
              "rows": [
                [
                  "Khẳng định",
                  "我 是 学生。",
                  "Tôi là học sinh."
                ],
                [
                  "Phủ định",
                  "我 不 是 老师。",
                  "Tôi không phải giáo viên."
                ],
                [
                  "Hỏi tên",
                  "你 叫 什么 名字？",
                  "Bạn tên là gì?"
                ],
                [
                  "Trả lời",
                  "我 叫 阿明。",
                  "Tôi tên A Minh."
                ],
                [
                  "SAI",
                  "我 是 好。",
                  "Trước tính từ KHÔNG dùng 是"
                ]
              ]
            },
            {
              "t": "culture",
              "title": "Bạn đã biết hàng nghìn từ tiếng Trung rồi",
              "body": "Khoảng 60% từ vựng tiếng Việt có gốc Hán. 学生 là “học sinh”, 国家 là “quốc gia”, 家庭 là “gia đình”, 同意 là “đồng ý”, 注意 là “chú ý”, 经验 là “kinh nghiệm”. Bạn không học từ mới — bạn học lại mặt chữ và cách đọc của những từ mình đã dùng cả đời. Đây là lợi thế mà người Anh, người Mỹ học tiếng Trung không bao giờ có. Hễ gặp một từ mới, hãy thử đọc âm Hán-Việt của nó lên xem có quen không."
            }
          ],
          "sentences": [
            {
              "en": "我 是 越南人",
              "vi": "Tôi là người Việt Nam"
            },
            {
              "en": "他 不 是 老师",
              "vi": "Anh ấy không phải giáo viên"
            },
            {
              "en": "你 叫 什么 名字",
              "vi": "Bạn tên là gì"
            }
          ]
        },
        {
          "id": "z1u1l3",
          "title": "Bạn khoẻ không?",
          "goal": "Câu hỏi với 吗 và tính từ không cần 是.",
          "teach": [
            {
              "t": "intro",
              "title": "Hỏi bằng cách thêm một chữ vào cuối",
              "body": "Muốn hỏi có/không, tiếng Trung chỉ việc thêm 吗 vào cuối câu khẳng định. Không đảo từ, không thêm gì khác — dễ hơn tiếng Anh rất nhiều.",
              "bullets": [
                "吗 biến câu kể thành câu hỏi",
                "很 + tính từ, bỏ 是",
                "Cách đáp lại"
              ]
            },
            {
              "t": "vocab",
              "en": "好",
              "vi": "tốt, khoẻ",
              "pos": "Tính từ",
              "ipa": "hǎo",
              "note": "Hán-Việt là “hảo”. Chữ này ghép từ 女 (nữ) và 子 (tử) — mẹ bên con thì là điều tốt.",
              "ex": {
                "en": "我 很 好。",
                "vi": "Tôi khoẻ."
              }
            },
            {
              "t": "vocab",
              "en": "很",
              "vi": "rất",
              "pos": "Trạng từ",
              "ipa": "hěn",
              "note": "Đứng trước tính từ. Lạ ở chỗ 很 nhiều khi KHÔNG mang nghĩa “rất” mà chỉ là chỗ đệm bắt buộc.",
              "ex": {
                "en": "今天 很 冷。",
                "vi": "Hôm nay lạnh."
              }
            },
            {
              "t": "vocab",
              "en": "吗",
              "vi": "…không? (từ để hỏi)",
              "pos": "Trợ từ",
              "ipa": "ma",
              "note": "Đặt cuối câu. Đọc thanh nhẹ, lướt qua. Chữ này có bộ 口 (khẩu — miệng) bên trái, dấu hiệu của từ phát ra thành tiếng.",
              "ex": {
                "en": "你 好 吗？",
                "vi": "Bạn khoẻ không?"
              }
            },
            {
              "t": "vocab",
              "en": "累",
              "vi": "mệt",
              "pos": "Tính từ",
              "ipa": "lèi",
              "pic": "tired",
              "note": "Hán-Việt là “luỵ”. Đọc lèi, thanh 4 rơi mạnh.",
              "ex": {
                "en": "我 今天 很 累。",
                "vi": "Hôm nay tôi mệt lắm."
              }
            },
            {
              "t": "vocab",
              "en": "忙",
              "vi": "bận",
              "pos": "Tính từ",
              "ipa": "máng",
              "pic": "busy",
              "note": "Hán-Việt là “mang”. Bên trái là 心 (tâm) biến thể — bận thì lòng rối.",
              "ex": {
                "en": "他 很 忙。",
                "vi": "Anh ấy bận lắm."
              }
            },
            {
              "t": "vocab",
              "en": "高兴",
              "vi": "vui, vui mừng",
              "pos": "Tính từ",
              "ipa": "gāoxìng",
              "pic": "happy",
              "note": "Hán-Việt là “cao hứng”! Đúng cái từ tiếng Việt vẫn dùng.",
              "ex": {
                "en": "认识 你 很 高兴。",
                "vi": "Rất vui được quen bạn."
              }
            },
            {
              "t": "vocab",
              "en": "不错",
              "vi": "cũng khá, không tệ",
              "pos": "Tính từ",
              "ipa": "bùcuò",
              "note": "Nghĩa đen “không sai”. Người Trung Quốc dùng câu này để khen, không phải chê nhẹ.",
              "ex": {
                "en": "你 的 中文 不错！",
                "vi": "Tiếng Trung của bạn khá đấy!"
              }
            },
            {
              "t": "vocab",
              "en": "身体",
              "vi": "sức khoẻ, cơ thể",
              "pos": "Danh từ",
              "ipa": "shēntǐ",
              "note": "Hán-Việt là “thân thể”. Hỏi thăm sức khoẻ: 身体好吗？",
              "ex": {
                "en": "他 身体 很 好。",
                "vi": "Sức khoẻ ông ấy tốt."
              }
            },
            {
              "t": "grammar",
              "title": "很 + tính từ — và vì sao KHÔNG có 是",
              "body": "Đây là chỗ giống tiếng Việt: “Tôi khoẻ”, không ai nói “Tôi là khoẻ”. Tiếng Trung y hệt. Nhưng tiếng Trung bắt phải có một chữ đệm trước tính từ, thường là 很.",
              "rows": [
                [
                  "Đúng",
                  "我 很 好。",
                  "Tôi khoẻ. (很 ở đây gần như không mang nghĩa “rất”)"
                ],
                [
                  "Sai",
                  "我 是 好。",
                  "không dùng 是 trước tính từ"
                ],
                [
                  "Cụt lủn",
                  "我 好。",
                  "đúng ngữ pháp nhưng nghe trống, như đang so sánh với ai"
                ],
                [
                  "Phủ định",
                  "我 不 累。",
                  "Tôi không mệt. (phủ định thì bỏ 很)"
                ],
                [
                  "Hỏi",
                  "你 累 吗？",
                  "Bạn mệt không?"
                ]
              ],
              "tip": "Mẹo nhớ: 很 trước tính từ là mặc định, như cái đệm. Muốn “rất” thật thì nhấn giọng vào 很, hoặc dùng 非常."
            },
            {
              "t": "dialogue",
              "title": "Hỏi thăm nhau",
              "lines": [
                {
                  "who": "A",
                  "en": "你 好 吗？",
                  "vi": "Bạn khoẻ không?"
                },
                {
                  "who": "B",
                  "en": "我 很 好，谢谢。你 呢？",
                  "vi": "Tôi khoẻ, cảm ơn. Còn bạn?"
                },
                {
                  "who": "A",
                  "en": "我 有点儿 累。",
                  "vi": "Tôi hơi mệt."
                },
                {
                  "who": "B",
                  "en": "早点 休息 吧。",
                  "vi": "Nghỉ sớm đi nhé."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "你 好 吗",
              "vi": "Bạn khoẻ không"
            },
            {
              "en": "我 今天 很 忙",
              "vi": "Hôm nay tôi bận lắm"
            },
            {
              "en": "认识 你 很 高兴",
              "vi": "Rất vui được làm quen với bạn"
            }
          ]
        },
        {
          "id": "z1u1l4",
          "title": "Bạn từ đâu đến?",
          "goal": "Hỏi quê quán và cấu trúc 是…人.",
          "teach": [
            {
              "t": "intro",
              "title": "Tên nước, tên người — toàn từ Hán-Việt",
              "body": "越南 đọc Yuènán, chính là “Việt Nam”. 中国 là “Trung Quốc”. Bạn đọc âm Hán-Việt lên là ra nghĩa ngay.",
              "bullets": [
                "Tên các nước",
                "…人 = người nước đó",
                "哪儿 để hỏi ở đâu"
              ]
            },
            {
              "t": "vocab",
              "en": "中国",
              "vi": "Trung Quốc",
              "pos": "Danh từ",
              "ipa": "zhōngguó",
              "note": "中 là trung (giữa), 国 là quốc (nước) — “nước ở giữa”. Đọc âm Hán-Việt là ra ngay.",
              "ex": {
                "en": "我 在 中国 学习。",
                "vi": "Tôi học ở Trung Quốc."
              }
            },
            {
              "t": "vocab",
              "en": "越南",
              "vi": "Việt Nam",
              "pos": "Danh từ",
              "ipa": "yuènán",
              "note": "Đúng hai chữ “Việt Nam”, đọc là Yuènán. 越 = Việt, 南 = Nam.",
              "ex": {
                "en": "我 是 越南人。",
                "vi": "Tôi là người Việt Nam."
              }
            },
            {
              "t": "vocab",
              "en": "人",
              "vi": "người",
              "pos": "Danh từ",
              "ipa": "rén",
              "note": "Chữ tượng hình: hình một người đang bước đi. Ghép sau tên nước thành người nước đó.",
              "ex": {
                "en": "他 是 中国人。",
                "vi": "Anh ấy là người Trung Quốc."
              }
            },
            {
              "t": "vocab",
              "en": "国家",
              "vi": "quốc gia",
              "pos": "Danh từ",
              "ipa": "guójiā",
              "pic": "country",
              "note": "Đúng từ “quốc gia” Hán-Việt.",
              "ex": {
                "en": "这 是 一 个 大 国家。",
                "vi": "Đây là một quốc gia lớn."
              }
            },
            {
              "t": "vocab",
              "en": "哪儿",
              "vi": "ở đâu",
              "pos": "Đại từ",
              "ipa": "nǎér",
              "note": "Người miền Bắc Trung Quốc nói 哪儿, miền Nam nói 哪里. Cả hai đều hiểu.",
              "ex": {
                "en": "你 住 在 哪儿？",
                "vi": "Bạn sống ở đâu?"
              }
            },
            {
              "t": "vocab",
              "en": "住",
              "vi": "ở, cư trú",
              "pos": "Động từ",
              "ipa": "zhù",
              "note": "Hán-Việt là “trú”, cùng gốc với “cư trú”, “trú ngụ”.",
              "ex": {
                "en": "我 住 在 河内。",
                "vi": "Tôi sống ở Hà Nội."
              }
            },
            {
              "t": "vocab",
              "en": "在",
              "vi": "ở (tại)",
              "pos": "Giới từ",
              "ipa": "zài",
              "note": "Hán-Việt là “tại”. Chữ này cực kỳ hay gặp, vừa là giới từ vừa là động từ.",
              "ex": {
                "en": "他 在 家。",
                "vi": "Anh ấy ở nhà."
              }
            },
            {
              "t": "vocab",
              "en": "河内",
              "vi": "Hà Nội",
              "pos": "Danh từ",
              "ipa": "hénèi",
              "note": "Đúng hai chữ “Hà Nội” — 河 là hà (sông), 内 là nội (trong).",
              "ex": {
                "en": "河内 是 越南 的 首都。",
                "vi": "Hà Nội là thủ đô Việt Nam."
              }
            },
            {
              "t": "grammar",
              "title": "Từ để hỏi đứng ĐÚNG CHỖ câu trả lời",
              "body": "Giống tiếng Việt, khác tiếng Anh: không đảo câu, không đưa từ hỏi lên đầu. Nói được câu trả lời là nói được câu hỏi.",
              "rows": [
                [
                  "Trả lời",
                  "我 住 在 河内。",
                  "Tôi sống ở Hà Nội."
                ],
                [
                  "Hỏi",
                  "你 住 在 哪儿？",
                  "Bạn sống ở đâu?"
                ],
                [
                  "Trả lời",
                  "他 是 中国人。",
                  "Anh ấy là người Trung Quốc."
                ],
                [
                  "Hỏi",
                  "他 是 哪 国 人？",
                  "Anh ấy là người nước nào?"
                ]
              ],
              "tip": "Lưu ý: câu đã có từ để hỏi thì KHÔNG thêm 吗 nữa. Nói 你住在哪儿吗？là sai."
            }
          ],
          "sentences": [
            {
              "en": "我 是 越南人",
              "vi": "Tôi là người Việt Nam"
            },
            {
              "en": "你 住 在 哪儿",
              "vi": "Bạn sống ở đâu"
            },
            {
              "en": "河内 是 越南 的 首都",
              "vi": "Hà Nội là thủ đô Việt Nam"
            }
          ]
        },
        {
          "id": "z1u1c",
          "title": "Ôn tập chương 1",
          "goal": "Ôn lại cả chương chào hỏi.",
          "checkpoint": true
        }
      ]
    },
    {
      "id": "z1u2",
      "title": "Gia đình & Con người",
      "goal": "Nói về gia đình, sở hữu và số lượng.",
      "lessons": [
        {
          "id": "z1u2l1",
          "title": "Gia đình tôi",
          "goal": "Từ chỉ người thân và chữ 的 sở hữu.",
          "teach": [
            {
              "t": "intro",
              "title": "的 — một chữ thay cho “của”",
              "body": "的 là chữ hay gặp nhất trong tiếng Trung. Nó đúng là chữ “của” tiếng Việt, chỉ khác vị trí: người sở hữu đứng TRƯỚC.",
              "bullets": [
                "A 的 B = B của A",
                "Từ chỉ người thân",
                "Khi nào bỏ được 的"
              ]
            },
            {
              "t": "vocab",
              "en": "家",
              "vi": "nhà, gia đình",
              "pos": "Danh từ",
              "ipa": "jiā",
              "pic": "house",
              "note": "Hán-Việt là “gia”. Chữ tượng hình: mái nhà 宀 che con lợn 豕 — có lợn dưới mái là có nhà.",
              "ex": {
                "en": "我 家 有 四 口 人。",
                "vi": "Nhà tôi có bốn người."
              }
            },
            {
              "t": "vocab",
              "en": "爸爸",
              "vi": "bố",
              "pos": "Danh từ",
              "ipa": "bàbà",
              "pic": "father",
              "note": "Từ thân mật, lặp hai chữ giống tiếng Việt “ba ba”. Trang trọng là 父亲 (phụ thân).",
              "ex": {
                "en": "我 爸爸 是 医生。",
                "vi": "Bố tôi là bác sĩ."
              }
            },
            {
              "t": "vocab",
              "en": "妈妈",
              "vi": "mẹ",
              "pos": "Danh từ",
              "ipa": "māmā",
              "pic": "mother",
              "note": "Trang trọng là 母亲 (mẫu thân). Chữ 妈 có bộ 女 (nữ) bên trái.",
              "ex": {
                "en": "妈妈 在 家。",
                "vi": "Mẹ ở nhà."
              }
            },
            {
              "t": "vocab",
              "en": "哥哥",
              "vi": "anh trai",
              "pos": "Danh từ",
              "ipa": "gēgē",
              "pic": "brother",
              "note": "Tiếng Trung phân biệt anh/em rõ như tiếng Việt: 哥哥 anh, 弟弟 em trai.",
              "ex": {
                "en": "我 有 一 个 哥哥。",
                "vi": "Tôi có một anh trai."
              }
            },
            {
              "t": "vocab",
              "en": "姐姐",
              "vi": "chị gái",
              "pos": "Danh từ",
              "ipa": "jiějiě",
              "pic": "sister",
              "note": "Em gái là 妹妹. Đây là chỗ tiếng Trung giống tiếng Việt mà khác hẳn tiếng Anh.",
              "ex": {
                "en": "姐姐 很 漂亮。",
                "vi": "Chị tôi xinh lắm."
              }
            },
            {
              "t": "vocab",
              "en": "孩子",
              "vi": "đứa trẻ, con",
              "pos": "Danh từ",
              "ipa": "háizi",
              "note": "Hán-Việt là “hài tử”, cùng gốc với “hài nhi”.",
              "ex": {
                "en": "他们 有 两 个 孩子。",
                "vi": "Họ có hai đứa con."
              }
            },
            {
              "t": "vocab",
              "en": "的",
              "vi": "của",
              "pos": "Trợ từ",
              "ipa": "de",
              "note": "Chữ hay gặp nhất tiếng Trung. Đọc thanh nhẹ, lướt qua gần như không nghe thấy.",
              "ex": {
                "en": "这 是 我 的 书。",
                "vi": "Đây là sách của tôi."
              }
            },
            {
              "t": "vocab",
              "en": "有",
              "vi": "có",
              "pos": "Động từ",
              "ipa": "yǒu",
              "note": "Hán-Việt là “hữu”. Phủ định của 有 là 没有, KHÔNG phải 不有 — chỗ này là ngoại lệ duy nhất.",
              "ex": {
                "en": "我 有 一 个 妹妹。",
                "vi": "Tôi có một em gái."
              }
            },
            {
              "t": "grammar",
              "title": "的 — người sở hữu đứng TRƯỚC",
              "body": "Ngược hẳn tiếng Việt về thứ tự. Tiếng Việt: “sách CỦA tôi”. Tiếng Trung: “tôi ĐÍCH sách”.",
              "rows": [
                [
                  "Tiếng Việt",
                  "sách của tôi",
                  "vật trước, người sau"
                ],
                [
                  "Tiếng Trung",
                  "我 的 书",
                  "người trước, vật sau"
                ],
                [
                  "Bỏ được 的",
                  "我 妈妈 / 我 家",
                  "người thân và nhà cửa thì bỏ cho tự nhiên"
                ],
                [
                  "Không bỏ được",
                  "我 的 书",
                  "đồ vật thì phải giữ 的"
                ],
                [
                  "Phủ định 有",
                  "我 没有 弟弟。",
                  "Tôi không có em trai. (không nói 不有)"
                ]
              ],
              "tip": "Mẹo: quan hệ càng gần thì càng hay bỏ 的. 我妈妈 nghe thân hơn 我的妈妈."
            }
          ],
          "sentences": [
            {
              "en": "我 家 有 四 口 人",
              "vi": "Nhà tôi có bốn người"
            },
            {
              "en": "这 是 我 的 书",
              "vi": "Đây là sách của tôi"
            },
            {
              "en": "我 没有 弟弟",
              "vi": "Tôi không có em trai"
            }
          ]
        },
        {
          "id": "z1u2l2",
          "title": "Miêu tả người",
          "goal": "Tính từ và cách khen chê.",
          "teach": [
            {
              "t": "intro",
              "title": "Tính từ đứng TRƯỚC danh từ — ngược tiếng Việt",
              "body": "Đây là chỗ người Việt hay nhầm nhất. Tiếng Việt nói “nhà đẹp”, tiếng Trung nói “đẹp nhà” — 漂亮的房子.",
              "bullets": [
                "Tính từ đứng trước",
                "的 nối tính từ với danh từ",
                "Tính từ hay dùng"
              ]
            },
            {
              "t": "vocab",
              "en": "高",
              "vi": "cao",
              "pos": "Tính từ",
              "ipa": "gāo",
              "pic": "tall",
              "note": "Hán-Việt là “cao”, đọc gāo — gần y hệt tiếng Việt.",
              "ex": {
                "en": "他 很 高。",
                "vi": "Anh ấy cao."
              }
            },
            {
              "t": "vocab",
              "en": "漂亮",
              "vi": "đẹp, xinh",
              "pos": "Tính từ",
              "ipa": "piàoliàng",
              "pic": "beautiful",
              "note": "Dùng cho người và vật. Khen đàn ông đẹp trai thì dùng 帅 (soái).",
              "ex": {
                "en": "这 个 房子 很 漂亮。",
                "vi": "Ngôi nhà này đẹp."
              }
            },
            {
              "t": "vocab",
              "en": "聪明",
              "vi": "thông minh",
              "pos": "Tính từ",
              "ipa": "cōngmíng",
              "pic": "clever",
              "note": "Hán-Việt đúng là “thông minh”! 聪 là thông, 明 là minh.",
              "ex": {
                "en": "这 个 孩子 很 聪明。",
                "vi": "Đứa bé này thông minh."
              }
            },
            {
              "t": "vocab",
              "en": "年轻",
              "vi": "trẻ",
              "pos": "Tính từ",
              "ipa": "niánqīng",
              "pic": "young",
              "note": "Hán-Việt là “niên khinh” — tuổi nhẹ. Trái nghĩa là 老 (lão).",
              "ex": {
                "en": "他 还 很 年轻。",
                "vi": "Anh ấy còn trẻ lắm."
              }
            },
            {
              "t": "vocab",
              "en": "胖",
              "vi": "béo",
              "pos": "Tính từ",
              "ipa": "pàng",
              "note": "Ở Trung Quốc nói ai béo không nhất thiết là chê, nhưng vẫn nên tránh. Trái nghĩa là 瘦 (gầy).",
              "ex": {
                "en": "他 有点儿 胖。",
                "vi": "Anh ấy hơi béo."
              }
            },
            {
              "t": "vocab",
              "en": "朋友",
              "vi": "bạn bè",
              "pos": "Danh từ",
              "ipa": "péngyǒu",
              "pic": "friend",
              "note": "Hán-Việt là “bằng hữu”! Cùng gốc với “bạn bè” trong tiếng Việt trang trọng.",
              "ex": {
                "en": "他 是 我 的 好 朋友。",
                "vi": "Anh ấy là bạn thân của tôi."
              }
            },
            {
              "t": "vocab",
              "en": "喜欢",
              "vi": "thích",
              "pos": "Động từ",
              "ipa": "xǐhuān",
              "note": "Hán-Việt là “hỉ hoan”. Sau 喜欢 có thể là danh từ hoặc cả một động từ.",
              "ex": {
                "en": "我 喜欢 中文。",
                "vi": "Tôi thích tiếng Trung."
              }
            },
            {
              "t": "vocab",
              "en": "房子",
              "vi": "ngôi nhà",
              "pos": "Danh từ",
              "ipa": "fángzi",
              "pic": "house",
              "note": "Hán-Việt là “phòng tử”. 房 là phòng, cùng gốc với “phòng ốc”.",
              "ex": {
                "en": "这 个 房子 很 大。",
                "vi": "Ngôi nhà này to."
              }
            },
            {
              "t": "grammar",
              "title": "Tính từ bổ nghĩa: 的 nối vào",
              "body": "Tính từ đứng trước danh từ, và thường có 的 ở giữa. Tính từ một chữ thì hay bỏ 的.",
              "rows": [
                [
                  "Tiếng Việt",
                  "ngôi nhà đẹp",
                  "danh từ trước"
                ],
                [
                  "Tiếng Trung",
                  "漂亮 的 房子",
                  "tính từ trước, có 的"
                ],
                [
                  "Tính từ một chữ",
                  "好 朋友",
                  "bỏ 的 cho gọn"
                ],
                [
                  "Làm vị ngữ thì khác",
                  "这 个 房子 很 漂亮。",
                  "lúc này KHÔNG có 的"
                ]
              ],
              "tip": "Phân biệt: 漂亮的房子 là “ngôi nhà đẹp” (một cụm danh từ). 房子很漂亮 là “ngôi nhà thì đẹp” (một câu trọn)."
            }
          ],
          "sentences": [
            {
              "en": "他 是 我 的 好 朋友",
              "vi": "Anh ấy là bạn thân của tôi"
            },
            {
              "en": "这 个 孩子 很 聪明",
              "vi": "Đứa bé này rất thông minh"
            },
            {
              "en": "我 很 喜欢 这 个 房子",
              "vi": "Tôi rất thích ngôi nhà này"
            }
          ]
        },
        {
          "id": "z1u2l3",
          "title": "Đếm người và vật",
          "goal": "Lượng từ — chỗ tiếng Việt và tiếng Trung giống nhau lạ thường.",
          "teach": [
            {
              "t": "intro",
              "title": "Loại từ tiếng Việt chính là lượng từ tiếng Trung",
              "body": "“Một CON mèo”, “một CÁI bàn”, “một QUẢ táo” — tiếng Trung cũng đúng như thế: 一只猫, 一张桌子, 一个苹果. Người Âu Mỹ vật vã với chỗ này; bạn thì đã quen từ bé.",
              "bullets": [
                "Số + lượng từ + danh từ",
                "个 dùng được gần hết",
                "Vài lượng từ hay gặp"
              ]
            },
            {
              "t": "vocab",
              "en": "个",
              "vi": "cái, chiếc (lượng từ chung)",
              "pos": "Lượng từ",
              "ipa": "gè",
              "note": "Lượng từ vạn năng. Không nhớ dùng chữ nào thì dùng 个, chín phần mười là đúng.",
              "ex": {
                "en": "一 个 人",
                "vi": "một người"
              }
            },
            {
              "t": "vocab",
              "en": "口",
              "vi": "khẩu (đếm nhân khẩu)",
              "pos": "Lượng từ",
              "ipa": "kǒu",
              "note": "Chỉ dùng đếm người trong nhà — đúng chữ “khẩu” trong “nhân khẩu”.",
              "ex": {
                "en": "我 家 有 五 口 人。",
                "vi": "Nhà tôi có năm nhân khẩu."
              }
            },
            {
              "t": "vocab",
              "en": "只",
              "vi": "con (đếm con vật)",
              "pos": "Lượng từ",
              "ipa": "zhǐ",
              "pic": "cat",
              "note": "Đúng bằng chữ “con” tiếng Việt. 一只猫 = một con mèo.",
              "ex": {
                "en": "一 只 猫",
                "vi": "một con mèo"
              }
            },
            {
              "t": "vocab",
              "en": "本",
              "vi": "quyển (đếm sách)",
              "pos": "Lượng từ",
              "ipa": "běn",
              "pic": "book",
              "note": "Hán-Việt là “bản”. 一本书 = một quyển sách.",
              "ex": {
                "en": "两 本 书",
                "vi": "hai quyển sách"
              }
            },
            {
              "t": "vocab",
              "en": "两",
              "vi": "hai (khi đếm)",
              "pos": "Số từ",
              "ipa": "liǎng",
              "note": "Đếm đồ vật thì dùng 两 chứ không dùng 二. 两个人 chứ không nói 二个人.",
              "ex": {
                "en": "两 个 学生",
                "vi": "hai học sinh"
              }
            },
            {
              "t": "vocab",
              "en": "几",
              "vi": "mấy",
              "pos": "Đại từ",
              "ipa": "jǐ",
              "note": "Hỏi số lượng nhỏ, dưới mười. Trên mười thì dùng 多少.",
              "ex": {
                "en": "你 家 有 几 口 人？",
                "vi": "Nhà bạn có mấy người?"
              }
            },
            {
              "t": "vocab",
              "en": "多少",
              "vi": "bao nhiêu",
              "pos": "Đại từ",
              "ipa": "duōshǎo",
              "note": "Hán-Việt là “đa thiểu” — nhiều ít. Hỏi số lượng lớn hoặc giá tiền.",
              "ex": {
                "en": "这 个 多少 钱？",
                "vi": "Cái này bao nhiêu tiền?"
              }
            },
            {
              "t": "vocab",
              "en": "岁",
              "vi": "tuổi",
              "pos": "Danh từ",
              "ipa": "suì",
              "note": "Hán-Việt là “tuế”, cùng gốc với “tuổi”. Hỏi tuổi: 你多大？",
              "ex": {
                "en": "他 today 二十 岁。",
                "vi": "Anh ấy hai mươi tuổi."
              }
            },
            {
              "t": "grammar",
              "title": "Số + lượng từ + danh từ — không được bỏ lượng từ",
              "body": "Y như tiếng Việt: không ai nói “ba mèo”, phải nói “ba CON mèo”. Tiếng Trung cũng vậy, và cũng bắt buộc.",
              "rows": [
                [
                  "Sai",
                  "三 猫",
                  "thiếu lượng từ"
                ],
                [
                  "Đúng",
                  "三 只 猫",
                  "ba con mèo"
                ],
                [
                  "Người",
                  "四 个 学生",
                  "bốn học sinh"
                ],
                [
                  "Nhân khẩu",
                  "五 口 人",
                  "năm nhân khẩu"
                ],
                [
                  "Hai",
                  "两 本 书",
                  "hai quyển sách — dùng 两 không dùng 二"
                ]
              ],
              "tip": "Chưa chắc dùng lượng từ nào thì cứ 个. Người Trung Quốc vẫn hiểu và cũng không thấy chối tai."
            },
            {
              "t": "culture",
              "title": "二 hay 两 — một chỗ nhỏ mà sai là lộ ngay",
              "body": "二 dùng khi đọc số: số điện thoại, số nhà, phép tính, và số thứ tự (第二 = thứ hai). 两 dùng khi ĐẾM đồ vật, luôn đi kèm lượng từ. Nói “hai giờ” là 两点, nhưng “tháng Hai” là 二月. Quy tắc gọn: có lượng từ phía sau thì dùng 两, không thì dùng 二."
            }
          ],
          "sentences": [
            {
              "en": "我 家 有 五 口 人",
              "vi": "Nhà tôi có năm người"
            },
            {
              "en": "我 有 两 只 猫",
              "vi": "Tôi có hai con mèo"
            },
            {
              "en": "你 家 有 几 口 人",
              "vi": "Nhà bạn có mấy người"
            }
          ]
        },
        {
          "id": "z1u2c",
          "title": "Ôn tập chương 2",
          "goal": "Ôn lại cả chương gia đình.",
          "checkpoint": true
        }
      ]
    },
    {
      "id": "z1u3",
      "title": "Ăn uống",
      "goal": "Gọi món, nói thích ăn gì và dùng 想 / 要.",
      "lessons": [
        {
          "id": "z1u3l1",
          "title": "Món ăn",
          "goal": "Từ vựng đồ ăn và động từ 吃.",
          "teach": [
            {
              "t": "intro",
              "title": "吃饭 — ăn cơm, y hệt tiếng Việt",
              "body": "Tiếng Trung cũng nói “ăn cơm” để chỉ ăn một bữa, dù bữa đó có cơm hay không — giống hệt tiếng Việt. Hai nền văn hoá cùng lấy cơm làm gốc.",
              "bullets": [
                "吃 và 喝",
                "Món ăn hay gặp",
                "Nói thích ăn gì"
              ]
            },
            {
              "t": "vocab",
              "en": "吃",
              "vi": "ăn",
              "pos": "Động từ",
              "ipa": "chī",
              "pic": "eat",
              "note": "Bộ 口 (khẩu — miệng) bên trái. Hầu hết chữ liên quan tới miệng đều có bộ này.",
              "ex": {
                "en": "我 想 吃 面。",
                "vi": "Tôi muốn ăn mì."
              }
            },
            {
              "t": "vocab",
              "en": "饭",
              "vi": "cơm, bữa cơm",
              "pos": "Danh từ",
              "ipa": "fàn",
              "pic": "rice",
              "note": "Hán-Việt là “phạn”, cùng gốc với “cơm phạn” trong nhà chùa. 吃饭 = ăn cơm.",
              "ex": {
                "en": "我们 一起 吃饭 吧。",
                "vi": "Chúng ta cùng ăn cơm nhé."
              }
            },
            {
              "t": "vocab",
              "en": "面",
              "vi": "mì",
              "pos": "Danh từ",
              "ipa": "miàn",
              "note": "Hán-Việt là “miến”. Chữ này cũng có nghĩa là mặt, mặt phẳng.",
              "ex": {
                "en": "我 喜欢 吃 面。",
                "vi": "Tôi thích ăn mì."
              }
            },
            {
              "t": "vocab",
              "en": "肉",
              "vi": "thịt",
              "pos": "Danh từ",
              "ipa": "ròu",
              "pic": "meat",
              "note": "Hán-Việt là “nhục”, cùng gốc với “nhục” trong “bì nhục”.",
              "ex": {
                "en": "我 不 吃 肉。",
                "vi": "Tôi không ăn thịt."
              }
            },
            {
              "t": "vocab",
              "en": "鱼",
              "vi": "cá",
              "pos": "Danh từ",
              "ipa": "yú",
              "pic": "fish",
              "note": "Hán-Việt là “ngư”. Chữ tượng hình, ngày xưa vẽ hình con cá.",
              "ex": {
                "en": "这 个 鱼 很 好吃。",
                "vi": "Con cá này ngon."
              }
            },
            {
              "t": "vocab",
              "en": "鸡蛋",
              "vi": "trứng gà",
              "pos": "Danh từ",
              "ipa": "jīdàn",
              "pic": "egg",
              "note": "鸡 là kê (gà), 蛋 là đản (trứng). Hán-Việt “kê đản”.",
              "ex": {
                "en": "我 每天 吃 一 个 鸡蛋。",
                "vi": "Ngày nào tôi cũng ăn một quả trứng."
              }
            },
            {
              "t": "vocab",
              "en": "好吃",
              "vi": "ngon",
              "pos": "Tính từ",
              "ipa": "hǎochī",
              "pic": "delicious",
              "note": "Nghĩa đen “dễ ăn”. Đồ uống ngon thì nói 好喝 (dễ uống).",
              "ex": {
                "en": "这 个 菜 很 好吃。",
                "vi": "Món này ngon lắm."
              }
            },
            {
              "t": "vocab",
              "en": "菜",
              "vi": "món ăn, rau",
              "pos": "Danh từ",
              "ipa": "cài",
              "pic": "vegetable",
              "note": "Hán-Việt là “thái”. Vừa nghĩa là rau, vừa là món ăn nói chung.",
              "ex": {
                "en": "你 想 点 什么 菜？",
                "vi": "Bạn muốn gọi món gì?"
              }
            },
            {
              "t": "grammar",
              "title": "想 và 要 — muốn",
              "body": "想 nhẹ hơn, là “muốn, định”. 要 mạnh hơn, là “cần, đòi”. Gọi món ở quán thì dùng 要.",
              "rows": [
                [
                  "想 + động từ",
                  "我 想 吃 面。",
                  "Tôi muốn ăn mì."
                ],
                [
                  "要 + danh từ",
                  "我 要 一 碗 面。",
                  "Cho tôi một bát mì."
                ],
                [
                  "Phủ định 想",
                  "我 不 想 吃。",
                  "Tôi không muốn ăn."
                ],
                [
                  "Phủ định 要",
                  "我 不 要 肉。",
                  "Tôi không lấy thịt."
                ]
              ],
              "tip": "Lưu ý: 不要 nói với người khác nghĩa là “đừng”. 不要走！= Đừng đi!"
            }
          ],
          "sentences": [
            {
              "en": "我 想 吃 面",
              "vi": "Tôi muốn ăn mì"
            },
            {
              "en": "这 个 菜 很 好吃",
              "vi": "Món này rất ngon"
            },
            {
              "en": "我 不 吃 肉",
              "vi": "Tôi không ăn thịt"
            }
          ]
        },
        {
          "id": "z1u3l2",
          "title": "Đồ uống",
          "goal": "Động từ 喝 và lượng từ cho đồ uống.",
          "teach": [
            {
              "t": "intro",
              "title": "Trà — chỗ hai nền văn hoá gặp nhau",
              "body": "茶 đọc là chá, chính là chữ “trà” tiếng Việt. Mời trà là nghi thức mở đầu mọi cuộc gặp ở cả hai nước.",
              "bullets": [
                "喝 = uống",
                "杯 và 瓶",
                "Mời và từ chối"
              ]
            },
            {
              "t": "vocab",
              "en": "喝",
              "vi": "uống",
              "pos": "Động từ",
              "ipa": "hē",
              "pic": "drink",
              "note": "Cũng có bộ 口 bên trái. Đừng lẫn với 渴 (khát) — nhìn gần giống nhau.",
              "ex": {
                "en": "你 想 喝 什么？",
                "vi": "Bạn muốn uống gì?"
              }
            },
            {
              "t": "vocab",
              "en": "水",
              "vi": "nước",
              "pos": "Danh từ",
              "ipa": "shuǐ",
              "pic": "water",
              "note": "Hán-Việt là “thuỷ”. Chữ tượng hình, vẽ dòng nước chảy.",
              "ex": {
                "en": "我 要 一 杯 水。",
                "vi": "Cho tôi một cốc nước."
              }
            },
            {
              "t": "vocab",
              "en": "茶",
              "vi": "trà",
              "pos": "Danh từ",
              "ipa": "chá",
              "pic": "tea",
              "note": "Đúng chữ “trà” tiếng Việt. Bên trên là bộ 艹 (thảo — cỏ cây).",
              "ex": {
                "en": "中国 茶 很 有名。",
                "vi": "Trà Trung Quốc rất nổi tiếng."
              }
            },
            {
              "t": "vocab",
              "en": "咖啡",
              "vi": "cà phê",
              "pos": "Danh từ",
              "ipa": "kāfēi",
              "pic": "coffee",
              "note": "Phiên âm từ tiếng nước ngoài, đọc kāfēi. Cả hai chữ đều có bộ 口.",
              "ex": {
                "en": "我 每天 喝 咖啡。",
                "vi": "Ngày nào tôi cũng uống cà phê."
              }
            },
            {
              "t": "vocab",
              "en": "牛奶",
              "vi": "sữa bò",
              "pos": "Danh từ",
              "ipa": "niúnǎi",
              "pic": "milk",
              "note": "牛 là ngưu (bò), 奶 là nãi (sữa). Hán-Việt “ngưu nãi”.",
              "ex": {
                "en": "孩子 要 喝 牛奶。",
                "vi": "Trẻ con cần uống sữa."
              }
            },
            {
              "t": "vocab",
              "en": "杯",
              "vi": "cốc, ly (lượng từ)",
              "pos": "Lượng từ",
              "ipa": "bēi",
              "note": "Hán-Việt là “bôi”, cùng gốc với “cạn bôi”. 一杯茶 = một cốc trà.",
              "ex": {
                "en": "两 杯 咖啡",
                "vi": "hai cốc cà phê"
              }
            },
            {
              "t": "vocab",
              "en": "瓶",
              "vi": "chai (lượng từ)",
              "pos": "Lượng từ",
              "ipa": "píng",
              "note": "Hán-Việt là “bình”. 一瓶水 = một chai nước.",
              "ex": {
                "en": "一 瓶 水",
                "vi": "một chai nước"
              }
            },
            {
              "t": "vocab",
              "en": "请",
              "vi": "mời, xin",
              "pos": "Động từ",
              "ipa": "qǐng",
              "note": "Hán-Việt là “thỉnh”. Đặt đầu câu là lời mời lịch sự: 请进 (mời vào), 请坐 (mời ngồi).",
              "ex": {
                "en": "请 喝 茶。",
                "vi": "Mời uống trà."
              }
            },
            {
              "t": "grammar",
              "title": "Gọi đồ: 我要 + số + lượng từ + món",
              "body": "Một khuôn dùng được ở mọi quán ăn Trung Quốc.",
              "rows": [
                [
                  "Khuôn",
                  "我 要 一 杯 咖啡。",
                  "Cho tôi một cốc cà phê."
                ],
                [
                  "Hai thứ",
                  "我 要 一 碗 面 和 一 杯 茶。",
                  "Cho tôi một bát mì và một cốc trà."
                ],
                [
                  "Lịch sự hơn",
                  "请 给 我 一 杯 水。",
                  "Làm ơn cho tôi cốc nước."
                ],
                [
                  "Hỏi người khác",
                  "你 要 什么？",
                  "Bạn muốn gì?"
                ]
              ],
              "tip": "和 nghĩa là “và”, chỉ nối DANH TỪ. Nối hai mệnh đề thì không dùng 和."
            },
            {
              "t": "culture",
              "title": "Rót trà cho người khác trước",
              "body": "Ở bàn trà Trung Quốc, người trẻ nhất rót cho cả bàn, rót cho mình sau cùng — y như tục lệ Việt Nam. Khi người khác rót cho mình, gõ nhẹ hai ngón tay xuống bàn là lời cảm ơn không lời. Ly trà rót cho khách chỉ nên đầy bảy phần; rót đầy tràn bị coi là ý đuổi khách."
            }
          ],
          "sentences": [
            {
              "en": "我 要 一 杯 咖啡",
              "vi": "Cho tôi một cốc cà phê"
            },
            {
              "en": "请 喝 茶",
              "vi": "Mời uống trà"
            },
            {
              "en": "你 想 喝 什么",
              "vi": "Bạn muốn uống gì"
            }
          ]
        },
        {
          "id": "z1u3c",
          "title": "Ôn tập chương 3",
          "goal": "Ôn lại cả chương ăn uống.",
          "checkpoint": true
        }
      ]
    },
    {
      "id": "z1u4",
      "title": "Đời sống hằng ngày",
      "goal": "Xem giờ, kể việc trong ngày và dùng 了.",
      "lessons": [
        {
          "id": "z1u4l1",
          "title": "Xem giờ",
          "goal": "Nói giờ và đặt trạng ngữ thời gian đúng chỗ.",
          "teach": [
            {
              "t": "intro",
              "title": "Chỗ người Việt hay sai nhất",
              "body": "Tiếng Việt nói “Tôi đi làm lúc bảy giờ” — thời gian ở CUỐI. Tiếng Trung bắt buộc thời gian đứng TRƯỚC động từ: 我七点去上班. Sai chỗ này là câu nghe lạ ngay.",
              "bullets": [
                "点 và 分",
                "Thời gian đứng trước động từ",
                "Buổi trong ngày"
              ]
            },
            {
              "t": "vocab",
              "en": "点",
              "vi": "giờ",
              "pos": "Danh từ",
              "ipa": "diǎn",
              "note": "Hán-Việt là “điểm”. 两点 = hai giờ (dùng 两 không dùng 二).",
              "ex": {
                "en": "现在 三 点。",
                "vi": "Bây giờ ba giờ."
              }
            },
            {
              "t": "vocab",
              "en": "分",
              "vi": "phút",
              "pos": "Danh từ",
              "ipa": "fēn",
              "note": "Hán-Việt là “phân”. 三点十分 = ba giờ mười phút.",
              "ex": {
                "en": "五 点 十 分",
                "vi": "năm giờ mười phút"
              }
            },
            {
              "t": "vocab",
              "en": "半",
              "vi": "rưỡi",
              "pos": "Danh từ",
              "ipa": "bàn",
              "note": "Hán-Việt là “bán”, cùng gốc với “bán cầu”. 八点半 = tám giờ rưỡi.",
              "ex": {
                "en": "七 点 半 起床。",
                "vi": "Bảy giờ rưỡi dậy."
              }
            },
            {
              "t": "vocab",
              "en": "现在",
              "vi": "bây giờ",
              "pos": "Danh từ",
              "ipa": "xiànzài",
              "note": "Hán-Việt đúng là “hiện tại”.",
              "ex": {
                "en": "现在 几 点？",
                "vi": "Bây giờ mấy giờ?"
              }
            },
            {
              "t": "vocab",
              "en": "今天",
              "vi": "hôm nay",
              "pos": "Danh từ",
              "ipa": "jīntiān",
              "pic": "today",
              "note": "Hán-Việt là “kim thiên”. 明天 mai, 昨天 hôm qua.",
              "ex": {
                "en": "今天 是 星期一。",
                "vi": "Hôm nay là thứ Hai."
              }
            },
            {
              "t": "vocab",
              "en": "早上",
              "vi": "buổi sáng",
              "pos": "Danh từ",
              "ipa": "zǎoshàng",
              "pic": "morning",
              "note": "Hán-Việt “tảo thượng”. 中午 trưa, 下午 chiều, 晚上 tối.",
              "ex": {
                "en": "早上 六 点 起床。",
                "vi": "Sáng sáu giờ dậy."
              }
            },
            {
              "t": "vocab",
              "en": "起床",
              "vi": "thức dậy",
              "pos": "Động từ",
              "ipa": "qǐchuáng",
              "note": "Nghĩa đen “rời giường”. 起 là khởi, 床 là sàng (giường).",
              "ex": {
                "en": "我 六 点 起床。",
                "vi": "Tôi dậy lúc sáu giờ."
              }
            },
            {
              "t": "vocab",
              "en": "睡觉",
              "vi": "đi ngủ",
              "pos": "Động từ",
              "ipa": "shuìjiào",
              "pic": "sleep",
              "note": "Hán-Việt là “thuỵ giác”. 睡 là thuỵ (ngủ).",
              "ex": {
                "en": "我 十一 点 睡觉。",
                "vi": "Tôi mười một giờ đi ngủ."
              }
            },
            {
              "t": "grammar",
              "title": "Thời gian đứng TRƯỚC động từ",
              "body": "Đây là khác biệt lớn nhất về trật tự câu giữa tiếng Việt và tiếng Trung. Nhớ được chỗ này là câu nghe chuẩn hẳn.",
              "rows": [
                [
                  "Tiếng Việt",
                  "Tôi dậy lúc sáu giờ.",
                  "thời gian ở cuối"
                ],
                [
                  "Tiếng Trung",
                  "我 六 点 起床。",
                  "thời gian trước động từ"
                ],
                [
                  "SAI",
                  "我 起床 六 点。",
                  "nghe rất lạ"
                ],
                [
                  "Đứng đầu câu cũng được",
                  "六 点 我 起床。",
                  "nhấn vào thời gian"
                ],
                [
                  "Hỏi giờ",
                  "现在 几 点？",
                  "Bây giờ mấy giờ?"
                ]
              ],
              "tip": "Quy tắc chung: trong tiếng Trung, mọi trạng ngữ — thời gian, nơi chốn, cách thức — đều đứng TRƯỚC động từ."
            }
          ],
          "sentences": [
            {
              "en": "现在 几 点",
              "vi": "Bây giờ mấy giờ"
            },
            {
              "en": "我 六 点 半 起床",
              "vi": "Tôi dậy lúc sáu giờ rưỡi"
            },
            {
              "en": "今天 我 很 忙",
              "vi": "Hôm nay tôi rất bận"
            }
          ]
        },
        {
          "id": "z1u4l2",
          "title": "Việc trong ngày",
          "goal": "Trợ từ 了 — việc đã xong.",
          "teach": [
            {
              "t": "intro",
              "title": "了 chính là chữ “rồi” của tiếng Việt",
              "body": "Tiếng Trung không chia động từ, y như tiếng Việt. Muốn nói việc đã xong thì thêm 了 — đúng vai trò chữ “rồi”.",
              "bullets": [
                "了 sau động từ",
                "了 cuối câu",
                "Phủ định thì bỏ 了"
              ]
            },
            {
              "t": "vocab",
              "en": "去",
              "vi": "đi",
              "pos": "Động từ",
              "ipa": "qù",
              "pic": "go",
              "note": "Hán-Việt là “khứ”, cùng gốc với “khứ hồi”.",
              "ex": {
                "en": "我 去 学校。",
                "vi": "Tôi đi đến trường."
              }
            },
            {
              "t": "vocab",
              "en": "来",
              "vi": "đến",
              "pos": "Động từ",
              "ipa": "lái",
              "note": "Hán-Việt là “lai”, cùng gốc với “vãng lai”. Trái nghĩa với 去.",
              "ex": {
                "en": "他 来 我 家。",
                "vi": "Anh ấy đến nhà tôi."
              }
            },
            {
              "t": "vocab",
              "en": "工作",
              "vi": "làm việc",
              "pos": "Động từ",
              "ipa": "gōngzuò",
              "pic": "work",
              "note": "Hán-Việt đúng là “công tác”! Vừa là động từ vừa là danh từ (công việc).",
              "ex": {
                "en": "我 在 银行 工作。",
                "vi": "Tôi làm ở ngân hàng."
              }
            },
            {
              "t": "vocab",
              "en": "学习",
              "vi": "học",
              "pos": "Động từ",
              "ipa": "xuéxí",
              "pic": "study",
              "note": "Hán-Việt là “học tập”.",
              "ex": {
                "en": "我 学习 中文。",
                "vi": "Tôi học tiếng Trung."
              }
            },
            {
              "t": "vocab",
              "en": "学校",
              "vi": "trường học",
              "pos": "Danh từ",
              "ipa": "xuéxiào",
              "pic": "school",
              "note": "Hán-Việt đúng là “học hiệu”, tức trường.",
              "ex": {
                "en": "我 的 学校 很 大。",
                "vi": "Trường tôi rất to."
              }
            },
            {
              "t": "vocab",
              "en": "看",
              "vi": "xem, nhìn",
              "pos": "Động từ",
              "ipa": "kàn",
              "note": "Chữ tượng hình: bàn tay 手 che trên con mắt 目 — đưa tay che nắng để nhìn.",
              "ex": {
                "en": "我 喜欢 看 书。",
                "vi": "Tôi thích đọc sách."
              }
            },
            {
              "t": "vocab",
              "en": "了",
              "vi": "rồi (đã xong)",
              "pos": "Trợ từ",
              "ipa": "le",
              "note": "Đọc thanh nhẹ le. Đây là chữ khó nhất tiếng Trung cơ bản, nhưng người Việt hiểu nhanh vì có chữ “rồi”.",
              "ex": {
                "en": "我 吃 了。",
                "vi": "Tôi ăn rồi."
              }
            },
            {
              "t": "vocab",
              "en": "没有",
              "vi": "chưa, không có",
              "pos": "Trạng từ",
              "ipa": "méiyǒu",
              "note": "Phủ định việc đã qua. Nói tắt là 没.",
              "ex": {
                "en": "我 没有 吃。",
                "vi": "Tôi chưa ăn."
              }
            },
            {
              "t": "grammar",
              "title": "了 và 没有 — việc đã xong hay chưa",
              "body": "Điều quan trọng nhất: câu có 没有 thì BỎ 了. Giống tiếng Việt — “tôi chưa ăn rồi” là câu vô nghĩa.",
              "rows": [
                [
                  "Đã xong",
                  "我 吃 了。",
                  "Tôi ăn rồi."
                ],
                [
                  "Chưa",
                  "我 没有 吃。",
                  "Tôi chưa ăn."
                ],
                [
                  "SAI",
                  "我 没有 吃 了。",
                  "có 没有 thì bỏ 了"
                ],
                [
                  "Hỏi",
                  "你 吃 了 吗？",
                  "Bạn ăn chưa?"
                ],
                [
                  "Đáp ngắn",
                  "吃 了。/ 没有。",
                  "Rồi. / Chưa."
                ]
              ],
              "tip": "了 KHÔNG phải là thì quá khứ. Nó chỉ báo việc đã HOÀN THÀNH — việc mai mới làm cũng dùng được: 明天我吃了饭就去."
            },
            {
              "t": "dialogue",
              "title": "Hỏi nhau buổi trưa",
              "lines": [
                {
                  "who": "A",
                  "en": "你 吃 饭 了 吗？",
                  "vi": "Bạn ăn cơm chưa?"
                },
                {
                  "who": "B",
                  "en": "还 没有。你 呢？",
                  "vi": "Chưa. Còn bạn?"
                },
                {
                  "who": "A",
                  "en": "我 吃 了。一起 去 吧。",
                  "vi": "Tôi ăn rồi. Cùng đi nhé."
                },
                {
                  "who": "B",
                  "en": "好，谢谢 你。",
                  "vi": "Được, cảm ơn bạn."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "我 吃 饭 了",
              "vi": "Tôi ăn cơm rồi"
            },
            {
              "en": "他 去 学校 了",
              "vi": "Anh ấy đi học rồi"
            },
            {
              "en": "我 没有 看 这 本 书",
              "vi": "Tôi chưa đọc quyển sách này"
            }
          ]
        },
        {
          "id": "z1u4c",
          "title": "Ôn tập chương 4",
          "goal": "Ôn lại cả chương đời sống.",
          "checkpoint": true
        }
      ]
    },
    {
      "id": "z1u5",
      "title": "Số đếm & Mua sắm",
      "goal": "Đếm tới 100, hỏi giá và mặc cả.",
      "lessons": [
        {
          "id": "z1u5l1",
          "title": "Số đếm 1–100",
          "goal": "Hệ đếm tiếng Trung — gọn gàng và có quy luật.",
          "teach": [
            {
              "t": "intro",
              "title": "Đếm tiếng Trung dễ hơn tiếng Việt",
              "body": "Học mười chữ số đầu là đếm được tới 99, không có ngoại lệ nào. Tiếng Việt còn phải nhớ “mười lăm”, “hai mươi mốt”; tiếng Trung thì không.",
              "bullets": [
                "Mười chữ số đầu",
                "Ghép số trên 10",
                "百 = trăm"
              ]
            },
            {
              "t": "vocab",
              "en": "一",
              "vi": "một",
              "pos": "Số từ",
              "ipa": "yī",
              "note": "Một nét ngang. Đọc yī, nhưng đổi thanh khi đứng trước từ khác — nghe quen dần là được.",
              "ex": {
                "en": "一 个 人",
                "vi": "một người"
              }
            },
            {
              "t": "vocab",
              "en": "二",
              "vi": "hai",
              "pos": "Số từ",
              "ipa": "èr",
              "note": "Hai nét ngang. Dùng khi đọc số; đếm đồ vật thì dùng 两.",
              "ex": {
                "en": "十 二",
                "vi": "mười hai"
              }
            },
            {
              "t": "vocab",
              "en": "三",
              "vi": "ba",
              "pos": "Số từ",
              "ipa": "sān",
              "note": "Ba nét ngang. Ba chữ đầu đều là số nét đúng bằng số.",
              "ex": {
                "en": "三 个 孩子",
                "vi": "ba đứa trẻ"
              }
            },
            {
              "t": "vocab",
              "en": "五",
              "vi": "năm",
              "pos": "Số từ",
              "ipa": "wǔ",
              "note": "Hán-Việt là “ngũ”, đọc wǔ. Gần với tiếng Việt.",
              "ex": {
                "en": "五 点",
                "vi": "năm giờ"
              }
            },
            {
              "t": "vocab",
              "en": "十",
              "vi": "mười",
              "pos": "Số từ",
              "ipa": "shí",
              "note": "Hán-Việt là “thập”, chữ hình dấu cộng.",
              "ex": {
                "en": "十 个",
                "vi": "mười cái"
              }
            },
            {
              "t": "vocab",
              "en": "百",
              "vi": "trăm",
              "pos": "Số từ",
              "ipa": "bǎi",
              "note": "Hán-Việt là “bách”, cùng gốc với “bách hoá”, “bách khoa”.",
              "ex": {
                "en": "一 百 块",
                "vi": "một trăm tệ"
              }
            },
            {
              "t": "vocab",
              "en": "零",
              "vi": "không (số 0)",
              "pos": "Số từ",
              "ipa": "líng",
              "note": "Hán-Việt là “linh”. Số điện thoại đọc từng chữ, số 0 đọc là líng.",
              "ex": {
                "en": "一 零 五",
                "vi": "một không năm"
              }
            },
            {
              "t": "vocab",
              "en": "号",
              "vi": "số, ngày",
              "pos": "Danh từ",
              "ipa": "hào",
              "note": "Hán-Việt là “hiệu”. Vừa là số nhà, vừa là ngày trong tháng.",
              "ex": {
                "en": "今天 五 号。",
                "vi": "Hôm nay ngày 5."
              }
            },
            {
              "t": "grammar",
              "title": "Ghép số — không có ngoại lệ",
              "body": "Số trên 10 ghép thẳng: mười-mấy, mấy-mươi-mấy. Đọc sao viết vậy.",
              "rows": [
                [
                  "11",
                  "十一",
                  "mười một"
                ],
                [
                  "15",
                  "十五",
                  "mười năm — không đổi âm như tiếng Việt"
                ],
                [
                  "20",
                  "二十",
                  "hai mươi"
                ],
                [
                  "21",
                  "二十一",
                  "hai mươi một — không thành “mốt”"
                ],
                [
                  "99",
                  "九十九",
                  "chín mươi chín"
                ],
                [
                  "100",
                  "一百",
                  "một trăm"
                ]
              ],
              "tip": "So với tiếng Việt: “mười lăm” và “hai mươi mốt” là ngoại lệ phải nhớ. Tiếng Trung không có ngoại lệ nào cả."
            }
          ],
          "sentences": [
            {
              "en": "今天 是 五 号",
              "vi": "Hôm nay là ngày 5"
            },
            {
              "en": "我 有 十 本 书",
              "vi": "Tôi có mười quyển sách"
            },
            {
              "en": "这 里 有 一 百 个 人",
              "vi": "Ở đây có một trăm người"
            }
          ]
        },
        {
          "id": "z1u5l2",
          "title": "Ở cửa hàng",
          "goal": "Hỏi giá, mặc cả và dùng 这 / 那.",
          "teach": [
            {
              "t": "intro",
              "title": "多少钱 — câu quan trọng nhất khi đi chợ",
              "body": "Hán-Việt là “đa thiểu tiền” — nhiều ít tiền. Học câu này trước mọi câu khác nếu bạn sắp sang Trung Quốc.",
              "bullets": [
                "多少钱",
                "这 và 那",
                "Mặc cả"
              ]
            },
            {
              "t": "vocab",
              "en": "钱",
              "vi": "tiền",
              "pos": "Danh từ",
              "ipa": "qián",
              "note": "Hán-Việt là “tiền” — đúng chữ tiếng Việt luôn. Bên trái là bộ 钅(kim — kim loại).",
              "ex": {
                "en": "这 个 多少 钱？",
                "vi": "Cái này bao nhiêu tiền?"
              }
            },
            {
              "t": "vocab",
              "en": "块",
              "vi": "tệ (đơn vị tiền)",
              "pos": "Lượng từ",
              "ipa": "kuài",
              "note": "Cách nói đời thường của 元. Người Trung Quốc nói 块 chứ ít nói 元.",
              "ex": {
                "en": "五十 块",
                "vi": "năm mươi tệ"
              }
            },
            {
              "t": "vocab",
              "en": "买",
              "vi": "mua",
              "pos": "Động từ",
              "ipa": "mǎi",
              "pic": "buy",
              "note": "Đừng lẫn với 卖 (bán) — chỉ khác một nét trên đầu. 买 mǎi thanh 3, 卖 mài thanh 4.",
              "ex": {
                "en": "我 想 买 一 件 衣服。",
                "vi": "Tôi muốn mua một cái áo."
              }
            },
            {
              "t": "vocab",
              "en": "卖",
              "vi": "bán",
              "pos": "Động từ",
              "ipa": "mài",
              "note": "Có thêm nét ngang trên đầu so với 买 — hình dung là người bán giơ tay lên mời chào.",
              "ex": {
                "en": "他们 卖 水果。",
                "vi": "Họ bán hoa quả."
              }
            },
            {
              "t": "vocab",
              "en": "这",
              "vi": "này, cái này",
              "pos": "Đại từ",
              "ipa": "zhè",
              "note": "Hán-Việt là “giá”. Chỉ vật ở gần. 这个 = cái này.",
              "ex": {
                "en": "这 个 很 便宜。",
                "vi": "Cái này rẻ."
              }
            },
            {
              "t": "vocab",
              "en": "那",
              "vi": "kia, cái kia",
              "pos": "Đại từ",
              "ipa": "nà",
              "note": "Hán-Việt là “na”. Chỉ vật ở xa. 那个 = cái kia.",
              "ex": {
                "en": "那 个 太 贵 了。",
                "vi": "Cái kia đắt quá."
              }
            },
            {
              "t": "vocab",
              "en": "贵",
              "vi": "đắt",
              "pos": "Tính từ",
              "ipa": "guì",
              "note": "Hán-Việt là “quý”, cùng gốc với “quý giá”. Đắt vì quý.",
              "ex": {
                "en": "太 贵 了！",
                "vi": "Đắt quá!"
              }
            },
            {
              "t": "vocab",
              "en": "便宜",
              "vi": "rẻ",
              "pos": "Tính từ",
              "ipa": "piányi",
              "note": "Hán-Việt là “tiện nghi”, nhưng nghĩa đã đổi thành “rẻ”. Đọc piányi, chữ 便 ở đây KHÔNG đọc biàn.",
              "ex": {
                "en": "这 个 很 便宜。",
                "vi": "Cái này rẻ."
              }
            },
            {
              "t": "grammar",
              "title": "太…了 — quá thể",
              "body": "Khuôn kẹp hai đầu, dùng để than. Rất hay gặp trong đời thường.",
              "rows": [
                [
                  "Khuôn",
                  "太 贵 了！",
                  "Đắt quá!"
                ],
                [
                  "Khen",
                  "太 好 了！",
                  "Tốt quá!"
                ],
                [
                  "Hỏi giá",
                  "这 个 多少 钱？",
                  "Cái này bao nhiêu tiền?"
                ],
                [
                  "Mặc cả",
                  "便宜 一点儿 吧。",
                  "Bớt chút đi."
                ],
                [
                  "Chốt",
                  "好，我 买 了。",
                  "Được, tôi mua."
                ]
              ],
              "tip": "一点儿 nghĩa là “một chút”, đặt sau tính từ. 便宜一点儿 = rẻ đi một chút."
            },
            {
              "t": "culture",
              "title": "Mặc cả ở đâu và không mặc cả ở đâu",
              "body": "Chợ, quầy hàng rong, khu du lịch: mặc cả là chuyện đương nhiên, và người bán chờ bạn trả giá. Siêu thị, cửa hàng có niêm yết, nhà hàng: tuyệt đối không. Giống hệt Việt Nam. Ở chợ, mức trả xuống 30–50% giá hỏi là bình thường, và nếu không mua thì cứ cười rồi đi, không ai giận."
            },
            {
              "t": "dialogue",
              "title": "Ở chợ",
              "lines": [
                {
                  "who": "A",
                  "en": "这 个 多少 钱？",
                  "vi": "Cái này bao nhiêu tiền?"
                },
                {
                  "who": "B",
                  "en": "五十 块。",
                  "vi": "Năm mươi tệ."
                },
                {
                  "who": "A",
                  "en": "太 贵 了。便宜 一点儿 吧。",
                  "vi": "Đắt quá. Bớt chút đi."
                },
                {
                  "who": "B",
                  "en": "四十，不能 再 少 了。",
                  "vi": "Bốn mươi, không bớt được nữa."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "这 个 多少 钱",
              "vi": "Cái này bao nhiêu tiền"
            },
            {
              "en": "太 贵 了 便宜 一点儿 吧",
              "vi": "Đắt quá, bớt chút đi"
            },
            {
              "en": "我 想 买 这 个",
              "vi": "Tôi muốn mua cái này"
            }
          ]
        },
        {
          "id": "z1u5l3",
          "title": "Màu sắc & Quần áo",
          "goal": "Tên màu và cách gọi đồ mặc.",
          "teach": [
            {
              "t": "intro",
              "title": "Màu sắc — lại toàn Hán-Việt",
              "body": "红 là hồng, 黄 là hoàng, 蓝 là lam, 白 là bạch, 黑 là hắc. Bạn đã dùng những chữ này cả đời trong tiếng Việt.",
              "bullets": [
                "Các màu chính",
                "色 = sắc",
                "Quần áo"
              ]
            },
            {
              "t": "vocab",
              "en": "红色",
              "vi": "màu đỏ",
              "pos": "Danh từ",
              "ipa": "hóngsè",
              "pic": "red",
              "note": "红 là “hồng”, 色 là “sắc”. Hán-Việt “hồng sắc”. Ở Trung Quốc đỏ là màu may mắn.",
              "ex": {
                "en": "我 喜欢 红色。",
                "vi": "Tôi thích màu đỏ."
              }
            },
            {
              "t": "vocab",
              "en": "黄色",
              "vi": "màu vàng",
              "pos": "Danh từ",
              "ipa": "huángsè",
              "pic": "yellow",
              "note": "黄 là “hoàng”, cùng gốc với “hoàng kim”, “Hoàng Hà”.",
              "ex": {
                "en": "黄色 的 花",
                "vi": "hoa màu vàng"
              }
            },
            {
              "t": "vocab",
              "en": "蓝色",
              "vi": "màu xanh lam",
              "pos": "Danh từ",
              "ipa": "lánsè",
              "pic": "blue",
              "note": "蓝 là “lam”. Tiếng Trung phân biệt rõ 蓝 (lam) và 绿 (lục) — tiếng Việt gộp cả hai vào “xanh”.",
              "ex": {
                "en": "蓝色 的 天空",
                "vi": "bầu trời xanh"
              }
            },
            {
              "t": "vocab",
              "en": "绿色",
              "vi": "màu xanh lá",
              "pos": "Danh từ",
              "ipa": "lǜsè",
              "pic": "green",
              "note": "绿 là “lục”, cùng gốc với “diệp lục”.",
              "ex": {
                "en": "绿色 的 树",
                "vi": "cây xanh"
              }
            },
            {
              "t": "vocab",
              "en": "白色",
              "vi": "màu trắng",
              "pos": "Danh từ",
              "ipa": "báisè",
              "pic": "white",
              "note": "白 là “bạch”, cùng gốc với “bạch mã”, “bạch cầu”.",
              "ex": {
                "en": "白色 的 衣服",
                "vi": "áo trắng"
              }
            },
            {
              "t": "vocab",
              "en": "黑色",
              "vi": "màu đen",
              "pos": "Danh từ",
              "ipa": "hēisè",
              "pic": "black",
              "note": "黑 là “hắc”, cùng gốc với “hắc ám”.",
              "ex": {
                "en": "他 穿 黑色 的 衣服。",
                "vi": "Anh ấy mặc áo đen."
              }
            },
            {
              "t": "vocab",
              "en": "衣服",
              "vi": "quần áo",
              "pos": "Danh từ",
              "ipa": "yīfú",
              "note": "Hán-Việt là “y phục” — đúng từ tiếng Việt trang trọng.",
              "ex": {
                "en": "这 件 衣服 很 漂亮。",
                "vi": "Bộ đồ này đẹp."
              }
            },
            {
              "t": "vocab",
              "en": "穿",
              "vi": "mặc, đi (giày)",
              "pos": "Động từ",
              "ipa": "chuān",
              "note": "Hán-Việt là “xuyên”. Dùng cho áo quần, giày dép. Đội mũ thì dùng 戴.",
              "ex": {
                "en": "今天 穿 什么？",
                "vi": "Hôm nay mặc gì?"
              }
            },
            {
              "t": "grammar",
              "title": "Màu đứng TRƯỚC danh từ, có 的",
              "body": "Giống mọi tính từ khác trong tiếng Trung — ngược với tiếng Việt.",
              "rows": [
                [
                  "Tiếng Việt",
                  "áo đỏ",
                  "danh từ trước"
                ],
                [
                  "Tiếng Trung",
                  "红色 的 衣服",
                  "màu trước, có 的"
                ],
                [
                  "Hỏi màu",
                  "什么 颜色 的？",
                  "Màu gì?"
                ],
                [
                  "Làm vị ngữ",
                  "这 件 衣服 是 红色 的。",
                  "Cái áo này màu đỏ."
                ]
              ],
              "tip": "件 là lượng từ của áo quần: 一件衣服. Quần thì dùng 条: 一条裤子."
            },
            {
              "t": "culture",
              "title": "Màu đỏ và màu trắng — đừng dùng nhầm",
              "body": "Đỏ là màu của may mắn, cưới hỏi, năm mới. Phong bì mừng tuổi màu đỏ, chữ Hỷ dán tường màu đỏ. Trắng ngược lại là màu tang. Tặng quà gói giấy trắng, hoặc tặng hoa trắng cho dịp vui, là điều kiêng. Tương tự Việt Nam, nhưng ở Trung Quốc chặt chẽ hơn. Và đừng tặng đồng hồ: 送钟 (tặng đồng hồ) đọc y hệt 送终 (đưa tang)."
            }
          ],
          "sentences": [
            {
              "en": "我 喜欢 红色",
              "vi": "Tôi thích màu đỏ"
            },
            {
              "en": "这 件 衣服 是 白色 的",
              "vi": "Cái áo này màu trắng"
            },
            {
              "en": "他 穿 黑色 的 衣服",
              "vi": "Anh ấy mặc áo đen"
            }
          ]
        },
        {
          "id": "z1u5c",
          "title": "Ôn tập chương 5",
          "goal": "Ôn lại cả chương số đếm và mua sắm.",
          "checkpoint": true
        }
      ]
    },
    {
      "id": "z1u6",
      "title": "Sức khoẻ & Chỉ đường",
      "goal": "Nói chỗ đau, hỏi đường và nói về thời tiết.",
      "lessons": [
        {
          "id": "z1u6l1",
          "title": "Ốm đau",
          "goal": "Nói chỗ nào đau và đi khám.",
          "teach": [
            {
              "t": "intro",
              "title": "疼 — chỗ nào đau thì nói chỗ đó",
              "body": "Khuôn đơn giản: bộ phận cơ thể + 疼. 头疼 là đau đầu, 肚子疼 là đau bụng. Giống hệt cách nói tiếng Việt.",
              "bullets": [
                "…疼 = đau…",
                "Ở phòng khám",
                "Từ vựng thuốc men"
              ]
            },
            {
              "t": "vocab",
              "en": "头",
              "vi": "đầu",
              "pos": "Danh từ",
              "ipa": "tóu",
              "pic": "head",
              "note": "Hán-Việt là “đầu”. 头疼 = đau đầu.",
              "ex": {
                "en": "我 头 疼。",
                "vi": "Tôi đau đầu."
              }
            },
            {
              "t": "vocab",
              "en": "肚子",
              "vi": "bụng",
              "pos": "Danh từ",
              "ipa": "dǔzi",
              "note": "Hán-Việt là “đỗ tử”. 肚子疼 = đau bụng.",
              "ex": {
                "en": "他 肚子 疼。",
                "vi": "Anh ấy đau bụng."
              }
            },
            {
              "t": "vocab",
              "en": "疼",
              "vi": "đau",
              "pos": "Tính từ",
              "ipa": "téng",
              "pic": "pain",
              "note": "Hán-Việt là “đông”. Có bộ 疒 (nạch — bệnh tật) bao ngoài, dấu hiệu của chữ về bệnh.",
              "ex": {
                "en": "哪儿 疼？",
                "vi": "Đau ở đâu?"
              }
            },
            {
              "t": "vocab",
              "en": "医生",
              "vi": "bác sĩ",
              "pos": "Danh từ",
              "ipa": "yīshēng",
              "pic": "doctor",
              "note": "Hán-Việt là “y sinh”. 医 là y, cùng gốc với “y tế”, “y học”.",
              "ex": {
                "en": "我 要 看 医生。",
                "vi": "Tôi cần đi khám."
              }
            },
            {
              "t": "vocab",
              "en": "医院",
              "vi": "bệnh viện",
              "pos": "Danh từ",
              "ipa": "yīyuàn",
              "pic": "hospital",
              "note": "Hán-Việt là “y viện”.",
              "ex": {
                "en": "医院 在 那儿。",
                "vi": "Bệnh viện ở đằng kia."
              }
            },
            {
              "t": "vocab",
              "en": "药",
              "vi": "thuốc",
              "pos": "Danh từ",
              "ipa": "yào",
              "pic": "medicine",
              "note": "Hán-Việt là “dược”, cùng gốc với “dược phẩm”. Uống thuốc là 吃药 — tiếng Trung “ăn thuốc”.",
              "ex": {
                "en": "你 要 吃 药。",
                "vi": "Bạn phải uống thuốc."
              }
            },
            {
              "t": "vocab",
              "en": "感冒",
              "vi": "cảm cúm",
              "pos": "Danh từ",
              "ipa": "gǎnmào",
              "note": "Hán-Việt là “cảm mạo” — đúng từ “cảm” tiếng Việt.",
              "ex": {
                "en": "我 感冒 了。",
                "vi": "Tôi bị cảm rồi."
              }
            },
            {
              "t": "vocab",
              "en": "休息",
              "vi": "nghỉ ngơi",
              "pos": "Động từ",
              "ipa": "xiūxī",
              "note": "Hán-Việt là “hưu tức”, cùng gốc với “hưu trí”.",
              "ex": {
                "en": "你 要 多 休息。",
                "vi": "Bạn phải nghỉ nhiều."
              }
            },
            {
              "t": "grammar",
              "title": "Nói bệnh: bộ phận + 疼, và 了 báo trạng thái mới",
              "body": "了 ở đây không phải “đã xong” mà là “đã thành ra thế” — trạng thái vừa đổi.",
              "rows": [
                [
                  "Đau",
                  "我 头 疼。",
                  "Tôi đau đầu."
                ],
                [
                  "Mới bị",
                  "我 感冒 了。",
                  "Tôi bị cảm rồi."
                ],
                [
                  "Hỏi",
                  "你 怎么 了？",
                  "Bạn làm sao thế?"
                ],
                [
                  "Khuyên",
                  "你 要 休息。",
                  "Bạn phải nghỉ."
                ],
                [
                  "Uống thuốc",
                  "吃 药 吧。",
                  "Uống thuốc đi."
                ]
              ],
              "tip": "怎么了 là câu hỏi thăm khi thấy ai đó khác thường — đúng nghĩa “bạn làm sao thế?”."
            }
          ],
          "sentences": [
            {
              "en": "我 头 疼",
              "vi": "Tôi đau đầu"
            },
            {
              "en": "我 感冒 了",
              "vi": "Tôi bị cảm rồi"
            },
            {
              "en": "你 要 多 休息",
              "vi": "Bạn phải nghỉ ngơi nhiều"
            }
          ]
        },
        {
          "id": "z1u6l2",
          "title": "Hỏi đường",
          "goal": "怎么走 và các từ chỉ hướng.",
          "teach": [
            {
              "t": "intro",
              "title": "怎么走 — đi thế nào",
              "body": "Một câu hỏi đường dùng được ở mọi thành phố Trung Quốc: 去…怎么走？",
              "bullets": [
                "Hỏi đường",
                "Trái phải thẳng",
                "在哪儿"
              ]
            },
            {
              "t": "vocab",
              "en": "路",
              "vi": "đường",
              "pos": "Danh từ",
              "ipa": "lù",
              "note": "Hán-Việt là “lộ”, cùng gốc với “lộ trình”, “đường lộ”.",
              "ex": {
                "en": "这 条 路 很 长。",
                "vi": "Con đường này dài."
              }
            },
            {
              "t": "vocab",
              "en": "走",
              "vi": "đi (bộ)",
              "pos": "Động từ",
              "ipa": "zǒu",
              "pic": "walk",
              "note": "Hán-Việt là “tẩu”, cùng gốc với “tẩu thoát”.",
              "ex": {
                "en": "往 前 走。",
                "vi": "Đi thẳng về phía trước."
              }
            },
            {
              "t": "vocab",
              "en": "左",
              "vi": "trái",
              "pos": "Danh từ",
              "ipa": "zuǒ",
              "pic": "arrowleft",
              "note": "Hán-Việt là “tả”, cùng gốc với “tả ngạn”.",
              "ex": {
                "en": "往 左 拐。",
                "vi": "Rẽ trái."
              }
            },
            {
              "t": "vocab",
              "en": "右",
              "vi": "phải",
              "pos": "Danh từ",
              "ipa": "yòu",
              "pic": "arrowright",
              "note": "Hán-Việt là “hữu”, cùng gốc với “hữu ngạn”.",
              "ex": {
                "en": "往 右 拐。",
                "vi": "Rẽ phải."
              }
            },
            {
              "t": "vocab",
              "en": "前",
              "vi": "phía trước",
              "pos": "Danh từ",
              "ipa": "qián",
              "note": "Hán-Việt là “tiền”, cùng gốc với “tiền tuyến”. Phía sau là 后 (hậu).",
              "ex": {
                "en": "银行 在 前面。",
                "vi": "Ngân hàng ở phía trước."
              }
            },
            {
              "t": "vocab",
              "en": "拐",
              "vi": "rẽ",
              "pos": "Động từ",
              "ipa": "guǎi",
              "note": "Miền Nam Trung Quốc hay dùng 转 thay cho 拐.",
              "ex": {
                "en": "在 前面 拐。",
                "vi": "Rẽ ở phía trước."
              }
            },
            {
              "t": "vocab",
              "en": "远",
              "vi": "xa",
              "pos": "Tính từ",
              "ipa": "yuǎn",
              "note": "Hán-Việt là “viễn”, cùng gốc với “viễn thị”, “viễn xứ”. Gần là 近 (cận).",
              "ex": {
                "en": "远 不 远？",
                "vi": "Có xa không?"
              }
            },
            {
              "t": "vocab",
              "en": "怎么",
              "vi": "thế nào, làm sao",
              "pos": "Đại từ",
              "ipa": "zěnme",
              "note": "Từ để hỏi cách thức. 怎么走 = đi thế nào.",
              "ex": {
                "en": "去 车站 怎么 走？",
                "vi": "Đi ra bến xe thế nào?"
              }
            },
            {
              "t": "grammar",
              "title": "Hỏi đường và hiểu câu trả lời",
              "body": "Một khuôn hỏi, bốn khuôn trả lời. Học đủ là không lạc.",
              "rows": [
                [
                  "Hỏi đường",
                  "去 医院 怎么 走？",
                  "Đi tới bệnh viện thế nào?"
                ],
                [
                  "Hỏi chỗ",
                  "医院 在 哪儿？",
                  "Bệnh viện ở đâu?"
                ],
                [
                  "Đi thẳng",
                  "往 前 走。",
                  "Đi thẳng."
                ],
                [
                  "Rẽ",
                  "往 左 拐。",
                  "Rẽ trái."
                ],
                [
                  "Xa gần",
                  "不 远，走 五 分钟。",
                  "Không xa, đi bộ năm phút."
                ]
              ],
              "tip": "往 nghĩa là “về phía”, luôn đi trước hướng: 往左 (về bên trái), 往前 (về phía trước)."
            }
          ],
          "sentences": [
            {
              "en": "去 医院 怎么 走",
              "vi": "Đi tới bệnh viện thế nào"
            },
            {
              "en": "往 前 走 然后 往 左 拐",
              "vi": "Đi thẳng rồi rẽ trái"
            },
            {
              "en": "银行 在 哪儿",
              "vi": "Ngân hàng ở đâu"
            }
          ]
        },
        {
          "id": "z1u6l3",
          "title": "Thời tiết",
          "goal": "Nói về trời và dùng 天气.",
          "teach": [
            {
              "t": "intro",
              "title": "天气 — thiên khí",
              "body": "天 là thiên (trời), 气 là khí. Câu thời tiết tiếng Trung đều bắt đầu bằng 今天天气… — hôm nay thời tiết…",
              "bullets": [
                "天气",
                "Nóng lạnh mưa nắng",
                "Hỏi thời tiết"
              ]
            },
            {
              "t": "vocab",
              "en": "天气",
              "vi": "thời tiết",
              "pos": "Danh từ",
              "ipa": "tiānqì",
              "pic": "weather",
              "note": "Hán-Việt là “thiên khí”.",
              "ex": {
                "en": "今天 天气 很 好。",
                "vi": "Hôm nay trời đẹp."
              }
            },
            {
              "t": "vocab",
              "en": "热",
              "vi": "nóng",
              "pos": "Tính từ",
              "ipa": "rè",
              "pic": "hot",
              "note": "Hán-Việt là “nhiệt”, cùng gốc với “nhiệt độ”, “nhiệt tình”.",
              "ex": {
                "en": "今天 很 热。",
                "vi": "Hôm nay nóng."
              }
            },
            {
              "t": "vocab",
              "en": "冷",
              "vi": "lạnh",
              "pos": "Tính từ",
              "ipa": "lěng",
              "pic": "cold",
              "note": "Hán-Việt là “lãnh”, cùng gốc với “lãnh đạm”.",
              "ex": {
                "en": "北京 冬天 很 冷。",
                "vi": "Mùa đông Bắc Kinh rất lạnh."
              }
            },
            {
              "t": "vocab",
              "en": "下雨",
              "vi": "mưa",
              "pos": "Động từ",
              "ipa": "xiàyǔ",
              "pic": "rain",
              "note": "Nghĩa đen “rơi mưa”. 下 là hạ (rơi xuống), 雨 là vũ (mưa).",
              "ex": {
                "en": "今天 下雨 了。",
                "vi": "Hôm nay mưa rồi."
              }
            },
            {
              "t": "vocab",
              "en": "晴天",
              "vi": "trời nắng",
              "pos": "Danh từ",
              "ipa": "qíngtiān",
              "pic": "sun",
              "note": "Hán-Việt là “tình thiên”. 晴 là tạnh ráo, có bộ 日 (nhật — mặt trời).",
              "ex": {
                "en": "明天 是 晴天。",
                "vi": "Mai trời nắng."
              }
            },
            {
              "t": "vocab",
              "en": "风",
              "vi": "gió",
              "pos": "Danh từ",
              "ipa": "fēng",
              "pic": "wind",
              "note": "Hán-Việt là “phong”, cùng gốc với “phong ba”, “cuồng phong”.",
              "ex": {
                "en": "今天 风 很 大。",
                "vi": "Hôm nay gió to."
              }
            },
            {
              "t": "vocab",
              "en": "春天",
              "vi": "mùa xuân",
              "pos": "Danh từ",
              "ipa": "chūntiān",
              "pic": "spring",
              "note": "Hán-Việt “xuân thiên”. 夏天 hạ, 秋天 thu, 冬天 đông — đúng bốn mùa Hán-Việt.",
              "ex": {
                "en": "我 喜欢 春天。",
                "vi": "Tôi thích mùa xuân."
              }
            },
            {
              "t": "vocab",
              "en": "度",
              "vi": "độ",
              "pos": "Danh từ",
              "ipa": "dù",
              "note": "Hán-Việt là “độ”. 三十度 = ba mươi độ.",
              "ex": {
                "en": "今天 三十 度。",
                "vi": "Hôm nay ba mươi độ."
              }
            },
            {
              "t": "grammar",
              "title": "Câu thời tiết — không cần chủ ngữ giả",
              "body": "Tiếng Anh phải có “it”, tiếng Trung thì không cần gì cả. Giống tiếng Việt.",
              "rows": [
                [
                  "Mưa",
                  "下雨 了。",
                  "Mưa rồi."
                ],
                [
                  "Nóng",
                  "今天 很 热。",
                  "Hôm nay nóng."
                ],
                [
                  "Hỏi",
                  "今天 天气 怎么样？",
                  "Hôm nay thời tiết thế nào?"
                ],
                [
                  "Nhiệt độ",
                  "今天 三十 度。",
                  "Hôm nay ba mươi độ."
                ]
              ],
              "tip": "怎么样 nghĩa là “thế nào”, dùng hỏi ý kiến hoặc tình trạng. 这个菜怎么样？= Món này thế nào?"
            }
          ],
          "sentences": [
            {
              "en": "今天 天气 很 好",
              "vi": "Hôm nay thời tiết rất đẹp"
            },
            {
              "en": "昨天 下雨 了",
              "vi": "Hôm qua trời mưa"
            },
            {
              "en": "北京 冬天 很 冷",
              "vi": "Mùa đông Bắc Kinh rất lạnh"
            }
          ]
        },
        {
          "id": "z1u6c",
          "title": "Ôn tập chương 6",
          "goal": "Ôn lại cả chương sức khoẻ và chỉ đường.",
          "checkpoint": true
        }
      ]
    },
    {
      "id": "z1u7",
      "title": "Con vật & So sánh",
      "goal": "Gọi tên con vật và so sánh hai thứ.",
      "lessons": [
        {
          "id": "z1u7l1",
          "title": "Con vật quanh ta",
          "goal": "Tên con vật và lượng từ 只.",
          "teach": [
            {
              "t": "intro",
              "title": "只 chính là chữ “con”",
              "body": "Đếm con vật tiếng Trung dùng 只, đúng vai trò chữ “con” tiếng Việt. 一只猫 = một con mèo.",
              "bullets": [
                "只 + con vật",
                "Con vật hay gặp",
                "Mười hai con giáp"
              ]
            },
            {
              "t": "vocab",
              "en": "猫",
              "vi": "con mèo",
              "pos": "Danh từ",
              "ipa": "māo",
              "pic": "cat",
              "note": "Hán-Việt là “miêu”. Bên trái là bộ 犭(khuyển) — dấu hiệu của chữ chỉ thú.",
              "ex": {
                "en": "我 有 一 只 猫。",
                "vi": "Tôi có một con mèo."
              }
            },
            {
              "t": "vocab",
              "en": "狗",
              "vi": "con chó",
              "pos": "Danh từ",
              "ipa": "gǒu",
              "pic": "dog",
              "note": "Hán-Việt là “cẩu”. Cũng có bộ 犭bên trái.",
              "ex": {
                "en": "那 只 狗 很 大。",
                "vi": "Con chó kia to."
              }
            },
            {
              "t": "vocab",
              "en": "鸟",
              "vi": "con chim",
              "pos": "Danh từ",
              "ipa": "niǎo",
              "pic": "bird",
              "note": "Hán-Việt là “điểu”. Chữ tượng hình, ngày xưa vẽ hình con chim.",
              "ex": {
                "en": "树 上 有 三 只 鸟。",
                "vi": "Trên cây có ba con chim."
              }
            },
            {
              "t": "vocab",
              "en": "鸡",
              "vi": "con gà",
              "pos": "Danh từ",
              "ipa": "jī",
              "pic": "chicken",
              "note": "Hán-Việt là “kê”, cùng gốc với “kê cẳng”, “tam kê”.",
              "ex": {
                "en": "我们 家 养 鸡。",
                "vi": "Nhà tôi nuôi gà."
              }
            },
            {
              "t": "vocab",
              "en": "猪",
              "vi": "con lợn",
              "pos": "Danh từ",
              "ipa": "zhū",
              "pic": "pig",
              "note": "Hán-Việt là “trư”, cùng gốc với “trư bát giới”.",
              "ex": {
                "en": "猪 肉 很 便宜。",
                "vi": "Thịt lợn rẻ."
              }
            },
            {
              "t": "vocab",
              "en": "牛",
              "vi": "con bò, trâu",
              "pos": "Danh từ",
              "ipa": "niú",
              "pic": "cow",
              "note": "Hán-Việt là “ngưu”. Chữ tượng hình, vẽ đầu bò có sừng.",
              "ex": {
                "en": "田 里 有 两 头 牛。",
                "vi": "Ngoài ruộng có hai con bò."
              }
            },
            {
              "t": "vocab",
              "en": "马",
              "vi": "con ngựa",
              "pos": "Danh từ",
              "ipa": "mǎ",
              "note": "Hán-Việt là “mã”, cùng gốc với “mã lực”, “xe mã”.",
              "ex": {
                "en": "他 会 骑 马。",
                "vi": "Anh ấy biết cưỡi ngựa."
              }
            },
            {
              "t": "vocab",
              "en": "养",
              "vi": "nuôi",
              "pos": "Động từ",
              "ipa": "yǎng",
              "note": "Hán-Việt là “dưỡng”, cùng gốc với “nuôi dưỡng”, “dưỡng sinh”.",
              "ex": {
                "en": "我 想 养 一 只 狗。",
                "vi": "Tôi muốn nuôi một con chó."
              }
            },
            {
              "t": "culture",
              "title": "Mười hai con giáp — giống Việt Nam, trừ một con",
              "body": "Trung Quốc và Việt Nam dùng chung mười hai con giáp, thứ tự y hệt: Tý, Sửu, Dần, Mão… Chỉ khác đúng một con: năm Mão của Việt Nam là con MÈO, còn Trung Quốc là con THỎ (兔). Hỏi tuổi người Trung Quốc, họ hay trả lời bằng con giáp: 我属狗 — tôi tuổi Tuất."
            }
          ],
          "sentences": [
            {
              "en": "我 有 一 只 猫",
              "vi": "Tôi có một con mèo"
            },
            {
              "en": "那 只 狗 很 大",
              "vi": "Con chó kia rất to"
            },
            {
              "en": "我 想 养 一 只 鸟",
              "vi": "Tôi muốn nuôi một con chim"
            }
          ]
        },
        {
          "id": "z1u7l2",
          "title": "So sánh",
          "goal": "Cấu trúc 比 — A hơn B.",
          "teach": [
            {
              "t": "intro",
              "title": "比 — một chữ thay cho cả chữ “hơn”",
              "body": "So sánh tiếng Trung cực gọn: A 比 B + tính từ. Không đổi đuôi tính từ như tiếng Anh, không thêm gì cả.",
              "bullets": [
                "A 比 B + tính từ",
                "Không dùng 很 với 比",
                "So sánh bằng nhau"
              ]
            },
            {
              "t": "vocab",
              "en": "比",
              "vi": "hơn (so sánh)",
              "pos": "Giới từ",
              "ipa": "bǐ",
              "note": "Hán-Việt là “tỉ”, cùng gốc với “tỉ lệ”, “so tỉ”. Chữ hình hai người đứng cạnh nhau.",
              "ex": {
                "en": "他 比 我 高。",
                "vi": "Anh ấy cao hơn tôi."
              }
            },
            {
              "t": "vocab",
              "en": "大",
              "vi": "to, lớn",
              "pos": "Tính từ",
              "ipa": "dà",
              "pic": "big",
              "note": "Hán-Việt là “đại”. Cũng dùng để hỏi tuổi: 你多大？",
              "ex": {
                "en": "这 个 比 那 个 大。",
                "vi": "Cái này to hơn cái kia."
              }
            },
            {
              "t": "vocab",
              "en": "小",
              "vi": "nhỏ",
              "pos": "Tính từ",
              "ipa": "xiǎo",
              "pic": "small",
              "note": "Hán-Việt là “tiểu”, cùng gốc với “tiểu học”, “tiểu thư”.",
              "ex": {
                "en": "我 的 房子 很 小。",
                "vi": "Nhà tôi nhỏ."
              }
            },
            {
              "t": "vocab",
              "en": "多",
              "vi": "nhiều",
              "pos": "Tính từ",
              "ipa": "duō",
              "note": "Hán-Việt là “đa”, cùng gốc với “đa số”, “đa tài”.",
              "ex": {
                "en": "这 里 人 很 多。",
                "vi": "Ở đây đông người."
              }
            },
            {
              "t": "vocab",
              "en": "少",
              "vi": "ít",
              "pos": "Tính từ",
              "ipa": "shǎo",
              "note": "Hán-Việt là “thiểu”, cùng gốc với “thiểu số”.",
              "ex": {
                "en": "钱 太 少 了。",
                "vi": "Tiền ít quá."
              }
            },
            {
              "t": "vocab",
              "en": "长",
              "vi": "dài",
              "pos": "Tính từ",
              "ipa": "zhǎng",
              "note": "Hán-Việt là “trường”. Chữ này còn đọc zhǎng nghĩa là trưởng (lớn lên) — một chữ hai âm.",
              "ex": {
                "en": "这 条 路 很 长。",
                "vi": "Con đường này dài."
              }
            },
            {
              "t": "vocab",
              "en": "快",
              "vi": "nhanh",
              "pos": "Tính từ",
              "ipa": "kuài",
              "pic": "fast",
              "note": "Hán-Việt là “khoái”, cùng gốc với “khoái hoạt”. Chậm là 慢 (mạn).",
              "ex": {
                "en": "他 走 得 很 快。",
                "vi": "Anh ấy đi nhanh."
              }
            },
            {
              "t": "vocab",
              "en": "一样",
              "vi": "giống nhau",
              "pos": "Tính từ",
              "ipa": "yīyàng",
              "note": "Hán-Việt là “nhất dạng”. A 和 B 一样 = A và B như nhau.",
              "ex": {
                "en": "这 两 个 一样。",
                "vi": "Hai cái này như nhau."
              }
            },
            {
              "t": "grammar",
              "title": "A 比 B + tính từ",
              "body": "Chỗ người học hay sai: KHÔNG được thêm 很 vào câu có 比.",
              "rows": [
                [
                  "Đúng",
                  "他 比 我 高。",
                  "Anh ấy cao hơn tôi."
                ],
                [
                  "SAI",
                  "他 比 我 很 高。",
                  "có 比 thì bỏ 很"
                ],
                [
                  "Hơn nhiều",
                  "他 比 我 高 很多。",
                  "cao hơn nhiều — 很多 đặt SAU"
                ],
                [
                  "Không bằng",
                  "我 没有 他 高。",
                  "Tôi không cao bằng anh ấy."
                ],
                [
                  "Bằng nhau",
                  "这 两 个 一样 大。",
                  "Hai cái này to bằng nhau."
                ]
              ],
              "tip": "Nhớ một câu: 比 và 很 không bao giờ đứng chung trong một câu."
            }
          ],
          "sentences": [
            {
              "en": "他 比 我 高",
              "vi": "Anh ấy cao hơn tôi"
            },
            {
              "en": "这 个 比 那 个 便宜",
              "vi": "Cái này rẻ hơn cái kia"
            },
            {
              "en": "这 两 个 一样 大",
              "vi": "Hai cái này to bằng nhau"
            }
          ]
        },
        {
          "id": "z1u7c",
          "title": "Ôn tập chương 7",
          "goal": "Ôn lại cả chương con vật và so sánh.",
          "checkpoint": true
        }
      ]
    },
    {
      "id": "z1u8",
      "title": "Nhà cửa & Lễ tết",
      "goal": "Tả nhà, nói việc mình biết làm và chúc Tết.",
      "lessons": [
        {
          "id": "z1u8l1",
          "title": "Trong nhà",
          "goal": "Đồ đạc và cách nói vị trí.",
          "teach": [
            {
              "t": "intro",
              "title": "在 + nơi chốn — cái gì ở đâu",
              "body": "在 là chữ “tại”. Nói vị trí thì dùng 在, và từ chỉ vị trí (trên, dưới, trong) đứng SAU danh từ — ngược tiếng Việt.",
              "bullets": [
                "在 + nơi chốn",
                "上下里外",
                "Đồ trong nhà"
              ]
            },
            {
              "t": "vocab",
              "en": "桌子",
              "vi": "cái bàn",
              "pos": "Danh từ",
              "ipa": "zhuōzi",
              "pic": "table",
              "note": "Hán-Việt là “trác tử”. Lượng từ là 张: 一张桌子.",
              "ex": {
                "en": "书 在 桌子 上。",
                "vi": "Sách ở trên bàn."
              }
            },
            {
              "t": "vocab",
              "en": "椅子",
              "vi": "cái ghế",
              "pos": "Danh từ",
              "ipa": "yǐzi",
              "pic": "chair",
              "note": "Hán-Việt là “ỷ tử”. Lượng từ là 把: 一把椅子.",
              "ex": {
                "en": "这 把 椅子 很 舒服。",
                "vi": "Cái ghế này êm."
              }
            },
            {
              "t": "vocab",
              "en": "床",
              "vi": "cái giường",
              "pos": "Danh từ",
              "ipa": "chuáng",
              "pic": "bed",
              "note": "Hán-Việt là “sàng”, cùng gốc với “long sàng”.",
              "ex": {
                "en": "我 的 床 很 大。",
                "vi": "Giường tôi to."
              }
            },
            {
              "t": "vocab",
              "en": "门",
              "vi": "cửa",
              "pos": "Danh từ",
              "ipa": "mén",
              "note": "Hán-Việt là “môn”, cùng gốc với “môn đệ”, “gia môn”. Chữ tượng hình, vẽ hai cánh cửa.",
              "ex": {
                "en": "请 关 门。",
                "vi": "Làm ơn đóng cửa."
              }
            },
            {
              "t": "vocab",
              "en": "窗户",
              "vi": "cửa sổ",
              "pos": "Danh từ",
              "ipa": "chuānghù",
              "note": "Hán-Việt là “song hộ” — chữ “song” trong “song cửa”.",
              "ex": {
                "en": "打开 窗户 吧。",
                "vi": "Mở cửa sổ đi."
              }
            },
            {
              "t": "vocab",
              "en": "上",
              "vi": "trên",
              "pos": "Danh từ",
              "ipa": "shàng",
              "note": "Hán-Việt là “thượng”. Đặt SAU danh từ: 桌子上 = trên bàn.",
              "ex": {
                "en": "书 在 桌子 上。",
                "vi": "Sách trên bàn."
              }
            },
            {
              "t": "vocab",
              "en": "里",
              "vi": "trong",
              "pos": "Danh từ",
              "ipa": "lǐ",
              "note": "Hán-Việt là “lý”. 房间里 = trong phòng.",
              "ex": {
                "en": "猫 在 房间 里。",
                "vi": "Con mèo ở trong phòng."
              }
            },
            {
              "t": "vocab",
              "en": "房间",
              "vi": "căn phòng",
              "pos": "Danh từ",
              "ipa": "fángjiān",
              "note": "Hán-Việt là “phòng gian”.",
              "ex": {
                "en": "我 的 房间 很 小。",
                "vi": "Phòng tôi nhỏ."
              }
            },
            {
              "t": "grammar",
              "title": "Từ chỉ vị trí đứng SAU danh từ",
              "body": "Đây là chỗ ngược hẳn tiếng Việt, và người Việt sai rất nhiều.",
              "rows": [
                [
                  "Tiếng Việt",
                  "trên bàn",
                  "vị trí trước"
                ],
                [
                  "Tiếng Trung",
                  "桌子 上",
                  "danh từ trước, vị trí sau"
                ],
                [
                  "Câu đủ",
                  "书 在 桌子 上。",
                  "Sách ở trên bàn."
                ],
                [
                  "Trong phòng",
                  "房间 里",
                  "phòng trong"
                ],
                [
                  "Hỏi",
                  "书 在 哪儿？",
                  "Sách ở đâu?"
                ]
              ],
              "tip": "Mẹo nhớ: tiếng Trung đi từ TO tới NHỎ, từ ngoài vào trong — 中国 北京 (Trung Quốc Bắc Kinh), 桌子上 (bàn trên). Địa chỉ cũng viết ngược tiếng Việt như vậy."
            }
          ],
          "sentences": [
            {
              "en": "书 在 桌子 上",
              "vi": "Sách ở trên bàn"
            },
            {
              "en": "猫 在 房间 里",
              "vi": "Con mèo ở trong phòng"
            },
            {
              "en": "我 的 房间 很 小",
              "vi": "Phòng của tôi rất nhỏ"
            }
          ]
        },
        {
          "id": "z1u8l2",
          "title": "Tết & Lễ hội",
          "goal": "Chúc Tết và dùng 会 / 要.",
          "teach": [
            {
              "t": "intro",
              "title": "春节 — Tết Nguyên đán, chung một cái Tết",
              "body": "Trung Quốc và Việt Nam ăn Tết cùng ngày, cùng lịch âm, nhiều tục lệ giống nhau. Câu chúc cũng gần như dịch thẳng được.",
              "bullets": [
                "Câu chúc Tết",
                "会 = biết làm",
                "要 chỉ việc sắp tới"
              ]
            },
            {
              "t": "vocab",
              "en": "春节",
              "vi": "Tết Nguyên đán",
              "pos": "Danh từ",
              "ipa": "chūnjié",
              "note": "Hán-Việt là “xuân tiết” — tiết mùa xuân. Cùng ngày với Tết Việt Nam.",
              "ex": {
                "en": "春节 快乐！",
                "vi": "Chúc mừng năm mới!"
              }
            },
            {
              "t": "vocab",
              "en": "快乐",
              "vi": "vui vẻ",
              "pos": "Tính từ",
              "ipa": "kuàilè",
              "pic": "happy",
              "note": "Hán-Việt là “khoái lạc”. 新年快乐 = Chúc mừng năm mới.",
              "ex": {
                "en": "生日 快乐！",
                "vi": "Chúc mừng sinh nhật!"
              }
            },
            {
              "t": "vocab",
              "en": "红包",
              "vi": "lì xì",
              "pos": "Danh từ",
              "ipa": "hóngbāo",
              "note": "Hán-Việt là “hồng bao” — bao đỏ. Đúng phong tục lì xì Việt Nam.",
              "ex": {
                "en": "孩子 喜欢 红包。",
                "vi": "Trẻ con thích lì xì."
              }
            },
            {
              "t": "vocab",
              "en": "会",
              "vi": "biết (làm gì)",
              "pos": "Động từ",
              "ipa": "huì",
              "note": "Hán-Việt là “hội”. Chỉ kỹ năng học mà có: 我会说中文 = tôi biết nói tiếng Trung.",
              "ex": {
                "en": "我 会 说 中文。",
                "vi": "Tôi biết nói tiếng Trung."
              }
            },
            {
              "t": "vocab",
              "en": "要",
              "vi": "sẽ, cần",
              "pos": "Động từ",
              "ipa": "yào",
              "note": "Đặt trước động từ là chỉ việc sắp làm: 我要去 = tôi sắp đi.",
              "ex": {
                "en": "我 要 回 家。",
                "vi": "Tôi sắp về nhà."
              }
            },
            {
              "t": "vocab",
              "en": "回",
              "vi": "về",
              "pos": "Động từ",
              "ipa": "huí",
              "note": "Hán-Việt là “hồi”, cùng gốc với “hồi hương”. 回家 = về nhà.",
              "ex": {
                "en": "春节 我 要 回 家。",
                "vi": "Tết tôi sẽ về nhà."
              }
            },
            {
              "t": "vocab",
              "en": "一起",
              "vi": "cùng nhau",
              "pos": "Trạng từ",
              "ipa": "yìqǐ",
              "note": "Hán-Việt là “nhất khởi”. Đặt trước động từ.",
              "ex": {
                "en": "我们 一起 吃饭 吧。",
                "vi": "Chúng ta cùng ăn cơm nhé."
              }
            },
            {
              "t": "vocab",
              "en": "朋友",
              "vi": "bạn bè",
              "pos": "Danh từ",
              "ipa": "péngyǒu",
              "pic": "friend",
              "note": "Gặp lại từ chương 2 — Hán-Việt “bằng hữu”.",
              "ex": {
                "en": "和 朋友 一起 过 年。",
                "vi": "Ăn Tết cùng bạn bè."
              }
            },
            {
              "t": "grammar",
              "title": "会, 能, 可以 — ba chữ đều dịch là “có thể”",
              "body": "Tiếng Việt gộp cả ba vào một chữ, nên đây là chỗ người Việt hay dùng nhầm.",
              "rows": [
                [
                  "会 — biết làm (học mà có)",
                  "我 会 游泳。",
                  "Tôi biết bơi."
                ],
                [
                  "能 — đủ sức, đủ điều kiện",
                  "今天 我 不 能 去。",
                  "Hôm nay tôi không đi được."
                ],
                [
                  "可以 — được phép",
                  "这里 可以 抽烟 吗？",
                  "Ở đây hút thuốc được không?"
                ],
                [
                  "要 — sắp, định",
                  "我 要 回 家。",
                  "Tôi sắp về nhà."
                ]
              ],
              "tip": "Mẹo: 会 là KỸ NĂNG, 能 là KHẢ NĂNG lúc này, 可以 là PHÉP TẮC."
            },
            {
              "t": "culture",
              "title": "Tết Trung Quốc và Tết Việt — giống và khác",
              "body": "Giống: cùng ngày, cùng lịch âm, cùng dọn nhà đón Tết, cùng lì xì phong bao đỏ, cùng kiêng quét nhà ngày mùng Một, cùng về quê sum họp. Khác: Trung Quốc gói sủi cảo 饺子 ở miền Bắc và bánh niên cao 年糕 ở miền Nam, Việt Nam gói bánh chưng bánh tét. Câu chúc thông dụng nhất là 新年快乐 (tân niên khoái lạc) và 恭喜发财 (cung hỉ phát tài) — câu sau đúng nghĩa “chúc phát tài”, dân buôn bán rất thích nghe."
            },
            {
              "t": "dialogue",
              "title": "Chúc Tết",
              "lines": [
                {
                  "who": "A",
                  "en": "春节 快乐！",
                  "vi": "Chúc mừng năm mới!"
                },
                {
                  "who": "B",
                  "en": "新年 快乐！你 要 回 家 吗？",
                  "vi": "Chúc mừng năm mới! Bạn có về quê không?"
                },
                {
                  "who": "A",
                  "en": "要，明天 回。",
                  "vi": "Có, mai về."
                },
                {
                  "who": "B",
                  "en": "一路 平安！",
                  "vi": "Thượng lộ bình an!"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "春节 快乐",
              "vi": "Chúc mừng năm mới"
            },
            {
              "en": "我 会 说 中文",
              "vi": "Tôi biết nói tiếng Trung"
            },
            {
              "en": "春节 我 要 回 家",
              "vi": "Tết tôi sẽ về nhà"
            }
          ]
        },
        {
          "id": "z1u8c",
          "title": "Ôn tập chương 8",
          "goal": "Ôn lại cả chương nhà cửa và lễ tết.",
          "checkpoint": true
        }
      ]
    }
  ]
};
