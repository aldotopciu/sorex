import { web3 } from '@project-serum/anchor';
import { Score } from '@/models';

// Define the storeHighscore endpoint.
export const storeHighscore = async ({ wallet, program }, highscore) => {
    // Generate a new Keypair for our new score account.
    const score = web3.Keypair.generate()
    // Send a "StoreScore" instruction with the right data and the right accounts.
    await program.value.rpc.storeScore(
        highscore, 
        {
            accounts: {
                score: score.publicKey,
                author: wallet.value.publicKey,
                systemProgram: web3.SystemProgram.programId
            }, 
            signers: [score]
        })
    // Fetch the newly created account from the blockchain.
    const scoreAccount = await program.value.account.score.fetch(score.publicKey)


    // Wrap the fetched account in a Score model so our frontend can display it.
    return new Score(score.publicKey, scoreAccount)
}