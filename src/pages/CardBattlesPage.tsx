import React, {useEffect, useState} from 'react';
import { useApp } from '../context/AppContext';
import CardBattleDisplay from '../components/ui/CardBattleDisplay';
import { Trophy, Calendar, Award } from 'lucide-react';
import {CardBattle} from "../types";
import LoadingSpinner from "../components/ui/LoadingSpinner.tsx";

const CardBattlesPage: React.FC = () => {
  const { getCardBattles } = useApp();
  const [cardBattles, setCardBattles] = useState<CardBattle[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const getAllCardBattles = async () => {
      setLoading(true)
      const data = await getCardBattles();
      setCardBattles(data);
      setLoading(false)
    }

    getAllCardBattles()
  }, [getCardBattles])
  
  // Get active battle (today's battle)
  const activeBattle = cardBattles.find(battle => {
    const now = new Date();
    const expiresAt = new Date(battle.expiresAt);
    return now < expiresAt;
  });
  
  // Get past battles
  const pastBattles = cardBattles.filter(battle => {
    const now = new Date();
    const expiresAt = new Date(battle.expiresAt);
    return now >= expiresAt;
  }).sort((a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime());
  
  // Find winning cards for stats
  const findWinningCard = (battle: typeof cardBattles[0]) => {
    return battle.votesCardOne > battle.votesCardTwo ? battle.cardOne : battle.cardTwo;
  };
  
  // Get driver win counts
  const driverWinCounts = pastBattles.reduce((acc, battle) => {
    const winningCard = findWinningCard(battle);
    acc[winningCard.driverName] = (acc[winningCard.driverName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Get team win counts
  const teamWinCounts = pastBattles.reduce((acc, battle) => {
    const winningCard = findWinningCard(battle);
    acc[winningCard.constructorName] = (acc[winningCard.constructorName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Get most winning driver and team
  const topDriver = Object.entries(driverWinCounts).sort((a, b) => b[1] - a[1])[0];
  const topTeam = Object.entries(teamWinCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Card Battles</h1>
        <p className="text-gray-600">Vote for your favorite cards in daily matchups</p>
      </div>

      {isLoading && <LoadingSpinner />}
      {!isLoading && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                  <Trophy className="h-6 w-6 text-[#FFC800] mr-2" />
                  <h2 className="text-lg font-bold">Total Battles</h2>
                </div>
                <p className="text-3xl font-bold">{cardBattles.length}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {pastBattles.length} completed, {cardBattles.length - pastBattles.length} upcoming
                </p>
              </div>

              {topDriver && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-2">
                      <Award className="h-6 w-6 text-[#E10600] mr-2" />
                      <h2 className="text-lg font-bold">Top Driver</h2>
                    </div>
                    <p className="text-3xl font-bold">{topDriver[0]}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {topDriver[1]} {topDriver[1] === 1 ? 'win' : 'wins'} in card battles
                    </p>
                  </div>
              )}

              {topTeam && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-6 w-6 text-[#0600E1] mr-2" />
                      <h2 className="text-lg font-bold">Top Team</h2>
                    </div>
                    <p className="text-3xl font-bold">{topTeam[0]}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {topTeam[1]} {topTeam[1] === 1 ? 'win' : 'wins'} in card battles
                    </p>
                  </div>
              )}
            </div>

            {/* Active Battle */}
            {activeBattle && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <Trophy className="h-6 w-6 text-[#FFC800] mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Battle</h2>
                  </div>
                  <CardBattleDisplay
                      key={activeBattle.battleId}
                      battle={activeBattle}
                      isActive={true}
                  />
                </div>
            )}

            {/* Past Battles */}
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-gray-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Past Battles</h2>
              </div>

              <div className="space-y-6">
                {pastBattles.map(battle => (
                    <CardBattleDisplay
                        key={battle.battleId}
                        battle={battle}
                        isActive={false}
                    />
                ))}
              </div>
            </div>
          </>
      )}
    </div>
  );
};

export default CardBattlesPage;