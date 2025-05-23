// User type definition
export interface User {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  joinDate: Date;
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
  parallel: string;
  printRun?: number;
  cardImageUrl: string;
  isOneOfOne: boolean
  isOneOfOneFound?: boolean;
}

// Card Ownership type definition
export interface CardOwnership {
  id: string;
  userId: string;
  cardId: string;
  quantity: number;
  purchasePrice?: number;
  purchaseDate?: Date;
  condition: string;
  notes?: string;
  location?: string;
}

// Market Price Snapshot type definition
export interface MarketPriceSnapshot {
  id: string;
  cardId: string;
  timestamp: Date;
  source: string;
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
}

// Card Battle type definition
export interface CardBattle {
  id: string;
  cardOneId: string;
  cardTwoId: string;
  votesCardOne: number;
  votesCardTwo: number;
  createdAt: Date;
  expiresAt: Date;
}

// Grail List Entry type definition
export interface GrailListEntry {
  id: string;
  userId: string;
  cardId: string;
  createdAt: Date;
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
  id: string;
  productName: string;
  releaseDate: Date;
  description: string;
  manufacturer: string;
  imageUrl: string;
  preorderUrl?: string;
}