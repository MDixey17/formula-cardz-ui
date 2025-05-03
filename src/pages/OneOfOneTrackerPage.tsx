import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CardDisplayItem from '../components/ui/CardDisplayItem';
import { Search, Filter, Grid, List, SortAsc, SortDesc } from 'lucide-react';

const OneOfOneTrackerPage: React.FC = () => {
  const { cards } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [filterSet, setFilterSet] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter 1/1 cards
  const oneOfOneCards = cards.filter(card => card.printRun === 1);

  // Get unique years and sets for filters
  const uniqueYears = Array.from(new Set(oneOfOneCards.map(card => card.year)));
  const uniqueSets = Array.from(new Set(oneOfOneCards.map(card => card.setName)));

  // Apply filters and search
  const filteredCards = oneOfOneCards.filter(card => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        card.driverName.toLowerCase().includes(query) ||
        card.constructorName.toLowerCase().includes(query) ||
        card.setName.toLowerCase().includes(query) ||
        card.parallel.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }
    
    if (filterYear && card.year !== parseInt(filterYear)) return false;
    if (filterSet && card.setName !== filterSet) return false;
    
    return true;
  });

  // Apply sorting
  const sortedCards = [...filteredCards].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'recent':
        comparison = b.year - a.year;
        break;
      case 'driver':
        comparison = a.driverName.localeCompare(b.driverName);
        break;
      case 'set':
        comparison = a.setName.localeCompare(b.setName);
        break;
      default:
        comparison = b.year - a.year;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Stats
  const totalOneOfOnes = oneOfOneCards.length;
  const foundCount = oneOfOneCards.filter(card => 
    card.ownership && card.ownership.quantity > 0
  ).length;
  const missingCount = totalOneOfOnes - foundCount;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">1/1 Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and discover one-of-one Formula 1 cards</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid' ? 'bg-[#0600E1] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list' ? 'bg-[#0600E1] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-md ${
              showFilters ? 'bg-[#0600E1] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Total 1/1s</span>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOneOfOnes}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Found</span>
          <p className="text-2xl font-bold text-green-600">{foundCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Missing</span>
          <p className="text-2xl font-bold text-[#E10600]">{missingCount}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0600E1] focus:border-[#0600E1] sm:text-sm transition"
            />
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Set</label>
              <select
                value={filterSet}
                onChange={(e) => setFilterSet(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Sets</option>
                {uniqueSets.map(set => (
                  <option key={set} value={set}>{set}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
              <div className="flex">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="recent">Most Recent</option>
                  <option value="driver">Driver Name</option>
                  <option value="set">Set Name</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-500 rounded-r-md"
                >
                  {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cards Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedCards.map((card) => (
            <div key={card.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <CardDisplayItem card={card} showActions={false} />
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-900 dark:text-white">#{card.cardNumber} {card.driverName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {card.setName} ({card.year})
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {card.parallel}
                </div>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    card.ownership && card.ownership.quantity > 0
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {card.ownership && card.ownership.quantity > 0 ? 'Found' : 'Missing'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Card
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Driver / Team
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Set / Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Parallel
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedCards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <img src={card.cardImageUrl} alt={card.driverName} className="h-full w-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">#{card.cardNumber} {card.driverName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{card.constructorName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{card.setName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{card.year}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{card.parallel}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      card.ownership && card.ownership.quantity > 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {card.ownership && card.ownership.quantity > 0 ? 'Found' : 'Missing'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OneOfOneTrackerPage;