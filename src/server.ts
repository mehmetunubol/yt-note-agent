import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { execSync } from "child_process";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
import dotenv from "dotenv";
import { promises as fs } from "fs";

dotenv.config();

const app: express.Application = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const audioDir = path.join(__dirname, "../audio");

async function downloadAudio(url: string, requestId: string) {
  console.log("Downloading audio...");
  execSync(
    `yt-dlp -x --audio-format mp3 -o './audio/${requestId}/audio.%(ext)s' ${url}`
  );
}

async function splitAudio(requestId: string) {
  console.log("Splitting audio...");
  execSync(
    `python3 src/splitAudio.py ${audioDir}/${requestId}/audio.mp3 ${requestId}`
  );
}

async function transcribeAudio(requestId: string): Promise<string> {
  console.log("Transcribing chunks...");
  const result = execSync(`python3 src/whisperTranscribe.py ${requestId}`);
  return result.toString();
}

// TODO: Improve to ask more questions
async function generateCheatSheet(transcript: string): Promise<string> {
  console.log("Summarizing...");
  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI that generates cheat sheets also you support multiple languages. ",
      },
      {
        role: "user",
        content: `Create a cheat sheet from this transcript:\n${transcript}. Please respond in the same language as the input.`,
      },
    ],
  });

  return chat.choices[0].message.content ?? "";
}

async function deleteFolder(folderPath: string) {
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    console.log(`Deleted folder: ${folderPath}`);
  } catch (err) {
    console.error(`Error deleting folder ${folderPath}:`, err);
  }
}

app.post("/process-video", async (req: Request, res: Response) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    res.status(400).json({ error: "Missing videoUrl in request body." });
    return;
  }

  const requestId = uuidv4();

  try {
    await downloadAudio(videoUrl, requestId);
    await splitAudio(requestId);
    const transcript = await transcribeAudio(requestId);
    const cheatSheet = await generateCheatSheet(transcript);

    res.json({
      requestId,
      cheatSheet,
    });
    console.log("Cheat sheet generated successfully.");
    // Example usage:
    const folderToDelete = path.join(__dirname, "../audio", requestId);
    deleteFolder(folderToDelete);
  } catch (error) {
    console.error("Error processing video:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
  });
