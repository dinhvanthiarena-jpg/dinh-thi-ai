"""
Máy chủ đọc tiếng Anh sống bằng MeloTTS, dùng cho phần "Gọi ON-Language nói
chuyện tự do" — nơi duy nhất trong app không thể tạo sẵn âm thanh trước vì
Claude trả lời một câu MỚI mỗi lượt.

Chạy trên Google Cloud Run (chỉ tính tiền đúng số giây thực sự xử lý, hạn
mức miễn phí hằng tháng thừa sức cho quy mô app này) — KHÔNG phải máy chủ
thuê cố định.

API rất nhỏ, một đường dẫn duy nhất:
  POST /tts   {"text": "Hello, how are you?"}   header: X-Tts-Secret: <khoá>
  -> trả về audio/mpeg (mp3)

Khoá bí mật (TTS_SECRET) chặn người lạ gọi tràn lan làm tốn hạn mức miễn phí
— chỉ backend Node của dinh-thi-ai biết khoá này, client không bao giờ thấy.
"""
import os
import wave
import tempfile

from fastapi import FastAPI, HTTPException, Header
from fastapi.responses import Response
import torch
from melo.api import TTS

APP_SECRET = os.environ.get("TTS_SECRET", "")
MAX_CHARS = 500

app = FastAPI()

device = "cuda:0" if torch.cuda.is_available() else "cpu"
model = TTS(language="EN", device=device)
speaker_ids = model.hps.data.spk2id
SPEAKER_KEY = "EN-US" if "EN-US" in speaker_ids else next(iter(speaker_ids))
SPEAKER_ID = speaker_ids[SPEAKER_KEY]
print(f"[tts_server] device={device} speaker={SPEAKER_KEY}")


def wav_pcm_to_mp3(pcm_bytes: bytes, sample_rate: int) -> bytes:
    import lameenc
    enc = lameenc.Encoder()
    enc.set_bit_rate(48)
    enc.set_in_sample_rate(sample_rate)
    enc.set_channels(1)
    enc.set_quality(2)
    data = enc.encode(pcm_bytes)
    data += enc.flush()
    return bytes(data)


@app.get("/health")
async def health():
    return {"ok": True, "device": device, "speaker": SPEAKER_KEY}


@app.post("/tts")
async def tts(payload: dict, x_tts_secret: str = Header(default=None)):
    if APP_SECRET and x_tts_secret != APP_SECRET:
        raise HTTPException(status_code=401, detail="unauthorized")

    text = str((payload or {}).get("text") or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="missing text")
    if len(text) > MAX_CHARS:
        raise HTTPException(status_code=400, detail="text too long")

    wav_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            wav_path = tmp.name
        model.tts_to_file(text, SPEAKER_ID, wav_path, speed=1.0, quiet=True)
        with wave.open(wav_path, "rb") as wf:
            sr = wf.getframerate()
            pcm = wf.readframes(wf.getnframes())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"synth failed: {e}")
    finally:
        if wav_path and os.path.exists(wav_path):
            os.remove(wav_path)

    mp3_bytes = wav_pcm_to_mp3(pcm, sr)
    return Response(content=mp3_bytes, media_type="audio/mpeg")
