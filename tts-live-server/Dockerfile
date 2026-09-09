# Máy chủ đọc tiếng Anh sống (MeloTTS) cho phần "Gọi ON-Language" — chạy trên
# Google Cloud Run. CPU-only (torch CPU wheel) vì Cloud Run không có GPU và
# MeloTTS đủ nhanh trên CPU cho một câu trả lời ngắn.
FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    git build-essential libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Torch bản CPU riêng để ảnh (image) nhẹ hơn nhiều so với bản mặc định có CUDA.
RUN pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch torchaudio

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir git+https://github.com/myshell-ai/MeloTTS.git

# Dữ liệu nltk cần cho g2p_en (đọc đúng âm tiếng Anh).
RUN python -m nltk.downloader averaged_perceptron_tagger averaged_perceptron_tagger_eng cmudict punkt

# Tải sẵn mô hình EN ngay lúc dựng ảnh — để lần gọi ĐẦU TIÊN không phải chờ
# tải mô hình (Cloud Run tính tiền theo giây xử lý thật, chờ tải mô hình mỗi
# lần "nguội máy" vừa chậm vừa tốn).
RUN python -c "from melo.api import TTS; TTS(language='EN', device='cpu')"

COPY tts_server.py .

ENV PORT=8080
CMD ["sh", "-c", "uvicorn tts_server:app --host 0.0.0.0 --port ${PORT}"]
