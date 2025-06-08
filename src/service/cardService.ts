import {CardResponse} from "../types/response/Cards.ts";
import {axiosService} from "./axiosService.ts";

const getCardsByCriteria = async (
    year?: number,
    setName?: string,
    driverName?: string,
    constructorName?: string,
    cardNumber?: string
): Promise<CardResponse[]> => {
    const url = new URL("/cards")
    if (year !== undefined) {
        url.searchParams.set("year", year.toString())
    }
    if (setName !== undefined) {
        url.searchParams.set("setName", setName.toString())
    }
    if (driverName !== undefined) {
        url.searchParams.set("driverName", driverName.toString())
    }
    if (constructorName !== undefined) {
        url.searchParams.set("constructorName", constructorName.toString())
    }
    if (cardNumber !== undefined) {
        url.searchParams.set("cardNumber", cardNumber.toString())
    }

    const response = await axiosService.get<CardResponse[]>(url.toString())
    return response.data
}

const getCardById = async (cardId: string): Promise<CardResponse> => {
    const response = await axiosService.get<CardResponse>(`/card/${cardId}`)
    return response.data
}

export const CardService = {
    getCardsByCriteria,
    getCardById
}