import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Menu, X, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar: React.FC = () => {
  const { user } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="ml-2 text-xl font-bold text-black dark:text-white">
                <span className="ml-2 text-xl font-bold text-[#E10600]">Formula</span>Cardz
              </span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-6">
              <Link
                to="/collection"
                className="text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                My Collection
              </Link>
              <Link
                  to="/grail-list"
                  className="text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                My Grail
              </Link>
              <Link
                to="/marketplace"
                className="text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Marketplace
              </Link>
              <Link
                to="/card-battles"
                className="text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Card Battles
              </Link>
              <Link
                to="/calendar"
                className="text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Drops Calendar
              </Link>
              <Link
                to="/one-of-one"
                className="text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                1/1 Tracker
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <div className="flex items-center ml-4 space-x-4">
              <button
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] p-1 rounded-full focus:outline-none"
              >
                {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
              <Link
                to="/profile"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600]"
              >
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.username}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6" />
                )}
                <span className="ml-2 text-sm font-medium">{user.username}</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              to="/collection"
              className="block text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Collection
            </Link>
            <Link
              to="/marketplace"
              className="block text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/card-battles"
              className="block text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Card Battles
            </Link>
            <Link
              to="/calendar"
              className="block text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Drops Calendar
            </Link>
            <Link
              to="/one-of-one"
              className="block text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              1/1 Tracker
            </Link>
            <Link
              to="/grail-list"
              className="block text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Grail List
            </Link>
            <Link
              to="/profile"
              className="block text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-gray-700 dark:text-gray-300 hover:text-[#E10600] dark:hover:text-[#E10600] px-3 py-2 text-base font-medium"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 flex items-center">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.username}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 rounded-full" />
              )}
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-white">
                  {user.username}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;