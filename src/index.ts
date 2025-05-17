import { execSync } from 'child_process';
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

const VIDEO_URL = process.argv[2];
const AUDIO_FILE = path.join(__dirname, '../audio/audio.mp3');

async function downloadAudio(url: string) {
  console.log('Downloading audio...');
  execSync(`yt-dlp -x --audio-format mp3 -o './audio/audio.%(ext)s' ${url}`);
}

async function transcribeAudio(): Promise<string> {
  console.log('Transcribing...');
  const result = execSync(`python3 src/whisperTranscribe.py ${AUDIO_FILE}`);
  return result.toString();
}

async function generateCheatSheet(transcript: string) {
  console.log('Summarizing...');
  const completion = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful AI that generates cheat-sheet style summaries from transcripts.',
      },
      {
        role: 'user',
        content: `Create a cheat sheet from this transcript:\n${transcript}`,
      },
    ],
  });

  const output = completion.data.choices[0].message?.content;
  console.log('\n=== Cheat Sheet ===\n');
  console.log(output);
}

(async () => {
  if (!VIDEO_URL) {
    console.error('Please provide a YouTube URL as an argument.');
    process.exit(1);
  }

  try {
    await downloadAudio(VIDEO_URL);
    const transcript = await transcribeAudio();
    await generateCheatSheet(transcript);
  } catch (err) {
    console.error('Error:', err);
  }
})();
