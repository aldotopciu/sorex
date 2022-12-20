import { Score } from '@/models'

export const getScore = async ({ program }, filters = []) => {
    const accounts = await program.value.account.score.all(filters);
    accounts.map(score => new Score(score.publicKey, score.account));
    const max = accounts.reduce(function(prev, current) {
        return (prev.account.score > current.account.score) ? prev : current
    })
    return max;
}

export const authorFilter = authorBase58PublicKey => ({
    memcmp: {
        offset: 8, // Discriminator.
        bytes: authorBase58PublicKey,
    }
})