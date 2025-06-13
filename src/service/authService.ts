import {AxiosError} from "axios";
import {AuthRequest} from "../types/request/AuthRequest.ts";
import {AuthResponse} from "../types/response/AuthResponse.ts";
import {axiosService} from "./axiosService.ts";

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

export const AuthService = {
    register,
    login
}