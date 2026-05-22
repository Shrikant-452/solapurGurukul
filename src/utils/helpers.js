/**
 * ==================== HELPER UTILITIES ====================
 * A comprehensive collection of helper functions for the Divine Mantra website
 */

// ==================== STRING UTILITIES ====================

/**
 * Capitalize first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export const capitalizeFirstLetter = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize first letter of each word
 * @param {string} str - Input string
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate text to specified length
 * @param {string} str - Input string
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export const truncateText = (str, length = 100, suffix = '...') => {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= length) return str;
  return str.substring(0, length).trim() + suffix;
};

/**
 * Remove HTML tags from string
 * @param {string} str - Input string with HTML
 * @returns {string} Plain text
 */
export const stripHtml = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '');
};

/**
 * Convert string to slug (URL-friendly)
 * @param {string} str - Input string
 * @returns {string} Slug
 */
export const slugify = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Convert slug back to readable string
 * @param {string} slug - Input slug
 * @returns {string} Readable string
 */
export const unslugify = (slug) => {
  if (!slug || typeof slug !== 'string') return '';
  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Count words in a string
 * @param {string} str - Input string
 * @returns {number} Word count
 */
export const wordCount = (str) => {
  if (!str || typeof str !== 'string') return 0;
  return str.trim().split(/\s+/).length;
};

/**
 * Extract initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate random string
 * @param {number} length - Length of random string
 * @returns {string} Random string
 */
export const randomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ==================== NUMBER UTILITIES ====================

/**
 * Format number with commas
 * @param {number} num - Input number
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format number as percentage
 * @param {number} num - Input number
 * @param {number} decimals - Decimal places
 * @returns {string} Percentage string
 */
export const formatPercentage = (num, decimals = 0) => {
  if (num === null || num === undefined) return '0%';
  return `${num.toFixed(decimals)}%`;
};

/**
 * Format number as currency (Indian Rupees)
 * @param {number} amount - Amount in rupees
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format number with ordinal suffix (1st, 2nd, 3rd, etc.)
 * @param {number} num - Input number
 * @returns {string} Number with ordinal suffix
 */
export const getOrdinalSuffix = (num) => {
  if (num === null || num === undefined) return '';
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
};

/**
 * Clamp number between min and max
 * @param {number} num - Input number
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Convert number to Roman numerals
 * @param {number} num - Input number (1-3999)
 * @returns {string} Roman numeral
 */
export const toRomanNumeral = (num) => {
  const romanMap = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  
  if (num < 1 || num > 3999) return String(num);
  
  let result = '';
  let remaining = num;
  
  for (const [value, symbol] of romanMap) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  
  return result;
};

// ==================== DATE & TIME UTILITIES ====================

/**
 * Format date to readable string
 * @param {string|Date} date - Input date
 * @param {string} format - Format style (short, long, full)
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'long') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const options = {
    short: { year: 'numeric', month: 'numeric', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  };
  
  return d.toLocaleDateString('en-US', options[format] || options.long);
};

/**
 * Format time from date
 * @param {string|Date} date - Input date
 * @returns {string} Formatted time
 */
export const formatTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Input date
 * @returns {string} Relative time string
 */
export const timeAgo = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);
  
  if (seconds < 30) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

/**
 * Check if date is today
 * @param {string|Date} date - Input date
 * @returns {boolean} True if today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const d = new Date(date);
  const today = new Date();
  
  return d.toDateString() === today.toDateString();
};

/**
 * Check if date is this week
 * @param {string|Date} date - Input date
 * @returns {boolean} True if this week
 */
export const isThisWeek = (date) => {
  if (!date) return false;
  
  const d = new Date(date);
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  return d >= weekStart && d <= weekEnd;
};

// ==================== ARRAY UTILITIES ====================

/**
 * Shuffle array (Fisher-Yates algorithm)
 * @param {Array} array - Input array
 * @returns {Array} Shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Chunk array into smaller arrays
 * @param {Array} array - Input array
 * @param {number} size - Chunk size
 * @returns {Array} Chunked array
 */
export const chunkArray = (array, size) => {
  if (!Array.isArray(array)) return [];
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

/**
 * Remove duplicates from array
 * @param {Array} array - Input array
 * @returns {Array} Array without duplicates
 */
export const uniqueArray = (array) => {
  return [...new Set(array)];
};

/**
 * Group array by key
 * @param {Array} array - Input array
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Sort array by key
 * @param {Array} array - Input array
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (typeof aVal === 'string') {
      return order === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return order === 'asc' ? aVal - bVal : bVal - aVal;
  });
};

// ==================== OBJECT UTILITIES ====================

/**
 * Deep clone an object
 * @param {Object} obj - Input object
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param {Object} obj - Input object
 * @returns {boolean} True if empty
 */
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Pick specific keys from object
 * @param {Object} obj - Input object
 * @param {Array} keys - Keys to pick
 * @returns {Object} Object with picked keys
 */
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj && obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

/**
 * Omit specific keys from object
 * @param {Object} obj - Input object
 * @param {Array} keys - Keys to omit
 * @returns {Object} Object without omitted keys
 */
export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

// ==================== VALIDATION UTILITIES ====================

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate phone number (Indian)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Strength object with score and message
 */
export const checkPasswordStrength = (password) => {
  let score = 0;
  const checks = [];
  
  if (password.length >= 8) {
    score++;
    checks.push('✓ At least 8 characters');
  } else {
    checks.push('✗ At least 8 characters');
  }
  
  if (/[A-Z]/.test(password)) {
    score++;
    checks.push('✓ Contains uppercase letter');
  } else {
    checks.push('✗ Contains uppercase letter');
  }
  
  if (/[a-z]/.test(password)) {
    score++;
    checks.push('✓ Contains lowercase letter');
  } else {
    checks.push('✗ Contains lowercase letter');
  }
  
  if (/[0-9]/.test(password)) {
    score++;
    checks.push('✓ Contains number');
  } else {
    checks.push('✗ Contains number');
  }
  
  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
    checks.push('✓ Contains special character');
  } else {
    checks.push('✗ Contains special character');
  }
  
  let strength = 'Weak';
  if (score >= 4) strength = 'Strong';
  else if (score >= 3) strength = 'Medium';
  
  return { score, strength, checks };
};

// ==================== STORAGE UTILITIES ====================

/**
 * Local storage wrapper with error handling
 */
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
  
  has: (key) => {
    return localStorage.getItem(key) !== null;
  }
};

/**
 * Session storage wrapper
 */
export const sessionStorageUtil = {
  get: (key) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  clear: () => {
    try {
      sessionStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
};

// ==================== BROWSER UTILITIES ====================

/**
 * Detect if device is mobile
 * @returns {boolean} True if mobile
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Detect if device is touch-enabled
 * @returns {boolean} True if touch-enabled
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get browser language
 * @returns {string} Language code
 */
export const getBrowserLanguage = () => {
  const lang = navigator.language || navigator.userLanguage;
  if (lang.startsWith('hi')) return 'hi';
  if (lang.startsWith('mr')) return 'mr';
  if (lang.startsWith('te')) return 'te';
  if (lang.startsWith('kn')) return 'kn';
  if (lang.startsWith('ta')) return 'ta';
  return 'en';
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - Download filename
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ==================== DOM UTILITIES ====================

/**
 * Scroll to element smoothly
 * @param {string|HTMLElement} element - Element ID or DOM element
 * @param {number} offset - Scroll offset
 */
export const scrollToElement = (element, offset = 80) => {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  if (el) {
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  }
};

/**
 * Scroll to top of page
 * @param {string} behavior - Scroll behavior ('smooth' or 'auto')
 */
export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({ top: 0, behavior });
};

/**
 * Get element position relative to viewport
 * @param {HTMLElement} element - DOM element
 * @returns {Object} Position object
 */
export const getElementPosition = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height
  };
};

// ==================== MANTRA-SPECIFIC UTILITIES ====================

/**
 * Extract mantra name from text
 * @param {string} text - Mantra text
 * @returns {string} Extracted name
 */
export const extractMantraName = (text) => {
  const match = text.match(/^[^।]+/);
  return match ? match[0].trim() : text.substring(0, 50);
};

/**
 * Count verses in mantra text
 * @param {string} text - Mantra text
 * @returns {number} Verse count
 */
export const countVerses = (text) => {
  if (!text) return 0;
  return text.split(/[।॥]/).filter(s => s.trim().length > 0).length;
};

/**
 * Format mantra text for display
 * @param {string} text - Raw mantra text
 * @returns {string} Formatted text
 */
export const formatMantraText = (text) => {
  if (!text) return '';
  return text
    .replace(/\n/g, '<br/>')
    .replace(/([।॥])/g, '$1<br/>')
    .replace(/<br\/><br\/>/g, '<br/>');
};

// ==================== DEBOUNCE & THROTTLE ====================

/**
 * Debounce function - delays execution until after wait time
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function - limits execution to once per wait time
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ==================== COLOR UTILITIES ====================

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code
 * @returns {Object} RGB object
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Get contrasting text color (black or white)
 * @param {string} hex - Background hex color
 * @returns {string} 'black' or 'white'
 */
export const getContrastColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'white';
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? 'black' : 'white';
};

// ==================== ERROR HANDLING ====================

/**
 * Format error message for display
 * @param {Error|string} error - Error object or message
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

/**
 * Create error object for consistent error handling
 * @param {string} message - Error message
 * @param {number} code - Error code
 * @returns {Object} Error object
 */
export const createError = (message, code = 500) => {
  return { message, code, success: false };
};

// ==================== RANDOM UTILITIES ====================

/**
 * Generate random ID
 * @returns {string} Random ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Get random item from array
 * @param {Array} array - Input array
 * @returns {*} Random item
 */
export const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ==================== EXPORT ALL ====================
export default {
  // String utilities
  capitalizeFirstLetter,
  toTitleCase,
  truncateText,
  stripHtml,
  slugify,
  unslugify,
  wordCount,
  getInitials,
  randomString,
  
  // Number utilities
  formatNumber,
  formatPercentage,
  formatCurrency,
  getOrdinalSuffix,
  clamp,
  toRomanNumeral,
  
  // Date utilities
  formatDate,
  formatTime,
  timeAgo,
  isToday,
  isThisWeek,
  
  // Array utilities
  shuffleArray,
  chunkArray,
  uniqueArray,
  groupBy,
  sortByKey,
  
  // Object utilities
  deepClone,
  isEmptyObject,
  pick,
  omit,
  
  // Validation utilities
  isValidEmail,
  isValidPhone,
  isValidUrl,
  checkPasswordStrength,
  
  // Storage utilities
  storage,
  sessionStorageUtil,
  
  // Browser utilities
  isMobile,
  isTouchDevice,
  getBrowserLanguage,
  copyToClipboard,
  downloadFile,
  
  // DOM utilities
  scrollToElement,
  scrollToTop,
  getElementPosition,
  
  // Mantra utilities
  extractMantraName,
  countVerses,
  formatMantraText,
  
  // Debounce & Throttle
  debounce,
  throttle,
  
  // Color utilities
  hexToRgb,
  getContrastColor,
  
  // Error handling
  formatErrorMessage,
  createError,
  
  // Random utilities
  generateId,
  randomItem,
  randomNumber
};