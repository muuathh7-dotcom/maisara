// Google Analytics, Google Ads & TikTok Pixel tracking functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    ttq: {
      track: (event: string, properties?: Record<string, any>) => void;
      page: () => void;
      identify: (properties: Record<string, any>) => void;
    };
  }
}

// Configuration - Replace with your actual Google Ads Conversion ID
const GOOGLE_ADS_ID = 'AW-17485794047';
const GA_ID = 'G-6B8662Z89L';

// Track page views
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_ID, {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      send_to: GA_ID
    });
  }
};

// Google Ads Conversion Tracking
export const trackGoogleAdsConversion = (conversionLabel: string, value?: number, currency = 'SAR') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${conversionLabel}`,
      value: value,
      currency: currency,
    });
  }
};

// TikTok Pixel Tracking
export const trackTikTokEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(eventName, properties);
  }
};

// Conversion tracking events
export const trackConversion = {
  // Track when user selects a package
  packageSelected: (packageId: string, packageTitle: string, price: number) => {
    trackEvent('select_item', {
      item_id: packageId,
      item_name: packageTitle,
      item_category: 'package',
      value: price,
      currency: 'SAR'
    });
    
    // TikTok Pixel tracking
    trackTikTokEvent('ViewContent', {
      content_type: 'product',
      content_id: packageId,
      content_name: packageTitle,
      value: price,
      currency: 'SAR'
    });
  },

  // Track when user starts booking process
  beginCheckout: (packageId: string, value: number) => {
    trackEvent('begin_checkout', {
      currency: 'SAR',
      value: value,
      items: [{
        item_id: packageId,
        item_name: 'Umrah Package',
        item_category: 'package',
        price: value,
        quantity: 1
      }]
    });
    
    // Google Ads micro-conversion for checkout start
    trackGoogleAdsConversion('BEGIN_CHECKOUT_LABEL', value, 'SAR');
    
    // TikTok Pixel tracking
    trackTikTokEvent('InitiateCheckout', {
      content_type: 'product',
      content_id: packageId,
      value: value,
      currency: 'SAR'
    });
  },

  // Track payment method selection
  paymentMethodSelected: (method: string, value: number) => {
    trackEvent('add_payment_info', {
      currency: 'SAR',
      value: value,
      payment_type: method
    });
    
    // TikTok Pixel tracking
    trackTikTokEvent('AddPaymentInfo', {
      value: value,
      currency: 'SAR'
    });
  },

  // Track purchase completion
  purchase: (transactionId: string, value: number, packageId: string) => {
    // Google Analytics Enhanced Ecommerce
    trackEvent('purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'SAR',
      items: [{
        item_id: packageId,
        item_name: 'Umrah Package',
        item_category: 'package',
        price: value,
        quantity: 1
      }]
    });
    
    // Google Ads Conversion Tracking (replace 'CONVERSION_LABEL' with your actual label)
    trackGoogleAdsConversion('PURCHASE_CONVERSION_LABEL', value, 'SAR');
    
    // TikTok Pixel tracking
    trackTikTokEvent('PlaceAnOrder', {
      content_type: 'product',
      content_id: packageId,
      value: value,
      currency: 'SAR'
    });
  },

  // Track form submissions
  formSubmission: (formName: string, step?: string) => {
    trackEvent('generate_lead', {
      form_name: formName,
      step: step || 'complete'
    });
    
    // TikTok Pixel tracking
    trackTikTokEvent('SubmitForm', {
      form_name: formName
    });
  },

  // Track button clicks
  buttonClick: (buttonName: string, location: string) => {
    trackEvent('click', {
      button_name: buttonName,
      click_location: location
    });
    
    // TikTok Pixel tracking
    trackTikTokEvent('ClickButton', {
      button_name: buttonName,
      click_location: location
    });
  }
};

// Track traffic sources and UTM parameters
export const trackTrafficSource = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  
  if (utmSource || utmMedium || utmCampaign) {
    trackEvent('campaign_details', {
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign,
      page: window.location.pathname
    });
  }
};