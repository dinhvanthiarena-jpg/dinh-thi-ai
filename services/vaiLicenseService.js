// Key cho bản desktop V-AI STUDIO (3DVIETPRO-AI-STUDIO) — KHÁC HẲN cơ chế
// checksum "AIWEB-" ở aaiLicenseService.js. Bản này ký RS256 (JWT), vì app
// desktop (exe PyInstaller đóng gói, khách không đọc/sửa được mã nguồn) đã
// có sẵn logic xác minh RS256 offline bằng khoá CÔNG KHAI nhúng cứng — xem
// F:\TOOL 3DVIETPRO\...\CODE 3DVIETPRO-AI-STUDIO\3DVIETPRO-AI-STUDIO-source\
// app\trial_config.py (TRIAL_PUBLIC_KEY) + app\license.py (_verify_token).
//
// Khoá RIÊNG dưới đây PHẢI khớp đúng cặp với TRIAL_PUBLIC_KEY trong app —
// đổi 1 bên mà không đổi bên kia thì mọi key cũ lẫn mới đều không dùng được.
//
// QUAN TRỌNG — khác aaiLicenseService: key ký RS256 kiểu "off":true là
// TOKEN TỰ ĐỦ, app xác minh chữ ký xong là dùng được VĨNH VIỄN (theo hạn ghi
// trong token) — KHÔNG hỏi lại server này, vì đúng ý đồ ban đầu là app phải
// chạy được không cần mạng. Nghĩa là KHÔNG THU HỒI được key đã phát ra bằng
// cách nào từ trang này (không giống nút "Thu hồi" ở trang AAI Ads Web).
// listKeys() ở đây CHỈ để thầy có sổ ghi lại đã cấp cho ai/ngày nào, không
// phải nguồn xác thực thật (nguồn thật là chữ ký RS256, kiểm tra hoàn toàn
// trên máy khách).
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const APP_ID = 'V-AI-STUDIO';

// Khoá riêng của hệ key V-AI STUDIO — sao lưu file gốc
// (F:\TOOL 3DVIETPRO\...\CODE 3DVIETPRO-AI-STUDIO\trial_key_system\trial_private_pkcs8.pem)
// ra USB/Drive riêng. Mất khoá này thì phải sinh cặp khoá MỚI + cập nhật lại
// TRIAL_PUBLIC_KEY trong app/trial_config.py rồi build lại bản khách — key cũ
// đã phát ra vẫn dùng được vì app giữ nhiều khoá công khai cùng lúc (xem
// license.py _verify_token thử lần lượt từng khoá).
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwLvxFGSmJUF9g
mn3s6DdAFk34m1ob324rztR5bC/yQdakEG2nwnqwT1QSZfsDTVxiTlwgXJBURgXs
z2nRSxotw3hrAvjR/sxCG7OYAeMBIZttPk8peMsQ6VVTrDBkWR6rj2Ej8uunRkcb
VRy3tkNl4RRFMgMHRK7v8yvq1HBP80UNClkl0giTBX7zlCY61iaCCUhZA7Yq0jZE
a22TVmBivLwPLlvye/RJM/skASMaK3ifawZ1sPH6/Tef2ayDlMj0bvJjkFkNhcLp
9rbi5EPPA9Rbf6iwicRgl90Y33+q61kUHFJZFNsf2LwfdTiRDqgIM3EEmiMfNO2F
o9X+m3pxAgMBAAECggEAKkyVj6drZAbSZ1igLB1SioXwYWQ2/aMmickGFULmvgSV
ml1BXnogR608E5C9c70Cla2Xi8N9eWY4bPMdRj0AQ4V/Jz4W7B/+/U42T6QAUti1
PsSrb9sK8fv7WvPnyGfnJ6xsV5uufUIvtz23f9n4E4E3AyfvNzMDxyM8Y4xujJsG
3P3vmNSqNC5Rb8/JEJO8GJ28QNb5HAUxUYdIAfVbaqOxMzq7BOoK7JpzI9X2Hpn+
bfuEBVWVAHAdPzNLacvckzXqxv/oKfEk8fwaoNNShC5n9NjLfHlzaULRR5pSoMJx
bb1iLCG3PcJIlGOfG8B7TOvSz71Pxq70FfiyWztE8wKBgQDeqm4CCFdSnDvsnzns
iS8MPs12aqNp8EzVEoDUTb3kYrsABoqAP2z2Zjfl6TPz+MJfZU6AbRID1hAmEDcn
GF5Huu1TGzMQrGC5W7KBk1sBts/9GVxe8HJkhgKcXM6atl4h3ajCwhsFwcVWRzlL
8740QXcQf3fCfVM1fy49F9rUQwKBgQDKjyUYnimYo89k80546ceAXgh3SjVYiXVC
PN1OOQE/sgXizm9y1DUn1iAVnZMsmXkXZ7eRe2djIATNsaFbI8iBay/VTOR/9+Og
Lly7wCyN7cm1o/T+nHgeGni03vzi/DrangVhzDJj1gJwYoJl0d1l8sr96BxXT0qj
usqNxAfFOwKBgD4y94Xj1JjEAc1IcULM03KlPHm+siVOtfezMn+bs9bPaZNJQHkw
vnxZ83Vq3lNhgtJpFzOyxByEOICZeP6XxQZehhr39xzKOj6tCcE+a2agLZty8SWo
HxxLfwE0v5XiKYtmQtUcqbXC+h/ux2ebD9/DBcJ7CPYwUgUYoM76EevHAoGAeP52
bzUSrb2zxZ5cUnd6luAUeIUYRnGdXFqU6wO8DjsdrvQWuGWv9sK92YuNfQeTwHpQ
uZMYF6rpk6C2PIWsYDoRkXzjxNji3Cy1ceUB+CmA4oI0dt4qFflD/u5v6no2AZ6A
ooFh3CbawBznvUBV2m7j+DTssO6JLDIIihP9fD8CgYEAwZ2X0f6KSZVy+nvgzsAJ
bpceVdoLtLhQXiuK/Z3soTseREpQWeRlrglubZFH2yOqm0GmwhnsD1cwXktbaiXo
Uw2HpOrLHEBwC6JwescZhKZB4+4FLB131dLLu6xHMmGVU95+KytAWe3fH+fiAvsx
WTefLRy3Pbis0BmH5ghAWNE=
-----END PRIVATE KEY-----`;

const LOG_PATH = path.join(__dirname, '..', 'data', 'vai-studio-keys.json');

function loadLog() {
  try {
    return JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
  } catch (e) {
    return [];
  }
}
function saveLog(list) {
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.writeFileSync(LOG_PATH, JSON.stringify(list, null, 2));
}

function listKeys() {
  return loadLog();
}

// name: tên/ghi chú khách hàng (hiện trong app khi kích hoạt).
// ngay: số ngày hiệu lực, 0/undefined = vĩnh viễn.
function issueKey(name, ngay) {
  const days = parseInt(ngay, 10) || 0;
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    app: APP_ID,
    off: true, // bắt buộc: app dùng ngay offline, không hỏi lại server nào
    plan: 'full',
    name: name || '',
    feat: '*',
    iat: now,
  };
  if (days > 0) payload.exp = now + days * 86400;

  const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });

  const entry = {
    key: token,
    name: name || '',
    days,
    issuedAt: Date.now(),
    expiresAt: days > 0 ? Date.now() + days * 86400000 : null,
  };
  const list = loadLog();
  list.unshift(entry);
  saveLog(list);
  return entry;
}

module.exports = { issueKey, listKeys };
