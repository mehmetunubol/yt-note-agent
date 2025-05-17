sudo yum install git -y
git clone https://github.com/mehmetunubol/yt-note-agent.git
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.nvm/nvm.sh
export NVM_DIR="$HOME/.nvm" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

rm -rf package.json
npm init -y
npm install typescript ts-node @types/node openai dotenv

sudo yum install python3-pip -y
pip install -U yt-dlp

Add your OpenAI API key to .env

# Run the tool

    npx ts-node src/index.ts "https://www.youtube.com/watch?v=qU3fmidNbJE"

!! TODO: youtube session is problematic here!
https://chromewebstore.google.com/detail/windscribe-free-proxy-and/hnmpcagpplmpfojmgmnngilcnanddlhb?pli=1
Open Chrome. Go to Get cookies.txt extension. Visit https://youtube.com and log in. Click the extension icon to download cookies.txt.
scp /path/to/cookies.txt ec2-user@<your-ec2-public-ip>:~/cookies.txt
yt-dlp --cookies ~/cookies.txt -x --audio-format mp3 -o './audio/audio.%(ext)s' 'https://www.youtube.com/watch?v=qU3fmidNbJE'
