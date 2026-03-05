// Utility functions for generating customer fingerprint and tracking data
export const generateCustomerFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Create a simple hash of the fingerprint
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
};

export const getCustomerTrackingData = () => {
  return {
    customer_fingerprint: generateCustomerFingerprint(),
    customer_ip: null, // Will be captured server-side if needed
    customer_user_agent: navigator.userAgent,
    customer_screen_resolution: `${screen.width}x${screen.height}`,
    customer_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    customer_language: navigator.language
  };
};