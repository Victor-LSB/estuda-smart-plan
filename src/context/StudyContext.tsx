import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Activity {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  notes?: string;
  completed: boolean;
  completed_at?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

interface StudyContextType {
  activities: Activity[];
  loading: boolean;
  addActivity: (activity: Omit<Activity, 'id' | 'completed' | 'user_id' | 'completed_at' | 'created_at' | 'updated_at'>) => Promise<void>;
  toggleActivity: (id: string) => Promise<void>;
  getActivitiesForDate: (date: string) => Activity[];
  getCompletedActivitiesCount: () => number;
  getTotalStudyHours: () => number;
  getWeeklyStats: () => { [key: string]: number };
  getBestStudyDay: () => string;
  refreshActivities: () => Promise<void>;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      refreshActivities();
    } else {
      setActivities([]);
    }
  }, [user]);

  const refreshActivities = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas atividades",
          variant: "destructive",
        });
        return;
      }

      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id' | 'completed' | 'user_id' | 'completed_at' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          ...activity,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível salvar a atividade",
          variant: "destructive",
        });
        return;
      }

      setActivities(prev => [...prev, data]);
      toast({
        title: "Sucesso!",
        description: "Atividade salva com sucesso",
      });
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const toggleActivity = async (id: string) => {
    if (!user) return;

    const activity = activities.find(a => a.id === id);
    if (!activity) return;

    const newCompleted = !activity.completed;
    const updateData = {
      completed: newCompleted,
      completed_at: newCompleted ? new Date().toISOString() : null,
    };

    try {
      const { error } = await supabase
        .from('activities')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a atividade",
          variant: "destructive",
        });
        return;
      }

      setActivities(prev =>
        prev.map(a =>
          a.id === id
            ? { ...a, ...updateData }
            : a
        )
      );
    } catch (error) {
      console.error('Error toggling activity:', error);
    }
  };

  const getActivitiesForDate = (date: string) => {
    return activities.filter(activity => activity.date === date);
  };

  const getCompletedActivitiesCount = () => {
    return activities.filter(activity => activity.completed).length;
  };

  const getTotalStudyHours = () => {
    return activities
      .filter(activity => activity.completed)
      .reduce((total, activity) => total + activity.duration, 0) / 60;
  };

  const getWeeklyStats = () => {
    const stats: { [key: string]: number } = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    days.forEach(day => stats[day] = 0);
    
    activities
      .filter(activity => activity.completed)
      .forEach(activity => {
        const date = new Date(activity.date);
        const dayName = days[date.getDay()];
        stats[dayName] += activity.duration / 60;
      });
    
    return stats;
  };

  const getBestStudyDay = () => {
    const stats = getWeeklyStats();
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const englishDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const bestDay = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);
    const bestDayIndex = englishDays.indexOf(bestDay);
    
    return days[bestDayIndex] || 'Domingo';
  };

  const value = {
    activities,
    loading,
    addActivity,
    toggleActivity,
    getActivitiesForDate,
    getCompletedActivitiesCount,
    getTotalStudyHours,
    getWeeklyStats,
    getBestStudyDay,
    refreshActivities,
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
};