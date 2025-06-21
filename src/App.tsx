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
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";

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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/collection" element={(
                    <PrivateRoute>
                      <CollectionPage />
                    </PrivateRoute>
                )} />
                <Route path="/marketplace" element={(
                    <PrivateRoute>
                      <MarketplacePage />
                    </PrivateRoute>
                )} />
                <Route path="/card-battles" element={(
                    <PrivateRoute>
                      <CardBattlesPage />
                    </PrivateRoute>
                )} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/grail-list" element={(
                    <PrivateRoute>
                      <GrailListPage />
                    </PrivateRoute>
                )} />
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
                        <li>Grail List</li>
                        <li>Market Pricing</li>
                        <li>Card Battles</li>
                        <li>Drops Calendar</li>
                        <li>One Of One Tracker</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Project</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li><a href={"https://docs.google.com/document/d/1rLWs5GR5_RTPW_aH-HG6BuVEABZgA8XztMSqpMcsPlM/edit?usp=sharing"} target={"_blank"}>Privacy Policy</a></li>
                        <li><a
                            href={"https://docs.google.com/document/d/1rLWs5GR5_RTPW_aH-HG6BuVEABZgA8XztMSqpMcsPlM/edit?usp=sharing"}
                            target={"_blank"}>Terms of Service</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div
                    className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  &copy; 2025 Formula Cardz. All rights reserved.
                  <br />
                  Formula Cardz is an independent project and is not affiliated with or endorsed by Formula 1 or any related entities.
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