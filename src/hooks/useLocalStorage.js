import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Get stored value
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };
  
  const [storedValue, setStoredValue] = useState(readValue);
  
  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  // Listen for changes to this localStorage key in other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);
  
  return [storedValue, setValue];
}

// Hook for storing user preferences
export const useUserPreferences = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const [language, setLanguage] = useLocalStorage('language', 'en');
  const [notifications, setNotifications] = useLocalStorage('notifications', true);
  const [autoPlay, setAutoPlay] = useLocalStorage('autoPlay', false);
  const [volume, setVolume] = useLocalStorage('volume', 0.7);
  const [playbackSpeed, setPlaybackSpeed] = useLocalStorage('playbackSpeed', 1);
  
  return {
    theme,
    setTheme,
    language,
    setLanguage,
    notifications,
    setNotifications,
    autoPlay,
    setAutoPlay,
    volume,
    setVolume,
    playbackSpeed,
    setPlaybackSpeed
  };
};

// Hook for storing recently viewed mantras
export const useRecentlyViewed = (maxItems = 10) => {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('recentlyViewed', []);
  
  const addToRecentlyViewed = (item) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      return [item, ...filtered].slice(0, maxItems);
    });
  };
  
  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };
  
  const removeFromRecentlyViewed = (id) => {
    setRecentlyViewed(prev => prev.filter(item => item.id !== id));
  };
  
  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
    removeFromRecentlyViewed
  };
};

// Hook for storing bookmarks/favorites
export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useLocalStorage('bookmarks', []);
  
  const addBookmark = (item) => {
    if (!isBookmarked(item.id)) {
      setBookmarks([...bookmarks, item]);
      return true;
    }
    return false;
  };
  
  const removeBookmark = (id) => {
    setBookmarks(bookmarks.filter(item => item.id !== id));
    return true;
  };
  
  const toggleBookmark = (item) => {
    if (isBookmarked(item.id)) {
      removeBookmark(item.id);
      return false;
    } else {
      addBookmark(item);
      return true;
    }
  };
  
  const isBookmarked = (id) => {
    return bookmarks.some(item => item.id === id);
  };
  
  const clearBookmarks = () => {
    setBookmarks([]);
  };
  
  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearBookmarks
  };
};

// Hook for storing search history
export const useSearchHistory = (maxItems = 10) => {
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', []);
  
  const addToSearchHistory = (query) => {
    if (!query.trim()) return;
    
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q !== query);
      return [query, ...filtered].slice(0, maxItems);
    });
  };
  
  const clearSearchHistory = () => {
    setSearchHistory([]);
  };
  
  const removeFromSearchHistory = (query) => {
    setSearchHistory(prev => prev.filter(q => q !== query));
  };
  
  return {
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
    removeFromSearchHistory
  };
};

// Hook for storing user settings
export const useUserSettings = () => {
  const [settings, setSettings] = useLocalStorage('userSettings', {
    darkMode: true,
    fontSize: 'medium',
    reducedMotion: false,
    highContrast: false,
    autoPlayAudio: false,
    showTranslations: true,
    defaultLanguage: 'en'
  });
  
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const resetSettings = () => {
    setSettings({
      darkMode: true,
      fontSize: 'medium',
      reducedMotion: false,
      highContrast: false,
      autoPlayAudio: false,
      showTranslations: true,
      defaultLanguage: 'en'
    });
  };
  
  return {
    settings,
    updateSetting,
    resetSettings
  };
};

export default useLocalStorage;