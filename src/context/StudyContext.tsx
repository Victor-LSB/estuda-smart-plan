import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudyActivity } from '@/types';

interface StudyContextType {
  activities: StudyActivity[];
  addActivity: (activity: Omit<StudyActivity, 'id' | 'createdAt' | 'completed'>) => void;
  toggleActivityCompletion: (id: string) => void;
  getActivitiesForDate: (date: string) => StudyActivity[];
  getNextActivity: () => StudyActivity | null;
  getTotalStudyHours: () => number;
  getCompletionRate: () => number;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};

interface StudyProviderProps {
  children: ReactNode;
}

export const StudyProvider: React.FC<StudyProviderProps> = ({ children }) => {
  const [activities, setActivities] = useState<StudyActivity[]>([]);

  // Load activities from localStorage on mount
  useEffect(() => {
    const savedActivities = localStorage.getItem('estuda-ai-activities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Save activities to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem('estuda-ai-activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activityData: Omit<StudyActivity, 'id' | 'createdAt' | 'completed'>) => {
    const newActivity: StudyActivity = {
      ...activityData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const toggleActivityCompletion = (id: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id ? { ...activity, completed: !activity.completed } : activity
      )
    );
  };

  const getActivitiesForDate = (date: string) => {
    return activities.filter(activity => activity.date === date);
  };

  const getNextActivity = () => {
    const now = new Date();
    const upcomingActivities = activities
      .filter(activity => !activity.completed)
      .filter(activity => {
        const activityDateTime = new Date(`${activity.date}T${activity.time}`);
        return activityDateTime > now;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });

    return upcomingActivities[0] || null;
  };

  const getTotalStudyHours = () => {
    return activities
      .filter(activity => activity.completed)
      .reduce((total, activity) => total + activity.duration, 0) / 60;
  };

  const getCompletionRate = () => {
    if (activities.length === 0) return 0;
    const completedCount = activities.filter(activity => activity.completed).length;
    return (completedCount / activities.length) * 100;
  };

  const value: StudyContextType = {
    activities,
    addActivity,
    toggleActivityCompletion,
    getActivitiesForDate,
    getNextActivity,
    getTotalStudyHours,
    getCompletionRate,
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
};