import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// ==================== MAIN SCROLL TO TOP HOOK ====================
const useScrollToTop = (options = {}) => {
  const { 
    behavior = 'smooth', 
    onScrollComplete = null,
    excludePaths = [],
    threshold = 0 
  } = options;
  
  const { pathname } = useLocation();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const scrollToTop = useCallback((customBehavior = behavior) => {
    // Check if current path should be excluded
    if (excludePaths.includes(pathname)) {
      return;
    }

    setIsScrolling(true);
    
    window.scrollTo({
      top: threshold,
      left: 0,
      behavior: customBehavior
    });

    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set timeout to reset scrolling state
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      if (onScrollComplete) {
        onScrollComplete();
      }
    }, 500);
  }, [pathname, behavior, excludePaths, threshold, onScrollComplete]);

  // Scroll to top on route change
  useEffect(() => {
    scrollToTop();
  }, [pathname, scrollToTop]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return { scrollToTop, isScrolling };
};

// ==================== SCROLL TO ELEMENT HOOK ====================
export const useScrollToElement = () => {
  const scrollToElement = useCallback((elementId, options = {}) => {
    const {
      behavior = 'smooth',
      offset = 0,
      block = 'start',
      inline = 'nearest'
    } = options;

    const element = document.getElementById(elementId);
    
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: behavior
      });
      
      return true;
    }
    
    return false;
  }, []);

  const scrollToRef = useCallback((ref, options = {}) => {
    const {
      behavior = 'smooth',
      offset = 0
    } = options;

    if (ref && ref.current) {
      const elementPosition = ref.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: behavior
      });
      
      return true;
    }
    
    return false;
  }, []);

  return { scrollToElement, scrollToRef };
};

// ==================== SCROLL POSITION RESTORATION HOOK ====================
export const useScrollRestoration = (key = 'scroll-position') => {
  const { pathname } = useLocation();
  const [isRestored, setIsRestored] = useState(false);
  const scrollPositions = useRef({});

  // Save scroll position
  const saveScrollPosition = useCallback(() => {
    scrollPositions.current[pathname] = window.scrollY;
    sessionStorage.setItem(key, JSON.stringify(scrollPositions.current));
  }, [pathname, key]);

  // Restore scroll position
  const restoreScrollPosition = useCallback(() => {
    const saved = sessionStorage.getItem(key);
    if (saved) {
      scrollPositions.current = JSON.parse(saved);
      const savedPosition = scrollPositions.current[pathname];
      if (savedPosition && savedPosition > 0) {
        setTimeout(() => {
          window.scrollTo({
            top: savedPosition,
            behavior: 'auto'
          });
          setIsRestored(true);
        }, 100);
      }
    }
  }, [pathname, key]);

  // Save position before page unload
  useEffect(() => {
    window.addEventListener('beforeunload', saveScrollPosition);
    return () => window.removeEventListener('beforeunload', saveScrollPosition);
  }, [saveScrollPosition]);

  // Save position on scroll
  useEffect(() => {
    const handleScroll = () => {
      saveScrollPosition();
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [saveScrollPosition]);

  // Restore position on route change
  useEffect(() => {
    restoreScrollPosition();
  }, [pathname, restoreScrollPosition]);

  return { isRestored, saveScrollPosition, restoreScrollPosition };
};

// ==================== SCROLL DIRECTION HOOK ====================
export const useScrollDirection = (threshold = 10) => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [scrollY, setScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      setScrollY(currentScrollY);
      setIsAtTop(currentScrollY <= threshold);
      setIsAtBottom(currentScrollY + windowHeight >= documentHeight - threshold);
      
      if (Math.abs(currentScrollY - lastScrollYRef.current) > threshold) {
        if (currentScrollY > lastScrollYRef.current && currentScrollY > threshold) {
          setScrollDirection('down');
        } else if (currentScrollY < lastScrollYRef.current) {
          setScrollDirection('up');
        }
      }
      
      lastScrollYRef.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { scrollDirection, scrollY, isAtTop, isAtBottom };
};

// ==================== INFINITE SCROLL HOOK ====================
export const useInfiniteScroll = (callback, options = {}) => {
  const {
    threshold = 100,
    enabled = true,
    dependencies = []
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      if (loadingRef.current || !hasMore) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - threshold) {
        loadingRef.current = true;
        setIsLoading(true);
        
        Promise.resolve(callback()).finally(() => {
          loadingRef.current = false;
          setIsLoading(false);
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, threshold, enabled, hasMore, ...dependencies]);

  return { isLoading, setIsLoading, hasMore, setHasMore };
};

// ==================== SMOOTH SCROLL TO SECTION HOOK ====================
export const useSmoothScroll = () => {
  const [activeSection, setActiveSection] = useState('');
  const sectionRefs = useRef({});

  const registerSection = useCallback((id, ref) => {
    sectionRefs.current[id] = ref;
  }, []);

  const scrollToSection = useCallback((id, options = {}) => {
    const {
      behavior = 'smooth',
      offset = 80,
      onComplete = null
    } = options;

    const section = sectionRefs.current[id] || document.getElementById(id);
    
    if (section) {
      const elementPosition = section.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: behavior
      });

      setActiveSection(id);
      
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
      
      return true;
    }
    
    return false;
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const [id, ref] of Object.entries(sectionRefs.current)) {
        if (ref && ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { registerSection, scrollToSection, activeSection };
};

// ==================== SCROLL PROGRESS HOOK ====================
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const maxScroll = documentHeight - windowHeight;
      const percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      
      setProgress(scrollTop);
      setScrollPercentage(Math.round(percentage));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, scrollPercentage };
};

// ==================== DETECT IF ELEMENT IS VISIBLE HOOK ====================
export const useIsVisible = (ref, options = { threshold: 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);
  
  return isVisible;
};

// ==================== PREVENT SCROLL HOOK ====================
export const usePreventScroll = (shouldPrevent = false) => {
  useEffect(() => {
    if (shouldPrevent) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [shouldPrevent]);
};

// ==================== SCROLL LOCK HOOK (for modals) ====================
export const useScrollLock = (isLocked = false) => {
  useEffect(() => {
    if (isLocked) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLocked]);
};

// ==================== SCROLL TO BOTTOM HOOK ====================
export const useScrollToBottom = () => {
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: behavior
    });
  }, []);

  return { scrollToBottom };
};

// ==================== SCROLL TO TOP BUTTON COMPONENT HOOK ====================
export const useScrollToTopButton = (threshold = 300) => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollToTop } = useScrollToTop({ behavior: 'smooth' });

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { isVisible, scrollToTop };
};

export default useScrollToTop;