import React from 'react';
import { MarketPrice } from '../../types';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

interface PriceChartProps {
  priceData: MarketPrice;
}

const PriceChart: React.FC<PriceChartProps> = ({ priceData }) => {
    // Sort data by timestamp
    const sortedData = priceData.history
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map((entry) => ({
            ...entry,
            rangeTop: entry.highestPrice,
            rangeBottom: entry.lowestPrice,
        }));

  // If there is no data, return a placeholder
  if (sortedData.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p>No price data available</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Price History</h3>
      <div className="h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) =>
                          new Date(value).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                          })
                      }
                  />
                  <YAxis />
                  <Tooltip
                      formatter={(value: number, name: string) => {
                          // Create a mapping from data keys to display names
                          const labelMap: Record<string, string> = {
                              averagePrice: 'Average Price',
                              rangeTop: 'Highest Price',
                              rangeBottom: 'Lowest Price',
                          };

                          const displayName = labelMap[name] || name;

                          return [`$${value.toFixed(2)}`, displayName];
                      }}
                      labelFormatter={(label) =>
                          new Date(label).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                          })
                      }
                  />

                  {/* Average price line */}
                  <Line
                      type="monotone"
                      dataKey="averagePrice"
                      stroke="#E10600"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#E10600' }}
                      activeDot={{ r: 5 }}
                  />

                  {/* Invisible lines for highest and lowest to include in tooltip */}
                  <Line type="monotone" dataKey="rangeTop" stroke="#6b7280" dot={false} />
                  <Line type="monotone" dataKey="rangeBottom" stroke="#6b7280" dot={false} />
              </LineChart>
          </ResponsiveContainer>
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