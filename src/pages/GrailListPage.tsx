import React, {useEffect, useMemo, useState} from 'react';
import { useApp } from '../context/AppContext';
import CardDisplayItem from '../components/ui/CardDisplayItem';
import PriceChart from '../components/ui/PriceChart';
import {Bell, Search, BellOff, X, Plus} from 'lucide-react';
import {Card, GrailListEntry, MarketPrice} from "../types";
import {RemoveGrailRequest} from "../types/request/Grail.ts";
import LoadingSpinner from "../components/ui/LoadingSpinner.tsx";
import {Dropdown} from "../types/Dropdown.ts";
import {DropdownService} from "../service/dropdownService.ts";

const GrailListPage: React.FC = () => {
  const { user, grailEntries, removeCardFromGrailList, getMarketPriceByCardId, addCardToGrailList, getCardsByCriteria } = useApp();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isAddLoading, setAddLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add card modal states
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [selectedParallel, setSelectedParallel] = useState<string | null>(null);
  const [cardSearchQuery, setCardSearchQuery] = useState<string>('');
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const [newCardId, setNewCardId] = useState<string>('');

  // Dropdown
  const [parallelDropdown, setParallelDropdown] = useState<Dropdown[]>([])
  const [setsDropdown, setSetsDropdown] = useState<Dropdown[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [possibleParallels, setPossibleParallels] = useState<Dropdown[]>([])

  useEffect(() => {
    const getDropdowns = async () => {
      const sets = await DropdownService.getSetsDropdown();
      setSetsDropdown(sets);
    }

    getDropdowns()
  }, [])

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

  useEffect(() => {
    if (!selectedSet) return
    const getPossibleParallels = async () => {
      const possibleParallels = await DropdownService.getParallelDropdown(selectedSet)
      const possibleCards = await getCardsByCriteria(undefined, selectedSet, undefined, undefined, undefined)
      setParallelDropdown(possibleParallels);
      setPossibleParallels(possibleParallels)
      setCards(possibleCards);
    }

    getPossibleParallels();
  }, [getCardsByCriteria, selectedSet])

  // Get filtered cards for autocomplete
  const filteredCardsForAdd = useMemo(() => {
    if (!selectedSet) return [];

    let filteredCards = cards.filter(card =>
        card.setName === selectedSet
    );

    if (selectedParallel) {
      filteredCards = filteredCards.filter(card => card.parallels.some((p) => p.name === selectedParallel));
    }

    if (cardSearchQuery) {
      const query = cardSearchQuery.toLowerCase();
      filteredCards = filteredCards.filter(card =>
          card.driverName.toLowerCase().includes(query) ||
          card.constructorName.toLowerCase().includes(query) ||
          card.cardNumber.includes(query)
      );
    }

    return filteredCards.slice(0, 10); // Limit to 10 results for performance
  }, [selectedSet, selectedParallel, cardSearchQuery, cards])
  
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

  const handleCardSelect = (card: typeof cards[0]) => {
    setNewCardId(card.id);
    setCardSearchQuery(`${card.driverName} - ${card.constructorName} #${card.cardNumber}`);
    setShowCardDropdown(false);
  };

  const handleAddCard = async () => {
    if (!newCardId) return;
    if (user === null || user.id === null) return
    setAddLoading(true)
    await addCardToGrailList({
      userId: user.id,
      cardId: newCardId,
      parallel: selectedParallel === null ? undefined: selectedParallel,
      notifyOnAvailable: true
    });
    setAddLoading(false)
    setShowAddModal(false);
    resetNewCardForm();
  };

  const resetNewCardForm = () => {
    setSelectedSet('');
    setSelectedParallel('');
    setCardSearchQuery('');
    setNewCardId('');
    setShowCardDropdown(false);
  };

  return (
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Grail List</h1>
          <p className="text-gray-600">Track your most wanted Formula 1 cards</p>
        </div>
        <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 mb-4 md:mt-0 bg-[#0600E1] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
        >
          <Plus className="h-5 w-5 mr-2"/>
          Add Grail Card
        </button>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400"/>
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
                  <PriceChart priceData={selectedCardMarketData.length > 0 ? selectedCardMarketData[0] : {
                    cardId: selectedCard,
                    history: []
                  }}/>
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
        {isLoading && <LoadingSpinner/>}
        {!isLoading && (
            <>
              {filteredGrailList.length === 0 ? (
                  <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <Bell className="mx-auto h-12 w-12 text-gray-400"/>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Your grail list is empty</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add cards to your grail list to track.
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
                                      <Bell className="h-5 w-5 text-[#E10600]"/>
                                  ) : (
                                      <BellOff className="h-5 w-5 text-gray-400"/>
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
        {/* Add Grail Card Modal */}
        {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Add Card to Grail List</h3>

                {isAddLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner text="Adding to grail list..."/>
                    </div>
                ) : (
                    <div className="space-y-4">
                      {/* Set Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Set</label>
                        <select
                            value={selectedSet ?? undefined}
                            onChange={(e) => {
                              setSelectedSet(e.target.value);
                              setSelectedParallel('');
                              setCardSearchQuery('');
                              setNewCardId('');
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Choose a set...</option>
                          {setsDropdown.map(set => (
                              <option key={set.value} value={set.value}>
                                {set.label}
                              </option>
                          ))}
                        </select>
                      </div>

                      {/* Parallel Selection */}
                      {selectedSet && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Parallel
                              (Optional)</label>
                            <select
                                value={selectedParallel ?? undefined}
                                onChange={(e) => {
                                  setSelectedParallel(e.target.value);
                                  setCardSearchQuery('');
                                  setNewCardId('');
                                }}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                              <option value="">All Parallels</option>
                              {possibleParallels.map(parallel => (
                                  <option key={parallel.value} value={parallel.value}>{parallel.label}</option>
                              ))}
                            </select>
                          </div>
                      )}

                      {/* Card Search with Autocomplete */}
                      {selectedSet && (
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search for Card</label>
                            <div className="relative">
                              <input
                                  type="text"
                                  value={cardSearchQuery}
                                  onChange={(e) => {
                                    setCardSearchQuery(e.target.value);
                                    setShowCardDropdown(true);
                                    if (!e.target.value) {
                                      setNewCardId('');
                                    }
                                  }}
                                  onFocus={() => setShowCardDropdown(true)}
                                  placeholder="Type driver name, team, or card number..."
                                  className="w-full p-2 border border-gray-300 rounded-md pr-8"
                              />
                              {cardSearchQuery && (
                                  <button
                                      onClick={() => {
                                        setCardSearchQuery('');
                                        setNewCardId('');
                                        setPossibleParallels(parallelDropdown)
                                        setShowCardDropdown(false);
                                      }}
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    <X className="h-4 w-4"/>
                                  </button>
                              )}
                            </div>

                            {/* Autocomplete Dropdown */}
                            {showCardDropdown && cardSearchQuery && filteredCardsForAdd.length > 0 && (
                                <div
                                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                  {filteredCardsForAdd.map(card => (
                                      <button
                                          key={card.id}
                                          onClick={() => handleCardSelect(card)}
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

                            {showCardDropdown && cardSearchQuery && filteredCardsForAdd.length === 0 && (
                                <div
                                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-center text-gray-500">
                                  No cards found or all cards already in grail list
                                </div>
                            )}
                          </div>
                      )}
                    </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                      onClick={() => {
                        setShowAddModal(false);
                        resetNewCardForm();
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleAddCard}
                      disabled={!newCardId}
                      className="px-4 py-2 bg-[#0600E1] text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add to Grail List
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default GrailListPage;