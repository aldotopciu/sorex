import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { TopciuSorex } from '../target/types/topciu_sorex';
import * as assert from "assert";

describe('topciu-sorex', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.TopciuSorex as Program<TopciuSorex>;

  it('can store new highscore', async () => {
    const score = anchor.web3.Keypair.generate();
    await program.rpc.storeScore(12, {
        accounts: {
            score: score.publicKey,
            author: program.provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [score],
    });

    const scoreAccount = await program.account.score.fetch(score.publicKey);

    // test the store went fine
    assert.equal(scoreAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(scoreAccount.score, 12);
    assert.ok(scoreAccount.timestamp);
  });

  it('can fetch the highest score of an author', async () => {
    const authorPublicKey = program.provider.wallet.publicKey
    const scoreAccount = await program.account.score.all([
        {
            memcmp: {
                offset: 8, // Discriminator.
                bytes: authorPublicKey.toBase58(),
            }
        }
    ]);

    assert.equal(scoreAccount.length, 1);
    assert.ok(scoreAccount.every(scoreAccount => {
      return scoreAccount.account.author.toBase58() === authorPublicKey.toBase58()
  }))
});

});
