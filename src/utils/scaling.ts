// Viewport scaling utility
export const calculateScale = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const isPortrait = viewportHeight > viewportWidth;
  
  // Design dimensions based on orientation
  const designWidth = isPortrait ? 768 : 1024;
  const designHeight = isPortrait ? 1024 : 768;
  
  // Calculate scale factors
  const scaleX = viewportWidth / designWidth;
  const scaleY = viewportHeight / designHeight;
  
  // Use the smaller scale to ensure content fits
  const scale = Math.min(scaleX, scaleY);
  
  // Apply limits to prevent excessive scaling
  const minScale = 0.5;
  const maxScale = 2;
  
  return Math.max(minScale, Math.min(maxScale, scale));
};

// Apply scaling to the app container
export const applyScaling = () => {
  const container = document.querySelector('.app-container') as HTMLElement;
  if (!container) return;
  
  const scale = calculateScale();
  container.style.transform = `scale(${scale})`;
  
  // Update CSS variables for responsive adjustments
  const root = document.documentElement;
  root.style.setProperty('--viewport-scale', scale.toString());
};

// Initialize scaling and handle resize events
export const initializeScaling = () => {
  // Apply initial scaling
  applyScaling();
  
  // Handle resize events with debouncing
  let resizeTimeout: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(applyScaling, 100);
  });
  
  // Handle orientation changes
  window.addEventListener('orientationchange', () => {
    setTimeout(applyScaling, 300); // Delay to ensure dimensions are updated
  });
};