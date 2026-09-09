# Máy chủ đọc tiếng Anh sống (MeloTTS) cho English Air

Dùng riêng cho phần "Gọi ON-Language nói chuyện tự do" — nơi duy nhất trong
app không thể tạo âm thanh trước vì Claude trả lời một câu MỚI mỗi lượt (khác
với từ vựng/bài học, đã tạo sẵn hết rồi, xem `tieng-anh-air/src/assets/tieng/`).

Đã test xong trên máy local: MeloTTS tổng hợp đúng, mã hoá mp3 đúng, máy chủ
FastAPI trả về audio/mpeg 200 OK. Còn thiếu duy nhất bước deploy lên Cloud Run
(cần tài khoản Google Cloud có bật thanh toán, thầy tự làm — xem bên dưới).

## Vì sao Cloud Run mà không phải VPS thuê cố định

- Cloud Run chỉ tính tiền đúng số giây thực sự xử lý một yêu cầu — không có
  yêu cầu thì không tốn tiền (không giống VPS phải trả đều mỗi tháng).
- Có hạn mức miễn phí vĩnh viễn hằng tháng khá rộng (không phải bản dùng thử
  có hạn), đủ cho quy mô app này gần như chắc chắn không tốn phí thật.
- Vẫn cần bật thanh toán trên project (Google yêu cầu có thẻ dự phòng), y hệt
  bước đã làm cho Gemini và cho đăng nhập Google trước đây.

## Bước deploy (thầy tự làm, hoặc Claude làm qua Chrome khi thầy đã bật thanh toán)

1. Vào console.cloud.google.com, chọn project **mon-maths** (project đã tạo
   sẵn lúc làm đăng nhập Google).
2. Vào mục **Thanh toán (Billing)** → liên kết một tài khoản thanh toán (nhập
   thẻ). Bước này CHỈ thầy làm được.
3. Bật API **Cloud Run** và **Cloud Build** cho project (Claude có thể bật hộ
   qua Console một khi bước 2 xong).
4. Deploy bằng dòng lệnh (Claude chạy hộ nếu có `gcloud` CLI, hoặc qua Console
   mục Cloud Run → "Triển khai bộ chứa" → "Liên tục triển khai từ kho lưu
   trữ", trỏ vào thư mục này):
   ```
   gcloud run deploy english-air-tts \
     --source . \
     --region asia-southeast1 \
     --memory 2Gi --cpu 2 \
     --min-instances 0 --max-instances 2 \
     --set-env-vars TTS_SECRET=<một chuỗi bí mật tự đặt> \
     --no-allow-unauthenticated=false
   ```
5. Sau khi deploy xong, Cloud Run cho một địa chỉ dạng
   `https://english-air-tts-xxxxx-as.a.run.app`. Đặt hai biến môi trường này
   trong cPanel → Setup Node.js App (giống cách đã đặt `GOOGLE_CLIENT_ID`
   trước đây):
   - `TTS_LIVE_URL` = địa chỉ Cloud Run đó
   - `TTS_LIVE_SECRET` = đúng chuỗi bí mật đã đặt ở bước 4
6. Khởi động lại app Node (kill tiến trình `lsnode`, LiteSpeed tự dựng lại).

Chưa đặt hai biến môi trường này thì app KHÔNG hỏng gì cả — `synthLiveEn()`
trong `services/englishAirTutorService.js` tự bỏ qua, tiếng Anh trong lúc gọi
tự do vẫn đọc bằng giọng máy như trước, chỉ là chưa nâng cấp thôi.

## Test local (đã làm, để tham khảo)

```
py -3.11 -m venv .venv
.venv\Scripts\pip install --index-url https://download.pytorch.org/whl/cpu torch torchaudio
.venv\Scripts\pip install fastapi "uvicorn[standard]" lameenc txtsplit cached_path ^
  transformers==4.27.4 num2words==0.5.12 anyascii==0.3.2 g2p_en==2.1.0 eng_to_ipa==0.0.2 ^
  inflect==7.0.0 unidecode==1.3.7 librosa==0.9.1 pydub==0.25.1 langid==1.1.6 tqdm loguru==0.7.2 ^
  nltk numpy unidic_lite==1.0.8 unidic==1.1.0 mecab-python3==1.0.9 pykakasi==2.2.1 fugashi==1.3.0 ^
  jamo==0.4.1 "gruut[de,es,fr]==2.2.3" "g2pkk>=0.1.1" pypinyin==0.50.0 cn2an==0.5.22 jieba==0.42.1
.venv\Scripts\pip install --no-deps git+https://github.com/myshell-ai/MeloTTS.git
.venv\Scripts\python -m unidic download
.venv\Scripts\python -m nltk.downloader averaged_perceptron_tagger averaged_perceptron_tagger_eng cmudict punkt
.venv\Scripts\python -m uvicorn tts_server:app --port 8991
```

Lưu ý: bản `melotts` trên PyPI (cài `--no-deps`) tải các mô hình EN/BERT từ
Hugging Face lúc chạy lần đầu — Dockerfile đã tải sẵn lúc dựng ảnh (bước
`RUN python -c "from melo.api import TTS; ..."`) để lần gọi thật đầu tiên
không phải chờ tải.
