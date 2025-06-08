import {EnrichedParallel} from "./response/Cards.ts";
import {MarketPriceSnapshot} from "./response/MarketPrice.ts";
import {CardBattleCard} from "./response/CardBattleResponse.ts";

// User type definition
export interface User {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  favoriteDrivers: string[];
  favoriteConstructors: string[];
}

// Card type definition
export interface Card {
  id: string;
  year: number;
  setName: string;
  cardNumber: string;
  driverName: string;
  constructorName: string;
  subset?: string;
  rookieCard: boolean;
  baseImageUrl: string;
  hasOneOfOne: boolean
  parallels: EnrichedParallel[];
}

// Card Ownership type definition
export interface CardOwnership {
  id: string
  year: number
  setName: string
  cardNumber: string
  driverName: string
  constructorName: string
  rookieCard: boolean
  parallel?: string
  printRun?: number
  imageUrl: string
  quantity: number
  condition: string
  purchasePrice?: number
  purchaseDate?: Date
}

// Market Price Snapshot type definition
export interface MarketPrice {
  cardId: string
  history: MarketPriceSnapshot[]
}

// Card Battle type definition
export interface CardBattle {
  battleId: string;
  cardOne: CardBattleCard;
  cardTwo: CardBattleCard;
  votesCardOne: number;
  votesCardTwo: number;
  expiresAt: Date;
}

// Grail List Entry type definition
export interface GrailListEntry {
  id: string
  year: number
  setName: string
  cardNumber: string
  driverName: string
  constructorName: string
  rookieCard: boolean
  parallel?: string
  printRun?: number
  imageUrl: string
  notifyOnAvailable: boolean;
}

// Card Condition Options
export enum CardCondition {
  RAW = "Raw",
  EXCELLENT = "Excellent",
  NEAR_MINT = "Near Mint",
  MINT = "Mint",
  PSA_10 = "PSA 10",
  PSA_9 = "PSA 9",
  PSA_8 = "PSA 8",
  PSA_7 = "PSA 7",
  PSA_6 = "PSA 6",
  BGS_10 = "BGS 10",
  BGS_9_5 = "BGS 9.5",
  BGS_9 = "BGS 9",
  BGS_8_5 = "BGS 8.5",
  BGS_8 = "BGS 8",
  BGS_7_5 = "BGS 7.5",
  BGS_7 = "BGS 7",
  SGC_10 = "SGC 10",
  SGC_9_5 = "SGC 9.5",
  SGC_9 = "SGC 9",
  SGC_8_5 = "SGC 8.5",
  SGC_8 = "SGC 8",
  SGC_7_5 = "SGC 7.5",
  SGC_7 = "SGC 7",
  OTHER = "Other"
}

// Marketplace listings
export interface MarketplaceListing {
  id: string;
  cardId: string;
  source: string;
  price: number;
  condition: string;
  sellerRating: number;
  listingUrl: string;
  listingDate: Date;
}

// Card drops calendar
export interface CardDrop {
  productName: string;
  releaseDate: Date;
  description: string;
  manufacturer: string;
  imageUrl: string;
  preorderUrl?: string;
}