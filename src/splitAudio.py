# src/split_audio.py
from pydub import AudioSegment
import math
import sys
import os

file_path = sys.argv[1]
request_id = sys.argv[2]  # unique id per API call
chunk_length_ms = 5 * 60 * 1000  # 5 minutes

audio = AudioSegment.from_file(file_path)
duration_ms = len(audio)
total_chunks = math.ceil(duration_ms / chunk_length_ms)

output_dir = f"audio_chunks/{request_id}"
os.makedirs(output_dir, exist_ok=True)

for i in range(total_chunks):
    start = i * chunk_length_ms
    end = min((i + 1) * chunk_length_ms, duration_ms)
    chunk = audio[start:end]
    chunk.export(f"{output_dir}/chunk_{i}.mp3", format="mp3")

print(f"Split into {total_chunks} chunks at {output_dir}")
