import { useEffect } from 'react';

const AnalyticsTracker = ({ trackingId, apiEndpoint }) => {
  useEffect(() => {
    // Initialize analytics on component mount
    const sessionId = getSessionId();
    const visitorId = getVisitorId();
    
    // Detect device type
    const deviceInfo = getDeviceInfo();

    // Track initial page view
    const pageData = {
      trackingId,
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      sessionId,
      visitorId,
      // Include device type information
      deviceType: deviceInfo.deviceType,
      isMobile: deviceInfo.isMobile,
      deviceBrand: deviceInfo.brand,
      browserName: deviceInfo.browserName
    };

    sendPageView(pageData);

    // Set up event tracking
    setupEventTracking(sessionId, visitorId, trackingId, apiEndpoint, deviceInfo);
    
    // Set up scroll depth tracking
    setupScrollTracking(sessionId, visitorId, trackingId, apiEndpoint, deviceInfo);
    
    // Track orientation changes on mobile devices
    if (deviceInfo.isMobile) {
      setupOrientationTracking(sessionId, visitorId, trackingId, apiEndpoint);
    }

    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      if (deviceInfo.isMobile) {
        window.removeEventListener('orientationchange', handleOrientationChange);
      }
    };
  }, [trackingId, apiEndpoint]);

  // Device detection function
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Mobile detection regex patterns
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobile = mobileRegex.test(userAgent) || 
                    (window.innerWidth <= 768) || 
                    ('ontouchstart' in document.documentElement);
    
    // Determine device type
    const deviceType = isMobile ? 'mobile' : 'desktop';
    
    // Determine browser name
    let browserName = 'unknown';
    if (/firefox/i.test(userAgent)) browserName = 'firefox';
    else if (/chrome/i.test(userAgent)) browserName = 'chrome';
    else if (/safari/i.test(userAgent)) browserName = 'safari';
    else if (/msie|trident/i.test(userAgent)) browserName = 'ie';
    else if (/edge/i.test(userAgent)) browserName = 'edge';
    
    // Determine device brand (simplified)
    let brand = 'unknown';
    if (/iphone|ipad|ipod/i.test(userAgent)) brand = 'apple';
    else if (/android/i.test(userAgent)) brand = 'android';
    else if (/windows/i.test(userAgent)) brand = 'windows';
    else if (/macintosh|mac os/i.test(userAgent)) brand = 'mac';
    
    return {
      deviceType,
      isMobile,
      browserName,
      brand,
      orientation: isMobile ? (window.innerHeight > window.innerWidth ? 'portrait' : 'landscape') : null
    };
  };

  // Helper functions
  const getSessionId = () => {
    let id = sessionStorage.getItem('analytics_session_id');
    if (!id) {
      id = 'session_' + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('analytics_session_id', id);
    }
    return id;
  };

  const getVisitorId = () => {
    let id = localStorage.getItem('analytics_visitor_id');
    if (!id) {
      id = 'visitor_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('analytics_visitor_id', id);
    }
    return id;
  };

  const sendPageView = (data) => {
    fetch(`${apiEndpoint}/pageview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      keepalive: true
    }).catch(err => console.error('Error sending analytics data:', err));
  };

  const sendEvent = (eventData) => {
    fetch(`${apiEndpoint}/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData),
      keepalive: true
    }).catch(err => console.error('Error sending event:', err));
  };

  // Click tracking handler
  const handleClick = (e) => {
    // Find the closest interactive element
    let target = e.target;
    let depth = 0;
    const maxDepth = 3; // Only search up to 3 levels up
    
    while (target && depth < maxDepth) {
      // Check if it's an interactive element worth tracking
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        (target.tagName === 'INPUT' && target.type === 'submit') ||
        target.hasAttribute('data-track')
      ) {
        const sessionId = sessionStorage.getItem('analytics_session_id');
        const visitorId = localStorage.getItem('analytics_visitor_id');
        const deviceInfo = getDeviceInfo();
        
        // Get tracking label - prefer data attributes, fallback to text/id/class
        const label = 
          target.getAttribute('data-track-label') || 
          target.innerText || 
          target.id || 
          target.className || 
          `${target.tagName.toLowerCase()}_element`;
        
        const eventData = {
          trackingId,
          url: window.location.href,
          eventType: 'click',
          eventCategory: target.getAttribute('data-track-category') || 'user_interaction',
          eventAction: 'click',
          eventLabel: label,
          element: target.tagName.toLowerCase(),
          elementId: target.id,
          elementClass: target.className,
          sessionId,
          visitorId,
          deviceType: deviceInfo.deviceType,
          isMobile: deviceInfo.isMobile
        };
        
        sendEvent(eventData);
        break;
      }
      
      // Move up the DOM tree
      target = target.parentElement;
      depth++;
    }
  };

  // Scroll depth tracking
  let scrollDepths = [25, 50, 75, 100];
  let reachedDepths = [];

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calculate scroll percentage
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    // Check if user has reached new scroll depths
    scrollDepths.forEach(depth => {
      if (scrollPercentage >= depth && !reachedDepths.includes(depth)) {
        reachedDepths.push(depth);
        
        const sessionId = sessionStorage.getItem('analytics_session_id');
        const visitorId = localStorage.getItem('analytics_visitor_id');
        const deviceInfo = getDeviceInfo();
        
        const eventData = {
          trackingId,
          url: window.location.href,
          eventType: 'scroll',
          eventCategory: 'user_engagement',
          eventAction: 'scroll_depth',
          eventLabel: `${depth}%`,
          scrollDepth: depth,
          sessionId,
          visitorId,
          deviceType: deviceInfo.deviceType,
          isMobile: deviceInfo.isMobile
        };
        
        sendEvent(eventData);
      }
    });
  };

  // Orientation change handler for mobile
  const handleOrientationChange = () => {
    const sessionId = sessionStorage.getItem('analytics_session_id');
    const visitorId = localStorage.getItem('analytics_visitor_id');
    const deviceInfo = getDeviceInfo();
    
    // Give the browser a moment to adjust dimensions
    setTimeout(() => {
      const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      
      const eventData = {
        trackingId,
        url: window.location.href,
        eventType: 'orientation',
        eventCategory: 'device_interaction',
        eventAction: 'orientation_change',
        eventLabel: orientation,
        sessionId,
        visitorId,
        deviceType: deviceInfo.deviceType,
        isMobile: deviceInfo.isMobile,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
      };
      
      sendEvent(eventData);
    }, 300);
  };

  const setupEventTracking = (sessionId, visitorId, trackingId, apiEndpoint, deviceInfo) => {
    document.addEventListener('click', handleClick);
  };

  const setupScrollTracking = (sessionId, visitorId, trackingId, apiEndpoint, deviceInfo) => {
    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
  };

  const setupOrientationTracking = (sessionId, visitorId, trackingId, apiEndpoint) => {
    window.addEventListener('orientationchange', handleOrientationChange);
  };

  // The component doesn't render anything
  return null;
};

export default AnalyticsTracker;