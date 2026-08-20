export interface SetOption {
  label: string;
  value: string;
}

export interface EnabledParallel {
  name: string;
  imageUrl?: string;
  isOneOfOne?: boolean;
  isOneOfOneFound?: boolean;
  numberOfOneOfOnesFound?: number;
  hasBounty?: boolean;
}

export interface OneOfOneCard {
  id: string;
  year: number;
  setName: string;
  cardNumber: string;
  driverName: string;
  constructorName: string;
  rookieCard: boolean;
  parallels: EnabledParallel[];
}

export interface Drop {
  _id: string;
  productName: string;
  releaseDate: string;
  description?: string;
  manufacturer?: string;
  imageUrl?: string;
  preorderUrl?: string;
}

export interface AuthResponse {
  email: string;
  username: string;
  token: string;
  id: string;
  profileImageUrl?: string;
  favoriteDrivers?: string[];
  favoriteConstructors?: string[];
  hasPremium?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  favoriteDrivers?: string[];
  favoriteConstructors?: string[];
  hasPremium?: boolean;
  createdAt?: string;
}

export interface EnrichedParallel {
  name: string;
  imageUrl?: string;
  printRun?: number;
  isOneOfOne?: boolean;
}

export interface CardResponse {
  id: string;
  year: number;
  setName: string;
  cardNumber: string;
  driverName: string;
  constructorName: string;
  subset?: string;
  rookieCard: boolean;
  hasOneOfOne: boolean;
  baseImageUrl: string;
  parallels: EnrichedParallel[];
}

export interface OwnershipEntry {
  _id?: string;
  userId: string;
  cardId: string;
  quantity: number;
  parallel?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  condition: string;
  // Enriched fields the API may attach
  driverName?: string;
  setName?: string;
  year?: number;
  cardNumber?: string;
  constructorName?: string;
  rookieCard?: boolean;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  favoriteDrivers: string[];
  favoriteConstructors: string[];
  profileImageUrl?: string;
}
