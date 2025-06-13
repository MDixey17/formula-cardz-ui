import {CardBattleVoteRequest} from "../types/request/CardBattleVoteRequest.ts";
import {CardBattleResponse, CardBattleVoteResponse} from "../types/response/CardBattleResponse.ts";
import {axiosService} from "./axiosService.ts";

const voteOnCardBattle = async (vote: CardBattleVoteRequest): Promise<CardBattleVoteResponse> => {
    const response = await axiosService.post<CardBattleVoteResponse>('/battles/vote', vote)
    return response.data
}

const getActiveCardBattle = async (): Promise<CardBattleResponse[]> => {
    const response = await axiosService.get<CardBattleResponse[]>('/battles/active')
    return response.data
}

const getPastCardBattles = async (): Promise<CardBattleResponse[]> => {
    const response = await axiosService.get<CardBattleResponse[]>('/battles/previous')
    return response.data
}

export const CardBattleService = {
    voteOnCardBattle,
    getActiveCardBattle,
    getPastCardBattles
}