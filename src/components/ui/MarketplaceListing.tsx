import React from 'react';
import { Card } from '../../types';
import {DollarSign, ExternalLink, Star} from 'lucide-react';
import {AttributeStyles} from "../../constants/globalStyles.ts";

interface MarketplaceListingProps {
  listing: {
    id: string;
    cardId: string;
    source: string;
    price: number;
    condition: string;
    sellerRating: number;
    listingUrl: string;
    listingDate: Date;
  };
  card: Card;
  parallel?: string
}

const MarketplaceListing: React.FC<MarketplaceListingProps> = ({ listing, card, parallel }) => {

  const daysAgo = (date: Date) => {
    const today = new Date();
    const listingDate = new Date(date);
    const diffTime = Math.abs(today.getTime() - listingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const cardParallel = card.parallels.find((p) => p.name === parallel)

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-24 h-24 rounded-md overflow-hidden">
          <img 
            src={cardParallel === undefined ? card.baseImageUrl + "?v=2" : cardParallel.imageUrl + "?v=2"}
            alt={card.driverName} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-800">{card.driverName}</h3>
              <p className="text-sm text-gray-600">{card.setName}{cardParallel !== undefined ? `- ${cardParallel.name}` : ''}</p>
              
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <span className="mr-2">Card #{card.cardNumber}</span>
                {card.rookieCard && (
                  <span className={`${AttributeStyles.get('rookie')} px-1 py-0.5 rounded`}>RC</span>
                )}
                {cardParallel && cardParallel.printRun && (
                  <span className="ml-2">/{cardParallel.printRun}</span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-[#E10600]">${listing.price.toFixed(2)}</span>
              <span className="text-xs text-gray-500">{listing.condition}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-between items-center mt-4">
            <div className="flex items-center text-sm">
              {listing.source.toLowerCase() === 'ebay' ? (
                  <img
                      src={'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/200px-EBay_logo.svg.png'}
                      alt={listing.source}
                      className="h-4 mr-2"
                  />
              ) : <DollarSign />}
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                <span className="text-gray-600">{listing.sellerRating}%</span>
              </div>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-600">{daysAgo(listing.listingDate)} {daysAgo(listing.listingDate) === 1 ? 'day' : 'days'} ago</span>
            </div>
            
            <a 
              href={listing.listingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-[#0600E1] hover:text-blue-700"
            >
              View Listing <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceListing;