// Device detection and configuration utilities
import React from 'react';

export const deviceConfig = {
  // Detect device type
  isMobile: () => {
    if (typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (typeof window !== 'undefined' && window.innerWidth <= 768);
  },
  
  isTablet: () => {
    if (typeof navigator === 'undefined') return false;
    return /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent) ||
           (typeof window !== 'undefined' && window.innerWidth > 768 && window.innerWidth <= 1024);
  },
  
  isDesktop: () => {
    return !deviceConfig.isMobile() && !deviceConfig.isTablet();
  },
  
  isIOS: () => {
    if (typeof navigator === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },
  
  isAndroid: () => {
    if (typeof navigator === 'undefined') return false;
    return /Android/.test(navigator.userAgent);
  },
  
  isSafari: () => {
    if (typeof navigator === 'undefined') return false;
    return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  },
  
  isChrome: () => {
    if (typeof navigator === 'undefined') return false;
    return /Chrome/.test(navigator.userAgent);
  },
  
  isFirefox: () => {
    if (typeof navigator === 'undefined') return false;
    return /Firefox/.test(navigator.userAgent);
  },
  
  // Get device-specific settings
  getSettings: () => {
    // Handle SSR case
    if (typeof window === 'undefined') {
      return {
        // Touch settings
        touchAction: 'auto',
        preventZoom: false,
        
        // Speech recognition settings
        recognitionLang: 'en-US',
        recognitionContinuous: true,
        recognitionInterimResults: true,
        
        // Animation settings
        reduceMotion: false,
        animationDuration: '0.5s',
        
        // Performance settings
        enableGpuAcceleration: true,
        maxParticles: 50,
        
        // UI settings
        buttonSize: '36px',
        fontSize: {
          xs: '0.625rem', sm: '0.75rem', base: '0.875rem', lg: '1rem',
          xl: '1.125rem', '2xl': '1.25rem', '3xl': '1.5rem'
        },
        
        // Layout settings
        cardWidth: '380px',
        cardHeight: '460px',
        
        // Gesture settings
        swipeThreshold: 75,
        swipeTimeout: 400,
        doubleTapTimeout: 500,
        
        // Network settings
        enableOfflineMode: true,
        cacheStrategy: 'networkFirst',
        
        // Accessibility
        enableHighContrast: false,
        enableLargeText: false
      };
    }
    
    const isMobile = deviceConfig.isMobile();
    const isTablet = deviceConfig.isTablet();
    const isIOS = deviceConfig.isIOS();
    const isAndroid = deviceConfig.isAndroid();
    
    return {
      // Touch settings
      touchAction: isMobile ? 'pan-y pinch-zoom' : 'auto',
      preventZoom: isMobile && isIOS,
      
      // Speech recognition settings
      recognitionLang: isIOS ? 'en-US' : 'en-US',
      recognitionContinuous: true,
      recognitionInterimResults: true,
      
      // Animation settings
      reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      animationDuration: isMobile ? '0.3s' : '0.5s',
      
      // Performance settings
      enableGpuAcceleration: !isMobile || window.devicePixelRatio <= 2,
      maxParticles: isMobile ? 20 : 50,
      
      // UI settings
      buttonSize: isMobile ? '44px' : '36px',
      fontSize: {
        xs: isMobile ? '0.75rem' : '0.625rem',
        sm: isMobile ? '0.875rem' : '0.75rem',
        base: isMobile ? '1rem' : '0.875rem',
        lg: isMobile ? '1.125rem' : '1rem',
        xl: isMobile ? '1.25rem' : '1.125rem',
        '2xl': isMobile ? '1.5rem' : '1.25rem',
        '3xl': isMobile ? '2rem' : '1.5rem'
      },
      
      // Layout settings
      cardWidth: isMobile ? '280px' : isTablet ? '320px' : '380px',
      cardHeight: isMobile ? '350px' : isTablet ? '400px' : '460px',
      
      // Gesture settings
      swipeThreshold: isMobile ? 50 : 75,
      swipeTimeout: isMobile ? 300 : 400,
      doubleTapTimeout: isMobile ? 300 : 500,
      
      // Network settings
      enableOfflineMode: true,
      cacheStrategy: isMobile ? 'cacheFirst' : 'networkFirst',
      
      // Accessibility
      enableHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      enableLargeText: window.matchMedia('(prefers-reduced-data: reduce)').matches
    };
  },
  
  // Get viewport information
  getViewport: () => {
    // Handle SSR case
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        dvh: 768,
        dvw: 1024,
        safeArea: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
        orientation: 'landscape'
      };
    }
    
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      dvh: window.visualViewport?.height || window.innerHeight,
      dvw: window.visualViewport?.width || window.innerWidth,
      safeArea: {
        top: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)'),
        bottom: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)'),
        left: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-left)'),
        right: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-right)')
      },
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    };
  },
  
  // Check for touch support
  hasTouchSupport: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  
  // Check for speech recognition support
  hasSpeechRecognition: () => {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window || 'mozSpeechRecognition' in window;
  },
  
  // Check for speech synthesis support
  hasSpeechSynthesis: () => {
    return 'speechSynthesis' in window;
  },
  
  // Check for PWA support
  hasPwaSupport: () => {
    return 'serviceWorker' in navigator && 'manifest' in document;
  },
  
  // Check for fullscreen support
  hasFullscreenSupport: () => {
    return document.fullscreenEnabled || 
           document.webkitFullscreenEnabled || 
           document.mozFullScreenEnabled ||
           document.msFullscreenEnabled;
  },
  
  // Get optimized settings based on device capabilities
  getOptimizedSettings: () => {
    const baseSettings = deviceConfig.getSettings();
    const hasTouch = deviceConfig.hasTouchSupport();
    const hasSpeech = deviceConfig.hasSpeechRecognition();
    const hasPwa = deviceConfig.hasPwaSupport();
    
    return {
      ...baseSettings,
      // Enable/disable features based on support
      enableTouchGestures: hasTouch,
      enableVoiceInput: hasSpeech,
      enableVoiceOutput: deviceConfig.hasSpeechSynthesis(),
      enablePwaFeatures: hasPwa,
      enableFullscreen: deviceConfig.hasFullscreenSupport(),
      
      // Performance optimizations
      enableAnimations: !baseSettings.reduceMotion,
      enableParticles: baseSettings.enableGpuAcceleration && !baseSettings.reduceMotion,
      
      // UI optimizations
      compactMode: deviceConfig.isMobile(),
      enhancedTouch: hasTouch,
      
      // Feature flags
      features: {
        voiceCommands: hasSpeech,
        touchGestures: hasTouch,
        pwaInstall: hasPwa,
        fullscreenMode: deviceConfig.hasFullscreenSupport(),
        offlineMode: true,
        pushNotifications: 'Notification' in window,
        cameraAccess: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
        microphoneAccess: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
      }
    };
  }
};

// Hook for using device config in components
export const useDeviceConfig = () => {
  const [config, setConfig] = React.useState(() => {
    // Return fallback config for SSR/initial render
    if (typeof window === 'undefined') {
      return {
        enableAnimations: true,
        compactMode: false,
        enhancedTouch: false,
        reduceMotion: false,
        enableGpuAcceleration: true,
        enableTouchGestures: false,
        enableVoiceInput: false,
        enableVoiceOutput: false,
        enablePwaFeatures: false,
        enableFullscreen: false,
        enableParticles: false,
        touchAction: 'auto',
        preventZoom: false,
        recognitionLang: 'en-US',
        recognitionContinuous: true,
        recognitionInterimResults: true,
        animationDuration: '0.5s',
        maxParticles: 50,
        buttonSize: '36px',
        fontSize: {
          xs: '0.625rem', sm: '0.75rem', base: '0.875rem', lg: '1rem',
          xl: '1.125rem', '2xl': '1.25rem', '3xl': '1.5rem'
        },
        cardWidth: '380px',
        cardHeight: '460px',
        swipeThreshold: 75,
        swipeTimeout: 400,
        doubleTapTimeout: 500,
        enableOfflineMode: true,
        cacheStrategy: 'networkFirst',
        enableHighContrast: false,
        enableLargeText: false
      };
    }
    
    try {
      return deviceConfig.getOptimizedSettings();
    } catch (error) {
      console.error('Error getting device config:', error);
      // Return fallback config
      return {
        enableAnimations: true,
        compactMode: false,
        enhancedTouch: false,
        reduceMotion: false,
        enableGpuAcceleration: true,
        enableTouchGestures: false,
        enableVoiceInput: false,
        enableVoiceOutput: false,
        enablePwaFeatures: false,
        enableFullscreen: false,
        enableParticles: false,
        touchAction: 'auto',
        preventZoom: false,
        recognitionLang: 'en-US',
        recognitionContinuous: true,
        recognitionInterimResults: true,
        animationDuration: '0.5s',
        maxParticles: 50,
        buttonSize: '36px',
        fontSize: {
          xs: '0.625rem', sm: '0.75rem', base: '0.875rem', lg: '1rem',
          xl: '1.125rem', '2xl': '1.25rem', '3xl': '1.5rem'
        },
        cardWidth: '380px',
        cardHeight: '460px',
        swipeThreshold: 75,
        swipeTimeout: 400,
        doubleTapTimeout: 500,
        enableOfflineMode: true,
        cacheStrategy: 'networkFirst',
        enableHighContrast: false,
        enableLargeText: false
      };
    }
  });
  
  const [viewport, setViewport] = React.useState(() => {
    // Return fallback viewport for SSR/initial render
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        dvh: 768,
        dvw: 1024,
        safeArea: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
        orientation: 'landscape'
      };
    }
    
    try {
      return deviceConfig.getViewport();
    } catch (error) {
      console.error('Error getting viewport:', error);
      // Return fallback viewport
      return {
        width: 1024,
        height: 768,
        dvh: 768,
        dvw: 1024,
        safeArea: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
        orientation: 'landscape'
      };
    }
  });
  
  React.useEffect(() => {
    const handleResize = () => {
      try {
        setViewport(deviceConfig.getViewport());
        setConfig(deviceConfig.getOptimizedSettings());
      } catch (error) {
        console.error('Error updating device config:', error);
      }
    };
    
    const handleOrientationChange = () => {
      setTimeout(handleResize, 100); // Delay for orientation change
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleOrientationChange);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleOrientationChange);
      }
    };
  }, []);
  
  return { config, viewport };
};

export default deviceConfig;
