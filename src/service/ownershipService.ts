import {CardCollectionResponse} from "../types/response/CardCollection.ts";
import {axiosService} from "./axiosService.ts";
import {
    AddCardToCollectionRequest,
    RemoveCardFromCollectionRequest,
    UpdateCardInCollectionRequest
} from "../types/request/CardCollection.ts";

const getCardsOwnedByUserId = async (userId: string): Promise<CardCollectionResponse[]> => {
    const response = await axiosService.get<CardCollectionResponse[]>(`/ownership/${userId}`);
    return response.data
}

const addCardToCollection = async (newCard: AddCardToCollectionRequest) => {
    await axiosService.post('/ownership', newCard);
}

const updateCardInCollection = async (request: UpdateCardInCollectionRequest) => {
    await axiosService.put('/ownership', request);
}

const removeCardFromCollection = async (request: RemoveCardFromCollectionRequest) => {
    await axiosService.delete("/ownership", {
        data: request
    })
}

export const CardOwnershipService = {
    getCardsOwnedByUserId,
    addCardToCollection,
    updateCardInCollection,
    removeCardFromCollection,
}