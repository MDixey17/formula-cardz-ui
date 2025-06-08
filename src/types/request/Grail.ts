export interface AddGrailRequest {
    userId: string
    cardId: string
    parallel?: string
    notifyOnAvailable: boolean
}

export interface UpdateGrailRequest {
    userId: string
    cardId: string
    oldParallel?: string
    parallel?: string
    notifyOnAvailable?: boolean
}

export interface RemoveGrailRequest {
    userId: string
    cardId: string
    parallel?: string
}