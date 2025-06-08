import React, {createContext, useContext, useEffect, useState} from 'react';
import {
    Card,
    CardBattle,
    CardDrop,
    CardOwnership,
    GrailListEntry, MarketPrice,
    User
} from '../types';
import {AuthService} from "../service/authService.ts";
import {CardOwnershipService} from "../service/ownershipService.ts";
import {
    AddCardToCollectionRequest,
    RemoveCardFromCollectionRequest,
    UpdateCardInCollectionRequest
} from "../types/request/CardCollection.ts";
import {AddGrailRequest, RemoveGrailRequest} from "../types/request/Grail.ts";
import {OneOfOneCardResponse} from "../types/response/Cards.ts";
import {GrailService} from "../service/grailService.ts";
import {CardBattleService} from "../service/cardBattleService.ts";
import {OneOfOneService} from "../service/oneOfOneService.ts";
import {DropdownService} from "../service/dropdownService.ts";
import {CardDropService} from "../service/cardDropService.ts";
import {CardService} from "../service/cardService.ts";
import {MarketPriceService} from "../service/marketPriceService.ts";

interface AppContextType {
  user: User | null;
  cardOwnerships: CardOwnership[];
  grailEntries: GrailListEntry[];
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => Promise<void>
  addCardToCollection: (card: AddCardToCollectionRequest) => Promise<void>;
  updateCardOwnership: (card: UpdateCardInCollectionRequest) => Promise<void>;
  removeCardFromCollection: (card: RemoveCardFromCollectionRequest) => Promise<void>;
  addCardToGrailList: (card: AddGrailRequest) => Promise<void>;
  removeCardFromGrailList: (card: RemoveGrailRequest) => Promise<void>;
  voteForCard: (battleId: string, cardIndex: 1 | 2) => Promise<CardBattle[]>;
  getOneOfOnesBySet: (setName: string, driverName?: string, isFound?: boolean) => Promise<OneOfOneCardResponse[]>;
  getAvailableSets: () => Promise<{ setName: string; year: number }[]>;
  getCardDrops: () => Promise<CardDrop[]>;
  getCardsByCriteria: (year?: number, setName?: string, driverName?: string, constructorName?: string, cardNumber?: string) => Promise<Card[]>
  getMarketPriceByCardId: (cardId: string, parallel?: string) => Promise<MarketPrice>;
  getCardBattles: () => Promise<CardBattle[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cardOwnerships, setCardOwnerships] = useState<CardOwnership[]>([]);
  const [grailEntries, setGrailEntries] = useState<GrailListEntry[]>([]);

  useEffect(() => {
      // Check if the last login in localStorage was over 24 hours ago
      const lastLoginDateString = localStorage.getItem("lastLogin")
      const lastUserString = localStorage.getItem("lastUser")
      if (lastLoginDateString) {
          const now = new Date();
          const lastLoginDate = new Date(lastLoginDateString)
          const logoutThreshold = 86400000
          if (Math.abs(now.getTime() - lastLoginDate.getTime()) < logoutThreshold  && lastUserString) {
              const lastUser = JSON.parse(lastUserString) as User
              setUser(lastUser)
          }
      }
  }, [])

  useEffect(() => {
      const updatedOwnershipAndGrails = async () => {
          if (user) {
              // Get card ownerships and grails
              const ownershipData = await CardOwnershipService.getCardsOwnedByUserId(user.id)
              const grailData = await GrailService.getUserGrailCards(user.id)
              setCardOwnerships(ownershipData.map((c) => ({
                  ...c
              })))
              setGrailEntries(grailData.map((grail) => ({
                  ...grail
              })))
          }
      }

      updatedOwnershipAndGrails()
  }, [user])

  const login = async (email: string, password: string) => {
      try {
          const tokenResponse = await AuthService.login(email, password);
          localStorage.setItem('token', tokenResponse.token)
          localStorage.setItem('lastLogin', new Date().toDateString())
          const user: User = {
              id: tokenResponse.id,
              username: tokenResponse.username,
              email: tokenResponse.email,
              profileImageUrl: tokenResponse.profileImageUrl,
              favoriteConstructors: tokenResponse.favoriteConstructors,
              favoriteDrivers: tokenResponse.favoriteDrivers,
          }
          localStorage.setItem('lastUser', JSON.stringify(user));

          setUser(user);
      } catch (error) {
          console.error('Error on login attempt: ', error)
          throw new Error('Login failed!')
      }
  }

  const register = async (email: string, password: string, username: string) => {
      try {
          const tokenResponse = await AuthService.register(email, password, username);
          localStorage.setItem('token', tokenResponse.token)
          localStorage.setItem('lastLogin', new Date().toDateString())
          const user: User = {
              id: tokenResponse.id,
              username: tokenResponse.username,
              email: tokenResponse.email,
              profileImageUrl: tokenResponse.profileImageUrl,
              favoriteConstructors: tokenResponse.favoriteConstructors,
              favoriteDrivers: tokenResponse.favoriteDrivers,
          }
          localStorage.setItem('lastUser', JSON.stringify(user));
          setUser(user);
      } catch (error) {
          console.error('Error on register attempt: ', error)
          throw new Error('Register failed!')
      }
  }

  const logout = async () => {
      // Add logic to logout
      setUser(null)
  }

  const addCardToCollection = async (card: AddCardToCollectionRequest) => {
    if (user) {
        await CardOwnershipService.addCardToCollection(card)
        const collection = await CardOwnershipService.getCardsOwnedByUserId(user.id)
        setCardOwnerships(collection)
    } else {
        throw new Error('Please login to add cards to your collection')
    }
  };

  const updateCardOwnership = async (card: UpdateCardInCollectionRequest) => {
    if (user) {
        await CardOwnershipService.updateCardInCollection(card)
        const updatedCollection = await CardOwnershipService.getCardsOwnedByUserId(user.id)
        setCardOwnerships(updatedCollection.map((card) => ({
            ...card,
        })))
    }  else {
        throw new Error('Please login to update cards in your collection')
    }
  };

  const removeCardFromCollection = async (card: RemoveCardFromCollectionRequest) => {
    if (user) {
        await CardOwnershipService.removeCardFromCollection(card)
        const updatedCollection = await CardOwnershipService.getCardsOwnedByUserId(user.id)
        setCardOwnerships(updatedCollection.map((card) => ({
            ...card,
        })))
    } else {
        throw new Error('Please login to update cards in your collection')
    }
  };

  const addCardToGrailList = async (card: AddGrailRequest) => {
    if (user) {
        const updatedGrailList = await GrailService.addCardToGrail(card)
        setGrailEntries(updatedGrailList.map((grail) => ({
            ...grail,
        })))
    } else {
        throw new Error('Please login to add card to your grail list')
    }
  };

  const removeCardFromGrailList = async (card: RemoveGrailRequest) => {
      if (user) {
          const updatedGrailList = await GrailService.removeCardFromGrail(card)
          setGrailEntries(updatedGrailList.map((grail) => ({
              ...grail,
          })))
      } else {
          throw new Error('Please login to remove cards from your grail list')
      }
  };

  const getCardBattles = async (): Promise<CardBattle[]> => {
      const activeBattles = await CardBattleService.getActiveCardBattle()
      const pastBattles = await CardBattleService.getPastCardBattles()
      return activeBattles.concat(pastBattles).map((battle) => ({
          battleId: battle.id,
          cardOne: battle.cardOne,
          cardTwo: battle.cardTwo,
          votesCardOne: battle.votesCardOne,
          votesCardTwo: battle.votesCardTwo,
          expiresAt: battle.expiresAt,
      }))
  }

  const voteForCard = async (battleId: string, cardIndex: 1 | 2) => {
    if (user) {
        await CardBattleService.voteOnCardBattle({
            cardIndex: cardIndex === 1 ? 0 : 1,
            battleId: battleId,
            userId: user.id
        })

        return await getCardBattles()
    } else {
        throw new Error('Please login to vote in card battles')
    }
  };

    const getOneOfOnesBySet = async (setName: string, driverName?: string, isFound?: boolean): Promise<OneOfOneCardResponse[]> => {
        return await OneOfOneService.getOneOfOnesByCriteria(isFound, setName, driverName);
    };

    const getAvailableSets = async () => {
        return (await DropdownService.getSetsDropdown()).map((set) => ({
            setName: set.label,
            year: Number(set.label.substring(0, 4)),
        }))
    };

    const getCardDrops = async (): Promise<CardDrop[]> => {
        return (await CardDropService.getCardDrops()).map((cardDrop) => ({
            ...cardDrop,
        }));
    }

    const getCardsByCriteria = async (year?: number, setName?: string, driverName?: string, constructorName?: string, cardNumber?: string): Promise<Card[]> => {
        const cards = await CardService.getCardsByCriteria(year, setName, driverName, constructorName, cardNumber);
        return cards.map((card) => ({
            id: card.id,
            year: card.year,
            setName: card.setName,
            cardNumber: card.cardNumber,
            driverName: card.driverName,
            constructorName: card.constructorName,
            subset: card.subset,
            rookieCard: card.rookieCard,
            baseImageUrl: card.baseImageUrl,
            hasOneOfOne: card.hasOneOfOne,
            parallels: card.parallels
        }))
    }

    const getMarketPriceByCardId = async (cardId: string, parallel?: string): Promise<MarketPrice> => {
        return await MarketPriceService.getMarketPriceByCardId(cardId, parallel);
    }

  return (
      <AppContext.Provider
          value={{
            user,
            cardOwnerships,
            grailEntries,
            register,
            login,
            logout,
            addCardToCollection,
            updateCardOwnership,
            removeCardFromCollection,
            addCardToGrailList,
            removeCardFromGrailList,
            voteForCard,
            getOneOfOnesBySet,
            getAvailableSets,
            getCardDrops,
            getCardsByCriteria,
            getMarketPriceByCardId,
            getCardBattles,
          }}
      >
        {children}
      </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};