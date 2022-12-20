import process from 'process'
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { web3 } from "@project-serum/anchor";

export const play = async ({ wallet, connection }) => {
    var tokenMintAddress = process.env.VUE_APP_TOKEN_PK;
    var to = process.env.VUE_APP_PROGRAM_WALLET_PK;
    var amount = process.env.VUE_APP_FEE_TO_PLAY;

    const ownerPublicKey = new web3.PublicKey(wallet.value.publicKey.toBase58());   
    const destPublicKey = new web3.PublicKey(to);
    const mintPublicKey = new web3.PublicKey(tokenMintAddress);   

    const mintToken = new Token(
        connection,
        mintPublicKey,
        TOKEN_PROGRAM_ID,
    );

    const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(
        ownerPublicKey
    );

    // Get the derived address of the destination wallet which will hold the custom token
    const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintPublicKey,
        destPublicKey
    );

    const transaction = new web3.Transaction().add(Token.createTransferInstruction(
                                                        TOKEN_PROGRAM_ID,
                                                        fromTokenAccount.address,
                                                        associatedDestinationTokenAddr,
                                                        ownerPublicKey,
                                                        [],
                                                        amount
                                                    ));
                                                    
    transaction.feePayer = new web3.PublicKey(wallet.value.publicKey.toBase58());
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    return transaction;
}