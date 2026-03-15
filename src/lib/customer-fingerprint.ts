// UTM parameter keys
const UTM_STORAGE_KEY = 'maisara_utms';

// Capture UTMs from URL and persist to localStorage (only overwrite if new UTMs exist)
export const captureAndStoreUTMs = () => {
  const params = new URLSearchParams(window.location.search);
  const source   = params.get('utm_source');
  const medium   = params.get('utm_medium');
  const campaign = params.get('utm_campaign');
  const content  = params.get('utm_content');
  const term     = params.get('utm_term');

  if (source || medium || campaign || content || term) {
    const utms = { utm_source: source, utm_medium: medium, utm_campaign: campaign, utm_content: content, utm_term: term };
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utms));
  }
};

// Read stored UTMs (returns null values if none stored)
export const getStoredUTMs = () => {
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, string | null>;
  } catch {}
  return { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null };
};

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