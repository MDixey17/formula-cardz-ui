export interface UpdateUserRequest {
    username?: string
    email?: string
    profileImageUrl?: string
    favoriteDrivers?: string[]
    favoriteConstructors?: string[]
}

export interface NewUserRequest {
    username: string
    email: string
    password: string
    profileImageUrl?: string
    favoriteConstructors: string[]
    favoriteDrivers: string[]
}