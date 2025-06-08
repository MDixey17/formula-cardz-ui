export interface RemoveCardFromCollectionRequest {
    userId: string
    cardId: string
    quantityToSubtract: number
    parallel?: string
    condition: string
}

export interface AddCardToCollectionRequest {
    userId: string
    cardId: string
    quantity: number
    parallel?: string
    purchasePrice?: number
    purchaseDate?: Date
    condition: string
}

export interface UpdateCardInCollectionRequest {
    userId: string
    cardId: string
    oldParallel?: string
    quantity?: number
    parallel?: string
    purchasePrice?: number
    purchaseDate?: Date
    condition?: string
}