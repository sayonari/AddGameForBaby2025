// Viewport scaling utility
export const calculateScale = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Always use portrait dimensions to maintain consistent layout
  const designWidth = 414; // iPhone Pro Max width
  const designHeight = 896; // iPhone Pro Max height
  const paddingVertical = 20; // Safe area padding
  
  // Calculate scale factors with padding
  const availableHeight = viewportHeight - (paddingVertical * 2);
  const scaleX = viewportWidth / designWidth;
  const scaleY = availableHeight / designHeight;
  
  // Use the smaller scale to ensure content fits
  const scale = Math.min(scaleX, scaleY);
  
  // Apply limits to prevent excessive scaling
  const minScale = 0.5;
  const maxScale = 1; // Don't scale up beyond original size
  
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