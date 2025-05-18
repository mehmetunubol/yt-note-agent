# src/whisperTranscribe.py
import whisper
import os
import sys

request_id = sys.argv[1]
chunk_dir = f"audio/{request_id}"
model = whisper.load_model("base")

def transcribe_chunk(filename):
    path = os.path.join(chunk_dir, filename)
    print(f"Transcribing {filename}...")
    result = model.transcribe(path)
    return result["text"]

def main():
    files = sorted(f for f in os.listdir(chunk_dir) if f.endswith(".mp3") and f.startswith("chunk"))
    if not files:
        print("No audio chunks found.")
        return
    transcript_chunks = []

    for filename in files:
        text = transcribe_chunk(filename)
        transcript_chunks.append(text)

    transcript = "\n".join(transcript_chunks)

    # Save transcript to file
    output_file = f"transcripts/{request_id}.txt"
    os.makedirs("transcripts", exist_ok=True)
    with open(output_file, "w") as f:
        f.write(transcript.strip())

    print(transcript.strip())

if __name__ == "__main__":
    main()
