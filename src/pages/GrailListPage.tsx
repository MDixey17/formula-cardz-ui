import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CardDisplayItem from '../components/ui/CardDisplayItem';
import MarketplaceListing from '../components/ui/MarketplaceListing';
import PriceChart from '../components/ui/PriceChart';
import { Bell, Search, BellOff, ExternalLink } from 'lucide-react';

const GrailListPage: React.FC = () => {
  const { cards, grailEntries, removeCardFromGrailList, marketPriceSnapshots, marketplaceListings } = useApp();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get grail list with card data
  const grailList = grailEntries.map(entry => {
    return {
      ...entry,
      card: cards.find(card => card.id === entry.cardId)!
    };
  });
  
  // Apply search filter
  const filteredGrailList = grailList.filter(item => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      item.card.driverName.toLowerCase().includes(query) ||
      item.card.constructorName.toLowerCase().includes(query) ||
      item.card.setName.toLowerCase().includes(query)
    );
  });

  // Get marketplace listings for a card
  const getListingsForCard = (cardId: string) => {
    return marketplaceListings.filter(listing => listing.cardId === cardId);
  };

  // Check if card has listings
  const hasListings = (cardId: string) => {
    return getListingsForCard(cardId).length > 0;
  };

  // Toggle notification for a grail entry
  const toggleNotification = (entryId: string) => {
    // In a real app, this would update the database
    console.log(`Toggled notification for entry ${entryId}`);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Grail List</h1>
        <p className="text-gray-600">Track your most wanted Formula 1 cards</p>
      </div>
      
      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search your grail list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#0600E1] focus:border-[#0600E1] sm:text-sm transition"
          />
        </div>
      </div>
      
      {/* Selected Card Details */}
      {selectedCard && (
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="p-6 lg:w-1/3">
              <div className="max-w-[300px] mx-auto">
                <CardDisplayItem 
                  card={cards.find(card => card.id === selectedCard)!}
                  showActions={true}
                  isInGrailList={true}
                  marketPrice={
                    marketPriceSnapshots
                      .filter(snapshot => snapshot.cardId === selectedCard)
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.averagePrice
                  }
                />
              </div>
            </div>
            <div className="p-6 lg:w-2/3 border-t lg:border-t-0 lg:border-l border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Market Data</h2>
                <button 
                  onClick={() => setSelectedCard(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
              <PriceChart priceData={marketPriceSnapshots} cardId={selectedCard} />
              
              <h3 className="text-lg font-bold mt-6 mb-3">Available Listings</h3>
              {getListingsForCard(selectedCard).length > 0 ? (
                <div className="space-y-4">
                  {getListingsForCard(selectedCard).map(listing => (
                    <MarketplaceListing
                      key={listing.id}
                      listing={listing}
                      card={cards.find(card => card.id === listing.cardId)!}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded text-center">
                  <p className="text-gray-500">No active listings found. We'll notify you when this card becomes available.</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => removeCardFromGrailList(selectedCard)}
                  className="bg-[#E10600] text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Remove from Grail List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Grail List */}
      {filteredGrailList.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your grail list is empty</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add cards to your grail list to track and get notified when they're available.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredGrailList.map(entry => (
              <li key={entry.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                    <img 
                      src={entry.card.cardImageUrl} 
                      alt={entry.card.driverName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {entry.card.driverName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {entry.card.setName} - {entry.card.parallel}
                    </p>
                    <p className="text-xs text-gray-400">
                      Added on {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-sm font-medium text-[#0600E1] hover:text-blue-800">
                    {hasListings(entry.cardId) ? (
                      <span className="flex items-center text-green-600">
                        <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                        Available
                      </span>
                    ) : (
                      <span className="text-gray-400">Not Available</span>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => toggleNotification(entry.id)}
                      className="mr-2 p-1 rounded-full hover:bg-gray-100"
                    >
                      {entry.notifyOnAvailable ? (
                        <Bell className="h-5 w-5 text-[#E10600]" />
                      ) : (
                        <BellOff className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedCard(entry.cardId)}
                      className="mr-2 text-[#0600E1] hover:text-blue-800"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => removeCardFromGrailList(entry.cardId)}
                      className="text-gray-400 hover:text-[#E10600]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                {/* Available Listings Preview (if any) */}
                {hasListings(entry.cardId) && (
                  <div className="mt-2 ml-20">
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-medium text-gray-900">Available at:</p>
                      <button
                        onClick={() => setSelectedCard(entry.cardId)} 
                        className="text-[#0600E1] flex items-center hover:text-blue-800"
                      >
                        See all <ExternalLink className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {getListingsForCard(entry.cardId).slice(0, 3).map(listing => (
                        <div key={listing.id} className="bg-gray-50 px-3 py-1 rounded-md text-sm">
                          <span className="font-medium text-[#E10600]">${listing.price.toFixed(2)}</span>
                          <span className="text-gray-500 mx-1">•</span>
                          <span className="text-gray-600">{listing.condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GrailListPage;