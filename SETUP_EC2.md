sudo yum install git -y
git clone https://github.com/mehmetunubol/yt-note-agent.git
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.nvm/nvm.sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
