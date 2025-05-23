import React, { createContext, useContext, useState } from 'react';
import {
    Card,
    CardBattle,
    CardDrop,
    CardOwnership,
    GrailListEntry,
    MarketplaceListing,
    MarketPriceSnapshot,
    User
} from '../types';
import {
    currentUser,
    mockCardBattles,
    mockCardDrops,
    mockCardOwnerships,
    mockCards,
    mockGrailEntries,
    mockMarketPriceSnapshots,
    mockMarketplaceListings,
    mockYearDropdown
} from '../data/mockData';
import {Dropdown} from "../types/Dropdown.ts";

interface AppContextType {
  user: User;
  cards: Card[];
  cardOwnerships: CardOwnership[];
  marketPriceSnapshots: MarketPriceSnapshot[];
  cardBattles: CardBattle[];
  grailEntries: GrailListEntry[];
  marketplaceListings: MarketplaceListing[];
  cardDrops: CardDrop[];
  yearDropdown: Dropdown[]
  addCardToCollection: (card: Card, quantity: number, condition: string) => void;
  updateCardOwnership: (cardId: string, updates: Partial<CardOwnership>) => void;
  removeCardFromCollection: (cardId: string) => void;
  addCardToGrailList: (cardId: string) => void;
  removeCardFromGrailList: (cardId: string) => void;
  voteForCard: (battleId: string, cardIndex: 1 | 2) => void;
  getOneOfOnesBySet: (setName: string, year: number) => Card[];
  getAvailableSets: () => { setName: string; year: number }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(currentUser);
  const [cards, setCards] = useState<Card[]>(mockCards);
  const [cardOwnerships, setCardOwnerships] = useState<CardOwnership[]>(mockCardOwnerships);
  const [marketPriceSnapshots, setMarketPriceSnapshots] = useState<MarketPriceSnapshot[]>(mockMarketPriceSnapshots);
  const [cardBattles, setCardBattles] = useState<CardBattle[]>(mockCardBattles);
  const [grailEntries, setGrailEntries] = useState<GrailListEntry[]>(mockGrailEntries);
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(mockMarketplaceListings);
  const [cardDrops, setCardDrops] = useState<CardDrop[]>(mockCardDrops);
  const [yearDropdown, setYearDropdown] = useState<Dropdown[]>(mockYearDropdown)

  const addCardToCollection = (card: Card, quantity: number, condition: string) => {
    const existingOwnership = cardOwnerships.find(
        (ownership) => ownership.cardId === card.id && ownership.condition === condition
    );

    if (existingOwnership) {
      setCardOwnerships(
          cardOwnerships.map((ownership) =>
              ownership.id === existingOwnership.id
                  ? { ...ownership, quantity: ownership.quantity + quantity }
                  : ownership
          )
      );
    } else {
      const newOwnership: CardOwnership = {
        id: `ownership${cardOwnerships.length + 1}`,
        userId: user.id,
        cardId: card.id,
        quantity,
        condition,
        purchaseDate: new Date(),
      };
      setCardOwnerships([...cardOwnerships, newOwnership]);
    }
  };

  const updateCardOwnership = (cardId: string, updates: Partial<CardOwnership>) => {
    setCardOwnerships(
        cardOwnerships.map((ownership) =>
            ownership.cardId === cardId
                ? { ...ownership, ...updates }
                : ownership
        )
    );
  };

  const removeCardFromCollection = (cardId: string) => {
    setCardOwnerships(cardOwnerships.filter(ownership => ownership.cardId !== cardId));
  };

  const addCardToGrailList = (cardId: string) => {
    const existingEntry = grailEntries.find(
        (entry) => entry.cardId === cardId && entry.userId === user.id
    );

    if (!existingEntry) {
      const newEntry: GrailListEntry = {
        id: `grail${grailEntries.length + 1}`,
        userId: user.id,
        cardId,
        createdAt: new Date(),
        notifyOnAvailable: true,
      };
      setGrailEntries([...grailEntries, newEntry]);
    }
  };

  const removeCardFromGrailList = (cardId: string) => {
    setGrailEntries(
        grailEntries.filter(
            (entry) => !(entry.cardId === cardId && entry.userId === user.id)
        )
    );
  };

  const voteForCard = (battleId: string, cardIndex: 1 | 2) => {
    setCardBattles(
        cardBattles.map((battle) => {
          if (battle.id === battleId) {
            if (cardIndex === 1) {
              return { ...battle, votesCardOne: battle.votesCardOne + 1 };
            } else {
              return { ...battle, votesCardTwo: battle.votesCardTwo + 1 };
            }
          }
          return battle;
        })
    );
  };

    const getOneOfOnesBySet = (setName: string, year: number) => {
        return cards.filter(card =>
            card.setName === setName &&
            card.year === year &&
            card.printRun === 1
        );
    };

    const getAvailableSets = () => {
        const sets = cards.reduce((acc: { setName: string; year: number }[], card) => {
            const existingSet = acc.find(set => set.setName === card.setName && set.year === card.year);
            if (!existingSet) {
                acc.push({ setName: card.setName, year: card.year });
            }
            return acc;
        }, []);

        return sets.sort((a, b) => b.year - a.year);
    };

  return (
      <AppContext.Provider
          value={{
            user,
            cards,
            cardOwnerships,
            marketPriceSnapshots,
            cardBattles,
            grailEntries,
            marketplaceListings,
            cardDrops,
            yearDropdown,
            addCardToCollection,
            updateCardOwnership,
            removeCardFromCollection,
            addCardToGrailList,
            removeCardFromGrailList,
            voteForCard,
            getOneOfOnesBySet,
            getAvailableSets,
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