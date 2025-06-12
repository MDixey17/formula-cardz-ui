import React, {useEffect, useState} from 'react';
import { useApp } from '../context/AppContext';
import CardDisplayItem from '../components/ui/CardDisplayItem';
import PriceChart from '../components/ui/PriceChart';
import { Bell, Search, BellOff } from 'lucide-react';
import {Card, GrailListEntry, MarketPrice} from "../types";
import {RemoveGrailRequest} from "../types/request/Grail.ts";
import LoadingSpinner from "../components/ui/LoadingSpinner.tsx";

const GrailListPage: React.FC = () => {
  const { user, grailEntries, removeCardFromGrailList, getMarketPriceByCardId } = useApp();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getAllMarketPrices = async () => {
      setLoading(true)
      const data: MarketPrice[] = []
      for (let i = 0; i < grailEntries.length; i++) {
        const grail = grailEntries[i];
        const response = await getMarketPriceByCardId(grail.id, grail.parallel)
        data.push(response)
      }
      setMarketPrices(data)
      setLoading(false)
    }

    getAllMarketPrices()
  }, [grailEntries, getMarketPriceByCardId])
  
  // Apply search filter
  const filteredGrailList = grailEntries.filter(item => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      item.driverName.toLowerCase().includes(query) ||
      item.constructorName.toLowerCase().includes(query) ||
      item.setName.toLowerCase().includes(query)
    );
  });

  // Toggle notification for a grail entry
  const toggleNotification = (entryId: string) => {
    // In a real app, this would update the database
    console.log(`Toggled notification for entry ${entryId}`);
  };

  const convertGrailToCard = (grail: GrailListEntry): Card  => ({
    id: grail.id,
    year: grail.year,
    setName: grail.setName,
    cardNumber: grail.cardNumber,
    driverName: grail.driverName,
    constructorName: grail.constructorName,
    rookieCard: grail.rookieCard,
    baseImageUrl: grail.imageUrl,
    hasOneOfOne: false,
    parallels: []
  })

  const selectedCardMarketData = marketPrices.filter(snapshot => snapshot.cardId === selectedCard)

  const buildRemoveGrailRequest = (): RemoveGrailRequest => ({
    userId: user!.id,
    cardId: selectedCard ?? '',
    parallel: grailEntries.find((grail) => grail.id === selectedCard)!.parallel
  })

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
                  card={convertGrailToCard(grailEntries.find(card => card.id === selectedCard)!)}
                  showActions={true}
                  isInGrailList={true}
                  marketPrice={
                    selectedCardMarketData.length > 0 && selectedCardMarketData[0].history.length > 0
                      ? selectedCardMarketData[0].history[0].averagePrice
                        : 0.00
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
              <PriceChart priceData={selectedCardMarketData.length > 0 ? selectedCardMarketData[0] : {cardId: selectedCard, history: []}} />
              <h3 className="text-lg font-bold mt-6 mb-3">Available Listings</h3>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => removeCardFromGrailList(buildRemoveGrailRequest())}
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
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
          <>
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
                                  src={entry.imageUrl}
                                  alt={entry.driverName}
                                  className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {entry.driverName}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {entry.setName}{entry.parallel ? ` - ${entry.parallel}` : ''}
                              </p>
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
                                  onClick={() => setSelectedCard(entry.id)}
                                  className="mr-2 text-[#0600E1] hover:text-blue-800"
                              >
                                View Details
                              </button>
                              <button
                                  onClick={() => removeCardFromGrailList(buildRemoveGrailRequest())}
                                  className="text-gray-400 hover:text-[#E10600]"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>
            )}
          </>
      )}
    </div>
  );
};

export default GrailListPage;