import {AddGrailResponse, GrailResponse} from "../types/response/Grail.ts";
import {axiosService} from "./axiosService.ts";
import {AddGrailRequest, RemoveGrailRequest, UpdateGrailRequest} from "../types/request/Grail.ts";

const getUserGrailCards = async (userId: string): Promise<GrailResponse[]> => {
    const response = await axiosService.get<GrailResponse[]>(`/grails/${userId}`)
    return response.data
}

const addCardToGrail = async (request: AddGrailRequest): Promise<AddGrailResponse[]> => {
    const response = await axiosService.post<AddGrailResponse[]>("/grails", request)
    return response.data
}

const updateCardInGrail = async (request: UpdateGrailRequest): Promise<GrailResponse[]> => {
    const response = await axiosService.put<GrailResponse[]>("/grails", request)
    return response.data
}

const removeCardFromGrail = async (request: RemoveGrailRequest): Promise<GrailResponse[]> => {
    const response = await axiosService.delete<GrailResponse[]>("/grails", {
        data: request,
    })
    return response.data
}

export const GrailService = {
    getUserGrailCards,
    addCardToGrail,
    updateCardInGrail,
    removeCardFromGrail,
}