use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("64NXbocKn7bsha8f2asHEeNagb1XivwopeMttzZHTme");

#[program]
pub mod topciu_sorex {
    use super::*;
    pub fn store_score(ctx: Context<StoreScore>, highscore: u32) -> ProgramResult {
        let score: &mut Account<Score> = &mut ctx.accounts.score;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        // validate score

        // store
        score.author = *author.key;
        score.timestamp = clock.unix_timestamp;
        score.score = highscore;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct StoreScore<'info> {
    #[account(init, payer = author, space = Score::LEN)]
    pub score: Account<'info, Score>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const SCORE_LENGTH: usize = 4;

#[account]
pub struct Score {
    pub author: Pubkey,
    pub timestamp: i64,
    pub score: u32
}

impl Score {
    const LEN: usize = DISCRIMINATOR_LENGTH + PUBLIC_KEY_LENGTH + TIMESTAMP_LENGTH + SCORE_LENGTH;
}

#[error]
pub enum ErrorCode {
    #[msg("The provided score is not valid.")]
    ScoreNotValid
}