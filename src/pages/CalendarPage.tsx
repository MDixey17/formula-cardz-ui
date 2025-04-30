import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CalendarCard from '../components/ui/CalendarCard';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage: React.FC = () => {
  const { cardDrops } = useApp();
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  // Month navigation
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Get month name
  const getMonthName = (month: number) => {
    const date = new Date();
    date.setMonth(month);
    return date.toLocaleString('default', { month: 'long' });
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();

  // Check if a date has an event
  const hasEvent = (day: number | null) => {
    if (!day) return false;
    
    const date = new Date(currentYear, currentMonth, day);
    return cardDrops.some(drop => {
      const dropDate = new Date(drop.releaseDate);
      return (
        dropDate.getDate() === date.getDate() &&
        dropDate.getMonth() === date.getMonth() &&
        dropDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return cardDrops.filter(drop => {
      const dropDate = new Date(drop.releaseDate);
      return (
        dropDate.getDate() === date.getDate() &&
        dropDate.getMonth() === date.getMonth() &&
        dropDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Filter drops by current month and year
  const filteredDrops = cardDrops.filter(drop => {
    const dropDate = new Date(drop.releaseDate);
    return dropDate.getMonth() === currentMonth && dropDate.getFullYear() === currentYear;
  });

  // Filter upcoming drops (from today forward)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingDrops = cardDrops
    .filter(drop => new Date(drop.releaseDate) >= today)
    .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Drops Calendar</h1>
        <p className="text-gray-600">Stay updated on upcoming card releases and hobby events</p>
      </div>
      
      {/* Monthly Calendar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold">
            {getMonthName(currentMonth)} {currentYear}
          </h2>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, index) => {
            const isToday = day && new Date().getDate() === day && 
                           new Date().getMonth() === currentMonth && 
                           new Date().getFullYear() === currentYear;
            
            const hasDrops = hasEvent(day);
            
            return (
              <div 
                key={index} 
                className={`p-2 h-20 rounded-md relative ${
                  !day ? 'bg-gray-50' : 
                  isToday ? 'bg-blue-50 border border-blue-200' : 
                  'hover:bg-gray-50'
                }`}
              >
                {day && (
                  <>
                    <span className={`inline-block rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday ? 'bg-[#0600E1] text-white' : ''
                    }`}>
                      {day}
                    </span>
                    
                    {hasDrops && (
                      <div className="absolute bottom-1 right-1 left-1">
                        <div className="bg-[#E10600] text-white text-xs p-1 rounded text-center">
                          {getEventsForDay(day).length} {getEventsForDay(day).length === 1 ? 'release' : 'releases'}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Month Releases */}
      {filteredDrops.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Releases in {getMonthName(currentMonth)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrops.map(product => (
              <CalendarCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
      
      {/* Upcoming Releases */}
      <div>
        <div className="flex items-center mb-4">
          <Calendar className="h-6 w-6 text-[#E10600] mr-2" />
          <h2 className="text-2xl font-bold">Upcoming Releases</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingDrops.map(product => (
            <CalendarCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;