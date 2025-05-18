# Install dependencies

    rm -rf package.json
    npm init -y
    npm install typescript ts-node @types/node openai dotenv

# Set up yt-dlp and Python

    Make sure yt-dlp is installed and available in your PATH.
    brew install yt-dlp

# Install Whisper:

    pip install openai-whisper
    Add your OpenAI API key to .env

# Run the tool

    npx ts-node src/index.ts "https://www.youtube.com/watch?v=qU3fmidNbJE"

# Extras

## Process video in chunks

pip install pydub

## missing tsconfig.json

rm -rf tsconfig.json
npx tsc --init

curl -X POST http://localhost:3000/process-video \
 -H "Content-Type: application/json" \
 -d '{"videoUrl": "https://www.youtube.com/watch?v=qU3fmidNbJE"}'
