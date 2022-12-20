## update and install some things we should probably have
apt-get update
apt-get install -y \
  curl \
  git \
  gnupg2 \
  jq \
  sudo \
  zsh \
  vim \
  build-essential \
  openssl \
  libssl-dev \
  pkg-config \
  libudev-dev

### Install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

### Install Solana
sh -c "$(curl -sSfL https://release.solana.com/v1.9.4/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

solana config set --url localhost

sudo apt-get install npm
sudo npm i -g @project-serum/anchor-cli
sudo npm install -g yarn
sudo npm i -g n
sudo n stable
npm i

### Install Anchor
cargo install --git https://github.com/project-serum/anchor --tag v0.21.0 anchor-cli --locked

#install spl token cli
cargo install spl-token-cli

# generate new keys
solana-keygen new

# create validator from 0
solana-test-validator --reset

# build and deploy program (program id to be replaced in Anchor.toml and in lib.rs and re build/deploy)
anchor build
anchor deploy


# runs app frontend
cd app
npm install
npm run serve

