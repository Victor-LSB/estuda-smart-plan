import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudy } from '@/context/StudyContext';
import { cn } from '@/lib/utils';

const CalendarScreen: React.FC = () => {
  const { activities, getActivitiesForDate } = useStudy();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Create calendar grid
  const calendarDays = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const formatDateString = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const hasActivities = (day: number) => {
    const dateString = formatDateString(day);
    return getActivitiesForDate(dateString).length > 0;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const handleDayClick = (day: number) => {
    const dateString = formatDateString(day);
    setSelectedDate(selectedDate === dateString ? null : dateString);
  };

  const selectedActivities = selectedDate ? getActivitiesForDate(selectedDate) : [];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Track your study schedule</p>
        </div>
      </div>

      {/* Calendar */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {monthNames[currentMonth]} {currentYear}
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="w-8 h-8 p-0"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="w-8 h-8 p-0"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div key={index} className="aspect-square">
                {day && (
                  <button
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "w-full h-full rounded-lg text-sm font-medium transition-all relative",
                      "hover:bg-primary/10 hover:text-primary",
                      isToday(day) && "bg-primary text-primary-foreground hover:bg-primary/90",
                      selectedDate === formatDateString(day) && !isToday(day) && "bg-primary/20 text-primary",
                      !isToday(day) && selectedDate !== formatDateString(day) && "text-foreground"
                    )}
                  >
                    {day}
                    {hasActivities(day) && (
                      <div className={cn(
                        "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                        isToday(day) ? "bg-primary-foreground" : "bg-primary"
                      )} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Activities */}
      {selectedDate && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedActivities.length === 0 ? (
              <div className="text-center py-6">
                <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No activities scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedActivities
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className={cn(
                        "p-3 rounded-lg border-l-4",
                        activity.completed
                          ? "bg-muted/30 border-l-primary/60"
                          : "bg-card border-l-primary"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className={cn(
                            "font-medium text-foreground",
                            activity.completed && "line-through text-muted-foreground"
                          )}>
                            {activity.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{activity.subject}</p>
                        </div>
                        <div className="text-right flex flex-col items-end space-y-1">
                          <span className="text-sm font-medium text-primary">{activity.time}</span>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock size={12} />
                            <span>{activity.duration}min</span>
                          </div>
                        </div>
                      </div>
                      {activity.notes && (
                        <p className="text-xs text-muted-foreground mt-2">{activity.notes}</p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarScreen;