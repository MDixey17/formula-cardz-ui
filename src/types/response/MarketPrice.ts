export interface MarketPriceSnapshot {
    timestamp: Date
    lowestPrice: number
    averagePrice: number
    highestPrice: number
    source: string
    parallel: string
}

export interface MarketPriceResponse {
    cardId: string
    history: MarketPriceSnapshot[]
}