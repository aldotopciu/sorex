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
export PATH="$HOME/.cargo/bin:$PATH"

### Install Solana
sh -c "$(curl -sSfL https://release.solana.com/v1.9.4/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

solana config set --url localhost

### Install Anchor
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked