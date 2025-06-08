import {CardDropResponse} from "../types/response/CardDropResponse.ts";
import {axiosService} from "./axiosService.ts";

const getCardDrops = async (): Promise<CardDropResponse[]> => {
    const response = await axiosService.get<CardDropResponse[]>('/drops')
    return response.data
}

const getCardDropById = async (dropId: string): Promise<CardDropResponse> => {
    const response = await axiosService.get<CardDropResponse>(`/drops/${dropId}`)
    return response.data
}

export const CardDropService = {
    getCardDrops,
    getCardDropById
}