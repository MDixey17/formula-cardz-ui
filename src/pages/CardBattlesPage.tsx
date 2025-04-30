import React from 'react';
import { useApp } from '../context/AppContext';
import CardBattleDisplay from '../components/ui/CardBattleDisplay';
import { Trophy, Calendar, Award } from 'lucide-react';

const CardBattlesPage: React.FC = () => {
  const { cardBattles, cards } = useApp();
  
  // Get active battle (today's battle)
  const activeBattle = cardBattles.find(battle => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const battleDate = new Date(battle.createdAt);
    battleDate.setHours(0, 0, 0, 0);
    return battleDate.getTime() === today.getTime();
  });
  
  // Get past battles
  const pastBattles = cardBattles.filter(battle => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const battleDate = new Date(battle.createdAt);
    battleDate.setHours(0, 0, 0, 0);
    return battleDate.getTime() < today.getTime();
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Find winning cards for stats
  const findWinningCard = (battle: typeof cardBattles[0]) => {
    return battle.votesCardOne > battle.votesCardTwo ? 
      cards.find(card => card.id === battle.cardOneId)! : 
      cards.find(card => card.id === battle.cardTwoId)!;
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
            <h2 className="text-2xl font-bold">Today's Battle</h2>
          </div>
          <CardBattleDisplay 
            battle={activeBattle}
            cardOne={cards.find(card => card.id === activeBattle.cardOneId)!}
            cardTwo={cards.find(card => card.id === activeBattle.cardTwoId)!}
            isActive={true}
          />
        </div>
      )}
      
      {/* Past Battles */}
      <div>
        <div className="flex items-center mb-4">
          <Calendar className="h-6 w-6 text-gray-500 mr-2" />
          <h2 className="text-2xl font-bold">Past Battles</h2>
        </div>
        
        <div className="space-y-6">
          {pastBattles.map(battle => (
            <CardBattleDisplay 
              key={battle.id}
              battle={battle}
              cardOne={cards.find(card => card.id === battle.cardOneId)!}
              cardTwo={cards.find(card => card.id === battle.cardTwoId)!}
              isActive={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardBattlesPage;