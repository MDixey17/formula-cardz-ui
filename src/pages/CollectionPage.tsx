import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CardDisplayItem from '../components/ui/CardDisplayItem';
import { Grid, List, Filter, SortAsc, SortDesc, FileCog, Plus, Edit2, Trash2 } from 'lucide-react';

const CollectionPage: React.FC = () => {
  const { cards, cardOwnerships, addCardToCollection, removeCardFromCollection, updateCardOwnership } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('driver');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [filterDriver, setFilterDriver] = useState<string>('');
  const [filterTeam, setFilterTeam] = useState<string>('');
  const [filterParallel, setFilterParallel] = useState<string>('');
  const [filterCondition, setFilterCondition] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editCondition, setEditCondition] = useState('Raw');
  const [editPurchasePrice, setEditPurchasePrice] = useState<string>('');
  const [editNotes, setEditNotes] = useState('');
  const [editLocation, setEditLocation] = useState('');

  // Get unique values for filters
  const uniqueDrivers = Array.from(new Set(cards.map(card => card.driverName)));
  const uniqueTeams = Array.from(new Set(cards.map(card => card.constructorName)));
  const uniqueParallels = Array.from(new Set(cards.map(card => card.parallel)));
  const uniqueConditions = Array.from(new Set(cardOwnerships.map(ownership => ownership.condition)));

  // Get cards in collection with all necessary data
  const collectionCards = cardOwnerships.map(ownership => {
    const card = cards.find(card => card.id === ownership.cardId);
    return {
      ...card,
      ownership
    };
  }).filter(item => item) as (typeof cards[0] & { ownership: typeof cardOwnerships[0] })[];

  // Apply filters
  const filteredCards = collectionCards.filter(card => {
    if (filterDriver && card.driverName !== filterDriver) return false;
    if (filterTeam && card.constructorName !== filterTeam) return false;
    if (filterParallel && card.parallel !== filterParallel) return false;
    if (filterCondition && card.ownership.condition !== filterCondition) return false;
    return true;
  });

  // Apply sorting
  const sortedCards = [...filteredCards].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'driver':
        comparison = a.driverName.localeCompare(b.driverName);
        break;
      case 'team':
        comparison = a.constructorName.localeCompare(b.constructorName);
        break;
      case 'year':
        comparison = a.year - b.year;
        break;
      case 'quantity':
        comparison = a.ownership.quantity - b.ownership.quantity;
        break;
      case 'condition':
        comparison = a.ownership.condition.localeCompare(b.ownership.condition);
        break;
      default:
        comparison = a.driverName.localeCompare(b.driverName);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Collection stats
  const totalCards = cardOwnerships.reduce((sum, ownership) => sum + ownership.quantity, 0);
  const uniqueCardsCount = cardOwnerships.length;
  const rookieCardsCount = collectionCards.filter(card => card.rookieCard).length;
  const highestValueCard = collectionCards.sort((a, b) => {
    const aValue = a.ownership.purchasePrice || 0;
    const bValue = b.ownership.purchasePrice || 0;
    return bValue - aValue;
  })[0];

  const handleEditCard = (card: typeof sortedCards[0]) => {
    setSelectedCard(card.id);
    setEditQuantity(card.ownership.quantity);
    setEditCondition(card.ownership.condition);
    setEditPurchasePrice(card.ownership.purchasePrice?.toString() || '');
    setEditNotes(card.ownership.notes || '');
    setEditLocation(card.ownership.location || '');
    setShowEditModal(true);
  };

  const handleUpdateCard = () => {
    if (!selectedCard) return;

    updateCardOwnership(selectedCard, {
      quantity: editQuantity,
      condition: editCondition,
      purchasePrice: editPurchasePrice ? parseFloat(editPurchasePrice) : undefined,
      notes: editNotes,
      location: editLocation
    });

    setShowEditModal(false);
    setSelectedCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to remove this card from your collection?')) {
      removeCardFromCollection(cardId);
    }
  };

  return (
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Collection</h1>
            <p className="text-gray-600">Manage and view your Formula 1 trading cards</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#0600E1] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Card
            </button>
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

        {/* Collection stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <span className="text-gray-500 text-sm">Total Cards</span>
            <p className="text-2xl font-bold">{totalCards}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <span className="text-gray-500 text-sm">Unique Cards</span>
            <p className="text-2xl font-bold">{uniqueCardsCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <span className="text-gray-500 text-sm">Rookie Cards</span>
            <p className="text-2xl font-bold">{rookieCardsCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <span className="text-gray-500 text-sm">Highest Value</span>
            <p className="text-2xl font-bold">
              ${highestValueCard?.ownership.purchasePrice?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Filters</h2>
                <button
                    onClick={() => {
                      setFilterDriver('');
                      setFilterTeam('');
                      setFilterParallel('');
                      setFilterCondition('');
                    }}
                    className="text-sm text-[#E10600] hover:text-red-700 mt-2 sm:mt-0"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                  <select
                      value={filterDriver}
                      onChange={(e) => setFilterDriver(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Drivers</option>
                    {uniqueDrivers.map(driver => (
                        <option key={driver} value={driver}>{driver}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                  <select
                      value={filterTeam}
                      onChange={(e) => setFilterTeam(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Teams</option>
                    {uniqueTeams.map(team => (
                        <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parallel</label>
                  <select
                      value={filterParallel}
                      onChange={(e) => setFilterParallel(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Parallels</option>
                    {uniqueParallels.map(parallel => (
                        <option key={parallel} value={parallel}>{parallel}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                      value={filterCondition}
                      onChange={(e) => setFilterCondition(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Conditions</option>
                    {uniqueConditions.map(condition => (
                        <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <div className="flex">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-l-md"
                    >
                      <option value="driver">Driver</option>
                      <option value="team">Team</option>
                      <option value="year">Year</option>
                      <option value="quantity">Quantity</option>
                      <option value="condition">Condition</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md"
                    >
                      {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Collection */}
        {sortedCards.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FileCog className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No cards found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {cardOwnerships.length === 0
                    ? "You don't have any cards in your collection yet."
                    : "No cards match your current filters."}
              </p>
              {cardOwnerships.length === 0 && (
                  <div className="mt-6">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E10600] hover:bg-red-700"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Your First Card
                    </button>
                  </div>
              )}
            </div>
        ) : (
            <>
              {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {sortedCards.map((card) => (
                        <div key={`${card.id}-${card.ownership.condition}`} className="bg-white rounded-lg shadow p-4">
                          <div className="relative">
                            <div className="h-25 w-25 rounded-md overflow-hidden">
                              <img src={card.cardImageUrl} alt={card.driverName}
                                   className="h-full w-full object-cover"/>
                            </div>
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <button
                                  onClick={() => handleEditCard(card)}
                                  className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                                  title="Edit Card"
                              >
                                <Edit2 className="h-4 w-4 text-gray-600"/>
                              </button>
                              <button
                                  onClick={() => handleDeleteCard(card.id)}
                                  className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                                  title="Remove Card"
                              >
                                <Trash2 className="h-4 w-4 text-[#E10600]"/>
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Quantity:</span>
                              <span className="font-medium">{card.ownership.quantity}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-gray-500">Condition:</span>
                              <span className="font-medium">{card.ownership.condition}</span>
                            </div>
                            {card.ownership.purchasePrice && (
                                <div className="flex justify-between text-sm mt-1">
                                  <span className="text-gray-500">Purchase:</span>
                                  <span className="font-medium">${card.ownership.purchasePrice.toFixed(2)}</span>
                                </div>
                            )}
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
                          Condition
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purchase
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                      {sortedCards.map((card) => (
                          <tr key={`${card.id}-${card.ownership.condition}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-10 w-10 rounded-md overflow-hidden">
                                <img src={card.cardImageUrl} alt={card.driverName} className="h-full w-full object-cover" />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{card.driverName}</div>
                              <div className="text-sm text-gray-500">{card.constructorName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{card.setName}</div>
                              <div className="text-sm text-gray-500">{card.year}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            card.parallel === 'Base' ? 'bg-gray-100 text-gray-800' :
                                card.parallel === 'Refractor' ? 'bg-blue-100 text-blue-800' :
                                    card.parallel === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                                        card.parallel === 'Red' ? 'bg-red-100 text-red-800' :
                                            card.parallel === 'Orange' ? 'bg-orange-100 text-orange-800' :
                                                'bg-purple-100 text-purple-800'
                        }`}>
                          {card.parallel}
                        </span>
                              {card.printRun && (
                                  <span className="text-xs text-gray-500 ml-1">/{card.printRun}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {card.ownership.condition}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {card.ownership.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {card.ownership.purchasePrice
                                  ? `$${card.ownership.purchasePrice.toFixed(2)}`
                                  : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                  onClick={() => handleEditCard(card)}
                                  className="text-[#0600E1] hover:text-blue-800 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                  onClick={() => handleDeleteCard(card.id)}
                                  className="text-[#E10600] hover:text-red-800"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              )}
            </>
        )}

        {/* Edit Card Modal */}
        {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Edit Card Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                        type="number"
                        min="1"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <select
                        value={editCondition}
                        onChange={(e) => setEditCondition(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="Raw">Raw</option>
                      <option value="PSA 10">PSA 10</option>
                      <option value="PSA 9">PSA 9</option>
                      <option value="PSA 8">PSA 8</option>
                      <option value="BGS 9.5">BGS 9.5</option>
                      <option value="BGS 9">BGS 9</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                    <input
                        type="number"
                        step="0.01"
                        value={editPurchasePrice}
                        onChange={(e) => setEditPurchasePrice(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                    <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., Binder, Display Case"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleUpdateCard}
                      className="px-4 py-2 bg-[#0600E1] text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default CollectionPage;