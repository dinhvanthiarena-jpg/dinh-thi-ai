/* ============================================================
   ON-Language — Vietnamese for English speakers, level A1
   SINH TỰ ĐỘNG từ course-a1.js. Đừng sửa tay file này — sửa ở
   scratchpad/noi_dung_vi1.js rồi chạy lại tao_khoa_viet.js.

   Giữ nguyên quy ước của app: en = tiếng ĐANG HỌC (ở đây là tiếng Việt),
   vi = lời GIẢI THÍCH (ở đây là tiếng Anh). Nhờ giữ nguyên tên trường mà
   toàn bộ bài luyện, trò chơi, hình ảnh chạy y như khoá gốc.
   ============================================================ */

const VI1 = {
  "id": "v1",
  "code": "A1",
  "name": "Beginner",
  "desc": "Greetings, family, food, daily life and getting around — the Vietnamese you need first.",
  "units": [
    {
      "id": "v1u1",
      "title": "Greetings & Meeting People",
      "goal": "Greet people correctly and introduce yourself.",
      "lessons": [
        {
          "id": "v1u1l1",
          "title": "Saying hello",
          "goal": "Greet anyone correctly, and know why one word is never enough.",
          "teach": [
            {
              "t": "intro",
              "title": "The one thing English does not prepare you for",
              "body": "In English “hello” works on everybody. In Vietnamese it does not. Every greeting carries a word that says how old the other person is compared to you — and leaving it out sounds cold or childish.",
              "bullets": [
                "Chào + a pronoun, always",
                "How to pick anh / chị / em in one second",
                "The magic politeness word: ạ"
              ]
            },
            {
              "t": "vocab",
              "en": "xin chào",
              "vi": "Hello",
              "pos": "Greeting",
              "ipa": "mid level · low falling",
              "pic": "hello",
              "note": "The safe greeting for a stranger, any time of day. With people you know, Vietnamese almost always add a pronoun: “Chào anh”, “Chào chị”.",
              "ex": {
                "en": "Xin chào, tôi là Nam.",
                "vi": "Hello, I am Nam."
              }
            },
            {
              "t": "vocab",
              "en": "chào",
              "vi": "Hi",
              "pos": "Greeting",
              "ipa": "low falling",
              "note": "Never say “chào” on its own to an adult — it sounds like talking to a child. Add anh / chị / em / cô / chú after it.",
              "ex": {
                "en": "Chào, bạn khoẻ không?",
                "vi": "Hi, how are you?"
              }
            },
            {
              "t": "vocab",
              "en": "chào buổi sáng",
              "vi": "Good morning",
              "pos": "Greeting",
              "ipa": "low falling · dipping · high rising",
              "ex": {
                "en": "Chào buổi sáng thầy ạ.",
                "vi": "Good morning, teacher."
              }
            },
            {
              "t": "vocab",
              "en": "chào buổi chiều",
              "vi": "Good afternoon",
              "pos": "Greeting",
              "ipa": "low falling · dipping · low falling",
              "ex": {
                "en": "Chào buổi chiều mọi người.",
                "vi": "Good afternoon, everyone."
              }
            },
            {
              "t": "vocab",
              "en": "chào buổi tối",
              "vi": "Good evening",
              "pos": "Greeting",
              "ipa": "low falling · dipping · high rising",
              "ex": {
                "en": "Chào buổi tối, thưa ông.",
                "vi": "Good evening, sir."
              }
            },
            {
              "t": "vocab",
              "en": "tạm biệt",
              "vi": "Goodbye",
              "pos": "Greeting",
              "ipa": "heavy stop · heavy stop",
              "note": "Textbook goodbye. In real life people say “Chào anh/chị” again, or just “Em về nhé”.",
              "ex": {
                "en": "Tạm biệt, hẹn gặp lại ngày mai.",
                "vi": "Goodbye, see you tomorrow."
              }
            },
            {
              "t": "phrase",
              "en": "Rất vui được gặp bạn",
              "vi": "Nice to meet you",
              "pos": "Phrase",
              "ipa": "high rising · mid level · heavy stop · heavy stop · heavy stop"
            },
            {
              "t": "grammar",
              "title": "Chào + who you are talking to",
              "body": "“Chào” alone is what you say to a small child. To everyone else you add a word for the person. Guess their age against yours — that is genuinely how it works, and nobody minds if you get it slightly wrong.",
              "rows": [
                [
                  "Man a bit older than you",
                  "Chào anh",
                  "anh = older brother"
                ],
                [
                  "Woman a bit older than you",
                  "Chào chị",
                  "chị = older sister"
                ],
                [
                  "Anyone clearly younger",
                  "Chào em",
                  "em = younger sibling"
                ],
                [
                  "Man old enough to be your father",
                  "Chào chú",
                  "chú = uncle"
                ],
                [
                  "Woman old enough to be your mother",
                  "Chào cô",
                  "cô = aunt"
                ]
              ],
              "tip": "Stuck? “Xin chào” is neutral and always acceptable with a stranger."
            },
            {
              "t": "culture",
              "title": "There is no neutral “you” in Vietnamese",
              "body": "English lets you talk to anyone for an hour without knowing their age. Vietnamese does not: every sentence needs a word for “you” and every one of those words carries an age relationship. This is why Vietnamese people ask your age within a minute of meeting you. They are not being nosy — they literally cannot form a polite sentence until they know."
            },
            {
              "t": "dialogue",
              "title": "Meeting in the morning",
              "lines": [
                {
                  "who": "A",
                  "en": "Chào buổi sáng!",
                  "vi": "Good morning!"
                },
                {
                  "who": "B",
                  "en": "Chào buổi sáng. Rất vui được gặp bạn.",
                  "vi": "Good morning. Nice to meet you."
                },
                {
                  "who": "A",
                  "en": "Tôi cũng vậy. Tạm biệt nhé!",
                  "vi": "Nice to meet you too. Goodbye!"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Chào buổi sáng thầy",
              "vi": "Good morning teacher"
            },
            {
              "en": "Rất vui được gặp bạn",
              "vi": "Nice to meet you"
            },
            {
              "en": "Tạm biệt hẹn gặp lại ngày mai",
              "vi": "Goodbye see you tomorrow"
            }
          ]
        },
        {
          "id": "v1u1l2",
          "title": "Who I am",
          "goal": "Introduce yourself — and learn the verb that is NOT “to be”.",
          "teach": [
            {
              "t": "intro",
              "title": "Good news: no am / is / are",
              "body": "Vietnamese verbs never change. Not for person, not for tense, not ever. There is one word, “là”, for linking two nouns — and a rule about when to drop it that trips up every beginner.",
              "bullets": [
                "là = the linking word for nouns",
                "Never use là before an adjective",
                "Saying your name and your job"
              ]
            },
            {
              "t": "vocab",
              "en": "tên",
              "vi": "Name",
              "pos": "Noun",
              "ipa": "mid level",
              "note": "Vietnamese names run family name first, given name last. People call you by your GIVEN name, even formally.",
              "ex": {
                "en": "Tên tôi là Lan.",
                "vi": "My name is Lan."
              }
            },
            {
              "t": "vocab",
              "en": "học sinh",
              "vi": "Student",
              "pos": "Noun",
              "ipa": "heavy stop · mid level",
              "pic": "student",
              "note": "Used for school pupils. A university student is “sinh viên” — Vietnamese splits what English calls a “student”.",
              "ex": {
                "en": "Tôi là học sinh.",
                "vi": "I am a student."
              }
            },
            {
              "t": "vocab",
              "en": "giáo viên",
              "vi": "Teacher",
              "pos": "Noun",
              "ipa": "high rising · mid level",
              "pic": "teacher",
              "note": "The job title. You address a teacher as “thầy” (male) or “cô” (female), never as “giáo viên”.",
              "ex": {
                "en": "Anh ấy là giáo viên.",
                "vi": "He is a teacher."
              }
            },
            {
              "t": "vocab",
              "en": "đến từ",
              "vi": "From",
              "pos": "Preposition",
              "ipa": "high rising · low falling",
              "note": "Literally “arrive from”. In speech people more often just say “Tôi là người Mỹ” — I am an American person.",
              "ex": {
                "en": "Tôi đến từ Hà Nội.",
                "vi": "I am from Hanoi."
              }
            },
            {
              "t": "vocab",
              "en": "đất nước",
              "vi": "Country",
              "pos": "Noun",
              "ipa": "high rising · high rising",
              "pic": "country",
              "note": "The country as a nation. For “the countryside” you want “nông thôn”.",
              "ex": {
                "en": "Việt Nam là một đất nước xinh đẹp.",
                "vi": "Vietnam is a beautiful country."
              }
            },
            {
              "t": "phrase",
              "en": "Tên bạn là gì?",
              "vi": "What is your name?",
              "pos": "Phrase",
              "ipa": "mid level · heavy stop · low falling · low falling"
            },
            {
              "t": "grammar",
              "title": "là — and when to leave it out",
              "body": "Use “là” between two nouns. Do NOT use it before an adjective: “Tôi là mệt” is wrong, it must be “Tôi mệt”. Adjectives in Vietnamese already behave like verbs.",
              "rows": [
                [
                  "Noun + là + noun",
                  "Tôi là giáo viên.",
                  "I am a teacher. ✓"
                ],
                [
                  "Noun + adjective (no là)",
                  "Tôi mệt.",
                  "I am tired. ✓"
                ],
                [
                  "Noun + là + adjective",
                  "Tôi là mệt.",
                  "Wrong ✗"
                ],
                [
                  "Asking",
                  "Anh là ai?",
                  "Who are you?"
                ]
              ],
              "tip": "One word, every subject: tôi là, anh là, chúng tôi là. Nothing to conjugate."
            },
            {
              "t": "culture",
              "title": "Your name is not where you think it is",
              "body": "“Nguyễn Văn Minh” is family name, middle name, given name — in that order. Vietnamese people are addressed by the LAST part, the given name, even by strangers and even formally. A teacher called Nguyễn Văn Minh is “thầy Minh”, never “thầy Nguyễn”. So when someone asks your name, give the name you want to be called by."
            },
            {
              "t": "dialogue",
              "title": "Làm quen ở lớp học",
              "lines": [
                {
                  "who": "A",
                  "en": "Chào! Tên bạn là gì?",
                  "vi": "Hi! What is your name?"
                },
                {
                  "who": "B",
                  "en": "Tên tôi là Lan. Tôi đến từ Huế.",
                  "vi": "My name is Lan. I am from Hue."
                },
                {
                  "who": "A",
                  "en": "Tôi là Nam. Tôi cũng là học sinh.",
                  "vi": "I am Nam. I am a student too."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tên tôi là Nam",
              "vi": "My name is Nam"
            },
            {
              "en": "Tôi đến từ Việt Nam",
              "vi": "I am from Vietnam"
            },
            {
              "en": "Cô ấy là giáo viên của tôi",
              "vi": "She is my teacher"
            },
            {
              "en": "Tên bạn là gì",
              "vi": "What is your name"
            }
          ]
        },
        {
          "id": "v1u1l3",
          "title": "How are you?",
          "goal": "Ask how somebody is, and answer a yes/no question.",
          "teach": [
            {
              "t": "intro",
              "title": "Questions without question words",
              "body": "Vietnamese turns a statement into a yes/no question by wrapping it: put “có” before the verb and “không” at the end. Nothing moves, nothing is added at the front.",
              "bullets": [
                "The có … không? frame",
                "Answering yes and no",
                "Why “khoẻ không?” is not really “how are you”"
              ]
            },
            {
              "t": "phrase",
              "en": "Bạn khoẻ không?",
              "vi": "How are you?",
              "pos": "Phrase",
              "ipa": "heavy stop · dipping · mid level"
            },
            {
              "t": "vocab",
              "en": "ổn",
              "vi": "Fine",
              "pos": "Adjective",
              "ipa": "dipping",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Tôi khoẻ, cảm ơn bạn.",
                "vi": "I am fine, thank you."
              }
            },
            {
              "t": "vocab",
              "en": "tuyệt",
              "vi": "Great",
              "pos": "Adjective",
              "ipa": "heavy stop",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Hôm nay tôi rất tuyệt!",
                "vi": "I am great today!"
              }
            },
            {
              "t": "vocab",
              "en": "mệt",
              "vi": "Tired",
              "pos": "Adjective",
              "ipa": "heavy stop",
              "pic": "tired",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Tôi rất mệt.",
                "vi": "I am very tired."
              }
            },
            {
              "t": "vocab",
              "en": "vui",
              "vi": "Happy",
              "pos": "Adjective",
              "ipa": "mid level",
              "pic": "happy",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Hôm nay cô ấy vui.",
                "vi": "She is happy today."
              }
            },
            {
              "t": "vocab",
              "en": "cảm ơn",
              "vi": "Thanks",
              "pos": "Greeting",
              "ipa": "dipping · mid level",
              "note": "Add “ạ” at the end when speaking to anyone older: “Cảm ơn ạ”. That one syllable is the whole difference between polite and rude.",
              "ex": {
                "en": "Cảm ơn nhiều!",
                "vi": "Thanks a lot!"
              }
            },
            {
              "t": "vocab",
              "en": "xin lỗi",
              "vi": "Sorry",
              "pos": "Greeting",
              "ipa": "mid level · creaky rising",
              "note": "Also the way to stop a stranger to ask something — like “excuse me”.",
              "ex": {
                "en": "Xin lỗi, tôi đến muộn.",
                "vi": "Sorry, I am late."
              }
            },
            {
              "t": "grammar",
              "title": "The có … không? question frame",
              "body": "Take any statement, add “có” before the adjective or verb and “không” at the end. That is the whole mechanism. Word order never changes — a relief after English.",
              "rows": [
                [
                  "Statement",
                  "Anh khoẻ.",
                  "You are well."
                ],
                [
                  "Question",
                  "Anh có khoẻ không?",
                  "Are you well?"
                ],
                [
                  "Yes",
                  "Có.",
                  "Yes. (repeat the verb)"
                ],
                [
                  "No",
                  "Không.",
                  "No."
                ],
                [
                  "Another verb",
                  "Anh có ăn phở không?",
                  "Do you eat phở?"
                ]
              ],
              "tip": "To answer yes, Vietnamese often repeats the verb instead of saying “có”: “Khoẻ.” or “Ăn.”"
            },
            {
              "t": "culture",
              "title": "The real Vietnamese “how are you”",
              "body": "“Anh có khoẻ không?” is textbook, and people do say it — but the everyday greeting between people who know each other is “Anh ăn cơm chưa?” (Have you eaten yet?). It is not an invitation to dinner, it is small talk, like “alright?” in Britain. Answer “Rồi” (already) or “Chưa” (not yet) and carry on."
            },
            {
              "t": "dialogue",
              "title": "Gặp lại bạn cũ",
              "lines": [
                {
                  "who": "A",
                  "en": "Chào Lan! Bạn khoẻ không?",
                  "vi": "Hi Lan! How are you?"
                },
                {
                  "who": "B",
                  "en": "Tôi khoẻ, cảm ơn. Còn bạn?",
                  "vi": "I am fine, thanks. And you?"
                },
                {
                  "who": "A",
                  "en": "Hôm nay tôi rất mệt.",
                  "vi": "I am very tired today."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi khoẻ cảm ơn bạn",
              "vi": "I am fine thank you"
            },
            {
              "en": "Hôm nay bạn thế nào",
              "vi": "How are you today"
            },
            {
              "en": "Tôi rất mệt",
              "vi": "I am very tired"
            }
          ]
        },
        {
          "id": "v1u1l4",
          "title": "Where are you from?",
          "goal": "Say where you come from and ask others.",
          "teach": [
            {
              "t": "intro",
              "title": "Question words stay put",
              "body": "In English “Where are you from?” moves the question word to the front. Vietnamese leaves it exactly where the answer would go. Learn the answer sentence and you already have the question.",
              "bullets": [
                "Question words don’t move",
                "ở đâu = where",
                "Country names stay English-ish"
              ]
            },
            {
              "t": "vocab",
              "en": "thành phố",
              "vi": "City",
              "pos": "Noun",
              "ipa": "low falling · high rising",
              "pic": "city",
              "ex": {
                "en": "Hà Nội là một thành phố lớn.",
                "vi": "Hanoi is a big city."
              }
            },
            {
              "t": "vocab",
              "en": "sống",
              "vi": "Live",
              "pos": "Verb",
              "ipa": "high rising",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi sống ở Đà Nẵng.",
                "vi": "I live in Da Nang."
              }
            },
            {
              "t": "vocab",
              "en": "nói (một thứ tiếng)",
              "vi": "Speak",
              "pos": "Verb",
              "ipa": "high rising · heavy stop · high rising · high rising",
              "pic": "speak",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi nói tiếng Việt.",
                "vi": "I speak Vietnamese."
              }
            },
            {
              "t": "vocab",
              "en": "ngôn ngữ",
              "vi": "Language",
              "pos": "Noun",
              "ipa": "mid level · creaky rising",
              "ex": {
                "en": "Tiếng Anh là một ngôn ngữ hữu ích.",
                "vi": "English is a useful language."
              }
            },
            {
              "t": "vocab",
              "en": "làng",
              "vi": "Village",
              "pos": "Noun",
              "ipa": "low falling",
              "pic": "village",
              "ex": {
                "en": "Làng tôi rất yên tĩnh.",
                "vi": "My village is very quiet."
              }
            },
            {
              "t": "phrase",
              "en": "Bạn đến từ đâu?",
              "vi": "Where are you from?",
              "pos": "Phrase",
              "ipa": "heavy stop · high rising · low falling · mid level"
            },
            {
              "t": "grammar",
              "title": "Question words sit where the answer sits",
              "body": "This is the single biggest word-order gift Vietnamese gives you. Say the sentence, and put the question word in the slot you want filled.",
              "rows": [
                [
                  "Answer",
                  "Tôi đến từ Mỹ.",
                  "I come from America."
                ],
                [
                  "Question",
                  "Anh đến từ đâu?",
                  "Where do you come from?"
                ],
                [
                  "Answer",
                  "Tôi sống ở Hà Nội.",
                  "I live in Hanoi."
                ],
                [
                  "Question",
                  "Anh sống ở đâu?",
                  "Where do you live?"
                ]
              ],
              "tip": "Same trick for “ai” (who), “gì” (what), “khi nào” (when). Nothing ever moves to the front."
            },
            {
              "t": "culture",
              "title": "Country names you will recognise",
              "body": "Many are borrowed and sound close to English: Mỹ (America), Anh (England), Úc (Australia), Pháp (France), Đức (Germany), Nhật (Japan), Hàn Quốc (Korea). Note that “Anh” means England AND means “older brother” — context does all the work."
            },
            {
              "t": "dialogue",
              "title": "Làm quen ở sân bay",
              "lines": [
                {
                  "who": "A",
                  "en": "Xin chào! Bạn đến từ đâu?",
                  "vi": "Hello! Where are you from?"
                },
                {
                  "who": "B",
                  "en": "Tôi đến từ Việt Nam. Tôi sống ở Huế.",
                  "vi": "I am from Vietnam. I live in Hue."
                },
                {
                  "who": "A",
                  "en": "Hay quá! Bạn có nói tiếng Anh không?",
                  "vi": "Nice! Do you speak English?"
                },
                {
                  "who": "B",
                  "en": "Có, một chút. Tôi là học sinh.",
                  "vi": "Yes, a little. I am a student."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Bạn đến từ đâu",
              "vi": "Where are you from"
            },
            {
              "en": "Tôi sống ở một ngôi làng nhỏ",
              "vi": "I live in a small village"
            },
            {
              "en": "Cô ấy nói được ba thứ tiếng",
              "vi": "She speaks three languages"
            },
            {
              "en": "Hà Nội là một thành phố lớn",
              "vi": "Hanoi is a big city"
            },
            {
              "en": "Tôi là người Việt Nam",
              "vi": "I am Vietnamese"
            }
          ]
        },
        {
          "id": "v1u1l5",
          "title": "Thank you & Sorry",
          "goal": "Be polite — and learn the one syllable that does most of the work.",
          "teach": [
            {
              "t": "intro",
              "title": "One syllable changes everything",
              "body": "Vietnamese politeness is not in long formulas. It is mostly one small word, “ạ”, dropped at the end of a sentence when you speak to someone older. Leave it out and you sound blunt; put it in and you sound raised properly.",
              "bullets": [
                "Cảm ơn / Xin lỗi",
                "The particle ạ",
                "Vâng and dạ"
              ]
            },
            {
              "t": "vocab",
              "en": "làm ơn",
              "vi": "Please",
              "pos": "Adverb",
              "ipa": "low falling · mid level",
              "ex": {
                "en": "Cho tôi một cà phê.",
                "vi": "One coffee, please."
              }
            },
            {
              "t": "vocab",
              "en": "hoan nghênh",
              "vi": "Welcome",
              "pos": "Adjective",
              "ipa": "mid level · mid level",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Không có gì.",
                "vi": "You are welcome."
              }
            },
            {
              "t": "vocab",
              "en": "giúp đỡ",
              "vi": "Help",
              "pos": "Verb",
              "ipa": "high rising · creaky rising",
              "pic": "help",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Bạn giúp tôi được không?",
                "vi": "Can you help me, please?"
              }
            },
            {
              "t": "phrase",
              "en": "Tất nhiên rồi",
              "vi": "Of course",
              "pos": "Phrase",
              "ipa": "high rising · mid level · low falling"
            },
            {
              "t": "phrase",
              "en": "Xin lỗi cho hỏi",
              "vi": "Excuse me",
              "pos": "Phrase",
              "ipa": "mid level · creaky rising · mid level · dipping"
            },
            {
              "t": "phrase",
              "en": "Cảm ơn bạn rất nhiều",
              "vi": "Thank you very much",
              "pos": "Phrase",
              "ipa": "dipping · mid level · heavy stop · high rising · low falling"
            },
            {
              "t": "grammar",
              "title": "ạ — the politeness particle",
              "body": "Add “ạ” at the very end of anything you say to someone older or senior. It has no meaning you can translate; it is pure respect. Children are taught it before they are taught please.",
              "rows": [
                [
                  "Neutral",
                  "Cảm ơn.",
                  "Thanks."
                ],
                [
                  "Polite",
                  "Cảm ơn ạ.",
                  "Thank you (to an elder)."
                ],
                [
                  "Neutral",
                  "Vâng.",
                  "Yes."
                ],
                [
                  "Polite",
                  "Vâng ạ.",
                  "Yes (to an elder)."
                ],
                [
                  "Question",
                  "Anh khoẻ không ạ?",
                  "Are you well, sir?"
                ]
              ],
              "tip": "There is no separate word for “please”. Politeness lives in the pronoun and in “ạ”."
            },
            {
              "t": "culture",
              "title": "Vietnamese says thank you less than English",
              "body": "Inside a family or among close friends, constant “thank you” sounds distant, as if you were treating them as outsiders. A smile or a small gesture does the job. Save “cảm ơn” for service, for strangers, and for real favours — that is where it carries weight."
            },
            {
              "t": "dialogue",
              "title": "Nhờ giúp một tay",
              "lines": [
                {
                  "who": "A",
                  "en": "Xin lỗi, bạn giúp tôi được không?",
                  "vi": "Excuse me, can you help me?"
                },
                {
                  "who": "B",
                  "en": "Tất nhiên rồi. Chuyện gì vậy?",
                  "vi": "Of course. What is it?"
                },
                {
                  "who": "A",
                  "en": "Cái túi này to quá. Cảm ơn bạn rất nhiều!",
                  "vi": "This bag is very big. Thank you very much!"
                },
                {
                  "who": "B",
                  "en": "Không có gì đâu!",
                  "vi": "You are welcome!"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Xin lỗi bạn giúp tôi được không",
              "vi": "Excuse me can you help me"
            },
            {
              "en": "Cảm ơn bạn rất nhiều",
              "vi": "Thank you very much"
            },
            {
              "en": "Không có gì",
              "vi": "You are welcome"
            },
            {
              "en": "Cho tôi một cà phê",
              "vi": "One coffee please"
            },
            {
              "en": "Xin lỗi tôi đến muộn",
              "vi": "Sorry I am late"
            }
          ]
        },
        {
          "id": "v1u1l6",
          "title": "Unit 1 review",
          "goal": "Put everything from this unit together.",
          "teach": [],
          "sentences": [],
          "checkpoint": true
        }
      ]
    },
    {
      "id": "v1u2",
      "title": "Family & People",
      "goal": "Talk about your family and describe people.",
      "lessons": [
        {
          "id": "v1u2l1",
          "title": "My family",
          "goal": "Name family members — and see why there is no word for “uncle”.",
          "teach": [
            {
              "t": "intro",
              "title": "Family words carry more information than English",
              "body": "English “uncle” covers eight different people. Vietnamese has a separate word for each, because each one tells you which side of the family and whether he is older or younger than your parent.",
              "bullets": [
                "Family words by side and age",
                "gia đình = family",
                "Why you will be asked about your family"
              ]
            },
            {
              "t": "vocab",
              "en": "gia đình",
              "vi": "Family",
              "pos": "Noun",
              "ipa": "mid level · low falling",
              "pic": "family",
              "ex": {
                "en": "Đây là gia đình tôi.",
                "vi": "This is my family."
              }
            },
            {
              "t": "vocab",
              "en": "mẹ",
              "vi": "Mother",
              "pos": "Noun",
              "ipa": "heavy stop",
              "pic": "mother",
              "note": "Northern word for mum. Southern Vietnam says “má”.",
              "ex": {
                "en": "Mẹ tôi là giáo viên.",
                "vi": "My mother is a teacher."
              }
            },
            {
              "t": "vocab",
              "en": "bố",
              "vi": "Father",
              "pos": "Noun",
              "ipa": "high rising",
              "pic": "father",
              "note": "Northern word for dad. Southern Vietnam says “ba”. Both are normal — pick one and stay with it.",
              "ex": {
                "en": "Bố anh ấy là bác sĩ.",
                "vi": "His father is a doctor."
              }
            },
            {
              "t": "vocab",
              "en": "anh trai",
              "vi": "Brother",
              "pos": "Noun",
              "ipa": "mid level · mid level",
              "pic": "brother",
              "ex": {
                "en": "Tôi có một người anh trai.",
                "vi": "I have one brother."
              }
            },
            {
              "t": "vocab",
              "en": "chị gái",
              "vi": "Sister",
              "pos": "Noun",
              "ipa": "heavy stop · high rising",
              "pic": "sister",
              "ex": {
                "en": "Em gái cô ấy còn rất nhỏ.",
                "vi": "Her sister is very young."
              }
            },
            {
              "t": "vocab",
              "en": "bố mẹ",
              "vi": "Parents",
              "pos": "Noun",
              "ipa": "high rising · heavy stop",
              "pic": "parents",
              "ex": {
                "en": "Bố mẹ tôi đến từ Huế.",
                "vi": "My parents are from Hue."
              }
            },
            {
              "t": "grammar",
              "title": "There is no generic word for “uncle” or “aunt”",
              "body": "Pick the word by two facts: which parent’s side, and older or younger than that parent.",
              "rows": [
                [
                  "Father’s older brother",
                  "bác",
                  "also father’s older sister"
                ],
                [
                  "Father’s younger brother",
                  "chú",
                  ""
                ],
                [
                  "Father’s younger sister",
                  "cô",
                  "also the word for a female teacher"
                ],
                [
                  "Mother’s brother",
                  "cậu",
                  ""
                ],
                [
                  "Mother’s sister",
                  "dì",
                  ""
                ]
              ],
              "tip": "Don’t panic — “bác”, “chú” and “cô” will get you through almost every situation as a foreigner."
            },
            {
              "t": "culture",
              "title": "Family questions are not prying",
              "body": "Are you married? How many children? How old are your parents? These land within minutes of meeting someone, and they are friendly, not intrusive. They help the other person work out which pronoun to use with you. A short honest answer is all anyone wants."
            },
            {
              "t": "dialogue",
              "title": "Khoe ảnh gia đình",
              "lines": [
                {
                  "who": "A",
                  "en": "Đây là gia đình bạn à?",
                  "vi": "Is this your family?"
                },
                {
                  "who": "B",
                  "en": "Đúng rồi. Đây là mẹ tôi và bố tôi.",
                  "vi": "Yes. This is my mother and my father."
                },
                {
                  "who": "A",
                  "en": "Em gái cô ấy xinh quá.",
                  "vi": "Her sister is very beautiful."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Đây là gia đình tôi",
              "vi": "This is my family"
            },
            {
              "en": "Mẹ tôi là giáo viên",
              "vi": "My mother is a teacher"
            },
            {
              "en": "Anh trai anh ấy là học sinh",
              "vi": "His brother is a student"
            }
          ]
        },
        {
          "id": "v1u2l2",
          "title": "Describing people",
          "goal": "Describe someone — with the adjective in the Vietnamese place.",
          "teach": [
            {
              "t": "intro",
              "title": "Adjectives come after the noun",
              "body": "English says “a beautiful house”. Vietnamese says “nhà đẹp” — house beautiful. Everything that describes a noun trails behind it, and once you accept that, whole sentences fall into place.",
              "bullets": [
                "Noun + adjective, always",
                "rất before, lắm after",
                "No “to be” with adjectives"
              ]
            },
            {
              "t": "vocab",
              "en": "người đàn ông",
              "vi": "Man",
              "pos": "Noun",
              "ipa": "low falling · low falling · mid level",
              "pic": "man",
              "note": "“người” is a classifier — for people. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Anh ấy là một chàng trai trẻ.",
                "vi": "He is a young man."
              }
            },
            {
              "t": "vocab",
              "en": "người phụ nữ",
              "vi": "Woman",
              "pos": "Noun",
              "ipa": "low falling · heavy stop · creaky rising",
              "pic": "woman",
              "note": "“người” is a classifier — for people. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Cô ấy là một người phụ nữ tốt bụng.",
                "vi": "She is a kind woman."
              }
            },
            {
              "t": "vocab",
              "en": "bạn bè",
              "vi": "Friend",
              "pos": "Noun",
              "ipa": "heavy stop · low falling",
              "pic": "friend",
              "ex": {
                "en": "Anh ấy là bạn thân nhất của tôi.",
                "vi": "He is my best friend."
              }
            },
            {
              "t": "vocab",
              "en": "cao",
              "vi": "Tall",
              "pos": "Adjective",
              "ipa": "mid level",
              "pic": "tall",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Bố tôi rất cao.",
                "vi": "My father is very tall."
              }
            },
            {
              "t": "vocab",
              "en": "trẻ",
              "vi": "Young",
              "pos": "Adjective",
              "ipa": "dipping",
              "pic": "young",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Cô ấy là một giáo viên trẻ.",
                "vi": "She is a young teacher."
              }
            },
            {
              "t": "vocab",
              "en": "già",
              "vi": "Old",
              "pos": "Adjective",
              "ipa": "low falling",
              "pic": "old",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Đây là một quyển sách cũ.",
                "vi": "This is an old book."
              }
            },
            {
              "t": "grammar",
              "title": "Noun + adjective, and how to say “very”",
              "body": "The describing word follows the thing described. To intensify it, “rất” goes BEFORE the adjective, “lắm” goes AFTER — both mean very.",
              "rows": [
                [
                  "English order",
                  "a tall man",
                  "—"
                ],
                [
                  "Vietnamese order",
                  "người cao",
                  "person tall"
                ],
                [
                  "Very (before)",
                  "rất cao",
                  "very tall"
                ],
                [
                  "Very (after)",
                  "cao lắm",
                  "very tall, more spoken"
                ],
                [
                  "Full sentence",
                  "Anh ấy rất cao.",
                  "He is very tall. (no “là”)"
                ]
              ],
              "tip": "Two adjectives? Both follow: “nhà to đẹp” = a big beautiful house."
            },
            {
              "t": "dialogue",
              "title": "Tìm bạn trong đám đông",
              "lines": [
                {
                  "who": "A",
                  "en": "Bạn của bạn đâu rồi?",
                  "vi": "Where is your friend?"
                },
                {
                  "who": "B",
                  "en": "Anh ấy là người đàn ông cao ở đằng kia.",
                  "vi": "He is the tall man over there."
                },
                {
                  "who": "A",
                  "en": "Chàng trai trẻ cầm quyển sách à?",
                  "vi": "The young man with a book?"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Anh ấy là một người đàn ông cao",
              "vi": "He is a tall man"
            },
            {
              "en": "Cô ấy là một giáo viên trẻ",
              "vi": "She is a young teacher"
            },
            {
              "en": "Đây là một quyển sách cũ",
              "vi": "This is an old book"
            }
          ]
        },
        {
          "id": "v1u2l3",
          "title": "Possession & Plurals",
          "goal": "Say whose something is, and why plurals usually vanish.",
          "teach": [
            {
              "t": "intro",
              "title": "Two things English does that Vietnamese mostly skips",
              "body": "Vietnamese has no -’s and no -s. Possession uses one small word, “của”, and it is often dropped. Plurals are usually not marked at all — the number or the context does the job.",
              "bullets": [
                "của = of",
                "Plural words: những / các",
                "When to just say nothing"
              ]
            },
            {
              "t": "vocab",
              "en": "con chó",
              "vi": "Dog",
              "pos": "Noun",
              "ipa": "mid level · high rising",
              "pic": "dog",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Tôi có một con chó nhỏ.",
                "vi": "I have a small dog."
              }
            },
            {
              "t": "vocab",
              "en": "con mèo",
              "vi": "Cat",
              "pos": "Noun",
              "ipa": "mid level · low falling",
              "pic": "cat",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Cô ấy có hai con mèo.",
                "vi": "She has two cats."
              }
            },
            {
              "t": "vocab",
              "en": "ngôi nhà",
              "vi": "House",
              "pos": "Noun",
              "ipa": "mid level · low falling",
              "pic": "house",
              "note": "“ngôi” is a classifier — for houses and stars. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Nhà tôi rất cũ.",
                "vi": "My house is very old."
              }
            },
            {
              "t": "vocab",
              "en": "ô tô",
              "vi": "Car",
              "pos": "Noun",
              "ipa": "mid level · mid level",
              "pic": "car",
              "ex": {
                "en": "Bố tôi có một chiếc ô tô mới.",
                "vi": "My father has a new car."
              }
            },
            {
              "t": "vocab",
              "en": "quyển sách",
              "vi": "Book",
              "pos": "Noun",
              "ipa": "dipping · high rising",
              "pic": "book",
              "note": "“quyển” is a classifier — for books and notebooks. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Tôi có nhiều sách.",
                "vi": "I have many books."
              }
            },
            {
              "t": "grammar",
              "title": "của, and plurals you can usually leave out",
              "body": "Possession runs the opposite way from English: the thing comes first, the owner second. Plural markers exist but native speakers skip them whenever the meaning is already clear.",
              "rows": [
                [
                  "English",
                  "my book",
                  "—"
                ],
                [
                  "Vietnamese",
                  "sách của tôi",
                  "book of me"
                ],
                [
                  "Dropped in speech",
                  "sách tôi",
                  "same meaning, very common"
                ],
                [
                  "Some books",
                  "những quyển sách",
                  "những = a plural marker"
                ],
                [
                  "With a number",
                  "ba quyển sách",
                  "three books — no plural marker needed"
                ]
              ],
              "tip": "Rule of thumb: if a number or a word like “nhiều” (many) is present, drop the plural marker."
            },
            {
              "t": "dialogue",
              "title": "Hỏi về thú cưng",
              "lines": [
                {
                  "who": "A",
                  "en": "Bạn có nuôi thú cưng không?",
                  "vi": "Do you have a pet?"
                },
                {
                  "who": "B",
                  "en": "Có, tôi có hai con mèo và một con chó.",
                  "vi": "Yes, I have two cats and a dog."
                },
                {
                  "who": "A",
                  "en": "Tôi không nuôi con nào. Tôi có nhiều sách!",
                  "vi": "I do not have a pet. I have many books!"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi có một con chó nhỏ",
              "vi": "I have a small dog"
            },
            {
              "en": "Cô ấy có hai con mèo",
              "vi": "She has two cats"
            },
            {
              "en": "Bố tôi có một chiếc ô tô mới",
              "vi": "My father has a new car"
            }
          ]
        },
        {
          "id": "v1u2l4",
          "title": "Jobs in the family",
          "goal": "Say what people do for a living.",
          "teach": [
            {
              "t": "intro",
              "title": "Jobs are nouns, so you need là",
              "body": "This is where the linking word earns its keep: a job is a noun, so “Tôi là giáo viên” needs “là”. Compare with adjectives, which never take it.",
              "bullets": [
                "làm = to do / to work",
                "Asking what someone does",
                "là comes back for nouns"
              ]
            },
            {
              "t": "vocab",
              "en": "nông dân",
              "vi": "Farmer",
              "pos": "Noun",
              "ipa": "mid level · mid level",
              "pic": "farmer",
              "ex": {
                "en": "Bố tôi là nông dân.",
                "vi": "My father is a farmer."
              }
            },
            {
              "t": "vocab",
              "en": "tài xế",
              "vi": "Driver",
              "pos": "Noun",
              "ipa": "low falling · high rising",
              "pic": "driver",
              "ex": {
                "en": "Anh ấy là tài xế xe buýt.",
                "vi": "He is a bus driver."
              }
            },
            {
              "t": "vocab",
              "en": "y tá",
              "vi": "Nurse",
              "pos": "Noun",
              "ipa": "mid level · high rising",
              "pic": "nurse",
              "ex": {
                "en": "Chị tôi là y tá.",
                "vi": "My sister is a nurse."
              }
            },
            {
              "t": "vocab",
              "en": "công nhân",
              "vi": "Worker",
              "pos": "Noun",
              "ipa": "mid level · mid level",
              "pic": "worker",
              "ex": {
                "en": "Họ là công nhân nhà máy.",
                "vi": "They are factory workers."
              }
            },
            {
              "t": "vocab",
              "en": "kỹ sư",
              "vi": "Engineer",
              "pos": "Noun",
              "ipa": "creaky rising · mid level",
              "pic": "engineer",
              "ex": {
                "en": "Cô ấy muốn làm kỹ sư.",
                "vi": "She wants to be an engineer."
              }
            },
            {
              "t": "vocab",
              "en": "công an",
              "vi": "Police",
              "pos": "Noun",
              "ipa": "mid level · mid level",
              "pic": "police",
              "ex": {
                "en": "Công an đang ở đây.",
                "vi": "The police are here."
              }
            },
            {
              "t": "grammar",
              "title": "Asking and saying what someone does",
              "body": "Two ways: with “là” plus the job noun, or with the verb “làm”.",
              "rows": [
                [
                  "Question",
                  "Anh làm nghề gì?",
                  "What job do you do?"
                ],
                [
                  "Answer with là",
                  "Tôi là bác sĩ.",
                  "I am a doctor."
                ],
                [
                  "Answer with làm",
                  "Tôi làm bác sĩ.",
                  "I work as a doctor."
                ],
                [
                  "Where",
                  "Anh làm ở đâu?",
                  "Where do you work?"
                ]
              ],
              "tip": "“làm” also means “to make” and “to do”. It is everywhere."
            },
            {
              "t": "dialogue",
              "title": "Hỏi thăm gia đình",
              "lines": [
                {
                  "who": "A",
                  "en": "Bố bạn làm nghề gì?",
                  "vi": "What does your father do?"
                },
                {
                  "who": "B",
                  "en": "Bố tôi là nông dân. Mẹ tôi là y tá.",
                  "vi": "He is a farmer. My mother is a nurse."
                },
                {
                  "who": "A",
                  "en": "Còn anh trai bạn?",
                  "vi": "And your brother?"
                },
                {
                  "who": "B",
                  "en": "Anh ấy là kỹ sư. Anh ấy làm việc ở một thành phố lớn.",
                  "vi": "He is an engineer. He works in a big city."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Bố tôi là nông dân",
              "vi": "My father is a farmer"
            },
            {
              "en": "Mẹ bạn làm nghề gì",
              "vi": "What does your mother do"
            },
            {
              "en": "Cô ấy muốn làm kỹ sư",
              "vi": "She wants to be an engineer"
            },
            {
              "en": "Anh ấy là tài xế xe buýt",
              "vi": "He is a bus driver"
            },
            {
              "en": "Chị tôi là y tá",
              "vi": "My sister is a nurse"
            }
          ]
        },
        {
          "id": "v1u2l5",
          "title": "What friends are like",
          "goal": "Describe character and say what you like.",
          "teach": [
            {
              "t": "intro",
              "title": "Liking things",
              "body": "“Thích” is like and “yêu” is love — but Vietnamese uses “yêu” far more narrowly than English does. You love a person, not a sandwich.",
              "bullets": [
                "thích = to like",
                "Character adjectives",
                "Compliments and modesty"
              ]
            },
            {
              "t": "vocab",
              "en": "tốt bụng",
              "vi": "Kind",
              "pos": "Adjective",
              "ipa": "high rising · heavy stop",
              "pic": "kind",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Bà tôi rất tốt bụng.",
                "vi": "My grandmother is very kind."
              }
            },
            {
              "t": "vocab",
              "en": "hài hước",
              "vi": "Funny",
              "pos": "Adjective",
              "ipa": "low falling · high rising",
              "pic": "funny",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Bạn tôi rất hài hước.",
                "vi": "My friend is very funny."
              }
            },
            {
              "t": "vocab",
              "en": "thông minh",
              "vi": "Clever",
              "pos": "Adjective",
              "ipa": "mid level · mid level",
              "pic": "clever",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Cô ấy là một học sinh thông minh.",
                "vi": "She is a clever student."
              }
            },
            {
              "t": "vocab",
              "en": "nhút nhát",
              "vi": "Shy",
              "pos": "Adjective",
              "ipa": "high rising · high rising",
              "pic": "shy",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Cậu ấy nhút nhát với người lạ.",
                "vi": "He is shy with new people."
              }
            },
            {
              "t": "vocab",
              "en": "thân thiện",
              "vi": "Friendly",
              "pos": "Adjective",
              "ipa": "mid level · heavy stop",
              "pic": "friendly",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Người ở đây rất thân thiện.",
                "vi": "The people here are friendly."
              }
            },
            {
              "t": "vocab",
              "en": "ít nói",
              "vi": "Quiet",
              "pos": "Adjective",
              "ipa": "high rising · high rising",
              "pic": "quiet",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Em trai tôi rất ít nói.",
                "vi": "My brother is very quiet."
              }
            },
            {
              "t": "culture",
              "title": "How to take a compliment",
              "body": "Say “Tiếng Việt của anh giỏi quá!” to a Vietnamese person about their English and they will answer “Không, em kém lắm” — no, I am terrible. Deflecting a compliment is good manners, not false modesty. When people praise your Vietnamese, the graceful reply is not “thank you” but something like “Em còn kém lắm ạ” — I still have a lot to learn."
            },
            {
              "t": "dialogue",
              "title": "Kể về bạn thân",
              "lines": [
                {
                  "who": "A",
                  "en": "Kể tôi nghe về bạn thân của bạn đi.",
                  "vi": "Tell me about your best friend."
                },
                {
                  "who": "B",
                  "en": "Bạn ấy tên Mai. Bạn ấy rất tốt bụng và hài hước.",
                  "vi": "Her name is Mai. She is very kind and funny."
                },
                {
                  "who": "A",
                  "en": "Bạn ấy có thân thiện không?",
                  "vi": "Is she friendly?"
                },
                {
                  "who": "B",
                  "en": "Có, nhưng bạn ấy hơi nhút nhát với người lạ.",
                  "vi": "Yes, but she is a bit shy with new people."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Bà tôi rất tốt bụng",
              "vi": "My grandmother is very kind"
            },
            {
              "en": "Cậu ấy hơi nhút nhát",
              "vi": "He is a bit shy"
            },
            {
              "en": "Người ở đây rất thân thiện",
              "vi": "The people here are friendly"
            },
            {
              "en": "Cô ấy là một học sinh thông minh",
              "vi": "She is a clever student"
            },
            {
              "en": "Em trai tôi rất ít nói",
              "vi": "My brother is very quiet"
            }
          ]
        },
        {
          "id": "v1u2l6",
          "title": "Unit 2 review",
          "goal": "Put everything from this unit together.",
          "teach": [],
          "sentences": [],
          "checkpoint": true
        }
      ]
    },
    {
      "id": "v1u3",
      "title": "Food & Drink",
      "goal": "Order food, name dishes and get through a meal.",
      "lessons": [
        {
          "id": "v1u3l1",
          "title": "Dishes",
          "goal": "Name food and use the food classifier.",
          "teach": [
            {
              "t": "intro",
              "title": "Rice means more than rice",
              "body": "“Cơm” is cooked rice, but it also means a meal. “Ăn cơm” is what you say for eating lunch or dinner whether or not rice is on the table.",
              "bullets": [
                "món = dish",
                "ăn cơm = have a meal",
                "Famous dishes you will meet"
              ]
            },
            {
              "t": "vocab",
              "en": "quả táo",
              "vi": "Apple",
              "pos": "Noun",
              "ipa": "dipping · high rising",
              "pic": "apple",
              "note": "“quả” is a classifier — for round fruit and round things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Tôi ăn một quả táo mỗi ngày.",
                "vi": "I eat an apple every day."
              }
            },
            {
              "t": "vocab",
              "en": "bánh mì",
              "vi": "Bread",
              "pos": "Noun",
              "ipa": "high rising · low falling",
              "pic": "bread",
              "ex": {
                "en": "Tôi muốn một ít bánh mì.",
                "vi": "I want some bread."
              }
            },
            {
              "t": "vocab",
              "en": "cơm",
              "vi": "Rice",
              "pos": "Noun",
              "ipa": "mid level",
              "pic": "rice",
              "note": "Cooked rice — and by extension “a meal”. “Ăn cơm” means “to eat a meal”, even if there is no rice in it.",
              "ex": {
                "en": "Chúng tôi ăn cơm mỗi ngày.",
                "vi": "We eat rice every day."
              }
            },
            {
              "t": "vocab",
              "en": "quả trứng",
              "vi": "Egg",
              "pos": "Noun",
              "ipa": "dipping · high rising",
              "pic": "egg",
              "note": "“quả” is a classifier — for round fruit and round things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Cô ấy có hai quả trứng.",
                "vi": "She has two eggs."
              }
            },
            {
              "t": "vocab",
              "en": "con cá",
              "vi": "Fish",
              "pos": "Noun",
              "ipa": "mid level · high rising",
              "pic": "fish",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Tôi thích cá và cơm.",
                "vi": "I like fish and rice."
              }
            },
            {
              "t": "vocab",
              "en": "thịt",
              "vi": "Meat",
              "pos": "Noun",
              "ipa": "heavy stop",
              "pic": "meat",
              "ex": {
                "en": "Anh ấy không ăn thịt.",
                "vi": "He does not eat meat."
              }
            },
            {
              "t": "grammar",
              "title": "Counting food: the classifier món",
              "body": "You cannot put a number straight in front of a Vietnamese noun. A classifier goes in between, and for dishes of food that word is “món”.",
              "rows": [
                [
                  "Wrong",
                  "hai phở",
                  "two phở ✗"
                ],
                [
                  "Right",
                  "hai bát phở",
                  "two bowls of phở ✓"
                ],
                [
                  "A dish",
                  "một món ngon",
                  "a delicious dish"
                ],
                [
                  "Ordering",
                  "Cho tôi hai bát phở.",
                  "Give me two bowls of phở."
                ]
              ],
              "tip": "“Cho tôi …” — give me — is the normal, polite way to order. It is not rude."
            }
          ],
          "sentences": [
            {
              "en": "Tôi ăn cơm mỗi ngày",
              "vi": "I eat rice every day"
            },
            {
              "en": "Cô ấy có hai quả trứng",
              "vi": "She has two eggs"
            },
            {
              "en": "Tôi muốn một ít bánh mì",
              "vi": "I want some bread"
            }
          ]
        },
        {
          "id": "v1u3l2",
          "title": "Drinks",
          "goal": "Order a drink the way locals do.",
          "teach": [
            {
              "t": "intro",
              "title": "You drink medicine too",
              "body": "“Uống” covers every liquid, including medicine. And Vietnamese coffee deserves its own lesson — order it wrong and you will get a very strong surprise.",
              "bullets": [
                "uống = to drink",
                "Ordering with cho tôi",
                "Coffee vocabulary"
              ]
            },
            {
              "t": "vocab",
              "en": "nước",
              "vi": "Water",
              "pos": "Noun",
              "ipa": "high rising",
              "pic": "water",
              "note": "Same word for “water” and for “country”. The tone is identical; only context tells them apart.",
              "ex": {
                "en": "Cho tôi xin ít nước được không?",
                "vi": "Can I have some water?"
              }
            },
            {
              "t": "vocab",
              "en": "cà phê",
              "vi": "Coffee",
              "pos": "Noun",
              "ipa": "low falling · mid level",
              "pic": "coffee",
              "note": "Vietnamese coffee is strong and usually served with condensed milk: “cà phê sữa”.",
              "ex": {
                "en": "Tôi uống cà phê vào buổi sáng.",
                "vi": "I drink coffee in the morning."
              }
            },
            {
              "t": "vocab",
              "en": "trà",
              "vi": "Tea",
              "pos": "Noun",
              "ipa": "low falling",
              "pic": "tea",
              "ex": {
                "en": "Trà rất nóng.",
                "vi": "The tea is very hot."
              }
            },
            {
              "t": "vocab",
              "en": "sữa",
              "vi": "Milk",
              "pos": "Noun",
              "ipa": "creaky rising",
              "pic": "milk",
              "ex": {
                "en": "Trẻ con uống sữa.",
                "vi": "Children drink milk."
              }
            },
            {
              "t": "vocab",
              "en": "nước ép",
              "vi": "Juice",
              "pos": "Noun",
              "ipa": "high rising · high rising",
              "pic": "juice",
              "ex": {
                "en": "Tôi thích nước cam.",
                "vi": "I like orange juice."
              }
            },
            {
              "t": "vocab",
              "en": "uống",
              "vi": "Drink",
              "pos": "Verb",
              "ipa": "high rising",
              "pic": "drink",
              "note": "Only for drinking. Taking medicine is also “uống thuốc” — you “drink” medicine in Vietnamese.",
              "ex": {
                "en": "Bạn muốn uống gì?",
                "vi": "What do you want to drink?"
              }
            },
            {
              "t": "grammar",
              "title": "Ordering: cho tôi + number + classifier + thing",
              "body": "One pattern gets you every drink in the country.",
              "rows": [
                [
                  "Pattern",
                  "Cho tôi một cốc cà phê.",
                  "Give me a cup of coffee."
                ],
                [
                  "Iced",
                  "Cho tôi một cốc cà phê đá.",
                  "…iced coffee."
                ],
                [
                  "With milk",
                  "cà phê sữa",
                  "coffee with condensed milk"
                ],
                [
                  "Water",
                  "Cho tôi một chai nước.",
                  "Give me a bottle of water."
                ]
              ],
              "tip": "“cốc” is a glass in the north, “ly” in the south. Both are understood everywhere."
            },
            {
              "t": "dialogue",
              "title": "Ở quán cà phê",
              "lines": [
                {
                  "who": "A",
                  "en": "Bạn thích cà phê không?",
                  "vi": "Do you like coffee?"
                },
                {
                  "who": "B",
                  "en": "Không, tôi không thích cà phê. Tôi thích trà.",
                  "vi": "No, I do not like coffee. I like tea."
                },
                {
                  "who": "A",
                  "en": "Được thôi. Cho hai trà và một ít nước nhé.",
                  "vi": "OK. Two teas and some water, please."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi uống cà phê vào buổi sáng",
              "vi": "I drink coffee in the morning"
            },
            {
              "en": "Cô ấy thích trà và sữa",
              "vi": "She likes tea and milk"
            },
            {
              "en": "Cho tôi xin ít nước được không",
              "vi": "Can I have some water"
            }
          ]
        },
        {
          "id": "v1u3l3",
          "title": "At the restaurant",
          "goal": "Get through a meal from ordering to paying.",
          "teach": [
            {
              "t": "intro",
              "title": "Three sentences and you can eat anywhere",
              "body": "Ordering, asking for the bill, and saying it was good. That is genuinely all you need at a Vietnamese eatery.",
              "bullets": [
                "Cho tôi … to order",
                "Tính tiền to pay",
                "Ngon quá to compliment"
              ]
            },
            {
              "t": "vocab",
              "en": "nhà hàng",
              "vi": "Restaurant",
              "pos": "Noun",
              "ipa": "low falling · low falling",
              "pic": "restaurant",
              "ex": {
                "en": "Nhà hàng này rất ngon.",
                "vi": "This restaurant is very good."
              }
            },
            {
              "t": "vocab",
              "en": "thực đơn",
              "vi": "Menu",
              "pos": "Noun",
              "ipa": "heavy stop · mid level",
              "pic": "menu",
              "ex": {
                "en": "Cho tôi xem thực đơn được không?",
                "vi": "Can I see the menu?"
              }
            },
            {
              "t": "vocab",
              "en": "gọi món",
              "vi": "Order",
              "pos": "Verb",
              "ipa": "heavy stop · high rising",
              "pic": "order",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi muốn gọi món bây giờ.",
                "vi": "I want to order now."
              }
            },
            {
              "t": "vocab",
              "en": "hoá đơn",
              "vi": "Bill",
              "pos": "Noun",
              "ipa": "high rising · mid level",
              "pic": "bill",
              "ex": {
                "en": "Cho tôi xin hoá đơn nhé?",
                "vi": "Can I have the bill, please?"
              }
            },
            {
              "t": "vocab",
              "en": "ngon",
              "vi": "Delicious",
              "pos": "Adjective",
              "ipa": "mid level",
              "pic": "delicious",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Món ăn rất ngon.",
                "vi": "The food is delicious."
              }
            },
            {
              "t": "vocab",
              "en": "đói",
              "vi": "Hungry",
              "pos": "Adjective",
              "ipa": "high rising",
              "pic": "hungry",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Tôi rất đói.",
                "vi": "I am very hungry."
              }
            },
            {
              "t": "culture",
              "title": "How eating actually works",
              "body": "Dishes arrive when they are ready, not in courses, and they are shared in the middle of the table. You take from the communal plates into your own bowl. Hold the bowl up near your mouth — leaving it on the table and leaning down is what makes foreigners look odd. And when you want to pay, you call across the room: “Em ơi, tính tiền!” Nobody thinks this is rude."
            },
            {
              "t": "dialogue",
              "title": "Gọi món",
              "lines": [
                {
                  "who": "A",
                  "en": "Chào buổi tối. Anh chị gọi món chưa ạ?",
                  "vi": "Good evening. Are you ready to order?"
                },
                {
                  "who": "B",
                  "en": "Rồi. Cho tôi món cá nhé.",
                  "vi": "Yes. I would like the fish, please."
                },
                {
                  "who": "A",
                  "en": "Đồ uống thì sao ạ?",
                  "vi": "And to drink?"
                },
                {
                  "who": "B",
                  "en": "Cho tôi xin ít nước nhé?",
                  "vi": "Can I have some water, please?"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi rất đói",
              "vi": "I am very hungry"
            },
            {
              "en": "Cho tôi xem thực đơn được không",
              "vi": "Can I see the menu"
            },
            {
              "en": "Món ăn rất ngon",
              "vi": "The food is delicious"
            }
          ]
        },
        {
          "id": "v1u3l4",
          "title": "Fruit & Vegetables",
          "goal": "Buy fruit — and meet the north/south split.",
          "teach": [
            {
              "t": "intro",
              "title": "The same fruit, two words",
              "body": "Northern Vietnam says “quả”, southern Vietnam says “trái”. Both mean the classifier for a piece of fruit, and everyone understands both.",
              "bullets": [
                "quả / trái",
                "Market fruit names",
                "Bargaining basics"
              ]
            },
            {
              "t": "vocab",
              "en": "quả chuối",
              "vi": "Banana",
              "pos": "Noun",
              "ipa": "dipping · high rising",
              "pic": "banana",
              "note": "“quả” is a classifier — for round fruit and round things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Tôi ăn một quả chuối mỗi ngày.",
                "vi": "I eat a banana every day."
              }
            },
            {
              "t": "vocab",
              "en": "quả cam",
              "vi": "Orange",
              "pos": "Noun",
              "ipa": "dipping · mid level",
              "pic": "orange",
              "note": "“quả” is a classifier — for round fruit and round things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Quả cam này ngọt.",
                "vi": "This orange is sweet."
              }
            },
            {
              "t": "vocab",
              "en": "quả xoài",
              "vi": "Mango",
              "pos": "Noun",
              "ipa": "dipping · low falling",
              "pic": "mango",
              "note": "“quả” is a classifier — for round fruit and round things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Xoài Việt Nam rất ngon.",
                "vi": "Vietnamese mangoes are delicious."
              }
            },
            {
              "t": "vocab",
              "en": "quả cà chua",
              "vi": "Tomato",
              "pos": "Noun",
              "ipa": "dipping · low falling · mid level",
              "pic": "tomato",
              "note": "“quả” is a classifier — for round fruit and round things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Tôi muốn hai quả cà chua.",
                "vi": "I want two tomatoes."
              }
            },
            {
              "t": "vocab",
              "en": "củ cà rốt",
              "vi": "Carrot",
              "pos": "Noun",
              "ipa": "dipping · low falling · high rising",
              "pic": "carrot",
              "ex": {
                "en": "Thỏ thích cà rốt.",
                "vi": "Rabbits like carrots."
              }
            },
            {
              "t": "vocab",
              "en": "rau củ",
              "vi": "Vegetable",
              "pos": "Noun",
              "ipa": "mid level · dipping",
              "pic": "vegetable",
              "ex": {
                "en": "Ăn nhiều rau vào!",
                "vi": "Eat more vegetables!"
              }
            },
            {
              "t": "grammar",
              "title": "quả (north) and trái (south)",
              "body": "The classifier for round fruit. Pick whichever you hear around you.",
              "rows": [
                [
                  "North",
                  "một quả táo",
                  "an apple"
                ],
                [
                  "South",
                  "một trái táo",
                  "an apple"
                ],
                [
                  "Counting",
                  "ba quả chuối",
                  "three bananas"
                ],
                [
                  "Asking price",
                  "Bao nhiêu tiền một cân?",
                  "How much per kilo?"
                ]
              ],
              "tip": "Vietnam is full of these pairs. Neither is more correct; they are just where you are standing."
            },
            {
              "t": "dialogue",
              "title": "Ở quầy hoa quả",
              "lines": [
                {
                  "who": "A",
                  "en": "Bạn có thích xoài không?",
                  "vi": "Do you like mangoes?"
                },
                {
                  "who": "B",
                  "en": "Có, tôi rất thích! Nhưng tôi không thích cà chua.",
                  "vi": "Yes, I love them! But I don't like tomatoes."
                },
                {
                  "who": "A",
                  "en": "Thật à? Cà chua tốt cho bạn đấy.",
                  "vi": "Really? Tomatoes are good for you."
                },
                {
                  "who": "B",
                  "en": "Tôi biết. Tôi ăn cà rốt thay vào đó.",
                  "vi": "I know. I eat carrots instead."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi rất thích xoài",
              "vi": "I like mangoes very much"
            },
            {
              "en": "Bạn có thích cà rốt không",
              "vi": "Do you like carrots"
            },
            {
              "en": "Ăn nhiều rau vào",
              "vi": "Eat more vegetables"
            },
            {
              "en": "Quả cam này ngọt",
              "vi": "This orange is sweet"
            },
            {
              "en": "Tôi không thích cà chua",
              "vi": "I do not like tomatoes"
            }
          ]
        },
        {
          "id": "v1u3l5",
          "title": "Meals of the day",
          "goal": "Name meals — and see how Vietnamese builds compound words.",
          "teach": [
            {
              "t": "intro",
              "title": "Verb plus time equals meal",
              "body": "Vietnamese does not have separate nouns for breakfast, lunch and dinner. It glues “ăn” (eat) onto the time of day, and the result is a verb.",
              "bullets": [
                "ăn sáng / trưa / tối",
                "Time words at the front",
                "When Vietnamese people actually eat"
              ]
            },
            {
              "t": "vocab",
              "en": "bữa sáng",
              "vi": "Breakfast",
              "pos": "Noun",
              "ipa": "creaky rising · high rising",
              "pic": "breakfast",
              "ex": {
                "en": "Tôi ăn sáng lúc sáu giờ.",
                "vi": "I have breakfast at six."
              }
            },
            {
              "t": "vocab",
              "en": "bữa trưa",
              "vi": "Lunch",
              "pos": "Noun",
              "ipa": "creaky rising · mid level",
              "pic": "lunch",
              "ex": {
                "en": "Chúng tôi ăn trưa ở trường.",
                "vi": "We have lunch at school."
              }
            },
            {
              "t": "vocab",
              "en": "bữa tối",
              "vi": "Dinner",
              "pos": "Noun",
              "ipa": "creaky rising · high rising",
              "pic": "dinner",
              "ex": {
                "en": "Cơm tối xong rồi!",
                "vi": "Dinner is ready!"
              }
            },
            {
              "t": "vocab",
              "en": "món canh",
              "vi": "Soup",
              "pos": "Noun",
              "ipa": "high rising · mid level",
              "pic": "soup",
              "note": "“món” is a classifier — for dishes of food. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Mẹ tôi nấu canh ngon.",
                "vi": "My mother makes good soup."
              }
            },
            {
              "t": "vocab",
              "en": "mì",
              "vi": "Noodle",
              "pos": "Noun",
              "ipa": "low falling",
              "pic": "noodle",
              "ex": {
                "en": "Tôi ăn phở vào bữa sáng.",
                "vi": "I eat noodles for breakfast."
              }
            },
            {
              "t": "vocab",
              "en": "muối",
              "vi": "Salt",
              "pos": "Noun",
              "ipa": "high rising",
              "pic": "salt",
              "ex": {
                "en": "Canh này thiếu muối.",
                "vi": "This soup needs salt."
              }
            },
            {
              "t": "grammar",
              "title": "Meals are verbs, not nouns",
              "body": "Where English says “to have breakfast”, Vietnamese says “eat morning”.",
              "rows": [
                [
                  "ăn sáng",
                  "eat morning",
                  "to have breakfast"
                ],
                [
                  "ăn trưa",
                  "eat noon",
                  "to have lunch"
                ],
                [
                  "ăn tối",
                  "eat evening",
                  "to have dinner"
                ],
                [
                  "Sentence",
                  "Tôi ăn sáng lúc bảy giờ.",
                  "I have breakfast at seven."
                ]
              ],
              "tip": "The same trick builds many words: “làm việc” = do work = to work."
            },
            {
              "t": "dialogue",
              "title": "Hỏi chuyện ăn uống",
              "lines": [
                {
                  "who": "A",
                  "en": "Bạn ăn gì vào bữa sáng?",
                  "vi": "What do you have for breakfast?"
                },
                {
                  "who": "B",
                  "en": "Tôi thường ăn phở và uống trà.",
                  "vi": "I usually have noodles and tea."
                },
                {
                  "who": "A",
                  "en": "Còn bữa tối thì sao?",
                  "vi": "And what about dinner?"
                },
                {
                  "who": "B",
                  "en": "Cơm, cá và canh. Mẹ tôi nấu.",
                  "vi": "Rice, fish and soup. My mother cooks it."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi ăn sáng lúc sáu giờ",
              "vi": "I have breakfast at six"
            },
            {
              "en": "Chúng tôi ăn trưa ở trường",
              "vi": "We have lunch at school"
            },
            {
              "en": "Bạn ăn gì vào bữa tối",
              "vi": "What do you have for dinner"
            },
            {
              "en": "Canh này thiếu muối",
              "vi": "This soup needs salt"
            },
            {
              "en": "Tôi ăn phở vào bữa sáng",
              "vi": "I eat noodles for breakfast"
            }
          ]
        },
        {
          "id": "v1u3l6",
          "title": "Unit 3 review",
          "goal": "Put everything from this unit together.",
          "teach": [],
          "sentences": [],
          "checkpoint": true
        }
      ]
    },
    {
      "id": "v1u4",
      "title": "Everyday Life",
      "goal": "Tell the time and talk about your day.",
      "lessons": [
        {
          "id": "v1u4l1",
          "title": "Telling the time",
          "goal": "Say the time and put time words in the right place.",
          "teach": [
            {
              "t": "intro",
              "title": "Time goes first",
              "body": "English can put the time almost anywhere. Vietnamese strongly prefers it at the very start of the sentence, before the subject.",
              "bullets": [
                "giờ = hour and o’clock",
                "rưỡi = half past",
                "Time words at the front"
              ]
            },
            {
              "t": "vocab",
              "en": "thời gian",
              "vi": "Time",
              "pos": "Noun",
              "ipa": "low falling · mid level",
              "pic": "clock",
              "ex": {
                "en": "Bây giờ là mấy giờ?",
                "vi": "What time is it now?"
              }
            },
            {
              "t": "vocab",
              "en": "buổi sáng",
              "vi": "Morning",
              "pos": "Noun",
              "ipa": "dipping · high rising",
              "pic": "morning",
              "ex": {
                "en": "Tôi học vào buổi sáng.",
                "vi": "I study in the morning."
              }
            },
            {
              "t": "vocab",
              "en": "buổi tối",
              "vi": "Night",
              "pos": "Noun",
              "ipa": "dipping · high rising",
              "pic": "night",
              "ex": {
                "en": "Tôi ngủ vào ban đêm.",
                "vi": "I sleep at night."
              }
            },
            {
              "t": "vocab",
              "en": "hôm nay",
              "vi": "Today",
              "pos": "Adverb",
              "ipa": "mid level · mid level",
              "pic": "today",
              "note": "Time words like this go at the START of the sentence in Vietnamese, before the subject.",
              "ex": {
                "en": "Hôm nay tôi bận.",
                "vi": "I am busy today."
              }
            },
            {
              "t": "vocab",
              "en": "ngày mai",
              "vi": "Tomorrow",
              "pos": "Adverb",
              "ipa": "low falling · mid level",
              "pic": "tomorrow",
              "ex": {
                "en": "Hẹn gặp lại ngày mai.",
                "vi": "See you tomorrow."
              }
            },
            {
              "t": "vocab",
              "en": "tuần",
              "vi": "Week",
              "pos": "Noun",
              "ipa": "low falling",
              "pic": "week",
              "ex": {
                "en": "Tôi làm việc năm ngày một tuần.",
                "vi": "I work five days a week."
              }
            },
            {
              "t": "grammar",
              "title": "Telling the time, and where time words sit",
              "body": "Numbers come before “giờ”. Minutes follow. “Rưỡi” means half past.",
              "rows": [
                [
                  "2:00",
                  "hai giờ",
                  "two o’clock"
                ],
                [
                  "2:15",
                  "hai giờ mười lăm",
                  "two fifteen"
                ],
                [
                  "2:30",
                  "hai giờ rưỡi",
                  "half past two"
                ],
                [
                  "Question",
                  "Mấy giờ rồi?",
                  "What time is it?"
                ],
                [
                  "In a sentence",
                  "Bảy giờ tôi đi làm.",
                  "At seven I go to work."
                ]
              ],
              "tip": "Vietnamese adds a part of day for clarity: “hai giờ chiều” = two in the afternoon."
            },
            {
              "t": "dialogue",
              "title": "Hẹn giờ",
              "lines": [
                {
                  "who": "A",
                  "en": "Mấy giờ rồi?",
                  "vi": "What time is it?"
                },
                {
                  "who": "B",
                  "en": "Bảy giờ rồi.",
                  "vi": "It is seven o'clock."
                },
                {
                  "who": "A",
                  "en": "Tôi có lớp lúc tám giờ sáng.",
                  "vi": "I have a class at eight in the morning."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi học vào buổi sáng",
              "vi": "I study in the morning"
            },
            {
              "en": "Bây giờ là mấy giờ",
              "vi": "What time is it now"
            },
            {
              "en": "Hẹn gặp lại ngày mai",
              "vi": "See you tomorrow"
            }
          ]
        },
        {
          "id": "v1u4l2",
          "title": "Daily habits",
          "goal": "Describe your routine — with no tense at all.",
          "teach": [
            {
              "t": "intro",
              "title": "No present tense to learn",
              "body": "A plain Vietnamese verb already covers “I eat” and “I am eating” and “I do eat”. If you want to say it is a habit, add “thường” (usually) — but you do not have to.",
              "bullets": [
                "Bare verbs do the work",
                "thường = usually",
                "Frequency words"
              ]
            },
            {
              "t": "vocab",
              "en": "thức dậy",
              "vi": "Get up",
              "pos": "Verb",
              "ipa": "high rising · heavy stop",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi dậy lúc sáu giờ.",
                "vi": "I get up at six."
              }
            },
            {
              "t": "vocab",
              "en": "làm việc",
              "vi": "Work",
              "pos": "Verb",
              "ipa": "low falling · heavy stop",
              "pic": "work",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Cô ấy làm việc ở một trường học.",
                "vi": "She works in a school."
              }
            },
            {
              "t": "vocab",
              "en": "học",
              "vi": "Study",
              "pos": "Verb",
              "ipa": "heavy stop",
              "pic": "study",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Anh ấy học tiếng Anh.",
                "vi": "He studies English."
              }
            },
            {
              "t": "vocab",
              "en": "ăn",
              "vi": "Eat",
              "pos": "Verb",
              "ipa": "mid level",
              "pic": "eat",
              "note": "One of the most useful verbs in Vietnamese. It joins onto other words: ăn sáng (breakfast), ăn cưới (go to a wedding).",
              "ex": {
                "en": "Chúng tôi ăn lúc bảy giờ.",
                "vi": "We eat at seven."
              }
            },
            {
              "t": "vocab",
              "en": "ngủ",
              "vi": "Sleep",
              "pos": "Verb",
              "ipa": "dipping",
              "pic": "sleep",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi ngủ tám tiếng.",
                "vi": "I sleep eight hours."
              }
            },
            {
              "t": "vocab",
              "en": "đi",
              "vi": "Go",
              "pos": "Verb",
              "ipa": "mid level",
              "pic": "go",
              "note": "Go — and it also turns a sentence into a gentle command when put at the end: “Ăn đi!” = “Go on, eat.”",
              "ex": {
                "en": "Cô ấy đi học.",
                "vi": "She goes to school."
              }
            },
            {
              "t": "grammar",
              "title": "Habits: just the verb, optionally with thường",
              "body": "There is nothing to conjugate and no auxiliary to add.",
              "rows": [
                [
                  "Tôi ăn phở.",
                  "I eat phở / I am eating phở",
                  "context decides"
                ],
                [
                  "Tôi thường ăn phở.",
                  "I usually eat phở",
                  "thường before the verb"
                ],
                [
                  "Tôi luôn luôn dậy sớm.",
                  "I always get up early",
                  "luôn luôn = always"
                ],
                [
                  "Tôi không bao giờ hút thuốc.",
                  "I never smoke",
                  "không bao giờ = never"
                ]
              ],
              "tip": "Frequency words go before the verb, same as English."
            },
            {
              "t": "dialogue",
              "title": "Một ngày của bạn",
              "lines": [
                {
                  "who": "A",
                  "en": "Bạn dậy lúc mấy giờ?",
                  "vi": "What time do you get up?"
                },
                {
                  "who": "B",
                  "en": "Tôi dậy lúc sáu giờ và học vào buổi sáng.",
                  "vi": "I get up at six and I study in the morning."
                },
                {
                  "who": "A",
                  "en": "Em gái tôi dậy lúc bảy giờ. Nó đi học lúc tám giờ.",
                  "vi": "My sister gets up at seven. She goes to school at eight."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi dậy lúc sáu giờ mỗi ngày",
              "vi": "I get up at six every day"
            },
            {
              "en": "Cô ấy đi học lúc tám giờ",
              "vi": "She goes to school at eight"
            },
            {
              "en": "Anh ấy học tiếng Anh vào buổi tối",
              "vi": "He studies English at night"
            }
          ]
        },
        {
          "id": "v1u4l3",
          "title": "At school",
          "goal": "Talk about studying and school things.",
          "teach": [
            {
              "t": "intro",
              "title": "One verb, many school words",
              "body": "“Học” means to study, to learn and to go to school. It combines with other words to build most of the vocabulary in this lesson.",
              "bullets": [
                "học = study",
                "Classroom objects",
                "Addressing a teacher"
              ]
            },
            {
              "t": "vocab",
              "en": "trường học",
              "vi": "School",
              "pos": "Noun",
              "ipa": "low falling · heavy stop",
              "pic": "school",
              "ex": {
                "en": "Tôi đến trường mỗi ngày.",
                "vi": "I go to school every day."
              }
            },
            {
              "t": "vocab",
              "en": "lớp học",
              "vi": "Class",
              "pos": "Noun",
              "ipa": "high rising · heavy stop",
              "ex": {
                "en": "Lớp tôi có ba mươi học sinh.",
                "vi": "My class has thirty students."
              }
            },
            {
              "t": "vocab",
              "en": "bài tập về nhà",
              "vi": "Homework",
              "pos": "Noun",
              "ipa": "low falling · heavy stop · low falling · low falling",
              "ex": {
                "en": "Tôi làm bài tập vào buổi tối.",
                "vi": "I do my homework at night."
              }
            },
            {
              "t": "vocab",
              "en": "học được",
              "vi": "Learn",
              "pos": "Verb",
              "ipa": "heavy stop · heavy stop",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi học tiếng Anh mỗi ngày.",
                "vi": "I learn English every day."
              }
            },
            {
              "t": "vocab",
              "en": "câu hỏi",
              "vi": "Question",
              "pos": "Noun",
              "ipa": "mid level · dipping",
              "pic": "question",
              "ex": {
                "en": "Tôi hỏi một câu được không?",
                "vi": "Can I ask a question?"
              }
            },
            {
              "t": "vocab",
              "en": "câu trả lời",
              "vi": "Answer",
              "pos": "Noun",
              "ipa": "mid level · dipping · low falling",
              "ex": {
                "en": "Tôi biết câu trả lời.",
                "vi": "I know the answer."
              }
            },
            {
              "t": "culture",
              "title": "How students address teachers",
              "body": "A male teacher is “thầy”, a female teacher is “cô”, and the student calls themselves “em”. This holds for university students and for adults in an evening class — age does not release you from it. Vietnamese teachers are addressed by given name: “thầy Minh”, “cô Lan”."
            },
            {
              "t": "dialogue",
              "title": "Trong lớp",
              "lines": [
                {
                  "who": "A",
                  "en": "Em hỏi một câu được không ạ?",
                  "vi": "Can I ask a question?"
                },
                {
                  "who": "B",
                  "en": "Tất nhiên rồi. Câu hỏi của em là gì?",
                  "vi": "Of course. What is your question?"
                },
                {
                  "who": "A",
                  "en": "Em không làm được bài tập. Thầy giúp em được không ạ?",
                  "vi": "I can't do my homework. Can you help me?"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi đến trường mỗi ngày",
              "vi": "I go to school every day"
            },
            {
              "en": "Bạn giúp tôi được không",
              "vi": "Can you help me"
            },
            {
              "en": "Tôi làm bài tập vào buổi tối",
              "vi": "I do my homework at night"
            }
          ]
        },
        {
          "id": "v1u4l4",
          "title": "Housework",
          "goal": "Talk about chores at home.",
          "teach": [
            {
              "t": "intro",
              "title": "làm does a lot of work",
              "body": "“Làm” means do, make and work. Housework is “việc nhà” — house work — and doing it is “làm việc nhà”.",
              "bullets": [
                "làm việc nhà",
                "Common chores",
                "Helping out"
              ]
            },
            {
              "t": "vocab",
              "en": "nhà bếp",
              "vi": "Kitchen",
              "pos": "Noun",
              "ipa": "low falling · high rising",
              "pic": "kitchen",
              "ex": {
                "en": "Mẹ tôi đang ở trong bếp.",
                "vi": "My mother is in the kitchen."
              }
            },
            {
              "t": "vocab",
              "en": "phòng ngủ",
              "vi": "Bedroom",
              "pos": "Noun",
              "ipa": "low falling · dipping",
              "pic": "bedroom",
              "ex": {
                "en": "Tôi ở chung phòng ngủ với em trai.",
                "vi": "I share a bedroom with my brother."
              }
            },
            {
              "t": "vocab",
              "en": "dọn dẹp",
              "vi": "Clean",
              "pos": "Verb",
              "ipa": "heavy stop · heavy stop",
              "pic": "clean",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi dọn phòng mỗi chủ nhật.",
                "vi": "I clean my room every Sunday."
              }
            },
            {
              "t": "vocab",
              "en": "rửa",
              "vi": "Wash",
              "pos": "Verb",
              "ipa": "dipping",
              "pic": "wash",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi rửa bát sau bữa tối.",
                "vi": "I wash the dishes after dinner."
              }
            },
            {
              "t": "vocab",
              "en": "gọn gàng",
              "vi": "Tidy",
              "pos": "Adjective",
              "ipa": "heavy stop · low falling",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Phòng cô ấy lúc nào cũng gọn gàng.",
                "vi": "Her room is always tidy."
              }
            },
            {
              "t": "vocab",
              "en": "thường xuyên",
              "vi": "Often",
              "pos": "Adverb",
              "ipa": "low falling · mid level",
              "ex": {
                "en": "Tôi thường giúp mẹ.",
                "vi": "I often help my mother."
              }
            },
            {
              "t": "dialogue",
              "title": "Ai làm việc gì",
              "lines": [
                {
                  "who": "A",
                  "en": "Bạn có giúp gia đình việc nhà không?",
                  "vi": "Do you help your family at home?"
                },
                {
                  "who": "B",
                  "en": "Có. Tôi thường dọn phòng ngủ và rửa bát.",
                  "vi": "Yes. I often clean my bedroom and wash the dishes."
                },
                {
                  "who": "A",
                  "en": "Còn em trai bạn?",
                  "vi": "What about your brother?"
                },
                {
                  "who": "B",
                  "en": "Nó không bao giờ dọn phòng!",
                  "vi": "He never tidies his room!"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi thường giúp mẹ",
              "vi": "I often help my mother"
            },
            {
              "en": "Tôi rửa bát sau bữa tối",
              "vi": "I wash the dishes after dinner"
            },
            {
              "en": "Mẹ tôi đang ở trong bếp",
              "vi": "My mother is in the kitchen"
            },
            {
              "en": "Phòng cô ấy lúc nào cũng gọn gàng",
              "vi": "Her room is always tidy"
            },
            {
              "en": "Tôi dọn phòng mỗi chủ nhật",
              "vi": "I clean my room every Sunday"
            }
          ]
        },
        {
          "id": "v1u4l5",
          "title": "My day off",
          "goal": "Talk about the past and the future with two small words.",
          "teach": [
            {
              "t": "intro",
              "title": "Vietnamese has no tenses — it has markers",
              "body": "To place something in the past you may add “đã”, for the future “sẽ”. They are optional: if you already said “yesterday”, nobody adds “đã”. This is the opposite of English, where the tense is compulsory.",
              "bullets": [
                "đã = already happened",
                "sẽ = will happen",
                "Why you can often drop both"
              ]
            },
            {
              "t": "vocab",
              "en": "chơi",
              "vi": "Play",
              "pos": "Verb",
              "ipa": "mid level",
              "pic": "play",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi chơi bóng đá với bạn bè.",
                "vi": "I play football with my friends."
              }
            },
            {
              "t": "vocab",
              "en": "chạy",
              "vi": "Run",
              "pos": "Verb",
              "ipa": "heavy stop",
              "pic": "run",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi chạy trong công viên mỗi sáng.",
                "vi": "I run in the park every morning."
              }
            },
            {
              "t": "vocab",
              "en": "đọc",
              "vi": "Read",
              "pos": "Verb",
              "ipa": "heavy stop",
              "pic": "read",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi thích đọc sách.",
                "vi": "I like reading books."
              }
            },
            {
              "t": "vocab",
              "en": "nghe",
              "vi": "Listen",
              "pos": "Verb",
              "ipa": "mid level",
              "pic": "listen",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi nghe nhạc mỗi ngày.",
                "vi": "I listen to music every day."
              }
            },
            {
              "t": "vocab",
              "en": "công viên",
              "vi": "Park",
              "pos": "Noun",
              "ipa": "mid level · mid level",
              "pic": "park",
              "ex": {
                "en": "Công viên ở gần nhà tôi.",
                "vi": "The park is near my house."
              }
            },
            {
              "t": "vocab",
              "en": "vườn",
              "vi": "Garden",
              "pos": "Noun",
              "ipa": "low falling",
              "pic": "garden",
              "ex": {
                "en": "Bà tôi làm vườn.",
                "vi": "My grandmother works in the garden."
              }
            },
            {
              "t": "grammar",
              "title": "đã and sẽ — helpful, not compulsory",
              "body": "The marker goes directly before the verb. Drop it whenever a time word already makes the time obvious.",
              "rows": [
                [
                  "Neutral",
                  "Tôi đi Hà Nội.",
                  "I go / went / will go to Hanoi"
                ],
                [
                  "Past",
                  "Tôi đã đi Hà Nội.",
                  "I went to Hanoi"
                ],
                [
                  "Future",
                  "Tôi sẽ đi Hà Nội.",
                  "I will go to Hanoi"
                ],
                [
                  "Time word, no marker",
                  "Hôm qua tôi đi Hà Nội.",
                  "Yesterday I went to Hanoi ✓"
                ],
                [
                  "Right now",
                  "Tôi đang ăn.",
                  "I am eating (đang = in progress)"
                ]
              ],
              "tip": "Learn three: đã (past), đang (in progress), sẽ (future). That is the whole tense system."
            },
            {
              "t": "dialogue",
              "title": "Rủ nhau đi chơi",
              "lines": [
                {
                  "who": "A",
                  "en": "Cuối tuần bạn làm gì?",
                  "vi": "What do you do at the weekend?"
                },
                {
                  "who": "B",
                  "en": "Tôi thích đọc sách và nghe nhạc.",
                  "vi": "I like reading and listening to music."
                },
                {
                  "who": "A",
                  "en": "Mai mình chạy bộ ở công viên đi!",
                  "vi": "Let's run in the park tomorrow!"
                },
                {
                  "who": "B",
                  "en": "Ý hay đấy. Hẹn gặp lúc sáu giờ nhé!",
                  "vi": "Good idea. See you at six!"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi thích đọc sách",
              "vi": "I like reading books"
            },
            {
              "en": "Mình chơi bóng đá đi",
              "vi": "Let us play football"
            },
            {
              "en": "Tôi nghe nhạc mỗi ngày",
              "vi": "I listen to music every day"
            },
            {
              "en": "Công viên ở gần nhà tôi",
              "vi": "The park is near my house"
            },
            {
              "en": "Tôi chạy trong công viên mỗi sáng",
              "vi": "I run in the park every morning"
            }
          ]
        },
        {
          "id": "v1u4l6",
          "title": "Unit 4 review",
          "goal": "Put everything from this unit together.",
          "teach": [],
          "sentences": [],
          "checkpoint": true
        }
      ]
    },
    {
      "id": "v1u5",
      "title": "Numbers & Shopping",
      "goal": "Count, ask prices and buy things.",
      "lessons": [
        {
          "id": "v1u5l1",
          "title": "Numbers 1–100",
          "goal": "Count — and dodge the three traps in Vietnamese numbers.",
          "teach": [
            {
              "t": "intro",
              "title": "Vietnamese counting is regular, with three exceptions",
              "body": "The system is beautifully logical: twenty-one is “two ten one”. But three sounds change above ten, and every learner trips on them.",
              "bullets": [
                "The regular pattern",
                "một → mốt, năm → lăm",
                "mười → mươi"
              ]
            },
            {
              "t": "vocab",
              "en": "con số",
              "vi": "Number",
              "pos": "Noun",
              "ipa": "mid level · high rising",
              "pic": "number",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Số điện thoại của bạn là gì?",
                "vi": "What is your phone number?"
              }
            },
            {
              "t": "vocab",
              "en": "thứ nhất",
              "vi": "First",
              "pos": "Adjective",
              "ipa": "high rising · high rising",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Đây là bài học đầu tiên của tôi.",
                "vi": "This is my first lesson."
              }
            },
            {
              "t": "vocab",
              "en": "đếm",
              "vi": "Count",
              "pos": "Verb",
              "ipa": "high rising",
              "pic": "count",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Bạn đếm đến hai mươi được không?",
                "vi": "Can you count to twenty?"
              }
            },
            {
              "t": "vocab",
              "en": "tuổi",
              "vi": "Age",
              "pos": "Noun",
              "ipa": "dipping",
              "pic": "age",
              "ex": {
                "en": "Tuổi tôi là mười lăm.",
                "vi": "My age is fifteen."
              }
            },
            {
              "t": "grammar",
              "title": "The three sound changes",
              "body": "Everything is regular until you pass ten. Then three words shift.",
              "rows": [
                [
                  "10",
                  "mười",
                  "—"
                ],
                [
                  "15",
                  "mười lăm",
                  "năm becomes lăm ✗ mười năm"
                ],
                [
                  "20",
                  "hai mươi",
                  "mười becomes mươi after a number"
                ],
                [
                  "21",
                  "hai mươi mốt",
                  "một becomes mốt ✗ hai mươi một"
                ],
                [
                  "25",
                  "hai mươi lăm",
                  "both changes at once"
                ]
              ],
              "tip": "Why: “mười năm” would mean ten years. The sound change keeps the two apart."
            },
            {
              "t": "dialogue",
              "title": "Hỏi tuổi",
              "lines": [
                {
                  "who": "A",
                  "en": "Bạn bao nhiêu tuổi?",
                  "vi": "How old are you?"
                },
                {
                  "who": "B",
                  "en": "Tôi mười lăm tuổi. Còn bạn?",
                  "vi": "I am fifteen years old. And you?"
                },
                {
                  "who": "A",
                  "en": "Tôi mười ba. Bố tôi năm mươi.",
                  "vi": "I am thirteen. My father is fifty."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Bạn bao nhiêu tuổi",
              "vi": "How old are you"
            },
            {
              "en": "Tôi mười lăm tuổi",
              "vi": "I am fifteen years old"
            },
            {
              "en": "Đây là bài học đầu tiên của tôi",
              "vi": "This is my first lesson"
            }
          ]
        },
        {
          "id": "v1u5l2",
          "title": "At the shop",
          "goal": "Ask the price and understand the answer.",
          "teach": [
            {
              "t": "intro",
              "title": "The most useful question in Vietnam",
              "body": "“Bao nhiêu tiền?” — how much money? Learn it before anything else. And be ready for prices in thousands: everything has three zeros.",
              "bullets": [
                "Bao nhiêu tiền?",
                "Nghìn = thousand",
                "Saying it is expensive"
              ]
            },
            {
              "t": "vocab",
              "en": "cửa hàng",
              "vi": "Shop",
              "pos": "Noun",
              "ipa": "dipping · low falling",
              "pic": "shop",
              "ex": {
                "en": "Cửa hàng mở cửa lúc chín giờ.",
                "vi": "The shop opens at nine."
              }
            },
            {
              "t": "vocab",
              "en": "giá",
              "vi": "Price",
              "pos": "Noun",
              "ipa": "high rising",
              "ex": {
                "en": "Giá cao quá.",
                "vi": "The price is too high."
              }
            },
            {
              "t": "vocab",
              "en": "trả tiền",
              "vi": "Pay",
              "pos": "Verb",
              "ipa": "dipping · low falling",
              "pic": "pay",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi trả bằng thẻ được không?",
                "vi": "Can I pay by card?"
              }
            },
            {
              "t": "vocab",
              "en": "rẻ",
              "vi": "Cheap",
              "pos": "Adjective",
              "ipa": "dipping",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Cái áo này rất rẻ.",
                "vi": "This shirt is very cheap."
              }
            },
            {
              "t": "vocab",
              "en": "đắt",
              "vi": "Expensive",
              "pos": "Adjective",
              "ipa": "high rising",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Chiếc điện thoại đó đắt.",
                "vi": "That phone is expensive."
              }
            },
            {
              "t": "vocab",
              "en": "cỡ",
              "vi": "Size",
              "pos": "Noun",
              "ipa": "creaky rising",
              "ex": {
                "en": "Bạn muốn cỡ nào?",
                "vi": "What size do you want?"
              }
            },
            {
              "t": "phrase",
              "en": "Cái này bao nhiêu tiền?",
              "vi": "How much is it?",
              "pos": "Phrase",
              "ipa": "high rising · low falling · mid level · mid level · low falling",
              "note": "“cái” is a classifier — for most everyday objects. Vietnamese nouns almost always need one, so learn the two words together."
            },
            {
              "t": "grammar",
              "title": "Prices and the thousands",
              "body": "Vietnamese money runs in thousands, so “nghìn” is in almost every price. People often drop it entirely and just say the number.",
              "rows": [
                [
                  "Question",
                  "Cái này bao nhiêu tiền?",
                  "How much is this?"
                ],
                [
                  "50,000₫",
                  "năm mươi nghìn",
                  "fifty thousand"
                ],
                [
                  "Spoken short",
                  "năm mươi",
                  "fifty — the nghìn is understood"
                ],
                [
                  "Too expensive",
                  "Đắt quá!",
                  "Too expensive!"
                ],
                [
                  "Cheaper?",
                  "Bớt một chút được không?",
                  "Can you come down a little?"
                ]
              ],
              "tip": "“nghìn” in the north, “ngàn” in the south. Same thousand."
            },
            {
              "t": "dialogue",
              "title": "Mua áo",
              "lines": [
                {
                  "who": "A",
                  "en": "Cái áo này bao nhiêu tiền?",
                  "vi": "How much is this shirt?"
                },
                {
                  "who": "B",
                  "en": "Hai trăm nghìn đồng.",
                  "vi": "It is two hundred thousand dong."
                },
                {
                  "who": "A",
                  "en": "Đắt quá. Có cái nào rẻ hơn không?",
                  "vi": "That is expensive. Do you have a cheaper one?"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Cái áo này bao nhiêu tiền",
              "vi": "How much is this shirt"
            },
            {
              "en": "Tôi trả bằng thẻ được không",
              "vi": "Can I pay by card"
            },
            {
              "en": "Chiếc điện thoại đó rất đắt",
              "vi": "That phone is very expensive"
            }
          ]
        },
        {
          "id": "v1u5l3",
          "title": "Colours & Clothes",
          "goal": "Describe what someone is wearing.",
          "teach": [
            {
              "t": "intro",
              "title": "Colours are nouns with a hat on",
              "body": "Most colour words start with “màu” (colour). And like all describing words, they come after the thing they describe.",
              "bullets": [
                "màu + colour",
                "Colour after the noun",
                "Clothes vocabulary"
              ]
            },
            {
              "t": "vocab",
              "en": "màu đỏ",
              "vi": "Red",
              "pos": "Adjective",
              "ipa": "low falling · dipping",
              "pic": "red",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Cô ấy có một cái túi màu đỏ.",
                "vi": "She has a red bag."
              }
            },
            {
              "t": "vocab",
              "en": "màu xanh dương",
              "vi": "Blue",
              "pos": "Adjective",
              "ipa": "low falling · mid level · mid level",
              "pic": "blue",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Bầu trời màu xanh.",
                "vi": "The sky is blue."
              }
            },
            {
              "t": "vocab",
              "en": "màu xanh lá",
              "vi": "Green",
              "pos": "Adjective",
              "ipa": "low falling · mid level · high rising",
              "pic": "green",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Tôi thích trà xanh.",
                "vi": "I like green tea."
              }
            },
            {
              "t": "vocab",
              "en": "màu đen",
              "vi": "Black",
              "pos": "Adjective",
              "ipa": "low falling · mid level",
              "pic": "black",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Anh ấy mặc áo đen.",
                "vi": "He wears a black shirt."
              }
            },
            {
              "t": "vocab",
              "en": "màu trắng",
              "vi": "White",
              "pos": "Adjective",
              "ipa": "low falling · high rising",
              "pic": "white",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Tôi cần một cái áo trắng.",
                "vi": "I need a white shirt."
              }
            },
            {
              "t": "vocab",
              "en": "áo sơ mi",
              "vi": "Shirt",
              "pos": "Noun",
              "ipa": "high rising · mid level · mid level",
              "pic": "shirt",
              "ex": {
                "en": "Cái áo này rộng quá.",
                "vi": "This shirt is too big."
              }
            },
            {
              "t": "vocab",
              "en": "mặc",
              "vi": "Wear",
              "pos": "Verb",
              "ipa": "heavy stop",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi mặc áo trắng đi học.",
                "vi": "I wear a white shirt to school."
              }
            },
            {
              "t": "grammar",
              "title": "Colour words follow the noun",
              "body": "“Áo đỏ” is red shirt — shirt red. Adding “màu” makes it more explicit but is often dropped.",
              "rows": [
                [
                  "áo đỏ",
                  "shirt red",
                  "a red shirt"
                ],
                [
                  "áo màu đỏ",
                  "shirt colour red",
                  "same, a bit fuller"
                ],
                [
                  "Question",
                  "Áo màu gì?",
                  "What colour is the shirt?"
                ],
                [
                  "Two describers",
                  "áo đỏ đẹp",
                  "a nice red shirt"
                ]
              ],
              "tip": "“xanh” covers both blue and green. To be exact: “xanh da trời” (sky blue), “xanh lá cây” (leaf green)."
            },
            {
              "t": "dialogue",
              "title": "Chọn áo",
              "lines": [
                {
                  "who": "A",
                  "en": "Bạn muốn màu gì?",
                  "vi": "What colour do you want?"
                },
                {
                  "who": "B",
                  "en": "Tôi muốn áo trắng, cỡ vừa.",
                  "vi": "I want a white shirt, size medium."
                },
                {
                  "who": "A",
                  "en": "Chúng tôi cũng có cái màu xanh to hơn.",
                  "vi": "We have a big blue one too."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi mặc áo trắng đi học",
              "vi": "I wear a white shirt to school"
            },
            {
              "en": "Cô ấy có một cái túi đỏ to",
              "vi": "She has a big red bag"
            },
            {
              "en": "Bạn muốn màu gì",
              "vi": "What colour do you want"
            }
          ]
        },
        {
          "id": "v1u5l4",
          "title": "Days, months & birthdays",
          "goal": "Say the date — by counting.",
          "teach": [
            {
              "t": "intro",
              "title": "Days and months are numbered, not named",
              "body": "Vietnamese does not name the days after gods or the months after emperors. Monday is “day two”, January is “month one”. Once you can count, you already know them.",
              "bullets": [
                "thứ hai = Monday",
                "tháng một = January",
                "Date order: day, month, year"
              ]
            },
            {
              "t": "vocab",
              "en": "thứ Hai",
              "vi": "Monday",
              "pos": "Noun",
              "ipa": "high rising · mid level",
              "ex": {
                "en": "Tôi có lớp vào thứ Hai.",
                "vi": "I have class on Monday."
              }
            },
            {
              "t": "vocab",
              "en": "chủ nhật",
              "vi": "Sunday",
              "pos": "Noun",
              "ipa": "dipping · heavy stop",
              "ex": {
                "en": "Chủ nhật tôi ở nhà.",
                "vi": "I stay home on Sunday."
              }
            },
            {
              "t": "vocab",
              "en": "tháng",
              "vi": "Month",
              "pos": "Noun",
              "ipa": "high rising",
              "pic": "month",
              "ex": {
                "en": "Một năm có mười hai tháng.",
                "vi": "There are twelve months in a year."
              }
            },
            {
              "t": "vocab",
              "en": "năm",
              "vi": "Year",
              "pos": "Noun",
              "ipa": "mid level",
              "pic": "year",
              "note": "Same word for “five” and for “year”. Also, after “mười”, five becomes “lăm”: fifteen is “mười lăm”.",
              "ex": {
                "en": "Hẹn gặp lại năm sau!",
                "vi": "See you next year!"
              }
            },
            {
              "t": "vocab",
              "en": "sinh nhật",
              "vi": "Birthday",
              "pos": "Noun",
              "ipa": "mid level · heavy stop",
              "pic": "birthday",
              "ex": {
                "en": "Sinh nhật tôi vào tháng Năm.",
                "vi": "My birthday is in May."
              }
            },
            {
              "t": "vocab",
              "en": "ngày (trong tháng)",
              "vi": "Date",
              "pos": "Noun",
              "ipa": "low falling · mid level · high rising",
              "pic": "date",
              "ex": {
                "en": "Hôm nay là ngày mấy?",
                "vi": "What is the date today?"
              }
            },
            {
              "t": "grammar",
              "title": "Counting the calendar",
              "body": "Sunday is the odd one out — it is “chủ nhật”, the master day, not a number. Everything else counts from there.",
              "rows": [
                [
                  "Sunday",
                  "chủ nhật",
                  "the only named day"
                ],
                [
                  "Monday",
                  "thứ hai",
                  "day two"
                ],
                [
                  "Tuesday",
                  "thứ ba",
                  "day three"
                ],
                [
                  "Saturday",
                  "thứ bảy",
                  "day seven"
                ],
                [
                  "January",
                  "tháng một",
                  "month one"
                ],
                [
                  "Date",
                  "ngày 5 tháng 9",
                  "5 September — day then month"
                ]
              ],
              "tip": "Vietnamese always writes day before month, as in Britain, not month before day."
            },
            {
              "t": "dialogue",
              "title": "Hỏi ngày sinh nhật",
              "lines": [
                {
                  "who": "A",
                  "en": "Sinh nhật bạn khi nào?",
                  "vi": "When is your birthday?"
                },
                {
                  "who": "B",
                  "en": "Vào tháng Năm. Còn bạn?",
                  "vi": "It is in May. What about you?"
                },
                {
                  "who": "A",
                  "en": "Của tôi vào chủ nhật này! Đến nhà tôi nhé.",
                  "vi": "Mine is on Sunday! Come to my house."
                },
                {
                  "who": "B",
                  "en": "Tất nhiên rồi. Chúc mừng sinh nhật!",
                  "vi": "Of course. Happy birthday!"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Sinh nhật tôi vào tháng Năm",
              "vi": "My birthday is in May"
            },
            {
              "en": "Tôi có lớp vào thứ Hai",
              "vi": "I have class on Monday"
            },
            {
              "en": "Hôm nay là ngày mấy",
              "vi": "What is the date today"
            },
            {
              "en": "Một năm có mười hai tháng",
              "vi": "There are twelve months in a year"
            },
            {
              "en": "Chủ nhật tôi ở nhà",
              "vi": "I stay home on Sunday"
            }
          ]
        },
        {
          "id": "v1u5l5",
          "title": "Going to market",
          "goal": "Buy food at a market and bargain politely.",
          "teach": [
            {
              "t": "intro",
              "title": "Bargaining is a conversation, not a fight",
              "body": "At a market, the first price is an opening offer. Smiling, asking for a little off, and walking slowly away are all normal steps — nobody is offended.",
              "bullets": [
                "Asking per kilo",
                "Bớt một chút",
                "When not to bargain"
              ]
            },
            {
              "t": "vocab",
              "en": "chợ",
              "vi": "Market",
              "pos": "Noun",
              "ipa": "heavy stop",
              "pic": "market",
              "ex": {
                "en": "Tôi đi chợ mỗi sáng.",
                "vi": "I go to the market every morning."
              }
            },
            {
              "t": "vocab",
              "en": "cân",
              "vi": "Kilo",
              "pos": "Noun",
              "ipa": "mid level",
              "ex": {
                "en": "Tôi muốn hai cân gạo.",
                "vi": "I want two kilos of rice."
              }
            },
            {
              "t": "vocab",
              "en": "túi",
              "vi": "Bag",
              "pos": "Noun",
              "ipa": "high rising",
              "pic": "bag",
              "ex": {
                "en": "Cho tôi xin một cái túi được không?",
                "vi": "Can I have a bag, please?"
              }
            },
            {
              "t": "vocab",
              "en": "hộp",
              "vi": "Box",
              "pos": "Noun",
              "ipa": "heavy stop",
              "pic": "box",
              "ex": {
                "en": "Cô ấy mua một hộp sữa.",
                "vi": "She buys a box of milk."
              }
            },
            {
              "t": "vocab",
              "en": "một ít",
              "vi": "Some",
              "pos": "Pronoun",
              "ipa": "heavy stop · high rising",
              "ex": {
                "en": "Tôi muốn một chút nước.",
                "vi": "I want some water."
              }
            },
            {
              "t": "vocab",
              "en": "nhiều",
              "vi": "Many",
              "pos": "Adjective",
              "ipa": "low falling",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Ở đây có nhiều người.",
                "vi": "There are many people here."
              }
            },
            {
              "t": "culture",
              "title": "Where to bargain and where not to",
              "body": "Markets and street stalls: bargaining is expected, and a cheerful “Bớt một chút đi chị” is part of the ritual. Supermarkets, restaurants and shops with price tags: never — it is as odd as haggling in a London café. Aim for perhaps 20–30% off an opening market price, and if they refuse, pay it or leave with a smile."
            },
            {
              "t": "dialogue",
              "title": "Mua rau ngoài chợ",
              "lines": [
                {
                  "who": "A",
                  "en": "Cà chua này bao nhiêu tiền?",
                  "vi": "How much are these tomatoes?"
                },
                {
                  "who": "B",
                  "en": "Hai mươi nghìn một cân.",
                  "vi": "Twenty thousand a kilo."
                },
                {
                  "who": "A",
                  "en": "Cho tôi một cân. Với một ít cà rốt nữa.",
                  "vi": "I want one kilo, please. And some carrots."
                },
                {
                  "who": "B",
                  "en": "Của bạn đây. Bạn có cần túi không?",
                  "vi": "Here you are. Do you need a bag?"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Bạn muốn mấy quả táo",
              "vi": "How many apples do you want"
            },
            {
              "en": "Tôi muốn hai cân gạo",
              "vi": "I want two kilos of rice"
            },
            {
              "en": "Tôi đi chợ mỗi sáng",
              "vi": "I go to the market every morning"
            },
            {
              "en": "Ở đây có nhiều người",
              "vi": "There are many people here"
            },
            {
              "en": "Cho tôi xin một cái túi được không",
              "vi": "Can I have a bag please"
            }
          ]
        },
        {
          "id": "v1u5l6",
          "title": "Unit 5 review",
          "goal": "Put everything from this unit together.",
          "teach": [],
          "sentences": [],
          "checkpoint": true
        }
      ]
    },
    {
      "id": "v1u6",
      "title": "Health & Directions",
      "goal": "Say what hurts and find your way around.",
      "lessons": [
        {
          "id": "v1u6l1",
          "title": "Body & Illness",
          "goal": "Say what hurts.",
          "teach": [
            {
              "t": "intro",
              "title": "One word covers it",
              "body": "“Đau” means both “to hurt” and “painful”. Put it with a body part and you have said everything a pharmacist needs.",
              "bullets": [
                "đau + body part",
                "Feeling unwell",
                "At the pharmacy"
              ]
            },
            {
              "t": "vocab",
              "en": "cái đầu",
              "vi": "Head",
              "pos": "Noun",
              "ipa": "high rising · low falling",
              "pic": "head",
              "note": "“cái” is a classifier — for most everyday objects. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Tôi bị đau đầu.",
                "vi": "I have a headache."
              }
            },
            {
              "t": "vocab",
              "en": "con mắt",
              "vi": "Eye",
              "pos": "Noun",
              "ipa": "mid level · high rising",
              "pic": "eye",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Cô ấy có đôi mắt đẹp.",
                "vi": "She has beautiful eyes."
              }
            },
            {
              "t": "vocab",
              "en": "bàn tay",
              "vi": "Hand",
              "pos": "Noun",
              "ipa": "low falling · mid level",
              "pic": "hand",
              "ex": {
                "en": "Rửa tay đi.",
                "vi": "Wash your hands."
              }
            },
            {
              "t": "vocab",
              "en": "cái chân",
              "vi": "Leg",
              "pos": "Noun",
              "ipa": "high rising · mid level",
              "pic": "leg",
              "note": "“cái” is a classifier — for most everyday objects. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Chân tôi đau.",
                "vi": "My leg hurts."
              }
            },
            {
              "t": "vocab",
              "en": "ốm",
              "vi": "Sick",
              "pos": "Adjective",
              "ipa": "high rising",
              "pic": "sick",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Hôm nay anh ấy bị ốm.",
                "vi": "He is sick today."
              }
            },
            {
              "t": "vocab",
              "en": "bác sĩ",
              "vi": "Doctor",
              "pos": "Noun",
              "ipa": "high rising · creaky rising",
              "pic": "doctor",
              "ex": {
                "en": "Bạn nên đi khám bác sĩ.",
                "vi": "You should see a doctor."
              }
            },
            {
              "t": "grammar",
              "title": "Saying what hurts",
              "body": "Subject + đau + body part. No “to be”, no article, no preposition.",
              "rows": [
                [
                  "Tôi đau đầu.",
                  "I hurt head",
                  "I have a headache"
                ],
                [
                  "Tôi đau bụng.",
                  "I hurt stomach",
                  "I have a stomach ache"
                ],
                [
                  "Tôi bị ốm.",
                  "I suffer sick",
                  "I am ill"
                ],
                [
                  "Question",
                  "Anh bị sao?",
                  "What is wrong with you?"
                ]
              ],
              "tip": "“bị” marks something bad happening to you. “được” marks something good."
            },
            {
              "t": "dialogue",
              "title": "Ở phòng khám",
              "lines": [
                {
                  "who": "A",
                  "en": "Hôm nay bạn thấy thế nào?",
                  "vi": "How do you feel today?"
                },
                {
                  "who": "B",
                  "en": "Tôi bị ốm. Tôi đau đầu.",
                  "vi": "I am sick. I have a headache."
                },
                {
                  "who": "A",
                  "en": "Bạn nên đi khám bác sĩ.",
                  "vi": "You should see a doctor."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi bị đau đầu",
              "vi": "I have a headache"
            },
            {
              "en": "Hôm nay anh ấy bị ốm",
              "vi": "He is sick today"
            },
            {
              "en": "Bạn nên đi khám bác sĩ",
              "vi": "You should see a doctor"
            }
          ]
        },
        {
          "id": "v1u6l2",
          "title": "Asking directions",
          "goal": "Ask the way and understand the answer.",
          "teach": [
            {
              "t": "intro",
              "title": "Where stays at the end",
              "body": "Same rule as before: “ở đâu” goes where the answer goes, at the end. Then learn four direction words and you can follow most answers.",
              "bullets": [
                "… ở đâu?",
                "Left, right, straight",
                "Distances in Vietnamese"
              ]
            },
            {
              "t": "phrase",
              "en": "Xin lỗi",
              "vi": "Excuse me, where is the station?",
              "pos": "Phrase",
              "ipa": "mid level · creaky rising"
            },
            {
              "t": "vocab",
              "en": "bên trái",
              "vi": "Left",
              "pos": "Noun",
              "ipa": "mid level · high rising",
              "pic": "arrowleft",
              "ex": {
                "en": "Rẽ trái ở góc đường.",
                "vi": "Turn left at the corner."
              }
            },
            {
              "t": "vocab",
              "en": "bên phải",
              "vi": "Right",
              "pos": "Noun",
              "ipa": "mid level · dipping",
              "pic": "arrowright",
              "ex": {
                "en": "Cửa hàng ở bên phải.",
                "vi": "The shop is on the right."
              }
            },
            {
              "t": "vocab",
              "en": "thẳng",
              "vi": "Straight",
              "pos": "Adverb",
              "ipa": "dipping",
              "ex": {
                "en": "Đi thẳng khoảng hai phút.",
                "vi": "Go straight for two minutes."
              }
            },
            {
              "t": "vocab",
              "en": "gần",
              "vi": "Near",
              "pos": "Adjective",
              "ipa": "low falling",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Trường học gần nhà tôi.",
                "vi": "The school is near my house."
              }
            },
            {
              "t": "vocab",
              "en": "nhà ga",
              "vi": "Station",
              "pos": "Noun",
              "ipa": "low falling · mid level",
              "pic": "station",
              "ex": {
                "en": "Bến xe buýt ở đâu?",
                "vi": "Where is the bus station?"
              }
            },
            {
              "t": "vocab",
              "en": "bản đồ",
              "vi": "Map",
              "pos": "Noun",
              "ipa": "dipping · low falling",
              "pic": "map",
              "ex": {
                "en": "Cho tôi xem bản đồ được không?",
                "vi": "Can I see your map?"
              }
            },
            {
              "t": "grammar",
              "title": "Asking the way",
              "body": "Name the place, then ask where it is.",
              "rows": [
                [
                  "Question",
                  "Nhà vệ sinh ở đâu?",
                  "Where is the toilet?"
                ],
                [
                  "Straight on",
                  "đi thẳng",
                  "go straight"
                ],
                [
                  "Left",
                  "rẽ trái",
                  "turn left"
                ],
                [
                  "Right",
                  "rẽ phải",
                  "turn right"
                ],
                [
                  "Near / far",
                  "gần / xa",
                  "near / far"
                ]
              ],
              "tip": "“rẽ” in the north, “quẹo” in the south. Both mean turn."
            },
            {
              "t": "dialogue",
              "title": "Tìm nhà ga",
              "lines": [
                {
                  "who": "A",
                  "en": "Xin lỗi, nhà ga ở đâu ạ?",
                  "vi": "Excuse me, where is the station?"
                },
                {
                  "who": "B",
                  "en": "Đi thẳng, rồi rẽ trái. Nó ở gần trường học.",
                  "vi": "Go straight, then turn left. It is near the school."
                },
                {
                  "who": "A",
                  "en": "Cảm ơn bạn rất nhiều!",
                  "vi": "Thank you very much!"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Rẽ trái ở góc đường",
              "vi": "Turn left at the corner"
            },
            {
              "en": "Trường học gần nhà tôi",
              "vi": "The school is near my house"
            },
            {
              "en": "Bến xe buýt ở đâu",
              "vi": "Where is the bus station"
            }
          ]
        },
        {
          "id": "v1u6l3",
          "title": "The weather",
          "goal": "Talk about the weather — starting with the sky.",
          "teach": [
            {
              "t": "intro",
              "title": "Weather sentences start with trời",
              "body": "“Trời” is the sky. Almost every weather sentence begins with it, the way English sentences begin with an empty “it”.",
              "bullets": [
                "Trời + weather word",
                "Hot, cold, rain",
                "The two seasons"
              ]
            },
            {
              "t": "vocab",
              "en": "thời tiết",
              "vi": "Weather",
              "pos": "Noun",
              "ipa": "low falling · high rising",
              "pic": "weather",
              "ex": {
                "en": "Hôm nay thời tiết đẹp.",
                "vi": "The weather is nice today."
              }
            },
            {
              "t": "vocab",
              "en": "nắng",
              "vi": "Sunny",
              "pos": "Adjective",
              "ipa": "high rising",
              "pic": "sun",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Hôm nay trời nắng.",
                "vi": "It is sunny today."
              }
            },
            {
              "t": "vocab",
              "en": "mưa",
              "vi": "Rain",
              "pos": "Noun",
              "ipa": "mid level",
              "pic": "rain",
              "ex": {
                "en": "Tôi thích mưa.",
                "vi": "I like the rain."
              }
            },
            {
              "t": "vocab",
              "en": "lạnh",
              "vi": "Cold",
              "pos": "Adjective",
              "ipa": "heavy stop",
              "pic": "cold",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Tháng Mười Hai rất lạnh.",
                "vi": "It is very cold in December."
              }
            },
            {
              "t": "vocab",
              "en": "ấm",
              "vi": "Warm",
              "pos": "Adjective",
              "ipa": "high rising",
              "pic": "warm",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Mùa xuân thì ấm áp.",
                "vi": "Spring is warm."
              }
            },
            {
              "t": "vocab",
              "en": "gió",
              "vi": "Wind",
              "pos": "Noun",
              "ipa": "high rising",
              "pic": "wind",
              "ex": {
                "en": "Hôm nay nhiều gió.",
                "vi": "There is a lot of wind today."
              }
            },
            {
              "t": "grammar",
              "title": "Trời + weather",
              "body": "“Trời” fills the same slot as the English “it” in “it is raining”.",
              "rows": [
                [
                  "Trời mưa.",
                  "sky rain",
                  "It is raining."
                ],
                [
                  "Trời nắng.",
                  "sky sunny",
                  "It is sunny."
                ],
                [
                  "Trời nóng.",
                  "sky hot",
                  "It is hot."
                ],
                [
                  "Trời lạnh.",
                  "sky cold",
                  "It is cold."
                ],
                [
                  "Question",
                  "Hôm nay trời thế nào?",
                  "What is the weather like today?"
                ]
              ],
              "tip": "Northern Vietnam has four seasons and a genuinely cold winter. The south has two: dry and rainy."
            },
            {
              "t": "dialogue",
              "title": "Bắt chuyện về thời tiết",
              "lines": [
                {
                  "who": "A",
                  "en": "Hôm nay thời tiết thế nào?",
                  "vi": "How is the weather today?"
                },
                {
                  "who": "B",
                  "en": "Trời nắng và ấm.",
                  "vi": "It is sunny and warm."
                },
                {
                  "who": "A",
                  "en": "Tuyệt! Hôm qua trời rất lạnh.",
                  "vi": "Nice! Yesterday it was very cold."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Hôm nay thời tiết đẹp",
              "vi": "The weather is nice today"
            },
            {
              "en": "Trời nắng và ấm",
              "vi": "It is sunny and warm"
            },
            {
              "en": "Tháng Mười Hai rất lạnh",
              "vi": "It is very cold in December"
            }
          ]
        },
        {
          "id": "v1u6l4",
          "title": "Getting around",
          "goal": "Say how you travel.",
          "teach": [
            {
              "t": "intro",
              "title": "Go by something",
              "body": "“Đi bằng” means “go by”. Slot in the vehicle and you are done — and in Vietnam the answer is usually the motorbike.",
              "bullets": [
                "đi bằng + vehicle",
                "Transport words",
                "Motorbike culture"
              ]
            },
            {
              "t": "vocab",
              "en": "xe buýt",
              "vi": "Bus",
              "pos": "Noun",
              "ipa": "mid level · high rising",
              "pic": "bus",
              "ex": {
                "en": "Tôi đi học bằng xe buýt.",
                "vi": "I go to school by bus."
              }
            },
            {
              "t": "vocab",
              "en": "tàu hoả",
              "vi": "Train",
              "pos": "Noun",
              "ipa": "low falling · dipping",
              "pic": "train",
              "ex": {
                "en": "Tàu hoả rất nhanh.",
                "vi": "The train is very fast."
              }
            },
            {
              "t": "vocab",
              "en": "xe đạp",
              "vi": "Bike",
              "pos": "Noun",
              "ipa": "mid level · heavy stop",
              "pic": "bike",
              "ex": {
                "en": "Xe đạp của tôi cũ nhưng tốt.",
                "vi": "My bike is old but good."
              }
            },
            {
              "t": "vocab",
              "en": "đi bộ",
              "vi": "Walk",
              "pos": "Verb",
              "ipa": "mid level · heavy stop",
              "pic": "walk",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Tôi đi bộ đến trường mỗi ngày.",
                "vi": "I walk to school every day."
              }
            },
            {
              "t": "vocab",
              "en": "lái xe",
              "vi": "Drive",
              "pos": "Verb",
              "ipa": "high rising · mid level",
              "pic": "drive",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Bố tôi lái ô tô.",
                "vi": "My father drives a car."
              }
            },
            {
              "t": "vocab",
              "en": "phút",
              "vi": "Minute",
              "pos": "Noun",
              "ipa": "high rising",
              "pic": "minute",
              "ex": {
                "en": "Mất hai mươi phút.",
                "vi": "It takes twenty minutes."
              }
            },
            {
              "t": "grammar",
              "title": "đi bằng gì? — how do you go?",
              "body": "“bằng” means “by means of”.",
              "rows": [
                [
                  "Question",
                  "Anh đi bằng gì?",
                  "How do you travel?"
                ],
                [
                  "Motorbike",
                  "Tôi đi bằng xe máy.",
                  "I go by motorbike."
                ],
                [
                  "Bus",
                  "Tôi đi bằng xe buýt.",
                  "I go by bus."
                ],
                [
                  "On foot",
                  "Tôi đi bộ.",
                  "I walk. (no bằng)"
                ]
              ],
              "tip": "“đi bộ” literally means “go on foot” — one word, no “bằng”."
            },
            {
              "t": "dialogue",
              "title": "Hỏi đường đi học",
              "lines": [
                {
                  "who": "A",
                  "en": "Bạn đi học bằng gì?",
                  "vi": "How do you go to school?"
                },
                {
                  "who": "B",
                  "en": "Tôi đi xe đạp. Mất mười lăm phút.",
                  "vi": "I go by bike. It takes fifteen minutes."
                },
                {
                  "who": "A",
                  "en": "Nhanh đấy! Tôi đi bộ nên mất ba mươi phút.",
                  "vi": "That is fast! I walk, so it takes thirty minutes."
                },
                {
                  "who": "B",
                  "en": "Vậy mai đi xe buýt đi!",
                  "vi": "Then take the bus tomorrow!"
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi đi học bằng xe buýt",
              "vi": "I go to school by bus"
            },
            {
              "en": "Bạn đi học bằng gì",
              "vi": "How do you go to school"
            },
            {
              "en": "Mất hai mươi phút",
              "vi": "It takes twenty minutes"
            },
            {
              "en": "Tôi đi bộ đến trường mỗi ngày",
              "vi": "I walk to school every day"
            },
            {
              "en": "Bố tôi lái ô tô",
              "vi": "My father drives a car"
            }
          ]
        },
        {
          "id": "v1u6l5",
          "title": "At the hospital",
          "goal": "Handle a visit to the doctor.",
          "teach": [
            {
              "t": "intro",
              "title": "The words you hope not to need",
              "body": "Worth ten minutes anyway. “Bác sĩ” is doctor, “bệnh viện” is hospital, and “Tôi cần giúp đỡ” is “I need help”.",
              "bullets": [
                "Doctor and hospital",
                "Describing symptoms",
                "Asking for help"
              ]
            },
            {
              "t": "vocab",
              "en": "bệnh viện",
              "vi": "Hospital",
              "pos": "Noun",
              "ipa": "heavy stop · heavy stop",
              "pic": "hospital",
              "ex": {
                "en": "Bệnh viện ở gần nhà ga.",
                "vi": "The hospital is near the station."
              }
            },
            {
              "t": "vocab",
              "en": "thuốc",
              "vi": "Medicine",
              "pos": "Noun",
              "ipa": "high rising",
              "pic": "medicine",
              "ex": {
                "en": "Uống thuốc này hai lần mỗi ngày.",
                "vi": "Take this medicine twice a day."
              }
            },
            {
              "t": "vocab",
              "en": "đau",
              "vi": "Hurt",
              "pos": "Verb",
              "ipa": "mid level",
              "pic": "hurt",
              "note": "Covers both “to hurt” and “painful”. Point at the place and say “Đau” — every doctor in Vietnam understands.",
              "ex": {
                "en": "Chân tôi đau.",
                "vi": "My leg hurts."
              }
            },
            {
              "t": "vocab",
              "en": "sốt",
              "vi": "Fever",
              "pos": "Noun",
              "ipa": "high rising",
              "pic": "fever",
              "ex": {
                "en": "Cô ấy sốt cao.",
                "vi": "She has a high fever."
              }
            },
            {
              "t": "vocab",
              "en": "nghỉ ngơi",
              "vi": "Rest",
              "pos": "Verb",
              "ipa": "dipping · mid level",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Bạn cần nghỉ ở nhà.",
                "vi": "You need to rest at home."
              }
            },
            {
              "t": "vocab",
              "en": "khá hơn",
              "vi": "Better",
              "pos": "Adjective",
              "ipa": "high rising · mid level",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Hôm nay tôi thấy đỡ hơn.",
                "vi": "I feel better today."
              }
            },
            {
              "t": "culture",
              "title": "Pharmacies come first",
              "body": "For anything minor, Vietnamese people go straight to a pharmacy — “nhà thuốc” — not to a doctor. The pharmacist listens, hands you what you need, and charges very little. Point at what hurts, say “đau”, and you will be looked after. Hospitals are for serious matters."
            },
            {
              "t": "dialogue",
              "title": "Khám bệnh",
              "lines": [
                {
                  "who": "A",
                  "en": "Chào buổi sáng. Bạn bị làm sao?",
                  "vi": "Good morning. What is the problem?"
                },
                {
                  "who": "B",
                  "en": "Tôi bị sốt và đau đầu.",
                  "vi": "I have a fever and my head hurts."
                },
                {
                  "who": "A",
                  "en": "Uống thuốc này và nghỉ ở nhà nhé.",
                  "vi": "Take this medicine and rest at home."
                },
                {
                  "who": "B",
                  "en": "Cảm ơn bác sĩ. Mong là mai tôi đỡ hơn.",
                  "vi": "Thank you, doctor. I hope I feel better tomorrow."
                }
              ]
            }
          ],
          "sentences": [
            {
              "en": "Tôi bị sốt",
              "vi": "I have a fever"
            },
            {
              "en": "Chân tôi đau",
              "vi": "My leg hurts"
            },
            {
              "en": "Bạn cần nghỉ ở nhà",
              "vi": "You need to rest at home"
            },
            {
              "en": "Hôm nay tôi thấy đỡ hơn",
              "vi": "I feel better today"
            },
            {
              "en": "Uống thuốc này hai lần mỗi ngày",
              "vi": "Take this medicine twice a day"
            }
          ]
        },
        {
          "id": "v1u6l6",
          "title": "Unit 6 review",
          "goal": "Put everything from this unit together.",
          "teach": [],
          "sentences": [],
          "checkpoint": true
        }
      ]
    },
    {
      "id": "v1u7",
      "title": "Body, Colours & Animals",
      "goal": "Name what you see around you.",
      "lessons": [
        {
          "id": "v1u7l1",
          "title": "My body",
          "goal": "Name body parts and their classifiers.",
          "teach": [
            {
              "t": "intro",
              "title": "Even body parts take classifiers",
              "body": "Vietnamese counts almost nothing bare. Hands and legs take “cái” or “bàn”, eyes take “con” — yes, the animal classifier.",
              "bullets": [
                "Body parts",
                "Classifiers for parts of the body",
                "Talking about pain again"
              ]
            },
            {
              "t": "vocab",
              "en": "đầu",
              "vi": "Head",
              "pos": "Noun",
              "ipa": "low falling",
              "pic": "head",
              "ex": {
                "en": "Tôi đau đầu.",
                "vi": "My head hurts."
              }
            },
            {
              "t": "vocab",
              "en": "khuôn mặt",
              "vi": "Face",
              "pos": "Noun",
              "ipa": "mid level · heavy stop",
              "pic": "face",
              "ex": {
                "en": "Cô ấy có khuôn mặt hiền.",
                "vi": "She has a kind face."
              }
            },
            {
              "t": "vocab",
              "en": "mắt",
              "vi": "Eye",
              "pos": "Noun",
              "ipa": "high rising",
              "pic": "eye",
              "ex": {
                "en": "Cậu ấy có đôi mắt to.",
                "vi": "He has big eyes."
              }
            },
            {
              "t": "vocab",
              "en": "tai",
              "vi": "Ear",
              "pos": "Noun",
              "ipa": "mid level",
              "pic": "ear",
              "ex": {
                "en": "Tôi đau tai.",
                "vi": "My ear hurts."
              }
            },
            {
              "t": "vocab",
              "en": "mũi",
              "vi": "Nose",
              "pos": "Noun",
              "ipa": "creaky rising",
              "pic": "nose",
              "ex": {
                "en": "Tôi bị sổ mũi.",
                "vi": "I have a runny nose."
              }
            },
            {
              "t": "vocab",
              "en": "miệng",
              "vi": "Mouth",
              "pos": "Noun",
              "ipa": "heavy stop",
              "pic": "mouth",
              "ex": {
                "en": "Há miệng ra nào.",
                "vi": "Open your mouth."
              }
            },
            {
              "t": "vocab",
              "en": "bàn tay",
              "vi": "Hand",
              "pos": "Noun",
              "ipa": "low falling · mid level",
              "pic": "hand",
              "ex": {
                "en": "Rửa tay đi con.",
                "vi": "Wash your hands."
              }
            },
            {
              "t": "vocab",
              "en": "cánh tay",
              "vi": "Arm",
              "pos": "Noun",
              "ipa": "high rising · mid level",
              "pic": "arm",
              "ex": {
                "en": "Cánh tay tôi mỏi.",
                "vi": "My arm is tired."
              }
            },
            {
              "t": "vocab",
              "en": "bàn chân",
              "vi": "Foot",
              "pos": "Noun",
              "ipa": "low falling · mid level",
              "pic": "foot",
              "ex": {
                "en": "Tôi đau chân.",
                "vi": "My foot hurts."
              }
            },
            {
              "t": "vocab",
              "en": "răng",
              "vi": "Tooth",
              "pos": "Noun",
              "ipa": "mid level",
              "pic": "tooth",
              "ex": {
                "en": "Đánh răng đi con.",
                "vi": "Brush your teeth."
              }
            }
          ],
          "sentences": [
            {
              "en": "Tôi đau đầu",
              "vi": "My head hurts"
            },
            {
              "en": "Rửa tay đi",
              "vi": "Wash your hands"
            },
            {
              "en": "Cô ấy có đôi mắt to",
              "vi": "She has big eyes"
            },
            {
              "en": "Đánh răng đi",
              "vi": "Brush your teeth"
            }
          ]
        },
        {
          "id": "v1u7l2",
          "title": "Colours",
          "goal": "Name colours — and the one that covers two English words.",
          "teach": [
            {
              "t": "intro",
              "title": "Blue and green are the same word",
              "body": "“Xanh” is both. If the difference matters, you say sky-xanh or leaf-xanh. Most of the time nobody bothers.",
              "bullets": [
                "The main colours",
                "xanh = blue and green",
                "Colour after the noun"
              ]
            },
            {
              "t": "vocab",
              "en": "màu đỏ",
              "vi": "Red",
              "pos": "Adjective",
              "ipa": "low falling · dipping",
              "pic": "red",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Tôi muốn một cái túi đỏ.",
                "vi": "I want a red bag."
              }
            },
            {
              "t": "vocab",
              "en": "màu xanh dương",
              "vi": "Blue",
              "pos": "Adjective",
              "ipa": "low falling · mid level · mid level",
              "pic": "blue",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Bầu trời màu xanh.",
                "vi": "The sky is blue."
              }
            },
            {
              "t": "vocab",
              "en": "màu xanh lá",
              "vi": "Green",
              "pos": "Adjective",
              "ipa": "low falling · mid level · high rising",
              "pic": "green",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Cái cây màu xanh lá.",
                "vi": "The tree is green."
              }
            },
            {
              "t": "vocab",
              "en": "màu vàng",
              "vi": "Yellow",
              "pos": "Adjective",
              "ipa": "low falling · low falling",
              "pic": "yellow",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Tôi thích cái màu vàng.",
                "vi": "I like the yellow one."
              }
            },
            {
              "t": "vocab",
              "en": "màu đen",
              "vi": "Black",
              "pos": "Adjective",
              "ipa": "low falling · mid level",
              "pic": "black",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Anh ấy mặc áo đen.",
                "vi": "He wears a black shirt."
              }
            },
            {
              "t": "vocab",
              "en": "màu trắng",
              "vi": "White",
              "pos": "Adjective",
              "ipa": "low falling · high rising",
              "pic": "white",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Tôi cần một cái áo trắng.",
                "vi": "I need a white shirt."
              }
            },
            {
              "t": "vocab",
              "en": "màu nâu",
              "vi": "Brown",
              "pos": "Adjective",
              "ipa": "low falling · mid level",
              "pic": "brown",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Cô ấy tóc nâu.",
                "vi": "She has brown hair."
              }
            },
            {
              "t": "vocab",
              "en": "màu hồng",
              "vi": "Pink",
              "pos": "Adjective",
              "ipa": "low falling · low falling",
              "pic": "pink",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Em gái tôi thích màu hồng.",
                "vi": "My sister likes pink."
              }
            },
            {
              "t": "vocab",
              "en": "màu cam",
              "vi": "Orange",
              "pos": "Adjective",
              "ipa": "low falling · mid level",
              "pic": "orange",
              "note": "Adjectives come AFTER the noun, the opposite of English: “nhà đẹp” = house beautiful.",
              "ex": {
                "en": "Cái túi màu cam.",
                "vi": "The bag is orange."
              }
            },
            {
              "t": "vocab",
              "en": "màu sắc",
              "vi": "Colour",
              "pos": "Noun",
              "ipa": "low falling · high rising",
              "pic": "colour",
              "ex": {
                "en": "Bạn muốn màu gì?",
                "vi": "What colour do you want?"
              }
            },
            {
              "t": "culture",
              "title": "Colours carry meaning",
              "body": "Red and gold are lucky and cover everything at Tết and at weddings. White is the colour of mourning — a white envelope or white flowers at a celebration is a genuine mistake. Black is avoided at happy occasions. If you are giving a gift, wrap it in red or gold and you can do no wrong."
            }
          ],
          "sentences": [
            {
              "en": "Tôi muốn một cái túi đỏ",
              "vi": "I want a red bag"
            },
            {
              "en": "Bầu trời màu xanh",
              "vi": "The sky is blue"
            },
            {
              "en": "Cô ấy tóc nâu",
              "vi": "She has brown hair"
            },
            {
              "en": "Cái đó màu gì",
              "vi": "What colour is it"
            }
          ]
        },
        {
          "id": "v1u7l3",
          "title": "In the classroom",
          "goal": "Name classroom objects and follow instructions.",
          "teach": [
            {
              "t": "intro",
              "title": "Classroom Vietnamese",
              "body": "Objects take “cái” or “quyển”. And there are a handful of instructions your teacher will use constantly — learn them and the lesson runs smoothly.",
              "bullets": [
                "Classroom objects",
                "quyển for books",
                "Instructions you will hear"
              ]
            },
            {
              "t": "vocab",
              "en": "bút mực",
              "vi": "Pen",
              "pos": "Noun",
              "ipa": "high rising · heavy stop",
              "pic": "pen",
              "ex": {
                "en": "Cho tôi mượn bút được không?",
                "vi": "Can I borrow your pen?"
              }
            },
            {
              "t": "vocab",
              "en": "bút chì",
              "vi": "Pencil",
              "pos": "Noun",
              "ipa": "high rising · low falling",
              "pic": "pencil",
              "ex": {
                "en": "Tôi cần một cái bút chì.",
                "vi": "I need a pencil."
              }
            },
            {
              "t": "vocab",
              "en": "quyển vở",
              "vi": "Notebook",
              "pos": "Noun",
              "ipa": "dipping · dipping",
              "pic": "notebook",
              "note": "“quyển” is a classifier — for books and notebooks. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Mở vở ra nào.",
                "vi": "Open your notebook."
              }
            },
            {
              "t": "vocab",
              "en": "thước kẻ",
              "vi": "Ruler",
              "pos": "Noun",
              "ipa": "high rising · dipping",
              "pic": "ruler",
              "ex": {
                "en": "Thước của tôi đâu rồi?",
                "vi": "Where is my ruler?"
              }
            },
            {
              "t": "vocab",
              "en": "cục tẩy",
              "vi": "Eraser",
              "pos": "Noun",
              "ipa": "heavy stop · dipping",
              "pic": "eraser",
              "ex": {
                "en": "Cho tôi dùng tẩy nhé?",
                "vi": "May I use your eraser?"
              }
            },
            {
              "t": "vocab",
              "en": "cặp sách",
              "vi": "Bag",
              "pos": "Noun",
              "ipa": "heavy stop · high rising",
              "pic": "bag",
              "ex": {
                "en": "Cặp tôi nặng quá.",
                "vi": "My bag is heavy."
              }
            },
            {
              "t": "vocab",
              "en": "bàn học",
              "vi": "Desk",
              "pos": "Noun",
              "ipa": "low falling · heavy stop",
              "pic": "desk",
              "ex": {
                "en": "Ngồi vào bàn đi.",
                "vi": "Sit at your desk."
              }
            },
            {
              "t": "vocab",
              "en": "cái ghế",
              "vi": "Chair",
              "pos": "Noun",
              "ipa": "high rising · high rising",
              "pic": "chair",
              "note": "“cái” is a classifier — for most everyday objects. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Cái ghế này hỏng rồi.",
                "vi": "This chair is broken."
              }
            },
            {
              "t": "vocab",
              "en": "bảng",
              "vi": "Board",
              "pos": "Noun",
              "ipa": "dipping",
              "pic": "board",
              "ex": {
                "en": "Nhìn lên bảng nào.",
                "vi": "Look at the board."
              }
            },
            {
              "t": "vocab",
              "en": "bài tập về nhà",
              "vi": "Homework",
              "pos": "Noun",
              "ipa": "low falling · heavy stop · low falling · low falling",
              "ex": {
                "en": "Tôi làm bài tập buổi tối.",
                "vi": "I do my homework at night."
              }
            }
          ],
          "sentences": [
            {
              "en": "Cho tôi mượn bút được không",
              "vi": "Can I borrow your pen"
            },
            {
              "en": "Mở vở ra",
              "vi": "Open your notebook"
            },
            {
              "en": "Cặp tôi nặng quá",
              "vi": "My bag is heavy"
            },
            {
              "en": "Nhìn lên bảng",
              "vi": "Look at the board"
            }
          ]
        },
        {
          "id": "v1u7l4",
          "title": "Animals around us",
          "goal": "Name animals with their classifier.",
          "teach": [
            {
              "t": "intro",
              "title": "Every animal takes con",
              "body": "“Con” is the classifier for living moving things. Animals essentially always carry it, so learn “con mèo”, not “mèo”.",
              "bullets": [
                "con + animal",
                "Common animals",
                "Animals in the zodiac"
              ]
            },
            {
              "t": "vocab",
              "en": "con chim",
              "vi": "Bird",
              "pos": "Noun",
              "ipa": "mid level · mid level",
              "pic": "bird",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Một con chim đang hót.",
                "vi": "A bird is singing."
              }
            },
            {
              "t": "vocab",
              "en": "con gà",
              "vi": "Chicken",
              "pos": "Noun",
              "ipa": "mid level · low falling",
              "pic": "chicken",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Nhà tôi nuôi ba con gà.",
                "vi": "We have three chickens."
              }
            },
            {
              "t": "vocab",
              "en": "con vịt",
              "vi": "Duck",
              "pos": "Noun",
              "ipa": "mid level · heavy stop",
              "pic": "duck",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Con vịt ở dưới ao.",
                "vi": "The duck is in the pond."
              }
            },
            {
              "t": "vocab",
              "en": "con lợn",
              "vi": "Pig",
              "pos": "Noun",
              "ipa": "mid level · heavy stop",
              "pic": "pig",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Con lợn to lắm.",
                "vi": "The pig is very big."
              }
            },
            {
              "t": "vocab",
              "en": "con bò",
              "vi": "Cow",
              "pos": "Noun",
              "ipa": "mid level · low falling",
              "pic": "cow",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Con bò cho sữa.",
                "vi": "The cow gives milk."
              }
            },
            {
              "t": "vocab",
              "en": "con trâu",
              "vi": "Buffalo",
              "pos": "Noun",
              "ipa": "mid level · mid level",
              "pic": "buffalo",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Con trâu ở ngoài đồng.",
                "vi": "The buffalo is in the field."
              }
            },
            {
              "t": "vocab",
              "en": "con chuột",
              "vi": "Mouse",
              "pos": "Noun",
              "ipa": "mid level · heavy stop",
              "pic": "mouse",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Có một con chuột.",
                "vi": "There is a mouse."
              }
            },
            {
              "t": "vocab",
              "en": "con ong",
              "vi": "Bee",
              "pos": "Noun",
              "ipa": "mid level · mid level",
              "pic": "bee",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Con ong đậu trên bông hoa.",
                "vi": "A bee is on the flower."
              }
            },
            {
              "t": "vocab",
              "en": "con bướm",
              "vi": "Butterfly",
              "pos": "Noun",
              "ipa": "mid level · high rising",
              "pic": "butterfly",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Con bướm đẹp quá.",
                "vi": "The butterfly is beautiful."
              }
            },
            {
              "t": "vocab",
              "en": "con voi",
              "vi": "Elephant",
              "pos": "Noun",
              "ipa": "mid level · mid level",
              "pic": "elephant",
              "note": "“con” is a classifier — for animals and a few moving things. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Con voi rất to.",
                "vi": "The elephant is very big."
              }
            },
            {
              "t": "grammar",
              "title": "con — the classifier for animals",
              "body": "It is part of the everyday word. Vietnamese children learn “con mèo” as a single unit.",
              "rows": [
                [
                  "con mèo",
                  "classifier cat",
                  "a cat"
                ],
                [
                  "con chó",
                  "classifier dog",
                  "a dog"
                ],
                [
                  "hai con mèo",
                  "two classifier cat",
                  "two cats"
                ],
                [
                  "Question",
                  "Đây là con gì?",
                  "What animal is this?"
                ]
              ],
              "tip": "“Con” also shows up in a few non-animals that move: con sông (river), con đường (road), con mắt (eye)."
            }
          ],
          "sentences": [
            {
              "en": "Một con chim đang hót",
              "vi": "A bird is singing"
            },
            {
              "en": "Con trâu ở ngoài đồng",
              "vi": "The buffalo is in the field"
            },
            {
              "en": "Nhà tôi nuôi ba con gà",
              "vi": "We have three chickens"
            },
            {
              "en": "Con voi rất to",
              "vi": "The elephant is very big"
            }
          ]
        },
        {
          "id": "v1u7l5",
          "title": "Unit 7 review",
          "goal": "Put everything from this unit together.",
          "teach": [],
          "sentences": [],
          "checkpoint": true
        }
      ]
    },
    {
      "id": "v1u8",
      "title": "Home & Holidays",
      "goal": "Describe your home and join in the festivals.",
      "lessons": [
        {
          "id": "v1u8l1",
          "title": "Things in the house",
          "goal": "Name furniture and household things.",
          "teach": [
            {
              "t": "intro",
              "title": "cái, the workhorse classifier",
              "body": "If you cannot remember which classifier a thing takes, say “cái”. It covers most ordinary objects and nobody will misunderstand you.",
              "bullets": [
                "cái for most objects",
                "Rooms and furniture",
                "When in doubt, use cái"
              ]
            },
            {
              "t": "vocab",
              "en": "ghế sô pha",
              "vi": "Sofa",
              "pos": "Noun",
              "ipa": "high rising · mid level · mid level",
              "pic": "sofa",
              "ex": {
                "en": "Chúng tôi ngồi trên ghế sô pha.",
                "vi": "We sit on the sofa."
              }
            },
            {
              "t": "vocab",
              "en": "cái bàn",
              "vi": "Table",
              "pos": "Noun",
              "ipa": "high rising · low falling",
              "pic": "table",
              "note": "“cái” is a classifier — for most everyday objects. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Để đĩa lên bàn.",
                "vi": "Put the plates on the table."
              }
            },
            {
              "t": "vocab",
              "en": "cái giường",
              "vi": "Bed",
              "pos": "Noun",
              "ipa": "high rising · low falling",
              "pic": "bed",
              "note": "“cái” is a classifier — for most everyday objects. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Cái giường rất êm.",
                "vi": "The bed is very soft."
              }
            },
            {
              "t": "vocab",
              "en": "tủ lạnh",
              "vi": "Fridge",
              "pos": "Noun",
              "ipa": "dipping · heavy stop",
              "pic": "fridge",
              "ex": {
                "en": "Cất sữa vào tủ lạnh.",
                "vi": "Put the milk in the fridge."
              }
            },
            {
              "t": "vocab",
              "en": "tivi",
              "vi": "Television",
              "pos": "Noun",
              "ipa": "mid level",
              "pic": "television",
              "ex": {
                "en": "Buổi tối chúng tôi xem tivi.",
                "vi": "We watch television at night."
              }
            },
            {
              "t": "vocab",
              "en": "cái đèn bàn",
              "vi": "Lamp",
              "pos": "Noun",
              "ipa": "high rising · low falling · low falling",
              "pic": "lamp",
              "note": "“cái” is a classifier — for most everyday objects. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Bật đèn lên.",
                "vi": "Turn on the lamp."
              }
            },
            {
              "t": "vocab",
              "en": "cái kệ",
              "vi": "Shelf",
              "pos": "Noun",
              "ipa": "high rising · heavy stop",
              "pic": "shelf",
              "note": "“cái” is a classifier — for most everyday objects. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Sách để trên kệ.",
                "vi": "The books are on the shelf."
              }
            },
            {
              "t": "vocab",
              "en": "cái gương",
              "vi": "Mirror",
              "pos": "Noun",
              "ipa": "high rising · mid level",
              "pic": "mirror",
              "note": "“cái” is a classifier — for most everyday objects. Vietnamese nouns almost always need one, so learn the two words together.",
              "ex": {
                "en": "Cô ấy soi gương.",
                "vi": "She looks in the mirror."
              }
            },
            {
              "t": "vocab",
              "en": "tủ quần áo",
              "vi": "Wardrobe",
              "pos": "Noun",
              "ipa": "dipping · low falling · high rising",
              "pic": "wardrobe",
              "ex": {
                "en": "Quần áo của tôi ở trong tủ.",
                "vi": "My clothes are in the wardrobe."
              }
            },
            {
              "t": "vocab",
              "en": "rèm cửa",
              "vi": "Curtain",
              "pos": "Noun",
              "ipa": "low falling · dipping",
              "pic": "curtain",
              "ex": {
                "en": "Kéo rèm lại giúp tôi.",
                "vi": "Close the curtain, please."
              }
            },
            {
              "t": "culture",
              "title": "Shoes come off at the door",
              "body": "Every Vietnamese home, and many small shops and offices, expect shoes off at the threshold. There will be a pile by the door and often slippers waiting for you. Wearing outdoor shoes inside is the single fastest way for a visitor to cause quiet offence — and it is easily avoided."
            }
          ],
          "sentences": [
            {
              "en": "Chúng tôi ngồi trên ghế sô pha",
              "vi": "We sit on the sofa"
            },
            {
              "en": "Cái giường rất êm",
              "vi": "The bed is very soft"
            },
            {
              "en": "Cất sữa vào tủ lạnh",
              "vi": "Put the milk in the fridge"
            },
            {
              "en": "Bật đèn lên",
              "vi": "Turn on the lamp"
            }
          ]
        },
        {
          "id": "v1u8l2",
          "title": "Holidays of the year",
          "goal": "Talk about Tết and the festivals.",
          "teach": [
            {
              "t": "intro",
              "title": "The week the country stops",
              "body": "Tết is lunar new year and it dwarfs every other holiday. Shops shut, cities empty as people travel home, and the greetings are fixed phrases worth learning.",
              "bullets": [
                "Tết and its customs",
                "Chúc mừng năm mới",
                "Lucky money"
              ]
            },
            {
              "t": "vocab",
              "en": "lễ hội",
              "vi": "Festival",
              "pos": "Noun",
              "ipa": "creaky rising · heavy stop",
              "pic": "festival",
              "ex": {
                "en": "Tết là một lễ hội lớn.",
                "vi": "Tet is a big festival."
              }
            },
            {
              "t": "vocab",
              "en": "ăn mừng",
              "vi": "Celebrate",
              "pos": "Verb",
              "ipa": "mid level · low falling",
              "pic": "celebrate",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Chúng tôi ăn Tết cùng gia đình.",
                "vi": "We celebrate Tet with family."
              }
            },
            {
              "t": "vocab",
              "en": "Tết Nguyên Đán",
              "vi": "Tet holiday",
              "pos": "Noun",
              "ipa": "high rising · mid level · high rising",
              "ex": {
                "en": "Tết rơi vào tháng Một hoặc tháng Hai.",
                "vi": "Tet holiday is in January or February."
              }
            },
            {
              "t": "vocab",
              "en": "Giáng sinh",
              "vi": "Christmas",
              "pos": "Noun",
              "ipa": "high rising · mid level",
              "pic": "christmas",
              "ex": {
                "en": "Giáng sinh vui vẻ!",
                "vi": "Merry Christmas!"
              }
            },
            {
              "t": "vocab",
              "en": "Năm mới",
              "vi": "New Year",
              "pos": "Noun",
              "ipa": "mid level · high rising",
              "ex": {
                "en": "Chúc mừng năm mới!",
                "vi": "Happy New Year!"
              }
            },
            {
              "t": "vocab",
              "en": "Tết Trung thu",
              "vi": "Mid-Autumn Festival",
              "pos": "Noun",
              "ipa": "high rising · mid level · mid level",
              "ex": {
                "en": "Trẻ em rất thích Tết Trung thu.",
                "vi": "Children love the Mid-Autumn Festival."
              }
            },
            {
              "t": "vocab",
              "en": "pháo hoa",
              "vi": "Firework",
              "pos": "Noun",
              "ipa": "high rising · mid level",
              "pic": "firework",
              "ex": {
                "en": "Chúng tôi xem pháo hoa đêm giao thừa.",
                "vi": "We watch fireworks on New Year."
              }
            },
            {
              "t": "vocab",
              "en": "lì xì",
              "vi": "Lucky money",
              "pos": "Noun",
              "ipa": "low falling · low falling",
              "ex": {
                "en": "Trẻ em được lì xì vào dịp Tết.",
                "vi": "Children get lucky money at Tet."
              }
            },
            {
              "t": "vocab",
              "en": "trang trí",
              "vi": "Decorate",
              "pos": "Verb",
              "ipa": "mid level · high rising",
              "pic": "decorate",
              "note": "Verbs never change form in Vietnamese. Same word for I, you, he, yesterday, tomorrow.",
              "ex": {
                "en": "Chúng tôi trang trí nhà trước Tết.",
                "vi": "We decorate the house before Tet."
              }
            },
            {
              "t": "vocab",
              "en": "đèn lồng",
              "vi": "Lantern",
              "pos": "Noun",
              "ipa": "low falling · low falling",
              "pic": "lantern",
              "ex": {
                "en": "Trẻ em rước đèn lồng vào buổi tối.",
                "vi": "Children carry lanterns at night."
              }
            },
            {
              "t": "culture",
              "title": "Surviving and enjoying Tết",
              "body": "Everyone returns to their home town, so the big cities go quiet and many restaurants close for several days — plan ahead. The greeting is “Chúc mừng năm mới” (happy new year). Elders give children “lì xì”, lucky money in a red envelope; if children greet you, a small note in a red envelope is the kind thing to do. Avoid sweeping the floor on the first day: you would be sweeping the luck out."
            }
          ],
          "sentences": [
            {
              "en": "Tết là một lễ hội lớn",
              "vi": "Tet is a big festival"
            },
            {
              "en": "Chúng tôi ăn Tết cùng gia đình",
              "vi": "We celebrate Tet with family"
            },
            {
              "en": "Chúc mừng năm mới",
              "vi": "Happy New Year"
            },
            {
              "en": "Trẻ em được lì xì vào dịp Tết",
              "vi": "Children get lucky money at Tet"
            }
          ]
        },
        {
          "id": "v1u8l3",
          "title": "Unit 8 review",
          "goal": "Put everything from this unit together.",
          "teach": [],
          "sentences": [],
          "checkpoint": true
        }
      ]
    }
  ]
};
