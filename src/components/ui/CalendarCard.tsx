import React from 'react';
import { ExternalLink } from 'lucide-react';

interface CalendarCardProps {
  product: {
    id: string;
    productName: string;
    releaseDate: Date;
    description: string;
    manufacturer: string;
    imageUrl: string;
    preorderUrl?: string;
  };
}

const CalendarCard: React.FC<CalendarCardProps> = ({ product }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const daysUntilRelease = (releaseDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const release = new Date(releaseDate);
    release.setHours(0, 0, 0, 0);
    
    const diffTime = release.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const days = daysUntilRelease(product.releaseDate);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.productName}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-0 right-0 bg-[#E10600] text-white px-3 py-1 font-bold">
          {days > 0 ? `${days} days` : 'Released'}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-sm text-[#0600E1] font-medium">{product.manufacturer}</span>
          <h3 className="font-bold text-lg">{product.productName}</h3>
        </div>
        
        <div className="bg-gray-100 px-3 py-2 rounded-md mb-3">
          <p className="text-sm text-gray-700">{formatDate(product.releaseDate)}</p>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 flex-grow">{product.description}</p>
        
        {product.preorderUrl && (
          <a 
            href={product.preorderUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-auto block text-center bg-[#0600E1] text-white py-2 px-4 rounded-md hover:bg-blue-800 transition flex items-center justify-center"
          >
            Preorder Now <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        )}
        
        {!product.preorderUrl && days <= 0 && (
          <div className="mt-auto block text-center bg-green-600 text-white py-2 px-4 rounded-md">
            Available Now
          </div>
        )}
        
        {!product.preorderUrl && days > 0 && (
          <div className="mt-auto block text-center bg-gray-200 text-gray-700 py-2 px-4 rounded-md">
            Coming Soon
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarCard;