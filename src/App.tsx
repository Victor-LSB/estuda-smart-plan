import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { StudyProvider } from "@/context/StudyContext";
import Layout from "@/components/Layout";
import HomeScreen from "@/components/screens/HomeScreen";
import StudyScreen from "@/components/screens/StudyScreen";
import RegisterActivityScreen from "@/components/screens/RegisterActivityScreen";
import CalendarScreen from "@/components/screens/CalendarScreen";
import AnalyticsScreen from "@/components/screens/AnalyticsScreen";
import AuthScreen from "@/components/screens/AuthScreen";
import { NavigationTab } from "@/types";
import { StatusBar, Style } from '@capacitor/status-bar'; // Importe o StatusBar

const queryClient = new QueryClient();

const AppContent = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [showRegisterActivity, setShowRegisterActivity] = useState(false);
  const { user, loading } = useAuth();

  // Efeito para configurar a cor da barra de status
  useEffect(() => {
    const setStatusBarColor = async () => {
      await StatusBar.setBackgroundColor({ color: '#4DA6FF' }); // Cor azul primária
      await StatusBar.setStyle({ style: Style.Dark }); // Ícones brancos
    };

    // Apenas executa em ambiente mobile (Capacitor)
    if (typeof window !== 'undefined' && (window as any).Capacitor?.isPluginAvailable('StatusBar')) {
      setStatusBarColor();
    }
  }, []);

  const handleTabChange = (tab: NavigationTab) => {
    setCurrentTab(tab);
    setShowRegisterActivity(false);
  };

  // ... resto do código continua igual ...
  const handleAddActivity = () => {
    setShowRegisterActivity(true);
  };

  const handleBackFromRegister = () => {
    setShowRegisterActivity(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderScreen = () => {
    if (showRegisterActivity) {
      return <RegisterActivityScreen onBack={handleBackFromRegister} />;
    }

    switch (currentTab) {
      case 'home':
        return <HomeScreen onTabChange={handleTabChange} />;
      case 'study':
        return <StudyScreen onAddActivity={handleAddActivity} />;
      case 'calendar':
        return <CalendarScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      default:
        return <HomeScreen onTabChange={handleTabChange} />;
    }
  };

  return (
    <Layout 
      currentTab={currentTab} 
      onTabChange={handleTabChange}
    >
      {renderScreen()}
    </Layout>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StudyProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </StudyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;