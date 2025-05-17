import whisper
import sys

audio_file = sys.argv[1]

model = whisper.load_model("base")
result = model.transcribe(audio_file)
print(result["text"])
