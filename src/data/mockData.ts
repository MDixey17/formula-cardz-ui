import { Card, CardBattle, CardOwnership, GrailListEntry, MarketPriceSnapshot, User } from "../types";

// Mock current user
export const currentUser: User = {
  id: "user1",
  username: "f1collector",
  email: "f1collector@example.com",
  profileImageUrl: "https://images.pexels.com/photos/12318239/pexels-photo-12318239.jpeg?auto=compress&cs=tinysrgb&w=300",
  joinDate: new Date("2023-01-15"),
  favoriteDrivers: ["Max Verstappen", "Lewis Hamilton", "Lando Norris"],
  favoriteConstructors: ["Red Bull Racing", "McLaren", "Ferrari"]
};

// Mock cards
export const mockCards: Card[] = [
  {
    id: "card1",
    year: 2023,
    setName: "Topps Chrome Formula 1",
    cardNumber: "1",
    driverName: "Max Verstappen",
    constructorName: "Red Bull Racing",
    rookieCard: false,
    parallel: "Superfractor",
    printRun: 1,
    cardImageUrl: "https://d2tt46f3mh26nl.cloudfront.net/public/Lots/202404-0219-2042-f8387411-2004-4f98-8deb-84636c689a02/6aded069-3dd8-4dca-a9fe-965759f32a27@1x"
  },
  {
    id: "card2",
    year: 2023,
    setName: "Topps Chrome Formula 1",
    cardNumber: "44",
    driverName: "Lewis Hamilton",
    constructorName: "Mercedes",
    rookieCard: false,
    parallel: "Black Refractor",
    printRun: 10,
    cardImageUrl: "https://i5.walmartimages.com/seo/F1-2023-Topps-Chrome-Formula-1-Lewis-Hamilton-186_862e549e-f9e5-4ddf-a8e1-da67d948f873.4f74167e07da8ac74821fa0a36408086.jpeg"
  },
  {
    id: "card3",
    year: 2023,
    setName: "Topps Chrome Formula 1",
    cardNumber: "16",
    driverName: "Charles Leclerc",
    constructorName: "Ferrari",
    rookieCard: false,
    parallel: "Gold",
    printRun: 50,
    cardImageUrl: "https://i.ebayimg.com/images/g/g1gAAOSw-zRl7Kfd/s-l1200.jpg"
  },
  {
    id: "card4",
    year: 2023,
    setName: "Topps Chrome Formula 1",
    cardNumber: "4",
    driverName: "Lando Norris",
    constructorName: "McLaren",
    rookieCard: false,
    parallel: "Orange",
    printRun: 25,
    cardImageUrl: "https://images.production.sportscardinvestor.com/6853_1585_654_25-L"
  },
  {
    id: "card5",
    year: 2023,
    setName: "Topps Chrome Formula 1",
    cardNumber: "14",
    driverName: "Fernando Alonso",
    constructorName: "Aston Martin",
    rookieCard: false,
    parallel: "Red",
    printRun: 5,
    cardImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUhxp9AdNx-XSewlZcVgjCiWypiLonVDoRIA&s"
  },
  {
    id: "card6",
    year: 2023,
    setName: "Topps Chrome Formula 1",
    cardNumber: "81",
    driverName: "Oscar Piastri",
    constructorName: "McLaren",
    rookieCard: true,
    parallel: "Base",
    cardImageUrl: "https://cdn11.bigcommerce.com/s-bzjcg0/images/stencil/1280x1280/products/124985/186331/img_20240221_0016__34797.1708555011.jpg?c=2"
  }
];

// Mock card ownerships
export const mockCardOwnerships: CardOwnership[] = [
  {
    id: "ownership1",
    userId: "user1",
    cardId: "card1",
    quantity: 2,
    purchasePrice: 5.99,
    purchaseDate: new Date("2023-02-10"),
    condition: "PSA 10",
    notes: "Bought at local card shop",
    location: "Display case"
  },
  {
    id: "ownership2",
    userId: "user1",
    cardId: "card3",
    quantity: 1,
    purchasePrice: 89.99,
    purchaseDate: new Date("2023-03-15"),
    condition: "Raw",
    notes: "eBay purchase",
    location: "Toploader"
  },
  {
    id: "ownership3",
    userId: "user1",
    cardId: "card6",
    quantity: 3,
    purchasePrice: 12.99,
    purchaseDate: new Date("2023-01-20"),
    condition: "PSA 9",
    notes: "Rookie card",
    location: "Binder"
  }
];

// Mock market price snapshots
export const mockMarketPriceSnapshots: MarketPriceSnapshot[] = [
  {
    id: "price1",
    cardId: "card1",
    timestamp: new Date("2023-06-01"),
    source: "eBay",
    averagePrice: 8.50,
    lowestPrice: 5.99,
    highestPrice: 12.99
  },
  {
    id: "price2",
    cardId: "card1",
    timestamp: new Date("2023-07-01"),
    source: "eBay",
    averagePrice: 10.25,
    lowestPrice: 7.99,
    highestPrice: 15.99
  },
  {
    id: "price3",
    cardId: "card1",
    timestamp: new Date("2023-08-01"),
    source: "eBay",
    averagePrice: 12.75,
    lowestPrice: 9.99,
    highestPrice: 19.99
  },
  {
    id: "price4",
    cardId: "card3",
    timestamp: new Date("2023-06-01"),
    source: "eBay",
    averagePrice: 75.50,
    lowestPrice: 65.00,
    highestPrice: 89.99
  },
  {
    id: "price5",
    cardId: "card3",
    timestamp: new Date("2023-07-01"),
    source: "eBay",
    averagePrice: 85.25,
    lowestPrice: 75.00,
    highestPrice: 99.99
  },
  {
    id: "price6",
    cardId: "card3",
    timestamp: new Date("2023-08-01"),
    source: "eBay",
    averagePrice: 95.00,
    lowestPrice: 85.00,
    highestPrice: 119.99
  }
];

// Mock card battles
export const mockCardBattles: CardBattle[] = [
  {
    id: "battle1",
    cardOneId: "card1",
    cardTwoId: "card2",
    votesCardOne: 245,
    votesCardTwo: 189,
    createdAt: new Date("2023-07-15"),
    expiresAt: new Date("2023-07-16")
  },
  {
    id: "battle2",
    cardOneId: "card3",
    cardTwoId: "card4",
    votesCardOne: 178,
    votesCardTwo: 201,
    createdAt: new Date("2023-07-16"),
    expiresAt: new Date("2023-07-17")
  },
  {
    id: "battle3",
    cardOneId: "card5",
    cardTwoId: "card6",
    votesCardOne: 132,
    votesCardTwo: 267,
    createdAt: new Date(new Date().setHours(0, 0, 0, 0)),
    expiresAt: new Date(new Date().setHours(24, 0, 0, 0))
  }
];

// Mock grail list entries
export const mockGrailEntries: GrailListEntry[] = [
  {
    id: "grail1",
    userId: "user1",
    cardId: "card5",
    createdAt: new Date("2023-05-10"),
    notifyOnAvailable: true
  },
  {
    id: "grail2",
    userId: "user1",
    cardId: "card2",
    createdAt: new Date("2023-06-22"),
    notifyOnAvailable: true
  }
];

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

export const mockMarketplaceListings: MarketplaceListing[] = [
  {
    id: "listing1",
    cardId: "card1",
    source: "eBay",
    price: 9.99,
    condition: "Raw",
    sellerRating: 98.5,
    listingUrl: "#",
    listingDate: new Date("2023-08-01")
  },
  {
    id: "listing2",
    cardId: "card1",
    source: "eBay",
    price: 42.99,
    condition: "PSA 10",
    sellerRating: 100,
    listingUrl: "#",
    listingDate: new Date("2023-08-02")
  },
  {
    id: "listing3",
    cardId: "card2",
    source: "eBay",
    price: 119.99,
    condition: "Raw",
    sellerRating: 99.1,
    listingUrl: "#",
    listingDate: new Date("2023-08-03")
  },
  {
    id: "listing4",
    cardId: "card3",
    source: "eBay",
    price: 89.99,
    condition: "Raw",
    sellerRating: 97.8,
    listingUrl: "#",
    listingDate: new Date("2023-08-04")
  },
  {
    id: "listing5",
    cardId: "card5",
    source: "eBay",
    price: 749.99,
    condition: "PSA 9",
    sellerRating: 100,
    listingUrl: "#",
    listingDate: new Date("2023-08-05")
  }
];

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

export const mockCardDrops: CardDrop[] = [
  {
    id: "drop1",
    productName: "2023 Topps Chrome Formula 1 Racing",
    releaseDate: new Date("2023-09-15"),
    description: "Premier F1 trading card product with on-card autographs and rare parallels",
    manufacturer: "Topps",
    imageUrl: "https://images.pexels.com/photos/12318239/pexels-photo-12318239.jpeg?auto=compress&cs=tinysrgb&w=400",
    preorderUrl: "#"
  },
  {
    id: "drop2",
    productName: "2023 Topps Finest Formula 1",
    releaseDate: new Date("2023-10-20"),
    description: "Premium offering with etched foil designs and low-numbered autographs",
    manufacturer: "Topps",
    imageUrl: "https://images.pexels.com/photos/12692092/pexels-photo-12692092.jpeg?auto=compress&cs=tinysrgb&w=400",
    preorderUrl: "#"
  },
  {
    id: "drop3",
    productName: "2023 Topps Dynasty Formula 1",
    releaseDate: new Date("2023-12-08"),
    description: "Ultra-premium, high-end product with one on-card autograph relic per box",
    manufacturer: "Topps",
    imageUrl: "https://images.pexels.com/photos/12702993/pexels-photo-12702993.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
];