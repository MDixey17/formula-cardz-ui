export interface GrailResponse {
    // Card fields
    id: string
    year: number
    setName: string
    cardNumber: string
    driverName: string
    constructorName: string
    rookieCard: boolean
    parallel?: string
    printRun?: number
    imageUrl: string

    // Grail fields
    notifyOnAvailable: boolean
}