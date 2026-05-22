import { configureStore, createSlice } from '@reduxjs/toolkit';

// ==================== MANTRAS SLICE ====================
const mantraInitialState = {
  mantras: [
    {
      id: 1,
      name: "ॐ गण गणपतये नमः",
      name_en: "Om Gan Ganapataye Namah",
      name_hi: "ॐ गण गणपतये नमः",
      name_mr: "ॐ गण गणपतये नमः",
      name_te: "ఓం గణ గణపతయే నమః",
      name_kn: "ಓಂ ಗಣ ಗಣಪತಯೇ ನಮಃ",
      deity: "Ganesha",
      deity_hi: "गणेश",
      deity_mr: "गणेश",
      deity_te: "గణేశ",
      deity_kn: "ಗಣೇಶ",
      language: "Sanskrit",
      occasion: "Daily, New Beginnings",
      occasion_hi: "दैनिक, नई शुरुआत",
      occasion_mr: "दररोज, नवीन सुरुवात",
      occasion_te: "రోజువారీ, కొత్త ప్రారంభాలు",
      occasion_kn: "ದೈನಂದಿನ, ಹೊಸ ಆರಂಭಗಳು",
      purpose: "Removal of obstacles, success in all endeavors",
      purpose_hi: "बाधाओं का नाश, सभी कार्यों में सफलता",
      purpose_mr: "अडथळे दूर करणे, सर्व प्रयत्नांमध्ये यश",
      purpose_te: "అడ్డంకుల తొలగింపు, అన్ని ప్రయత్నాలలో విజయం",
      purpose_kn: "ಅಡೆತಡೆಗಳ ನಿವಾರಣೆ, ಎಲ್ಲಾ ಪ್ರಯತ್ನಗಳಲ್ಲಿ ಯಶಸ್ಸು",
      verses: [
        { 
          dev: "ॐ गण गणपतये नमः", 
          roman: "Om Gan Ganapataye Namah", 
          meaning: "Salutations to the Lord of all beings",
          meaning_hi: "समस्त प्राणियों के स्वामी को नमन",
          meaning_mr: "सर्व प्राण्यांच्या स्वामीला नमन",
          meaning_te: "సమస్త ప్రాణుల ప్రభువుకు నమస్కారం",
          meaning_kn: "ಸಮಸ್ತ ಪ್ರಾಣಿಗಳ ಒಡೆಯನಿಗೆ ನಮಸ್ಕಾರ"
        }
      ],
      color: "#ffd700",
      views: 1247,
      downloads: 342,
      status: "published",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "ॐ नमः शिवाय",
      name_en: "Om Namah Shivaya",
      name_hi: "ॐ नमः शिवाय",
      name_mr: "ॐ नमः शिवाय",
      name_te: "ఓం నమః శివాయ",
      name_kn: "ಓಂ ನಮಃ ಶಿವಾಯ",
      deity: "Shiva",
      deity_hi: "शिव",
      deity_mr: "शिव",
      deity_te: "శివ",
      deity_kn: "ಶಿವ",
      language: "Sanskrit",
      occasion: "Daily, Monday",
      occasion_hi: "दैनिक, सोमवार",
      occasion_mr: "दररोज, सोमवार",
      occasion_te: "రోజువారీ, సోమవారం",
      occasion_kn: "ದೈನಂದಿನ, ಸೋಮವಾರ",
      purpose: "Inner peace, liberation, spiritual growth",
      purpose_hi: "आंतरिक शांति, मोक्ष, आध्यात्मिक विकास",
      purpose_mr: "आंतरिक शांती, मोक्ष, आध्यात्मिक विकास",
      purpose_te: "అంతర్గత శాంతి, మోక్షం, ఆధ్యాత్మిక వృద్ధి",
      purpose_kn: "ಆಂತರಿಕ ಶಾಂತಿ, ಮೋಕ್ಷ, ಆಧ್ಯಾತ್ಮಿಕ ಬೆಳವಣಿಗೆ",
      verses: [
        { 
          dev: "ॐ नमः शिवाय", 
          roman: "Om Namah Shivaya", 
          meaning: "Salutations to Lord Shiva",
          meaning_hi: "भगवान शिव को नमन",
          meaning_mr: "भगवान शिवांना नमन",
          meaning_te: "శివునికి నమస్కారాలు",
          meaning_kn: "ಶಿವನಿಗೆ ನಮಸ್ಕಾರ"
        }
      ],
      color: "#20b2aa",
      views: 2341,
      downloads: 567,
      status: "published",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: "ॐ श्री रामाय नमः",
      name_en: "Om Shri Ramaya Namah",
      name_hi: "ॐ श्री रामाय नमः",
      name_mr: "ॐ श्री रामाय नमः",
      name_te: "ఓం శ్రీ రామాయ నమః",
      name_kn: "ಓಂ ಶ್ರೀ ರಾಮಾಯ ನಮಃ",
      deity: "Rama",
      deity_hi: "राम",
      deity_mr: "राम",
      deity_te: "రామ",
      deity_kn: "ರಾಮ",
      language: "Sanskrit",
      occasion: "Daily, Tuesday",
      occasion_hi: "दैनिक, मंगलवार",
      occasion_mr: "दररोज, मंगळवार",
      occasion_te: "రోజువారీ, మంగళవారం",
      occasion_kn: "ದೈನಂದಿನ, ಮಂಗಳವಾರ",
      purpose: "Strength, righteousness, protection",
      purpose_hi: "शक्ति, धर्म, सुरक्षा",
      purpose_mr: "शक्ती, धर्म, संरक्षण",
      purpose_te: "బలం, ధర్మం, రక్షణ",
      purpose_kn: "ಶಕ್ತಿ, ಧರ್ಮ, ರಕ್ಷಣೆ",
      verses: [
        { 
          dev: "ॐ श्री रामाय नमः", 
          roman: "Om Shri Ramaya Namah", 
          meaning: "Salutations to Lord Rama",
          meaning_hi: "भगवान राम को नमन",
          meaning_mr: "भगवान रामांना नमन",
          meaning_te: "రామునికి నమస్కారాలు",
          meaning_kn: "ರಾಮನಿಗೆ ನಮಸ್ಕಾರ"
        }
      ],
      color: "#4f46e5",
      views: 1892,
      downloads: 421,
      status: "published",
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      name: "ॐ श्री दुर्गायै नमः",
      name_en: "Om Shri Durgayai Namah",
      name_hi: "ॐ श्री दुर्गायै नमः",
      name_mr: "ॐ श्री दुर्गायै नमः",
      name_te: "ఓం శ్రీ దుర్గాయై నమః",
      name_kn: "ಓಂ ಶ್ರೀ ದುರ್ಗಾಯೈ ನಮಃ",
      deity: "Durga",
      deity_hi: "दुर्गा",
      deity_mr: "दुर्गा",
      deity_te: "దుర్గ",
      deity_kn: "ದುರ್ಗಾ",
      language: "Sanskrit",
      occasion: "Navratri, Tuesday, Friday",
      occasion_hi: "नवरात्रि, मंगलवार, शुक्रवार",
      occasion_mr: "नवरात्री, मंगळवार, शुक्रवार",
      occasion_te: "నవరాత్రి, మంగళవారం, శుక్రవారం",
      occasion_kn: "ನವರಾತ್ರಿ, ಮಂಗಳವಾರ, ಶುಕ್ರವಾರ",
      purpose: "Courage, victory over evil, protection",
      purpose_hi: "साहस, बुराई पर विजय, सुरक्षा",
      purpose_mr: "धैर्य, वाईटावर विजय, संरक्षण",
      purpose_te: "ధైర్యం, చెడుపై విజయం, రక్షణ",
      purpose_kn: "ಧೈರ್ಯ, ದುಷ್ಟರ ಮೇಲೆ ವಿಜಯ, ರಕ್ಷಣೆ",
      verses: [
        { 
          dev: "ॐ श्री दुर्गायै नमः", 
          roman: "Om Shri Durgayai Namah", 
          meaning: "Salutations to Goddess Durga",
          meaning_hi: "देवी दुर्गा को नमन",
          meaning_mr: "देवी दुर्गेला नमन",
          meaning_te: "దుర్గాదేవికి నమస్కారం",
          meaning_kn: "ದುರ್ಗಾದೇವಿಗೆ ನಮಸ್ಕಾರ"
        }
      ],
      color: "#dc2626",
      views: 1567,
      downloads: 289,
      status: "published",
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      name: "ॐ श्री लक्ष्म्यै नमः",
      name_en: "Om Shri Lakshmyai Namah",
      name_hi: "ॐ श्री लक्ष्म्यै नमः",
      name_mr: "ॐ श्री लक्ष्म्यै नमः",
      name_te: "ఓం శ్రీ లక్ష్మ్యై నమః",
      name_kn: "ಓಂ ಶ್ರೀ ಲಕ್ಷ್ಮ್ಯೈ ನಮಃ",
      deity: "Lakshmi",
      deity_hi: "लक्ष्मी",
      deity_mr: "लक्ष्मी",
      deity_te: "లక్ష్మీ",
      deity_kn: "ಲಕ್ಷ್ಮೀ",
      language: "Sanskrit",
      occasion: "Friday, Diwali",
      occasion_hi: "शुक्रवार, दिवाली",
      occasion_mr: "शुक्रवार, दिवाळी",
      occasion_te: "శుక్రవారం, దీపావళి",
      occasion_kn: "ಶುಕ್ರವಾರ, ದೀಪಾವಳಿ",
      purpose: "Wealth, prosperity, abundance",
      purpose_hi: "धन, समृद्धि, प्रचुरता",
      purpose_mr: "संपत्ती, समृद्धी, विपुलता",
      purpose_te: "సంపద, సమృద్ధి, సమృద్ధి",
      purpose_kn: "ಸಂಪತ್ತು, ಸಮೃದ್ಧಿ, ಸಮೃದ್ಧಿ",
      verses: [
        { 
          dev: "ॐ श्री लक्ष्म्यै नमः", 
          roman: "Om Shri Lakshmyai Namah", 
          meaning: "Salutations to Goddess Lakshmi",
          meaning_hi: "देवी लक्ष्मी को नमन",
          meaning_mr: "देवी लक्ष्मीला नमन",
          meaning_te: "లక్ష్మీదేవికి నమస్కారం",
          meaning_kn: "ಲಕ್ಷ್ಮೀದೇವಿಗೆ ನಮಸ್ಕಾರ"
        }
      ],
      color: "#ea580c",
      views: 987,
      downloads: 198,
      status: "draft",
      createdAt: new Date().toISOString()
    }
  ],
  loading: false,
  error: null,
  filters: {
    deity: 'all',
    language: 'all',
    search: ''
  }
};

const mantraSlice = createSlice({
  name: 'mantras',
  initialState: mantraInitialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addMantra: (state, action) => {
      const newMantra = {
        id: Date.now(),
        ...action.payload,
        views: 0,
        downloads: 0,
        status: action.payload.status || 'draft',
        createdAt: new Date().toISOString()
      };
      state.mantras.push(newMantra);
    },
    updateMantra: (state, action) => {
      const index = state.mantras.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.mantras[index] = { ...state.mantras[index], ...action.payload.data };
      }
    },
    deleteMantra: (state, action) => {
      state.mantras = state.mantras.filter(m => m.id !== action.payload);
    },
    incrementViews: (state, action) => {
      const mantra = state.mantras.find(m => m.id === action.payload);
      if (mantra) {
        mantra.views += 1;
      }
    },
    incrementDownloads: (state, action) => {
      const mantra = state.mantras.find(m => m.id === action.payload);
      if (mantra) {
        mantra.downloads += 1;
      }
    },
    updateStatus: (state, action) => {
      const { id, status } = action.payload;
      const mantra = state.mantras.find(m => m.id === id);
      if (mantra) {
        mantra.status = status;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { deity: 'all', language: 'all', search: '' };
    }
  }
});

// ==================== USERS SLICE ====================
const usersInitialState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState: usersInitialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload.data };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setUsersLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUsersError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// ==================== BOOKMARKS SLICE ====================
const bookmarksInitialState = {
  bookmarks: [],
  loading: false
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState: bookmarksInitialState,
  reducers: {
    addBookmark: (state, action) => {
      if (!state.bookmarks.includes(action.payload)) {
        state.bookmarks.push(action.payload);
      }
    },
    removeBookmark: (state, action) => {
      state.bookmarks = state.bookmarks.filter(id => id !== action.payload);
    },
    clearBookmarks: (state) => {
      state.bookmarks = [];
    },
    setBookmarksLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

// ==================== ANALYTICS SLICE ====================
const analyticsInitialState = {
  totalViews: 0,
  totalDownloads: 0,
  topMantras: [],
  recentActivity: [],
  loading: false
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: analyticsInitialState,
  reducers: {
    setAnalytics: (state, action) => {
      return { ...state, ...action.payload };
    },
    addActivity: (state, action) => {
      state.recentActivity.unshift({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString()
      });
      if (state.recentActivity.length > 20) {
        state.recentActivity.pop();
      }
    },
    updateTotals: (state, action) => {
      const { views, downloads } = action.payload;
      if (views) state.totalViews += views;
      if (downloads) state.totalDownloads += downloads;
    },
    setAnalyticsLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

// ==================== THEME SLICE ====================
const themeInitialState = {
  darkMode: true,
  sidebarCollapsed: false
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: themeInitialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    }
  }
});

// ==================== NOTIFICATION SLICE ====================
const notificationInitialState = {
  notifications: [],
  unreadCount: 0
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: notificationInitialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        ...action.payload,
        read: false,
        createdAt: new Date().toISOString()
      });
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadCount -= 1;
        }
        state.notifications.splice(index, 1);
      }
    }
  }
});

// ==================== EXPORT ACTIONS ====================
export const {
  setLoading,
  setError,
  addMantra,
  updateMantra,
  deleteMantra,
  incrementViews,
  incrementDownloads,
  updateStatus,
  setFilters,
  clearFilters
} = mantraSlice.actions;

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setCurrentUser,
  clearCurrentUser,
  setUsersLoading,
  setUsersError
} = usersSlice.actions;

export const {
  addBookmark,
  removeBookmark,
  clearBookmarks,
  setBookmarksLoading
} = bookmarksSlice.actions;

export const {
  setAnalytics,
  addActivity,
  updateTotals,
  setAnalyticsLoading
} = analyticsSlice.actions;

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarCollapsed
} = themeSlice.actions;

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications,
  removeNotification
} = notificationSlice.actions;

// ==================== SELECTORS ====================
export const selectAllMantras = (state) => state.mantras.mantras;
export const selectPublishedMantras = (state) => state.mantras.mantras.filter(m => m.status === 'published');
export const selectDraftMantras = (state) => state.mantras.mantras.filter(m => m.status === 'draft');
export const selectMantrasLoading = (state) => state.mantras.loading;
export const selectMantrasError = (state) => state.mantras.error;
export const selectMantraFilters = (state) => state.mantras.filters;

export const selectFilteredMantras = (state) => {
  const { mantras, filters } = state.mantras;
  const { deity, language, search } = filters;
  
  return mantras.filter(mantra => {
    const matchesDeity = deity === 'all' || mantra.deity === deity;
    const matchesLanguage = language === 'all' || mantra.language === language;
    const matchesSearch = search === '' || 
      mantra.name.toLowerCase().includes(search.toLowerCase()) ||
      mantra.name_en.toLowerCase().includes(search.toLowerCase()) ||
      mantra.deity.toLowerCase().includes(search.toLowerCase());
    
    return matchesDeity && matchesLanguage && matchesSearch;
  });
};

export const selectMantraById = (state, id) => 
  state.mantras.mantras.find(m => m.id === id);

export const selectMantrasByDeity = (state, deity) =>
  state.mantras.mantras.filter(m => m.deity === deity);

export const selectMantrasByLanguage = (state, language) =>
  state.mantras.mantras.filter(m => m.language === language);

export const selectAllUsers = (state) => state.users.users;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;

export const selectBookmarks = (state) => state.bookmarks.bookmarks;
export const selectIsBookmarked = (state, id) => 
  state.bookmarks.bookmarks.includes(id);
export const selectBookmarksLoading = (state) => state.bookmarks.loading;

export const selectBookmarkedMantras = (state) => 
  state.mantras.mantras.filter(m => state.bookmarks.bookmarks.includes(m.id));

export const selectTotalViews = (state) => state.analytics.totalViews;
export const selectTotalDownloads = (state) => state.analytics.totalDownloads;
export const selectRecentActivity = (state) => state.analytics.recentActivity;
export const selectTopMantras = (state) => state.analytics.topMantras;
export const selectAnalyticsLoading = (state) => state.analytics.loading;

export const selectDarkMode = (state) => state.theme.darkMode;
export const selectSidebarCollapsed = (state) => state.theme.sidebarCollapsed;

export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;

// ==================== CONFIGURE STORE ====================
export const store = configureStore({
  reducer: {
    mantras: mantraSlice.reducer,
    users: usersSlice.reducer,
    bookmarks: bookmarksSlice.reducer,
    analytics: analyticsSlice.reducer,
    theme: themeSlice.reducer,
    notifications: notificationSlice.reducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

// ==================== DEFAULT EXPORT ====================
export default store;