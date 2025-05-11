import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Sun, Moon, MapPin, LogOut, User,
  Bell, Search, Home, PlusCircle, Settings, HelpCircle,
  Filter, ChevronDown, X as XIcon, Bot
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { addTimestampToUrl } from '../../utils/imageUtils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Your issue was resolved', read: false },
    { id: 2, text: 'New comment on your report', read: false },
    { id: 3, text: 'Issue status updated', read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Track scroll position to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsSearchOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
    setIsProfileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`bg-white dark:bg-gray-800 sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-200 dark:border-gray-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group" onClick={closeMenu}>
              <div className="flex items-center justify-center h-10 w-10 bg-primary-500 text-white rounded-lg group-hover:bg-primary-600 transition-colors">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                Civic-Resolve
              </span>
            </Link>

            {/* Desktop navigation links */}
            <div className="hidden md:flex ml-10 space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="flex items-center">
                  <Home size={18} className="mr-1.5" />
                  Feed
                </span>
              </Link>
              <Link
                to="/report"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/report')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="flex items-center">
                  <PlusCircle size={18} className="mr-1.5" />
                  Report Issue
                </span>
              </Link>
              <Link
                to="/chatbot-demo"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/chatbot-demo')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="flex items-center">
                  <Bot size={18} className="mr-1.5" />
                  Chatbot Demo
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search button and form */}
            <div className="relative">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Search overlay */}
              <div className={`absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                isSearchOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-4'
              }`}>
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="relative flex-grow">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search issues..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <XIcon size={16} />
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="ml-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Search
                    </button>
                  </form>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Try searching for issues by title, description, or location
                  </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              <div className={`absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                showNotifications ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-4'
              }`}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div>
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-800 dark:text-gray-200">{notification.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                        <p>No notifications yet</p>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to="/notifications"
                      className="block text-center text-xs text-primary-600 dark:text-primary-400 hover:underline"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Report Issue button */}
            <Link
              to="/report"
              className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow transition-all"
            >
              <span className="flex items-center">
                <PlusCircle size={18} className="mr-1.5" />
                Report Issue
              </span>
            </Link>

            {isAuthenticated ? (
              <div className="relative ml-2">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user?.avatar_url ? (
                    <img
                      src={addTimestampToUrl(user.avatar_url)}
                      alt={user.name || 'User'}
                      className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 ring-2 ring-white dark:ring-gray-800">
                      <User size={16} />
                    </div>
                  )}
                </button>

                {/* Profile dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 transition-all duration-300 transform origin-top-right ${
                    isProfileMenuOpen
                      ? 'opacity-100 scale-100 visible'
                      : 'opacity-0 scale-95 invisible'
                  }`}
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>

                  <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <User size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                    Your Profile
                  </Link>

                  <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Settings size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                    Settings
                  </Link>

                  <Link to="/help" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <HelpCircle size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                    Help & Support
                  </Link>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={16} className="mr-2" />
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-gray-800 dark:bg-white text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-100 shadow-sm hover:shadow transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated && (
              <Link to="/profile" className="p-2 rounded-full">
                {user?.avatar_url ? (
                  <img
                    src={addTimestampToUrl(user.avatar_url)}
                    alt={user.name || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300">
                    <User size={16} />
                  </div>
                )}
              </Link>
            )}

            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Open menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 transform ${
          isMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/"
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
              isActive('/')
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={closeMenu}
          >
            <Home size={20} className="mr-2" />
            Feed
          </Link>

          <Link
            to="/report"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
            onClick={closeMenu}
          >
            <PlusCircle size={20} className="mr-2" />
            Report Issue
          </Link>

          <Link
            to="/chatbot-demo"
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
              isActive('/chatbot-demo')
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={closeMenu}
          >
            <Bot size={20} className="mr-2" />
            Chatbot Demo
          </Link>

          {/* Mobile search */}
          <div className="px-3 py-2">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative flex-grow">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XIcon size={16} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="ml-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Search size={16} />
              </button>
            </form>
          </div>

          <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-3 py-2">
                  {user?.avatar_url ? (
                    <img
                      src={addTimestampToUrl(user.avatar_url)}
                      alt={user.name || 'User'}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300">
                      <User size={20} />
                    </div>
                  )}
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-800 dark:text-white">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={closeMenu}
                  >
                    <User size={20} className="mr-2" />
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={closeMenu}
                  >
                    <Settings size={20} className="mr-2" />
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={20} className="mr-2" />
                    Log out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-1 px-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full px-4 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  onClick={closeMenu}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center w-full px-4 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                  onClick={closeMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;