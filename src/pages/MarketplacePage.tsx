import React, {useEffect, useState} from 'react';
import { useApp } from '../context/AppContext';
import CardDisplayItem from '../components/ui/CardDisplayItem';
import PriceChart from '../components/ui/PriceChart';
import { Grid, List, Search, Filter } from 'lucide-react';
import {ParallelStyles} from "../constants/globalStyles.ts";
import {MarketPriceSnapshot} from "../types/response/MarketPrice.ts";
import {Card, CardOwnership} from "../types";

const MarketplacePage: React.FC = () => {
  const { cardOwnerships, getMarketPriceByCardId, grailEntries } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDriver, setFilterDriver] = useState<string>('');
  const [filterTeam, setFilterTeam] = useState<string>('');
  const [filterParallel, setFilterParallel] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [filterRookieOnly, setFilterRookieOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('recent');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cardMarketPrice, setCardMarketPrice] = useState<MarketPriceSnapshot[]>([])

  useEffect(() => {
    if (!selectedCard) {
      setCardMarketPrice([])
      return
    }
    
    const fetchCardData = async () => {
      const cardData = await getMarketPriceByCardId(selectedCard)
      setCardMarketPrice(cardData.history)
    }
    
    fetchCardData()
  }, [selectedCard, getMarketPriceByCardId])

  // Get unique values for filters
  const uniqueDrivers = Array.from(new Set(cardOwnerships.map(card => card.driverName)));
  const uniqueTeams = Array.from(new Set(cardOwnerships.map(card => card.constructorName)));
  const uniqueParallels = Array.from(new Set(cardOwnerships.map(card => card.parallel)));
  const uniqueYears = Array.from(new Set(cardOwnerships.map(card => card.year)));

  // Apply filters and search
  const filteredCards = cardOwnerships.filter(card => {
    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        card.driverName.toLowerCase().includes(query) ||
        card.constructorName.toLowerCase().includes(query) ||
        card.setName.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }
    
    // Dropdown filters
    if (filterDriver && card.driverName !== filterDriver) return false;
    if (filterTeam && card.constructorName !== filterTeam) return false;
    if (filterParallel && card.parallel !== filterParallel) return false;
    if (filterYear && card.year !== parseInt(filterYear)) return false;
    if (filterRookieOnly && !card.rookieCard) return false;
    
    return true;
  });

  // Apply sorting
  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'price-high':
        { const aPrice = cardMarketPrice
          .sort((x, y) => new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime())[0]?.averagePrice || 0;
        
        const bPrice = cardMarketPrice
          .sort((x, y) => new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime())[0]?.averagePrice || 0;
        
        return bPrice - aPrice; }
      
      case 'price-low':
        { const aPrice2 = cardMarketPrice
          .sort((x, y) => new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime())[0]?.averagePrice || 0;
        
        const bPrice2 = cardMarketPrice
          .sort((x, y) => new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime())[0]?.averagePrice || 0;
        
        return aPrice2 - bPrice2; }
      
      case 'recent':
        return b.year - a.year;
      
      case 'driver':
        return a.driverName.localeCompare(b.driverName);
      
      default:
        return 0;
    }
  });

  const buildCardFromOwnership = (ownership: CardOwnership): Card => ({
    ...ownership,
    baseImageUrl: ownership.imageUrl,
    hasOneOfOne: false,
    parallels: []
  })

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600">Discover and track Formula 1 trading cards</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid' ? 'bg-[#0600E1] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list' ? 'bg-[#0600E1] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-md ${
              showFilters ? 'bg-[#0600E1] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by driver, team, or set..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#0600E1] focus:border-[#0600E1] sm:text-sm transition duration-150 ease-in-out"
            />
          </div>
        </div>

        {showFilters && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Filters</h3>
              <button 
                onClick={() => {
                  setFilterDriver('');
                  setFilterTeam('');
                  setFilterParallel('');
                  setFilterYear('');
                  setFilterRookieOnly(false);
                }}
                className="text-xs text-[#E10600] hover:text-red-700"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Driver</label>
                <select
                  value={filterDriver}
                  onChange={(e) => setFilterDriver(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Drivers</option>
                  {uniqueDrivers.map(driver => (
                    <option key={driver} value={driver}>{driver}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Team</label>
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Teams</option>
                  {uniqueTeams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Parallel</label>
                <select
                  value={filterParallel}
                  onChange={(e) => setFilterParallel(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Parallels</option>
                  {uniqueParallels.map(parallel => (
                    <option key={parallel} value={parallel}>{parallel}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Years</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={filterRookieOnly}
                    onChange={(e) => setFilterRookieOnly(e.target.checked)}
                    className="h-4 w-4 text-[#E10600] focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Rookie Cards Only</span>
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="driver">Driver Name</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Display selected card details */}
      {selectedCard && (
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="p-6 lg:w-1/3">
              <div className="max-w-[300px] mx-auto">
                <CardDisplayItem 
                  card={buildCardFromOwnership(cardOwnerships.find(card => card.id === selectedCard)!)}
                  showActions={true}
                  isInGrailList={grailEntries.some(entry => entry.id === selectedCard)}
                  marketPrice={cardMarketPrice.length === 0 ? 0.00 : cardMarketPrice[0].averagePrice}
                  enable3d
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
              <PriceChart priceData={{cardId: selectedCard, history: cardMarketPrice}} />
              
              <h3 className="text-lg font-bold mt-6 mb-3">Available Listings</h3>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedCards.map((card) => (
            <div 
              key={card.id} 
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedCard(card.id)}
            >
              <CardDisplayItem 
                card={buildCardFromOwnership(card)}
                showActions={false}
                isInGrailList={grailEntries.some(entry => entry.id === card.id)}
                marketPrice={cardMarketPrice.length === 0 ? 0.00 : cardMarketPrice[0].averagePrice}
              />
              <div className="mt-2 text-center">
                <button className="text-sm text-[#0600E1] hover:text-blue-700">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver / Team
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Set / Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parallel
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCards.map((card) => {
                const latestPrice = cardMarketPrice
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                
                return (
                  <tr 
                    key={card.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedCard(card.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-md overflow-hidden">
                        <img src={card.imageUrl} alt={card.driverName} className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{card.cardNumber} {card.driverName}</div>
                      <div className="text-sm text-gray-500">{card.constructorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{card.setName}</div>
                      <div className="text-sm text-gray-500">{card.year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ParallelStyles.get(card.parallel ?? 'Base') ?? 'bg-gray-100 text-gray-800'
                      }`}>
                        {card.parallel}
                      </span>
                      {card.printRun && (
                        <span className="text-xs text-gray-500 ml-1">/{card.printRun}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#E10600]">
                        {latestPrice ? `$${latestPrice.averagePrice.toFixed(2)}` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-[#0600E1] hover:text-blue-800">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;