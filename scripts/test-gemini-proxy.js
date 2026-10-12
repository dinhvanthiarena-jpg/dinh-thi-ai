require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const g = require('../services/geminiProxyService');
g.write({ system: 'Bạn là biên tập viên tiếng Việt.', user: 'Viết 2 câu giới thiệu ngắn về phần mềm AI tự đăng bài cho doanh nghiệp.', maxTokens: 400 }).then((r) => { console.log(JSON.stringify(r).slice(0, 500)); process.exit(0); });
