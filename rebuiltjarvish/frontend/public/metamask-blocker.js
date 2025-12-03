// MetaMask Blocker Script - Load before any other scripts
(function() {
  'use strict';
  
  console.log('🛡️ MetaMask blocker initialized');
  
  // Block MetaMask injection
  if (typeof window !== 'undefined') {
    // Override ethereum object if it exists
    Object.defineProperty(window, 'ethereum', {
      get: function() {
        console.warn('🚫 MetaMask access blocked - not needed for this application');
        return undefined;
      },
      set: function(value) {
        console.warn('🚫 MetaMask injection blocked');
        // Don't actually set the value
      },
      configurable: false
    });
    
    // Block web3 as well
    Object.defineProperty(window, 'web3', {
      get: function() {
        console.warn('🚫 Web3 access blocked');
        return undefined;
      },
      set: function(value) {
        console.warn('🚫 Web3 injection blocked');
      },
      configurable: false
    });
  }
  
  console.log('✅ MetaMask and Web3 access successfully blocked');
})();