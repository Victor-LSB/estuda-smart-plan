import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.df628a033d26436eb0265455df12555a',
  appName: 'estuda-smart-plan',
  webDir: 'dist',
  server: {}, // Removido o conteúdo do servidor
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#4DA6FF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;