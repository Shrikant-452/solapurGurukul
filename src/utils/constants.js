// App Constants
export const APP_NAME = 'Divine Mantra';
export const APP_VERSION = '1.0.0';

// Language Options
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ' }
];

// Deity Options
export const DEITIES = [
  'Ganesha', 'Shiva', 'Vishnu', 'Rama', 'Krishna', 'Durga', 
  'Lakshmi', 'Saraswati', 'Hanuman', 'Surya', 'Kali', 'Parvati'
];

// Mantra Types
export const MANTRA_TYPES = [
  'Mantra', 'Stotra', 'Ashtakam', 'Sahasranama', 'Kavacham', 'Aarti', 'Chalisa'
];

// Languages
export const SUPPORTED_LANGUAGES = ['Sanskrit', 'Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];

// API Endpoints
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  BOOKMARKS: 'bookmarks'
};

// Routes
export const ROUTES = {
  HOME: '/',
  MANTRA: '/mantras',
  MANTRA_DETAIL: '/mantra/:id',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin'
};

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;

// File Upload Limits
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
export const ALLOWED_PDF_TYPES = ['application/pdf'];
export const ALLOWED_TEXT_TYPES = ['text/plain', 'text/markdown'];

// Timeouts
export const TOAST_DURATION = 3000;
export const DEBOUNCE_DELAY = 300;

// Colors
export const COLORS = {
  gold: '#ffd700',
  goldLight: '#ffed4a',
  saffron: '#ff8c42',
  crimson: '#dc143c',
  teal: '#20b2aa',
  purple: '#9370db',
  darkBg: '#0a0a1a',
  cardBg: '#141428'
};

// Social Links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/divinemantra',
  instagram: 'https://instagram.com/divinemantra',
  twitter: 'https://twitter.com/divinemantra',
  youtube: 'https://youtube.com/divinemantra'
};

// Contact Info
export const CONTACT_INFO = {
  email: 'contact@divinemantra.com',
  phone: '+91 98765 43210',
  address: 'Mumbai, Maharashtra, India'
};

// Meta Tags
export const META_TAGS = {
  title: APP_NAME,
  description: 'A digital treasury of sacred Hindu mantras, stotras, and devotional hymns for spiritual seekers.',
  keywords: 'mantra, hindu, stotra, devotion, spiritual, sanskrit, prayer',
  author: 'Divine Mantra Team'
};