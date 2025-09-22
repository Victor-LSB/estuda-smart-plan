import React from 'react';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudy } from '@/context/StudyContext';

const AnalyticsScreen: React.FC = () => {
  const { activities, getTotalStudyHours, getCompletionRate } = useStudy();

  // Calculate daily study hours for the last 7 days
  const getLast7DaysData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayActivities = activities.filter(
        activity => activity.date === dateString && activity.completed
      );
      
      const totalMinutes = dayActivities.reduce((sum, activity) => sum + activity.duration, 0);
      
      last7Days.push({
        date: dateString,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: totalMinutes / 60,
      });
    }
    
    return last7Days;
  };

  const last7DaysData = getLast7DaysData();
  const maxHours = Math.max(...last7DaysData.map(d => d.hours), 1);

  // Find best study day
  const getBestStudyDay = () => {
    const dayTotals = last7DaysData.reduce((acc, day) => {
      const dayName = day.day;
      acc[dayName] = (acc[dayName] || 0) + day.hours;
      return acc;
    }, {} as Record<string, number>);

    const bestDay = Object.entries(dayTotals).reduce<{ day: string; hours: number }>((best, [day, hours]) => 
      (hours as number) > best.hours ? { day, hours: hours as number } : best
    , { day: 'None', hours: 0 });

    return bestDay;
  };

  const bestStudyDay = getBestStudyDay();
  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.completed).length;
  const totalStudyHours = getTotalStudyHours();
  const completionRate = getCompletionRate();

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-medium text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track your study progress</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{totalStudyHours.toFixed(1)}h</p>
                <p className="text-xs text-muted-foreground">Total Study Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{completionRate.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Weekly Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chart */}
            <div className="flex items-end justify-between h-32 space-x-2">
              {last7DaysData.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex flex-col justify-end h-24">
                    <div
                      className="bg-primary rounded-t-lg transition-all duration-300 min-h-[4px]"
                      style={{
                        height: `${(day.hours / maxHours) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium text-foreground">{day.day}</p>
                    <p className="text-xs text-muted-foreground">{day.hours.toFixed(1)}h</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Daily study hours (last 7 days)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Best Study Day</p>
                  <p className="text-sm text-muted-foreground">This week's most productive day</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{bestStudyDay.day}</p>
                <p className="text-xs text-muted-foreground">{bestStudyDay.hours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{totalActivities}</p>
                <p className="text-xs text-muted-foreground">Total Activities</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{completedActivities}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{totalActivities - completedActivities}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsScreen;