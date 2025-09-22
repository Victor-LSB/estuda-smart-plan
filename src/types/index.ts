export interface StudyActivity {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: number; // in minutes
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export type NavigationTab = 'home' | 'study' | 'calendar' | 'analytics';