export interface AuthResponse {
    email: string
    username: string
    token: string
    id: string
    profileImageUrl: string
    favoriteDrivers: string[]
    favoriteConstructors: string[]
    hasPremium?: boolean
}