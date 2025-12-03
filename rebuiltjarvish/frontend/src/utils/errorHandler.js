// Global Error Handler for MetaMask and other errors
export const setupGlobalErrorHandler = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // Suppress MetaMask-related errors
    if (error && typeof error === 'object') {
      const errorMessage = error.message || error.toString();
      
      if (errorMessage.includes('MetaMask') || 
          errorMessage.includes('inpage.js') ||
          errorMessage.includes('Failed to connect to MetaMask') ||
          errorMessage.includes('MetaMask extension not found')) {
        
        console.warn('🚫 MetaMask error suppressed:', errorMessage);
        event.preventDefault(); // Prevent the error from being logged
        return;
      }
    }
  });

  // Handle regular JavaScript errors
  window.addEventListener('error', (event) => {
    const error = event.error;
    
    if (error && typeof error === 'object') {
      const errorMessage = error.message || error.toString();
      
      if (errorMessage.includes('MetaMask') || 
          errorMessage.includes('inpage.js') ||
          event.filename?.includes('inpage.js')) {
        
        console.warn('🚫 MetaMask script error suppressed:', errorMessage);
        event.preventDefault();
        return;
      }
    }
  });

  console.log('✅ Global error handler setup complete - MetaMask errors will be suppressed');
};