import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/ui/Navbar';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import MarketplacePage from './pages/MarketplacePage';
import CardBattlesPage from './pages/CardBattlesPage';
import CalendarPage from './pages/CalendarPage';
import GrailListPage from './pages/GrailListPage';
import OneOfOneTrackerPage from './pages/OneOfOneTrackerPage';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="pb-12">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/collection" element={<CollectionPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/card-battles" element={<CardBattlesPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/grail-list" element={<GrailListPage />} />
                <Route path="/one-of-one" element={<OneOfOneTrackerPage />} />
              </Routes>
            </main>
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Formula Cardz</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">The Ultimate F1 Trading Card Collection Platform</p>
                  </div>
                  <div className="flex space-x-8">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Features</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>Collection Management</li>
                        <li>Market Pricing</li>
                        <li>Card Battles</li>
                        <li>Drops Calendar</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Company</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>About Us</li>
                        <li>Contact</li>
                        <li>Privacy Policy</li>
                        <li>Terms of Service</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  &copy; 2025 Formula Cardz. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;