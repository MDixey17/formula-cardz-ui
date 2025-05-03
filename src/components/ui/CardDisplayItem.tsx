import React, { useState } from 'react';
import { Card } from '../../types';
import { Heart, DollarSign, PlusCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ParallelStyles } from '../../constants/globalStyles';

interface CardDisplayItemProps {
  card: Card;
  showActions?: boolean;
  marketPrice?: number;
  isInGrailList?: boolean;
  enable3d?: boolean
}

const CardDisplayItem: React.FC<CardDisplayItemProps> = ({
  card,
  showActions = true,
  marketPrice,
  isInGrailList = false,
  enable3d = false
}) => {
  const { addCardToCollection, addCardToGrailList, removeCardFromGrailList } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState('Raw');

  const handleAddToCollection = () => {
    addCardToCollection(card, quantity, condition);
    setShowAddModal(false);
  };

  const handleGrailListToggle = () => {
    if (isInGrailList) {
      removeCardFromGrailList(card.id);
    } else {
      addCardToGrailList(card.id);
    }
  };

  return (
    <div className="relative group">
      <div
        className={`card-container w-full h-full perspective-1000 cursor-pointer transition-transform duration-300 transform ${
          isFlipped ? 'card-flipped' : ''
        } hover:scale-105`}
        onClick={() => setIsFlipped(enable3d ? !isFlipped : false)}
      >
        <div
          className={`relative aspect-[10/14] w-full rounded-lg overflow-hidden transform-style-3d transition-transform duration-500 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front of card */}
          <div
            className="absolute w-full h-full backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="relative h-0 pb-[140%] bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-lg">
              <img
                src={card.cardImageUrl}
                alt={`${card.driverName} card`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {card.rookieCard && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-xs font-bold px-2 py-1 rounded-full text-white">
                  RC
                </div>
              )}
              {card.printRun && (
                <div className="absolute top-2 right-2 bg-black/70 text-xs font-bold px-2 py-1 rounded-full text-white">
                  /{card.printRun}
                </div>
              )}
              {card.parallel !== 'Base' && (
                <div
                  className={`absolute bottom-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${
                    ParallelStyles.get(card.parallel) ?? 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {card.parallel}
                </div>
              )}
            </div>
          </div>

          {/* Back of card */}
          <div
            className="absolute w-full h-full bg-white rounded-lg p-4 backface-hidden rotate-y-180"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-bold mb-1">{card.driverName}</h3>
              <p className="text-sm text-gray-600 mb-2">{card.constructorName}</p>
              <div className="bg-gray-100 p-2 rounded-md mb-2">
                <p className="text-xs text-gray-500">Set</p>
                <p className="text-sm font-medium">{card.setName}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-md mb-2">
                <p className="text-xs text-gray-500">Year</p>
                <p className="text-sm font-medium">{card.year}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-md mb-2">
                <p className="text-xs text-gray-500">Card #</p>
                <p className="text-sm font-medium">{card.cardNumber}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-md mb-2">
                <p className="text-xs text-gray-500">Parallel</p>
                <p className="text-sm font-medium">{card.parallel}</p>
              </div>
              {card.printRun && (
                <div className="bg-gray-100 p-2 rounded-md">
                  <p className="text-xs text-gray-500">Print Run</p>
                  <p className="text-sm font-medium">/{card.printRun}</p>
                </div>
              )}
              {marketPrice && (
                <div className="mt-auto bg-[#E10600] text-white p-2 rounded-md text-center">
                  <p className="text-xs">Market Price</p>
                  <p className="text-lg font-bold">${marketPrice.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="absolute -bottom-2 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center space-x-2 p-2">
          <button
            className="bg-[#0600E1] text-white p-2 rounded-full hover:bg-blue-800 transition"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddModal(true);
            }}
            title="Add to Collection"
          >
            <PlusCircle size={18} />
          </button>
          <button
            className={`${
              isInGrailList ? 'bg-red-500' : 'bg-white'
            } p-2 rounded-full hover:bg-red-100 transition border border-gray-300`}
            onClick={(e) => {
              e.stopPropagation();
              handleGrailListToggle();
            }}
            title={isInGrailList ? 'Remove from Grail List' : 'Add to Grail List'}
          >
            <Heart
              size={18}
              className={isInGrailList ? 'text-white' : 'text-red-500'}
              fill={isInGrailList ? 'white' : 'none'}
            />
          </button>
          <button
            className="bg-white p-2 rounded-full hover:bg-gray-100 transition border border-gray-300"
            onClick={(e) => e.stopPropagation()}
            title="View Market Price"
          >
            <DollarSign size={18} className="text-green-600" />
          </button>
          <button
            className="bg-white p-2 rounded-full hover:bg-gray-100 transition border border-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(enable3d ? !isFlipped : false);
            }}
            title="View Details"
          >
            <Info size={18} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* Add to Collection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white p-6 rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Add to Collection</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Card: {card.driverName} - {card.setName}</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
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
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#E10600] text-white rounded-md hover:bg-red-700"
                onClick={handleAddToCollection}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDisplayItem;