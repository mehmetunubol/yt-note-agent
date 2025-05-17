# src/whisperTranscribe.py
import whisper
import os
import sys
from concurrent.futures import ThreadPoolExecutor

request_id = sys.argv[1]
chunk_dir = f"audio_chunks/{request_id}"
model = whisper.load_model("base")

def transcribe_chunk(filename):
    path = os.path.join(chunk_dir, filename)
    print(f"Transcribing {filename}...")
    result = model.transcribe(path)
    return result["text"]

def main():
    files = sorted(f for f in os.listdir(chunk_dir) if f.endswith(".mp3"))
    transcript_chunks = []

    with ThreadPoolExecutor(max_workers=4) as executor:
        results = executor.map(transcribe_chunk, files)

    transcript = "\n".join(results)

    # Save transcript to file
    output_file = f"transcripts/{request_id}.txt"
    os.makedirs("transcripts", exist_ok=True)
    with open(output_file, "w") as f:
        f.write(transcript.strip())

    print(transcript.strip())

if __name__ == "__main__":
    main()
