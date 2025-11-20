import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, LogOut, User, Sun, Moon, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { clearTasks } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    // Clear cached task data on logout
    clearTasks();
    // Clear authentication data
    logout();
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    // Navigate to onboarding page
    navigate('/', { replace: true });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white dark:bg-[#1e293b] shadow-md fixed top-0 left-0 right-0 z-50 transition-colors border-b border-gray-200 dark:border-[#334155]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu toggle and App Title */}
          <div className="flex items-center gap-3">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors md:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            <button
              onClick={() => {
                if (location.pathname !== '/dashboard') {
                  navigate('/dashboard');
                }
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
            >
              {/* Logo SVG */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <circle cx="40" cy="40" r="38" fill="url(#navGradient)" />
                <path
                  d="M45 20L30 45H40L35 60L50 35H40L45 20Z"
                  fill="white"
                />
                <path
                  d="M52 28L38 42L32 36"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="navGradient" x1="0" y1="0" x2="80" y2="80">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                SnapTask
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors"
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-[#334155] rounded-lg hover:bg-gray-200 dark:hover:bg-[#475569] transition-colors"
                aria-label="User menu"
              >
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-600">
                    {user?.username || 'User'}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1e293b] rounded-lg shadow-xl border border-gray-200 dark:border-[#334155] py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-[#334155]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-600 truncate">
                          {user?.username || 'User'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email || ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0f172a]">
          <div className="px-3 py-4 space-y-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium text-gray-100">Light Mode</span>
                </>
              )}
            </button>

            {/* User Info Dropdown */}
            <div className="bg-gray-100 dark:bg-[#334155] rounded-lg overflow-hidden">
              <button
                onClick={toggleDropdown}
                className="w-full flex items-center justify-between px-3 py-3 hover:bg-gray-200 dark:hover:bg-[#475569] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {user?.username || 'User'}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Content */}
              {isDropdownOpen && (
                <div className="border-t border-gray-200 dark:border-[#475569]">
                  <div className="px-3 py-3 bg-gray-50 dark:bg-[#1e293b]">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {user?.username || 'User'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email || ''}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
