export interface CardBattleCard {
    year: number
    setName: string
    cardNumber: string
    driverName: string
    constructorName: string
    imageUrl: string
}

export interface CardBattleResponse {
    id: string
    votesCardOne: number
    votesCardTwo: number
    expiresAt: Date
    isExpired: boolean
    cardOne: CardBattleCard
    cardTwo: CardBattleCard
}

export interface CardBattleVoteResponse {
    message: string
    updatedVotes: {
        votesCardOne: number
        votesCardTwo: number
    }
}