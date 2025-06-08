import React, {useEffect, useState} from 'react';
import { useApp } from '../context/AppContext';
import CardBattleDisplay from '../components/ui/CardBattleDisplay';
import { Link } from 'react-router-dom';
import {CardBattle, CardDrop} from "../types";
import {CardBattleService} from "../service/cardBattleService.ts";

const HomePage: React.FC = () => {
  const { 
    getCardsByCriteria,
    getCardBattles,
    getCardDrops,
  } = useApp();

  const [cardBattles, setCardBattles] = useState<CardBattle[]>([])
  const [cardDrops, setCardDrops] = useState<CardDrop[]>([])

  useEffect(() => {
    const getAllData = async () => {
      const dropsResponse = await getCardDrops()
      const activeCardBattles = await CardBattleService.getActiveCardBattle()

      setCardBattles(activeCardBattles.map((battle) => ({
        ...battle,
        battleId: battle.id
      })))
      setCardDrops(dropsResponse)
    }

    getAllData()
  }, [getCardsByCriteria, getCardBattles, getCardDrops])

  // Get active battle (today's battle)
  const activeBattle = cardBattles[cardBattles.length === 0 ? 0 : Math.floor(Math.random() * cardBattles.length)];
  
  // Get next upcoming card drop
  const nextDrop = [...cardDrops].sort((a, b) => 
    new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
  ).find(drop => new Date(drop.releaseDate) > new Date());

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#E10600] to-[#000000] rounded-xl shadow-xl mb-8">
        <div className="absolute inset-0 bg-[url('https://media.formula1.com/image/upload/f_auto,c_limit,w_1440,q_auto/f_auto/q_auto/fom-website/Campaign/BGT/BGT%20Everything')] mix-blend-overlay opacity-30 bg-center bg-cover"></div>
        <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-24 lg:py-32 lg:px-16 text-white">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block">Formula Cardz</span>
            <span className="block text-[#FFC800]">The Ultimate F1 Card Collection</span>
          </h1>
          <p className="mt-6 max-w-lg text-xl sm:max-w-2xl">
            Track your collection, monitor market prices, discover new cards, and compete in card battles with other F1 trading card enthusiasts.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/collection"
              className="inline-block bg-white text-[#E10600] font-bold px-8 py-3 rounded-md shadow-md hover:bg-gray-100 transition"
            >
              View My Collection
            </Link>
            <Link
              to="/marketplace"
              className="inline-block bg-[#0600E1] text-white font-bold px-8 py-3 rounded-md shadow-md hover:bg-blue-800 transition"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Featured Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Featured Cards</h2>
            <div className="mt-6 text-center">
              <Link
                to="/marketplace"
                className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded-md transition"
              >
                View All Cards
              </Link>
            </div>
          </div>

          {/* Today's Card Battle */}
          {activeBattle && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Today's Card Battle</h2>
              <CardBattleDisplay 
                battle={activeBattle}
                isActive={true}
              />
              <div className="mt-6 text-center">
                <Link
                  to="/card-battles"
                  className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded-md transition"
                >
                  View Past Battles
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Next Drop */}
          {nextDrop && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={nextDrop.imageUrl} 
                  alt={nextDrop.productName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white font-bold">{nextDrop.productName}</h3>
                  <p className="text-white text-sm">
                    {new Date(nextDrop.releaseDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">{nextDrop.description}</p>
              <div className="mt-4">
                {nextDrop.preorderUrl ? (
                  <a
                    href={nextDrop.preorderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#E10600] text-white text-center font-medium px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    Preorder Now
                  </a>
                ) : (
                  <Link
                    to="/calendar"
                    className="block w-full bg-gray-100 text-gray-800 text-center font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition"
                  >
                    View Release Calendar
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;