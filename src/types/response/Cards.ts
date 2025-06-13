export interface ParallelDetails {
    name: string // Superfractor, Red, Black, Orange, Gold
    printRun?: number // nullable because multi-colored SPs are not numbered
    isOneOfOne?: boolean
}

export type EnrichedParallel = ParallelDetails & { imageUrl?: string }

export interface EnabledParallel {
    name: string // must match from ParallelSet exactly
    imageUrl?: string
    isOneOfOne?: boolean
    isOneOfOneFound?: boolean
}

export interface CardResponse {
    id: string
    year: number
    setName: string
    cardNumber: string
    driverName: string
    constructorName: string
    subset?: string
    rookieCard: boolean
    hasOneOfOne: boolean
    baseImageUrl: string
    parallels: EnrichedParallel[]
}

export interface OneOfOneCardResponse {
    id: string
    year: number
    setName: string
    cardNumber: string
    driverName: string
    constructorName: string
    rookieCard: boolean
    parallels: EnabledParallel[]
}