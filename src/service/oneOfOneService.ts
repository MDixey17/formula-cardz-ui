import {OneOfOneCardResponse} from "../types/response/Cards.ts";
import {axiosService} from "./axiosService.ts";

const getOneOfOnesByCriteria = async (isFound?: boolean, setName?: string, driverName?: string): Promise<OneOfOneCardResponse[]> => {
    const url = new URL("https://formula-cardz-api.onrender.com/v1/oneofones")
    if (isFound !== undefined) {
        url.searchParams.set("isFound", String(isFound))
    }
    if (driverName !== undefined) {
        url.searchParams.set("driverName", driverName)
    }
    if (setName !== undefined) {
        url.searchParams.set("setName", setName)
    }

    const response = await axiosService.get<OneOfOneCardResponse[]>(url.toString().substring(41))
    return response.data
}

export const OneOfOneService = {
    getOneOfOnesByCriteria
}