import dayjs from "dayjs"

export class Score
{
    constructor (publicKey, accountData) {
        this.publicKey = publicKey
        this.author = accountData.author
        this.timestamp = accountData.timestamp.toString()
        this.score = accountData.score
    }

    get key () {
        return this.publicKey.toBase58()
    }

    get author_display () {
        const author = this.author.toBase58()
        return author.slice(0,4) + '..' + author.slice(-4)
    }

    get created_at () {
        return dayjs.unix(this.timestamp).format('lll')
    }
}