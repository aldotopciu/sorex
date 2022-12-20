const express = require("express");
const bodyParser = require("body-parser")
const cors = require('cors');
const web3 = require("@solana/web3.js");
const splToken = require("@solana/spl-token");
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});
const process = require('process')
const app = express();

app.use(bodyParser.json());
const WALLET_SECRET_KEY = new Uint8Array(process.env.VUE_APP_TOKEN_PRIVATEK.split(', '));

app.use(cors({origin: 'http://localhost:8080'}));
  
app.post("/reward", function(req, res) {
  var author = req.body.author;
  var highscore = Number(req.body.score);
  transfer(author, highscore);
  res.sendStatus(200)
});

async function transfer(wallet, score) {
  // Connect to cluster
  var connection = new web3.Connection(process.env.VUE_APP_NETWORK, 'processed')
  // Construct wallet keypairs
  var fromWallet = web3.Keypair.fromSecretKey(WALLET_SECRET_KEY);
  // Source account
  var fromTokenAccount = new web3.PublicKey( process.env.VUE_APP_TOKEN_ACCOUNT);
  // Construct sender wallet keypairs
  var toWallet = new web3.PublicKey(wallet);

  // Construct my token class
  var myMint = new web3.PublicKey(process.env.VUE_APP_TOKEN_PUBK);
  var myToken = new splToken.Token(
    connection,
    myMint,
    splToken.TOKEN_PROGRAM_ID,
    fromWallet
  );

  var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(toWallet)

  // Add token transfer instructions to transaction
  var transaction = new web3.Transaction()
    .add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fromTokenAccount,
        toTokenAccount.address,
        fromWallet.publicKey,
        [],
        10000000000 // at the moment the reward is fixed to 10 SoRex
      )
    );

  // Sign transaction, broadcast, and confirm
  var signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet]
  );

  console.log("SIGNATURE", signature);
  console.log("SUCCESS");
}

app.listen(5000, function(){
  console.log("server is running on port 5000");
})