export interface Activity {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: number; // in minutes
  notes?: string;
  completed: boolean;
  completed_at?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export type NavigationTab = 'home' | 'study' | 'calendar' | 'analytics';