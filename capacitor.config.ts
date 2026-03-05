import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.15856148b70043b6ae6156314685bad5',
  appName: 'umrah-ease-jeddah',
  webDir: 'dist',
  server: {
    url: 'https://15856148-b700-43b6-ae61-56314685bad5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;