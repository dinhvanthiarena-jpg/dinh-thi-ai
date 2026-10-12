// Chạy thử việc viết bài bằng Gemini (KHÔNG đăng lên web, chỉ in ra màn hình).
// Dùng: source ~/nodevenv/dinh-thi-ai/20/bin/activate && node scripts/test-gemini-article.js
require('dotenv').config();
const articleAi = require('../services/articleAi');
const { generateArticle } = require('../services/newsFactoryService');

(async () => {
  console.log('Nhà cung cấp AI viết bài:', articleAi.PROVIDER());

  const t0 = Date.now();
  const article = await generateArticle('ai-cong-nghe', 'ứng dụng AI trong công việc', {
    title: 'Doanh nghiệp Việt đẩy mạnh dùng trợ lý ảo AI để giảm việc lặp lại',
    description: 'Nhiều công ty vừa và nhỏ bắt đầu dùng chatbot và trợ lý AI để xử lý email, báo cáo và chăm sóc khách hàng.',
    link: 'https://vnexpress.net/vi-du',
  });
  console.log('Viết bài mất', Math.round((Date.now() - t0) / 1000), 'giây');

  if (!article) {
    console.log('THẤT BẠI: không viết được bài (xem lỗi [articleAi] phía trên).');
    process.exit(1);
  }
  const soTu = article.content.split(/\s+/).length;
  console.log('Tiêu đề :', article.title);
  console.log('Mô tả   :', article.excerpt);
  console.log('Số từ   :', soTu);
  console.log('Tags    :', JSON.stringify(article.tags));
  console.log('imageQuery:', article.imageQuery);
  console.log('--- 400 ký tự đầu nội dung ---');
  console.log(article.content.slice(0, 400));
  console.log('--- 200 ký tự cuối ---');
  console.log(article.content.slice(-200));
  process.exit(0);
})();
