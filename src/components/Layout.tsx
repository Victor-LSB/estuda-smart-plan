import React from 'react';
import { Home, BookOpen, Calendar, BarChart3 } from 'lucide-react';
import { NavigationTab } from '@/types';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentTab, onTabChange }) => {
  const navItems = [
    { id: 'home' as NavigationTab, icon: Home, label: 'Home' },
    { id: 'study' as NavigationTab, icon: BookOpen, label: 'Study' },
    { id: 'calendar' as NavigationTab, icon: Calendar, label: 'Calendar' },
    { id: 'analytics' as NavigationTab, icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Conteúdo Principal com espaço extra para a barra e o botão */}
      <div className="flex-1 pb-32">
        {children}
      </div>

      {/* Barra de Navegação Inferior com a cor azul */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-primary text-primary-foreground pb-safe-bottom">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all w-20 h-16",
                  isActive
                    ? "bg-primary-dark/50 text-primary-foreground" // Estilo para ATIVO
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-dark/30" // Estilo para INATIVO
                )}
              >
                <Icon size={24} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout;