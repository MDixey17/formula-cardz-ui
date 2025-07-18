import React, {useEffect, useMemo, useState} from 'react';
import { useApp } from '../context/AppContext';
import CardDisplayItem from '../components/ui/CardDisplayItem';
import PriceChart from '../components/ui/PriceChart';
import {Grid, List, Search, Filter, TrendingUp, X} from 'lucide-react';
import {ParallelStyles} from "../constants/globalStyles.ts";
import {MarketPriceSnapshot} from "../types/response/MarketPrice.ts";
import {Card, CardOwnership} from "../types";
import LoadingSpinner from "../components/ui/LoadingSpinner.tsx";
import {Dropdown} from "../types/Dropdown.ts";
import {DropdownService} from "../service/dropdownService.ts";

const MarketplacePage: React.FC = () => {
  const { cardOwnerships, getMarketPriceByCardId, grailEntries, getCardsByCriteria } = useApp();
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
  const [selectedParallel, setSelectedParallel] = useState<string | null>(null);
  const [cardMarketPrice, setCardMarketPrice] = useState<MarketPriceSnapshot[]>([])

  // Enhanced search states
  const [setsDropdown, setSetsDropdown] = useState<Dropdown[]>([]);
  const [loadingDropdown, setLoadingDropdown] = useState<boolean>(false);
  const [loadingCards, setLoadingCards] = useState<boolean>(false);
  const [selectedSet, setSelectedSet] = useState<string>('');
  const [selectedParallelForSearch, setSelectedParallelForSearch] = useState<string>('Base');
  const [cardOptions, setCardOptions] = useState<Card[]>([]);
  const [parallelOptions, setParallelOptions] = useState<Dropdown[]>([]);
  const [cardSearchQuery, setCardSearchQuery] = useState<string>('');
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const [searchSelectedCard, setSearchSelectedCard] = useState<string>('');
  const [loadingPriceData, setLoadingPriceData] = useState(false);
  const [searchPriceData, setSearchPriceData] = useState<MarketPriceSnapshot[]>([]);

  useEffect(() => {
    const getDropdowns = async () => {
      setLoadingDropdown(true);
      const sets = await DropdownService.getSetsDropdown()
      setSetsDropdown(sets)
      setLoadingDropdown(false)
    }

    getDropdowns();
  }, [])

  useEffect(() => {
    if (!selectedSet || selectedSet === '') {
      setCardOptions([]);
      return
    }

    const getCardsFromSet = async () => {
      setLoadingCards(true)
      const data = await getCardsByCriteria(undefined, selectedSet, undefined, undefined, undefined)
      const possibleParallels = await DropdownService.getParallelDropdown(selectedSet)
      const parallelsWithBase = [{value: 'Base', label: 'Base'}]
      parallelsWithBase.push(...possibleParallels)
      setCardOptions(data);
      setParallelOptions(parallelsWithBase);
      setLoadingCards(false)
    }

    getCardsFromSet();
  }, [selectedSet, getCardsByCriteria])

  useEffect(() => {
    if (!selectedCard) {
      setCardMarketPrice([])
      return
    }
    
    const fetchCardData = async () => {
      setLoadingPriceData(true);
      const cardData = await getMarketPriceByCardId(selectedCard)
      setCardMarketPrice(cardData.history)
      setLoadingPriceData(false)
    }
    
    fetchCardData()
  }, [selectedCard, getMarketPriceByCardId])

  // Get filtered cards for autocomplete
  const filteredCardsForSearch = useMemo(() => {
    if (!selectedSet || selectedSet === '') {
      return [];
    }

    let filteredCards = cardOptions

    if (cardSearchQuery) {
      const query = cardSearchQuery.toLowerCase();
      filteredCards = filteredCards.filter(card =>
        card.driverName.toLowerCase().includes(query) ||
          card.constructorName.toLowerCase().includes(query) ||
          card.cardNumber.toLowerCase().includes(query)
      )
    }

    return filteredCards.slice(0, 16)
  }, [selectedSet, cardSearchQuery, cardOptions])

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

  const handleCardSelectForSearch = (card: typeof cardOptions[0]) => {
    setSearchSelectedCard(card.id)
    setCardSearchQuery(`${card.driverName} - ${card.constructorName} #${card.cardNumber}`)
    setShowCardDropdown(false)
    fetchPriceDataForSelectedCard(card.id, selectedParallelForSearch)
  }

  const fetchPriceDataForSelectedCard = async (cardId: string, parallel: string) => {
    setLoadingPriceData(true)
    try {
      const response = await getMarketPriceByCardId(cardId, parallel === 'Base' ? undefined : parallel)
      let historyData = response.history
      if (parallel === 'Base') {
        historyData = response.history.filter(sale => sale.parallel === undefined)
      }
      setSearchPriceData(historyData)
    } catch (error) {
      console.error('Failed to fetch price data: ', error)
      setSearchPriceData([])
    }
    setLoadingPriceData(false)
  }

  const handleParallelChangeForSearch = (parallel: string) => {
    setSelectedParallelForSearch(parallel)
    if (searchSelectedCard) {
      fetchPriceDataForSelectedCard(searchSelectedCard, parallel)
    }
  }

  const resetSearchForm = () => {
    setSelectedSet('')
    setSelectedParallelForSearch('Base')
    setCardSearchQuery('')
    setSearchSelectedCard('')
    setShowCardDropdown(false)
    setSearchPriceData([])
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600">
            Discover and track Formula 1 trading cards
            <br />
            <br />
            NOTE: Sales are gathered automatically and can be subject to incorrect values if the title of the card sold does not match the item actually sold.
            <br />
            If you notice any significant errors, please report them!
          </p>
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

      {/* Enhanced Card Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 text-[#E10600] mr-2" />
          <h2 className="text-xl font-bold">Price Tracker</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Set Selection */}
          <div>
            {loadingDropdown ? <LoadingSpinner /> : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Set</label>
                  <select
                      value={selectedSet}
                      onChange={(e) => {
                        setSelectedSet(e.target.value);
                        setSelectedParallelForSearch('Base');
                        setCardSearchQuery('');
                        setSearchSelectedCard('');
                        setSearchPriceData([]);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Choose a set...</option>
                    {setsDropdown.map(set => (
                        <option key={`${set.value}`} value={`${set.value}`}>
                          {set.label}
                        </option>
                    ))}
                  </select>
                </>
            )}
          </div>

          {/* Parallel Selection */}
          {selectedSet && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Parallel</label>
                <select
                    value={selectedParallelForSearch}
                    onChange={(e) => handleParallelChangeForSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {parallelOptions.map(parallel => (
                      <option key={parallel.value} value={parallel.value}>{parallel.label}</option>
                  ))}
                </select>
              </div>
          )}

          {/* Clear Button */}
          {selectedSet && (
              <div className="flex items-end">
                <button
                    onClick={resetSearchForm}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition flex items-center justify-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </button>
              </div>
          )}
        </div>

        {/* Card Search with Autocomplete */}
        {selectedSet && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search for Card</label>
              <div className="relative">
                {loadingCards ? <LoadingSpinner /> : (
                    <>
                      <input
                          type="text"
                          value={cardSearchQuery}
                          onChange={(e) => {
                            setCardSearchQuery(e.target.value);
                            setShowCardDropdown(true);
                            if (!e.target.value) {
                              setSearchSelectedCard('');
                              setSearchPriceData([]);
                            }
                          }}
                          onFocus={() => setShowCardDropdown(true)}
                          placeholder="Type driver name, team, or card number..."
                          className="w-full p-2 border border-gray-300 rounded-md pr-8 pl-10"
                      />
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      {cardSearchQuery && (
                          <button
                              onClick={() => {
                                setCardSearchQuery('');
                                setSearchSelectedCard('');
                                setShowCardDropdown(false);
                                setSearchPriceData([]);
                              }}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                      )}
                    </>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showCardDropdown && cardSearchQuery && filteredCardsForSearch.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredCardsForSearch.map(card => (
                        <button
                            key={card.id}
                            onClick={() => handleCardSelectForSearch(card)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {card.driverName} - {card.constructorName}
                            </div>
                            <div className="text-xs text-gray-500">
                              #{card.cardNumber}
                            </div>
                          </div>
                        </button>
                    ))}
                  </div>
              )}

              {showCardDropdown && cardSearchQuery && filteredCardsForSearch.length === 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-center text-gray-500">
                    No cards found matching your search
                  </div>
              )}
            </div>
        )}

        {/* Price Chart for Selected Card */}
        {searchSelectedCard && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Price History</h3>
                <div className="text-sm text-gray-500">
                  {cardOptions.find(c => c.id === searchSelectedCard)?.driverName} - {selectedParallelForSearch}
                </div>
              </div>

              {loadingPriceData ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner text="Loading price data..." />
                  </div>
              ) : searchPriceData.length > 0 ? (
                  <PriceChart priceData={{cardId: searchSelectedCard, history: searchPriceData}} />
              ) : (
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <p className="text-gray-500">No price data available for this card and parallel combination.</p>
                  </div>
              )}
            </div>
        )}
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
                  <option value="">Base</option>
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
              <PriceChart priceData={{cardId: selectedCard, history: selectedParallel ? cardMarketPrice.filter(cmp => cmp.parallel === selectedParallel) : cardMarketPrice}} />
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
                    onClick={() => {
                      setSelectedCard(card.id)
                      setSelectedParallel(card.parallel ?? null)
                    }}
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
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {sortedCards.map((card) => {
                return (
                    <tr
                        key={card.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedCard(card.id)
                          setSelectedParallel(card.parallel ?? null)
                        }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img src={card.imageUrl + "?v=2"} alt={card.driverName} className="h-full w-full object-cover" />
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
                        {card.parallel ?? 'Base'}
                      </span>
                        {card.printRun && (
                            <span className="text-xs text-gray-500 ml-1">/{card.printRun}</span>
                        )}
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