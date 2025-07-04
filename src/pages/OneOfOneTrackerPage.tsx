import React, {useEffect, useState} from 'react';
import { useApp } from '../context/AppContext';
import CardDisplayItem from '../components/ui/CardDisplayItem';
import { Search, Filter, Grid, List, SortAsc, SortDesc } from 'lucide-react';
import {Dropdown} from "../types/Dropdown.ts";
import {DropdownService} from "../service/dropdownService.ts";
import {Card} from "../types";
import {EnabledParallel, OneOfOneCardResponse} from "../types/response/Cards.ts";
import {compareCardNumbers} from "../utils";
import LoadingSpinner from "../components/ui/LoadingSpinner.tsx";

type StatusFilter = 'all' | 'missing' | 'found'

const OneOfOneTrackerPage: React.FC = () => {
  const { getOneOfOnesBySet } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [filterDriver, setFilterDriver] = useState<string>('');
  const [filterTeam, setFilterTeam] = useState<string>('');
  const [filterPrintingPlates, setFilterPrintingPlates] = useState<boolean>(true)
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<string>('card');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [setsDropdown, setSetsDropdown] = useState<Dropdown[]>([]);
  const [oneOfOneCards, setOneOfOneCards] = useState<OneOfOneCardResponse[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getDropdowns = async () => {
      setLoading(true);
      const sets = await DropdownService.getSetsDropdown()
      setSetsDropdown(sets)
      setLoading(false)
    }

    getDropdowns();
  }, []);

  useEffect(() => {
    if (!selectedSet) {
      setOneOfOneCards([])
      return;
    }

    const getOneOfOnes = async () => {
      setLoading(true)
      const data = await getOneOfOnesBySet(selectedSet);
      setOneOfOneCards(data)
      setLoading(false)
    }

    getOneOfOnes();
  }, [selectedSet, getOneOfOnesBySet]);

  // Get unique values for filters from the current set's cards
  const uniqueDrivers = Array.from(new Set(oneOfOneCards.map(card => card.driverName)));
  const uniqueTeams = Array.from(new Set(oneOfOneCards.map(card => card.constructorName)));

  // Apply filters and search
  const filteredCards = oneOfOneCards.filter(card => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
          card.driverName.toLowerCase().includes(query) ||
          card.constructorName.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    if (filterDriver && card.driverName !== filterDriver) return false;
    if (filterTeam && card.constructorName !== filterTeam) return false;

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
      default:
        comparison = compareCardNumbers(a.cardNumber, b.cardNumber);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Stats for the selected set
  const allParallels = oneOfOneCards.flatMap(card => card.parallels);

  // Count total one-of-one parallels
  const totalOneOfOnes = filterPrintingPlates
      ? allParallels.filter(p => p.isOneOfOne === true && !p.name.includes('Printing Plate')).length
      : allParallels.filter(p => p.isOneOfOne === true).length;

  // Count found one-of-one parallels
  const foundCount = filterPrintingPlates
      ? allParallels.filter(p => p.isOneOfOne === true && p.isOneOfOneFound === true && !p.name.includes('Printing Plate')).length
      : allParallels.filter(p => p.isOneOfOne === true && p.isOneOfOneFound === true).length

  // Calculate missing
  const missingCount = totalOneOfOnes - foundCount;

  const buildCardFromOneOfOne = (oneOfOne: OneOfOneCardResponse, imageUrl: string): Card => ({
    ...oneOfOne,
    baseImageUrl: imageUrl,
    hasOneOfOne: true
  })

  const showParallel = (parallel: EnabledParallel): boolean => {
    if (filterStatus === 'found') {
      return parallel.isOneOfOneFound === true
    } else if (filterStatus === 'missing') {
      return parallel.isOneOfOneFound === false
    }
    return true
  }

  return (
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">1/1 Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track one-of-one Formula 1 cards
              <br />
              <br />
              NOTE: This is entirely based on community input.
              <br />
              Even if a one-of-one is said to be missing, there is a chance it has been found and not been shared publicly.
            </p>
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

        {/* Set Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Set
          </label>
          <select
              value={selectedSet ? `${selectedSet}` : ''}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedSet(e.target.value);
                  // Reset filters when changing sets
                  setFilterDriver('');
                  setFilterTeam('');
                  setSearchQuery('');
                  setFilterPrintingPlates(true)
                  setFilterStatus('all')
                } else {
                  setSelectedSet(null);
                }
              }}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select a set...</option>
            {setsDropdown.map(set => (
                <option key={set.value} value={set.value}>
                  {set.label}
                </option>
            ))}
          </select>
        </div>

        {selectedSet ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Total 1/1s in Set</span>
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
                        placeholder="Search by driver or team..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0600E1] focus:border-[#0600E1] sm:text-sm transition"
                    />
                  </div>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver</label>
                        <select
                            value={filterDriver}
                            onChange={(e) => setFilterDriver(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">All Drivers</option>
                          {uniqueDrivers.map(driver => (
                              <option key={driver} value={driver}>{driver}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team</label>
                        <select
                            value={filterTeam}
                            onChange={(e) => setFilterTeam(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">All Teams</option>
                          {uniqueTeams.map(team => (
                              <option key={team} value={team}>{team}</option>
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
                            <option value="driver">Driver Name</option>
                            <option value="team">Team Name</option>
                          </select>
                          <button
                              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                              className="p-2 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-500 rounded-r-md"
                          >
                            {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
                          </button>
                        </div>
                      </div>
                      {/* Status Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="all">All Cards</option>
                          <option value="found">Only Found</option>
                          <option value="missing">Only Missing</option>
                        </select>
                      </div>

                      {/* Include Printing Plates */}
                      <div className="flex items-end">
                        <label className="inline-flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                          <input
                              type="checkbox"
                              checked={filterPrintingPlates}
                              onChange={() => setFilterPrintingPlates(prev => !prev)}
                              className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span>Exclude Printing Plates</span>
                        </label>
                      </div>
                    </div>
                )}
              </div>

              {/* Cards Display */}
              {isLoading && <LoadingSpinner />}
              {!isLoading && (
                  <>
                    {sortedCards.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                          <p className="text-gray-500 dark:text-gray-400">
                            No 1/1 cards found matching your criteria.
                          </p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                          {sortedCards.map((card) =>
                                  card.parallels.filter((p) => showParallel(p)).filter((p) => filterPrintingPlates ? !p.name.includes('Printing Plate') : true).map((parallel) => (
                                      <div key={`${parallel.name}-${card.id}`} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                                        <CardDisplayItem card={buildCardFromOneOfOne(card, parallel.imageUrl ? parallel.imageUrl + "?v=2" : '')} showActions={false}/>
                                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            #{card.cardNumber} {card.driverName}
                                          </div>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {card.setName}
                                          </div>
                                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {parallel.name}
                                          </div>
                                          <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          parallel.isOneOfOne === true && parallel.isOneOfOneFound === true
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}>
                        {parallel.isOneOfOne === true && parallel.isOneOfOneFound === true ? 'Found' : 'Missing'}
                      </span>
                                          </div>
                                        </div>
                                      </div>
                                  ))
                          )}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                              <th scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Card
                              </th>
                              <th scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Driver / Team
                              </th>
                              <th scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Parallel
                              </th>
                              <th scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {sortedCards.map((card) =>
                                card.parallels.map((parallel) => (
                                    <tr key={`${parallel.name}-${card.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-10 w-10 rounded-md overflow-hidden">
                                          <img src={parallel.imageUrl + "?v=2"} alt={card.driverName} className="h-full w-full object-cover" />
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{card.driverName}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{card.constructorName}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900 dark:text-white">{parallel.name}</span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            parallel.isOneOfOne === true && parallel.isOneOfOneFound === true
                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        }`}>
                          {parallel.isOneOfOne === true && parallel.isOneOfOneFound === true ? 'Found' : 'Missing'}
                        </span>
                                      </td>
                                    </tr>
                                )))}
                            </tbody>
                          </table>
                        </div>
                    )}
                  </>
              )}
            </>
        ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Please select a set to view its 1/1 cards.
              </p>
            </div>
        )}
      </div>
  );
};

export default OneOfOneTrackerPage;