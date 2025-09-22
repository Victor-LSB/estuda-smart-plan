import React from 'react';
import { BookOpen, Calendar, BarChart3, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudy } from '@/context/StudyContext';
import { NavigationTab } from '@/types';

interface HomeScreenProps {
  onTabChange: (tab: NavigationTab) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onTabChange }) => {
  const { getNextActivity, getTotalStudyHours, getCompletionRate } = useStudy();
  const nextActivity = getNextActivity();

  const quickAccessItems = [
    {
      id: 'study' as NavigationTab,
      icon: BookOpen,
      label: 'Study',
      color: 'bg-primary',
    },
    {
      id: 'calendar' as NavigationTab,
      icon: Calendar,
      label: 'Calendar',
      color: 'bg-secondary',
    },
    {
      id: 'analytics' as NavigationTab,
      icon: BarChart3,
      label: 'Analytics',
      color: 'bg-accent',
    },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pt-2">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-medium text-foreground">Hello, Victor 👋</h1>
          <p className="text-muted-foreground">Ready to study today?</p>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-lg font-medium text-foreground mb-3">Quick Access</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickAccessItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="outline"
                onClick={() => onTabChange(item.id)}
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:border-primary/50"
              >
                <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Next Activity Card */}
      <div>
        <h2 className="text-lg font-medium text-foreground mb-3">Next Activity</h2>
        <Card className="border-2">
          <CardContent className="p-4">
            {nextActivity ? (
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{nextActivity.title}</h3>
                    <p className="text-sm text-muted-foreground">{nextActivity.subject}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-primary">
                    <Clock size={16} />
                    <span className="text-sm font-medium">{nextActivity.duration}min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {new Date(nextActivity.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="font-medium text-primary">{nextActivity.time}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No upcoming activities</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => onTabChange('study')}
                >
                  Add Activity
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{getTotalStudyHours().toFixed(1)}h</p>
              <p className="text-xs text-muted-foreground">Total Study Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{getCompletionRate().toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Completion Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeScreen;