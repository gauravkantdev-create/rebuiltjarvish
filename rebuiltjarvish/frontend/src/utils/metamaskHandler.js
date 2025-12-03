// MetaMask Handler - Prevents MetaMask connection errors
export const preventMetaMaskErrors = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;

  // Override MetaMask connection attempts
  if (window.ethereum) {
    const originalConnect = window.ethereum.request;
    
    window.ethereum.request = function(args) {
      // Block MetaMask connection requests
      if (args.method === 'eth_requestAccounts' || args.method === 'wallet_requestPermissions') {
        console.warn('🚫 MetaMask connection blocked - not needed for this app');
        return Promise.reject(new Error('MetaMask connection disabled for this application'));
      }
      
      // Allow other requests to pass through
      return originalConnect.call(this, args);
    };
  }

  // Prevent inpage.js errors
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('MetaMask') || message.includes('inpage.js')) {
      console.warn('🚫 MetaMask error suppressed:', message);
      return;
    }
    originalError.apply(console, args);
  };
};

// Clean up MetaMask listeners
export const cleanupMetaMask = () => {
  if (typeof window === 'undefined') return;
  
  if (window.ethereum && window.ethereum.removeAllListeners) {
    try {
      window.ethereum.removeAllListeners();
    } catch (error) {
      console.warn('Could not remove MetaMask listeners:', error);
    }
  }
};