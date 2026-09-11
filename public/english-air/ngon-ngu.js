/* ============================================================
   ON-Language — giao diện theo ngôn ngữ của người học
   Khi người học chọn "tôi nói tiếng Anh", cả app phải nói tiếng Anh với họ.

   Cách làm: tra ĐÚNG NGUYÊN CHUỖI. Chuỗi nào có trong bảng thì thay, chuỗi nào
   không có thì để nguyên — nên bảng thiếu vài chỗ cũng không vỡ gì, chỉ là chỗ
   đó còn tiếng Việt. Nhờ vậy không phải sửa một dòng HTML nào.

   Thêm thứ tiếng mới: thêm một bảng nữa bên dưới rồi khai vào UI_BANG.
   ============================================================ */

const UI_EN = {
  /* --- Thanh điều hướng, trang chính --- */
  "Học": "Learn", "Từ vựng": "Words", "Ôn tập": "Review", "Giải đấu": "League",
  "Nhóm": "Crew", "Hồ sơ": "Profile", "Điều hướng chính": "Main navigation",
  "Lộ trình học": "Your path", "Tiếp tục học": "Continue learning",
  "Bắt đầu bài học": "Start lesson", "Bài học": "Lesson",
  "Chào bạn! Sẵn sàng học chưa?": "Hello! Ready to learn?",
  "Mục tiêu hôm nay": "Today’s goal", "XP hôm nay": "XP today",
  "Tiến độ mục tiêu XP hằng ngày": "Daily XP goal progress",
  "Chuỗi ngày": "Streak", "Chuỗi ngày học": "Learning streak",
  "ngày liên tiếp": "day streak", "Ngày liên tiếp": "Day streak",
  "hôm nay": "today", "Tuần này": "This week", "Xem tất cả": "See all",
  "Đổi trình độ": "Change level", "TRÌNH ĐỘ CỦA BẠN": "YOUR LEVEL",
  "Học từ trình độ này": "Start at this level",
  "Kiểm tra xếp trình độ": "Placement test", "Bắt đầu kiểm tra": "Start test",
  "Mở hết bài học": "Unlock every lesson",
  "Vào bài nào cũng được, không phải học lần lượt": "Jump to any lesson, no set order",

  /* --- Màn học --- */
  "Tiếp theo": "Next", "Tiếp tục": "Continue", "Kiểm tra": "Check",
  "Quay lại": "Back", "Quay lại bài trước": "Back to previous card",
  "Thoát bài học": "Leave lesson", "Tiến độ bài học": "Lesson progress",
  "Gợi ý": "Hint", "Tim còn lại": "Hearts left", "Số tim còn lại": "Hearts left",
  "Nghe lại": "Play again", "Nghe lại đáp án": "Hear the answer again",
  "Xem nghĩa": "Show meaning", "Bấm để xem nghĩa": "Tap to see the meaning",
  "Nhớ rồi": "I knew it", "Chưa nhớ": "Not yet", "Thoát ôn thẻ": "Leave flashcards",
  "Gõ câu trả lời": "Type your answer", "Nói vào micro": "Speak into the mic",
  "Bấm để nói": "Tap to speak", "Không nói được, gõ chữ": "Can’t speak? Type instead",
  "Từ này tiếng Anh là gì?": "What is this word?",
  "Xem lại hội thoại": "Review the dialogue", "Tình huống": "Situation",
  "Tóm tắt": "Summary", "Biết gì:": "You now know:",
  "Giới thiệu": "Introduction", "Ngữ pháp": "Grammar",
  "Góc văn hoá": "Culture note", "Hội thoại": "Dialogue",
  "Chưa đúng": "Not quite", "Đáp án: ": "Answer: ",
  "Câu này bạn làm đúng": "You got this one right",
  "Câu này bạn làm sai": "You got this one wrong",

  /* --- Kết quả cuối bài --- */
  "Bài hoàn thành": "Lesson complete", "HOÀN THÀNH BÀI HỌC TRONG": "FINISHED IN",
  "ĐỘ CHÍNH XÁC": "ACCURACY", "Độ chính xác": "Accuracy",
  "Chậm mà chắc, rất tuyệt!": "Slow and steady — excellent!",
  "Làm tốt lắm, giữ nhịp nhé!": "Well done, keep it up!",
  "Xong rồi, cứ từ từ mà chắc!": "Finished — steady does it!",
  "Cúp Vàng": "Gold Cup", "Cúp Bạc": "Silver Cup", "Cúp Đồng": "Bronze Cup",
  "PHẦN THƯỞNG": "REWARD", "Giỏi quá!": "Brilliant!",
  "Tải ảnh này về máy": "Save this picture",
  "Điểm kinh nghiệm": "Experience points", "Tổng XP": "Total XP", "tổng XP": "total XP",

  /* --- Trò chơi --- */
  "Chơi thưởng": "Bonus games", "Bắn chữ": "Word Archery", "Chém chữ": "Word Slice",
  "Ném bóng": "Ball Toss", "Rắn cắn chữ": "Word Snake",
  "Bắn": "Shoot", "Chơi lại": "Play again", "Chơi ngay": "Play now",
  "Chơi lại từ đầu": "Restart", "Bỏ qua câu này": "Skip this one",
  "Học tiếp": "Back to learning", "Hết lượt rồi": "Out of turns",
  "Đóng trò chơi": "Close game", "Nghe lại câu": "Hear the sentence again",
  "Kéo trên bầu trời để ngắm, thả tay là tên bay.": "Drag the sky to aim, let go to fire.",
  "Vuốt tay ngang quả mang chữ đúng để chém.": "Swipe across the fruit with the right word.",
  "Chạm vào quả mang từ đúng — chọn đủ ba từ.": "Tap the balloon with the right word — find all three.",
  "Rê tay trên màn hình, rắn sẽ bò theo tay.": "Drag your finger — the snake follows it.",
  "Xoay cung sang trái": "Aim left", "Xoay cung sang phải": "Aim right",
  "Số lần bắn sai còn được phép": "Wrong shots allowed",
  "Số lần chém nhầm còn được phép": "Wrong slices allowed",
  "Số lần ném nhầm còn được phép": "Wrong throws allowed",
  "Số lần cắn nhầm còn được phép": "Wrong bites allowed",
  "điểm": "points", "Đầu óc sáng lắm!": "Sharp thinking!",

  /* --- Từ vựng & ôn tập --- */
  "Từ vựng đã học": "Words you’ve learned", "Tìm từ": "Search", "Tìm trong kho từ": "Search your words",
  "Tìm từ tiếng Anh hoặc nghĩa…": "Search a word or its meaning…",
  "Xoá ô tìm": "Clear search", "Lọc theo từ loại": "Filter by word type",
  "Đổi cách sắp xếp": "Change sorting", "Đổi kiểu hiển thị": "Change layout",
  "Từ đến hạn ôn": "Due for review", "Từ hay sai": "Often wrong",
  "Mới học": "Just learned", "Ôn ngay": "Review now", "Ôn bằng thẻ ghi nhớ": "Review with flashcards",
  "Thẻ ghi nhớ": "Flashcards", "Lật thẻ, tự chấm — nhớ nhanh gấp đôi.": "Flip, self-check — remember twice as fast.",
  "Lặp lại ngắt quãng — ôn đúng lúc bạn sắp quên.": "Spaced repetition — review right before you forget.",
  "Ôn lại từng từ bạn đã học và xây dựng một vốn từ vững chắc.": "Go back over every word you’ve met and build a vocabulary that sticks.",
  "Hoàn thành 5 bài học để mở khoá phần ôn tập từ vựng": "Finish 5 lessons to unlock vocabulary review",
  "Hoàn thành thêm 5 bài học nữa để mở khoá": "Finish 5 more lessons to unlock",
  "từ đã học": "words learned", "0 từ": "0 words",

  /* --- Giải đấu --- */
  "Giải đấu tuần": "Weekly league", "Xem bảng xếp hạng": "See the table",
  "Bạn đang đứng thứ": "You are ranked",
  "Top 5 lên hạng · 3 cuối xuống hạng": "Top 5 go up · bottom 3 go down",
  "Đối thủ là dữ liệu mô phỏng lưu trên máy bạn, không phải người dùng thật.":
    "Rivals are simulated and stored on your device — they are not real users.",
  "Giải Đồng": "Bronze League",

  /* --- Gọi ON-Language --- */
  "Gọi ON-Language": "Call ON-Language", "Gọi": "Call", "Đang gọi…": "Calling…",
  "Đang kết nối…": "Connecting…", "Kết thúc": "End", "Kết thúc cuộc gọi": "End call",
  "Gọi nói chuyện tự do": "Free conversation", "Nói tiếng gì cũng được": "Speak any language",
  "Gọi thoải mái, không giới hạn": "Talk as long as you like",
  "Gợi ý — bạn có thể nói": "Try saying", "Gửi": "Send",
  "Bấm để nghe": "Tap to listen", "Luyện nói với giáo viên": "Speaking practice",

  /* --- Cài đặt & hồ sơ --- */
  "Cài đặt": "Settings", "Hồ sơ của bạn": "Your profile", "Người học": "Learner",
  "Tên của bạn": "Your name", "Phát âm tự động": "Read aloud automatically",
  "Nhạc nền nhẹ": "Soft background music",
  "Nhỏ tiếng lại khi đang đọc bài": "Turns down while something is being read",
  "Giảm chuyển động": "Reduce motion", "Chuyển chế độ sáng tối": "Switch light / dark",
  "Mục tiêu hằng ngày": "Daily goal", "Chọn mục tiêu hằng ngày": "Choose your daily goal",
  "Nhẹ · 10": "Light · 10", "Vừa · 30": "Steady · 30", "Chăm · 50": "Serious · 50",
  "Cường độ · 100": "Intense · 100",
  "Giọng tiếng Anh": "English voice", "Giọng tiếng Việt": "Vietnamese voice",
  "Nghe thử cả hai giọng": "Test both voices", "Nghe thử tiếng thưởng": "Test the reward sound",
  "Giọng trẻ con cho ON-Language": "Child voice for ON-Language",
  "Hiện nghĩa tiếng Việt trong hội thoại": "Show translations in dialogues",
  "Xoá toàn bộ tiến độ": "Erase all progress", "Cài lên màn hình chính": "Add to home screen",
  "Đổi ảnh đại diện": "Change your picture", "Đăng xuất": "Log out",
  "Đóng": "Close", "Xác nhận": "Confirm", "Làm lại": "Try again",
  "Quay lại học": "Back to learning", "Xem gói": "See plans", "Gói của bạn": "Your plan",
  "Tiến độ học lưu trên máy bạn; tên và số điện thoại lưu ở tài khoản.":
    "Your progress is stored on this device; your name and phone number are in your account.",
  "Đây là chuỗi dài nhất của bạn, đừng dừng lại.": "This is your longest streak yet — keep going.",
  "Bắt đầu chuỗi": "Start your streak", "Tháng trước": "Previous month", "Tháng sau": "Next month",

  /* --- Đăng nhập / đăng ký --- */
  "Đăng nhập": "Log in", "Đăng ký": "Sign up", "Đã có tài khoản?": "Already have an account?",
  "Quên mật khẩu?": "Forgotten your password?", "Mật khẩu": "Password",
  "Mật khẩu mới": "New password", "Đặt mật khẩu mới": "Set a new password",
  "Ít nhất 6 ký tự": "At least 6 characters", "Mã xác nhận": "Verification code",
  "Gửi mã về email": "Email me a code", "Gửi lại mã": "Send the code again",
  "Số điện thoại": "Phone number", "Số điện thoại hoặc email": "Phone number or email",
  "Email (để nhận mã xác nhận)": "Email (for your verification code)",
  "Xem thử trước, đăng ký sau": "Look around first, sign up later",
  "Đăng ký để giữ tiến độ học của bạn trên mọi máy.": "Sign up to keep your progress on every device.",
  "Nhập mã 6 số vừa gửi tới email của bạn.": "Enter the 6-digit code we emailed you.",
  "hoặc": "or", "← Quay lại": "← Back", "← Quay lại đăng nhập": "← Back to log in",
  "Đang tải…": "Loading…",

  /* --- Chọn ngôn ngữ --- */
  "Tôi nói": "I speak", "Tôi muốn học": "I want to learn",
  "Đổi ngôn ngữ": "Change language", "Ngôn ngữ": "Language",
  "Bắt đầu": "Start", "Tiếng Anh": "English", "Tiếng Việt": "Vietnamese",
};

/* Bảng tra theo gốc ngôn ngữ giao diện. Tiếng Việt là bản gốc nên không cần bảng. */
const UI_BANG = { en: UI_EN };
