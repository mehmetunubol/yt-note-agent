import { execSync } from "child_process";
import * as path from "path";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VIDEO_URL = process.argv[2];
const AUDIO_FILE = path.join(__dirname, "../audio/audio.mp3");

async function downloadAudio(url: string) {
  console.log("Downloading audio...");
  execSync(`yt-dlp -x --audio-format mp3 -o './audio/audio.%(ext)s' ${url}`);
}

async function splitAudio(requestId: string) {
  console.log("Splitting audio...");
  execSync(`python3 src/splitAudio.py ${AUDIO_FILE} ${requestId}`);
}

async function transcribeAudio(requestId: string): Promise<string> {
  console.log("Transcribing chunks...");
  const result = execSync(`python3 src/whisperTranscribe.py ${requestId}`);
  return result.toString();
}

async function generateCheatSheet(transcript: string) {
  console.log("Summarizing...");
  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a helpful AI that generates cheat sheets.",
      },
      {
        role: "user",
        content: `Create a cheat sheet from this transcript:\n${transcript}`,
      },
    ],
  });

  const output = chat.choices[0].message.content;
  console.log("\n=== Cheat Sheet ===\n");
  console.log(output);
}

(async () => {
  if (!VIDEO_URL) {
    console.error("Please provide a YouTube URL as an argument.");
    process.exit(1);
  }

  const requestId = uuidv4();

  try {
    await downloadAudio(VIDEO_URL);
    await splitAudio(requestId);
    const transcript = await transcribeAudio(requestId);
    await generateCheatSheet(transcript);
  } catch (err) {
    console.error("Error:", err);
  }
})();
