import React from 'react';
import { MarketPriceSnapshot } from '../../types';

interface PriceChartProps {
  priceData: MarketPriceSnapshot[];
  cardId: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ priceData, cardId }) => {
  // Filter price data for the specific card
  const cardPriceData = priceData.filter((snapshot) => snapshot.cardId === cardId);

  // Sort data by timestamp
  const sortedData = [...cardPriceData].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // If there is no data, return a placeholder
  if (sortedData.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p>No price data available</p>
      </div>
    );
  }

  // Find min and max values for scaling
  const maxPrice = Math.max(...sortedData.map((data) => data.highestPrice));
  const minPrice = Math.min(...sortedData.map((data) => data.lowestPrice));
  const range = maxPrice - minPrice;

  // Helper function to format dates
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Price History</h3>
      <div className="h-48 relative">
        {/* Chart grid */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border-t border-gray-200 w-full h-0"
              style={{ top: `${(i * 100) / 4}%` }}
            ></div>
          ))}
        </div>

        {/* Price lines */}
        <div className="absolute inset-0 pt-4 pb-6">
          <svg width="100%" height="100%" className="overflow-visible">
            {/* Average price line */}
            <polyline
              points={sortedData
                .map((data, index) => {
                  const x = (index / (sortedData.length - 1)) * 100;
                  const normalizedPrice =
                    range === 0
                      ? 50
                      : 100 - ((data.averagePrice - minPrice) / range) * 100;
                  return `${x}% ${normalizedPrice}%`;
                })
                .join(' ')}
              fill="none"
              stroke="#E10600"
              strokeWidth="2"
            />

            {/* Highest and lowest price area */}
            <path
              d={`
                M${(0 / (sortedData.length - 1)) * 100}% ${
                100 - ((sortedData[0].highestPrice - minPrice) / range) * 100
              }%
                ${sortedData
                  .map((data, index) => {
                    const x = (index / (sortedData.length - 1)) * 100;
                    const normalizedPrice =
                      range === 0
                        ? 50
                        : 100 - ((data.highestPrice - minPrice) / range) * 100;
                    return `L${x}% ${normalizedPrice}%`;
                  })
                  .join(' ')}
                L${((sortedData.length - 1) / (sortedData.length - 1)) * 100}% ${
                100 - ((sortedData[sortedData.length - 1].lowestPrice - minPrice) / range) * 100
              }%
                ${sortedData
                  .map((data, index) => {
                    const reverseIndex = sortedData.length - 1 - index;
                    const x = (reverseIndex / (sortedData.length - 1)) * 100;
                    const normalizedPrice =
                      range === 0
                        ? 50
                        : 100 - ((data.lowestPrice - minPrice) / range) * 100;
                    return `L${x}% ${normalizedPrice}%`;
                  })
                  .reverse()
                  .join(' ')}
                Z
              `}
              fill="rgba(225, 6, 0, 0.1)"
              stroke="none"
            />

            {/* Point for each data point */}
            {sortedData.map((data, index) => {
              const x = (index / (sortedData.length - 1)) * 100;
              const normalizedPrice =
                range === 0 ? 50 : 100 - ((data.averagePrice - minPrice) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${normalizedPrice}%`}
                  r="3"
                  fill="#E10600"
                />
              );
            })}
          </svg>
        </div>

        {/* Price labels */}
        <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center h-6">
              ${((maxPrice - (i * range) / 4) || 0).toFixed(2)}
            </div>
          ))}
        </div>

        {/* Date labels */}
        <div className="absolute bottom-0 inset-x-0 flex justify-between text-xs text-gray-500 pt-1">
          {sortedData.map((data, index) => (
            <div key={index} className="text-center">
              {formatDate(data.timestamp)}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-4 text-sm">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-[#E10600] rounded-full mr-1"></div>
          <span>Average Price</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[rgba(225,6,0,0.1)] rounded-sm mr-1"></div>
          <span>Price Range</span>
        </div>
      </div>

      {/* Current price summary */}
      <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-xs text-gray-500">Lowest</div>
          <div className="font-bold">${sortedData[sortedData.length - 1].lowestPrice.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Average</div>
          <div className="font-bold text-[#E10600]">
            ${sortedData[sortedData.length - 1].averagePrice.toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Highest</div>
          <div className="font-bold">${sortedData[sortedData.length - 1].highestPrice.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;