import {AxiosError} from "axios";
import {AuthRequest} from "../types/request/AuthRequest.ts";
import {AuthResponse} from "../types/response/AuthResponse.ts";
import {axiosService} from "./axiosService.ts";
import {ForgotPasswordRequest, ResetPasswordRequest} from "../types/request/ResetPassword.ts";

const register = async (email: string, password: string, username: string): Promise<AuthResponse> => {
    try {
        const registerBody: AuthRequest = {
            email: email,
            password: password,
            username: username,
        }

        const response = await axiosService.post<AuthResponse>('/auth/register', registerBody)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError && error.status && error.status === 400) {
            throw new Error('An account already exists with that email!')
        } else {
            throw error
        }
    }
}

const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const loginBody: AuthRequest = {
            email: email,
            password: password,
        }

        const response = await axiosService.post<AuthResponse>('/auth/login', loginBody)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.status && error.status === 400) {
                throw new Error('An account does not exist with that email!')
            }
            else if (error.status && error.status === 401) {
                throw new Error('Incorrect email or password!')
            } else {
                throw error
            }
        } else {
            throw error
        }
    }
}

const forgotPassword = async (email: string) => {
    const requestBody: ForgotPasswordRequest = {
        email
    }

    try {
        await axiosService.post('/auth/forgot-password', requestBody)
    } catch (error) {
        console.error('An error occurred with sending the forgot password request: ', error)
        throw error
    }
}

const resetPassword = async (userId: string, resetToken: string, newPassword: string) => {
    const requestBody: ResetPasswordRequest = {
        id: userId,
        token: resetToken,
        newPassword
    }

    try {
        await axiosService.put('/auth/reset-password', requestBody)
    } catch (error) {
        console.error('An error occurred when attempting to reset a user password: ', error)
        throw error
    }
}

export const AuthService = {
    register,
    login,
    forgotPassword,
    resetPassword
}