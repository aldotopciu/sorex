## Project setup (Mac)

### Install rust
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
export PATH="$HOME/.cargo/bin:$PATH"

```

### Install Solana
```
sh -c "$(curl -sSfL https://release.solana.com/v1.9.4/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Note: this creates a test-ledger folder in your current directory.
solana-test-validator

# To develop the application in local set the network to localhost
solana config set --url localhost

# Check if you already have a solana keypair
solana address

# If not create it
solana-keygen new

# Install spl-token-cli
cargo install spl-token-cli

# Create new token
spl-token create-token # returns G6HRHifWHh6KZqQEe8pR2EsBanRQhUANopJaz5QCqGej (token pk)
spl-token supply G6HRHifWHh6KZqQEe8pR2EsBanRQhUANopJaz5QCqGej # returns 0

# Create token account
spl-token create-account G6HRHifWHh6KZqQEe8pR2EsBanRQhUANopJaz5QCqGej # returns 83vXU3rdcpMhmXa8rJ7vxfNZjB2XxMRBfpd4ZW6227yq (account pk)
spl-token mint G6HRHifWHh6KZqQEe8pR2EsBanRQhUANopJaz5QCqGej 1000000 # mint 1000000 tokens

# Transfer some coins to a receipent (token amount receiverPK)
spl-token transfer --fund-recipient HxEw3k1ePbww8xVa1i3LRCGbxXujZmNSygDWULLALCXx 100 6smrpDoUAEnH8iukPaFRffh5fzcUiB92K6TcDUqZyBnw
# Airdrop some solana to the receiver (to use for the transactions)
solana airdrop 10 6smrpDoUAEnH8iukPaFRffh5fzcUiB92K6TcDUqZyBnw

```

### Install Anchor
```
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked

# Compiles your program.
anchor build

# Deploys your compiled program.
anchor deploy

# Runs tests in the tests folder.
anchor run test

# Runs all the above commands
anchor test

```
