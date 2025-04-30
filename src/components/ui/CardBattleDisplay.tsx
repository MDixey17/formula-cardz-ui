import React from 'react';
import { Card, CardBattle } from '../../types';
import { Trophy, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CardBattleDisplayProps {
  battle: CardBattle;
  cardOne: Card;
  cardTwo: Card;
  isActive?: boolean;
}

const CardBattleDisplay: React.FC<CardBattleDisplayProps> = ({
  battle,
  cardOne,
  cardTwo,
  isActive = false,
}) => {
  const { voteForCard } = useApp();
  
  const totalVotes = battle.votesCardOne + battle.votesCardTwo;
  const cardOnePercentage = totalVotes > 0 ? Math.round((battle.votesCardOne / totalVotes) * 100) : 50;
  const cardTwoPercentage = totalVotes > 0 ? Math.round((battle.votesCardTwo / totalVotes) * 100) : 50;
  
  const handleVote = (cardIndex: 1 | 2) => {
    if (!isActive) return;
    voteForCard(battle.id, cardIndex);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <Trophy className="h-5 w-5 text-[#FFC800] mr-2" />
          Card Battle
        </h3>
        <div className="text-sm text-gray-500">
          {isActive ? (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
              Active
            </span>
          ) : (
            <span>{formatDate(battle.createdAt)}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div 
          className={`w-full md:w-[45%] ${isActive ? 'cursor-pointer transform transition-transform hover:scale-105' : ''}`}
          onClick={isActive ? () => handleVote(1) : undefined}
        >
          <div className={`relative rounded-lg overflow-hidden ${battle.votesCardOne > battle.votesCardTwo ? 'ring-2 ring-[#FFC800]' : ''}`}>
            <img 
              src={cardOne.cardImageUrl} 
              alt={cardOne.driverName} 
              className="w-full h-60 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
              <div className="text-white">
                <p className="font-bold">{cardOne.driverName}</p>
                <p className="text-sm">{cardOne.setName} {cardOne.parallel}</p>
              </div>
            </div>
            {battle.votesCardOne > battle.votesCardTwo && !isActive && (
              <div className="absolute top-2 right-2 bg-[#FFC800] p-1 rounded-full">
                <Trophy className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#E10600] h-2.5 rounded-full" 
                style={{ width: `${cardOnePercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="font-semibold">{battle.votesCardOne} votes</span>
              <span className="text-[#E10600] font-bold">{cardOnePercentage}%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center">
            <span className="text-gray-500 font-bold">VS</span>
          </div>
          {isActive && (
            <p className="text-xs text-gray-500 mt-2 text-center">Click to vote</p>
          )}
        </div>

        <div 
          className={`w-full md:w-[45%] ${isActive ? 'cursor-pointer transform transition-transform hover:scale-105' : ''}`}
          onClick={isActive ? () => handleVote(2) : undefined}
        >
          <div className={`relative rounded-lg overflow-hidden ${battle.votesCardTwo > battle.votesCardOne ? 'ring-2 ring-[#FFC800]' : ''}`}>
            <img 
              src={cardTwo.cardImageUrl} 
              alt={cardTwo.driverName} 
              className="w-full h-60 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
              <div className="text-white">
                <p className="font-bold">{cardTwo.driverName}</p>
                <p className="text-sm">{cardTwo.setName} {cardTwo.parallel}</p>
              </div>
            </div>
            {battle.votesCardTwo > battle.votesCardOne && !isActive && (
              <div className="absolute top-2 right-2 bg-[#FFC800] p-1 rounded-full">
                <Trophy className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#0600E1] h-2.5 rounded-full" 
                style={{ width: `${cardTwoPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="font-semibold">{battle.votesCardTwo} votes</span>
              <span className="text-[#0600E1] font-bold">{cardTwoPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBattleDisplay;