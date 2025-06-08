import {axiosService} from "./axiosService.ts";
import {MarketPriceResponse} from "../types/response/MarketPrice.ts";

const getMarketPriceByCardId = async (cardId: string, parallel?: string): Promise<MarketPriceResponse> => {
    const url = new URL(`/marketprice/${cardId}`)
    if (parallel) {
        url.searchParams.set("parallel", parallel.toString())
    }
    const response = await axiosService.get<MarketPriceResponse>(url.toString())
    return response.data
}

export const MarketPriceService = {
    getMarketPriceByCardId
}