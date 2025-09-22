import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StudyProvider } from "@/context/StudyContext";
import Layout from "@/components/Layout";
import HomeScreen from "@/components/screens/HomeScreen";
import StudyScreen from "@/components/screens/StudyScreen";
import RegisterActivityScreen from "@/components/screens/RegisterActivityScreen";
import CalendarScreen from "@/components/screens/CalendarScreen";
import AnalyticsScreen from "@/components/screens/AnalyticsScreen";
import { NavigationTab } from "@/types";

const queryClient = new QueryClient();

const App = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [showRegisterActivity, setShowRegisterActivity] = useState(false);

  const handleTabChange = (tab: NavigationTab) => {
    setCurrentTab(tab);
    setShowRegisterActivity(false);
  };

  const handleAddActivity = () => {
    setShowRegisterActivity(true);
  };

  const handleBackFromRegister = () => {
    setShowRegisterActivity(false);
  };

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
    <QueryClientProvider client={queryClient}>
      <StudyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Layout 
            currentTab={currentTab} 
            onTabChange={handleTabChange}
          >
            {renderScreen()}
          </Layout>
        </TooltipProvider>
      </StudyProvider>
    </QueryClientProvider>
  );
};

export default App;
