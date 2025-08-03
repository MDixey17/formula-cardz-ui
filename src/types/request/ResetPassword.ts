export interface ForgotPasswordRequest {
    email: string
}

export interface ResetPasswordRequest {
    token: string
    id: string
    newPassword: string
}