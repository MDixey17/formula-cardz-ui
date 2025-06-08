export interface CardCollectionResponse {
    // Card fields
    id: string
    year: number
    setName: string
    cardNumber: string
    driverName: string
    constructorName: string
    rookieCard: boolean
    parallel?: string
    imageUrl: string

    // Ownership fields
    quantity: number
    condition: string
    purchasePrice?: number
    purchaseDate?: Date
}