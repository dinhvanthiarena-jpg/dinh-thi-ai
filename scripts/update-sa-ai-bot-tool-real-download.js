require('dotenv').config();
const connectDB = require('../config/db');
const Tool = require('../models/Tool');

// Thầy Đinh Thi Ai yêu cầu 2026-09-24: "đưa tool vào web" — file cài đặt thật
// (SA-AI-BOT-Setup.exe) đã upload qua FTP vào
// ~/dinh-thi-ai/public/downloads/sa-ai-bot/ trên chính hosting này (phục vụ
// tĩnh qua express.static, thấy được tại
// https://3dvietpro.com/downloads/sa-ai-bot/SA-AI-BOT-Setup.exe — đã verify
// HTTP 200, đúng dung lượng). Cùng thư mục cũng chứa latest.yml +
// .exe.blockmap phục vụ auto-update (build.publish trong package.json của
// fb-ads-manager đã đổi từ GitHub private repo — hay bị 404 vì repo private —
// sang provider "generic" trỏ đúng URL này, nên NGƯỜI DÙNG ĐÃ CÀI cũng tự
// nhận bản mới, không cần cài lại).
async function run() {
  await connectDB();

  const tool = await Tool.findByPk(6);
  if (!tool) {
    console.error('Không tìm thấy Tool id 6');
    process.exit(1);
  }

  tool.set({
    driveUrl: 'https://3dvietpro.com/downloads/sa-ai-bot/SA-AI-BOT-Setup.exe',
  });
  await tool.save();

  console.log('Đã gắn link tải thật:', tool.id, tool.slug, tool.driveUrl);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
