import React from 'react';
import { Plus, Clock, CheckCircle2, Circle, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudy } from '@/context/StudyContext';
import { cn } from '@/lib/utils';

interface StudyScreenProps {
  onAddActivity: () => void;
}

const StudyScreen: React.FC<StudyScreenProps> = ({ onAddActivity }) => {
  const { activities, toggleActivity } = useStudy();

  const sortedActivities = [...activities].sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time}`);
    const dateTimeB = new Date(`${b.date}T${b.time}`);
    return dateTimeB.getTime() - dateTimeA.getTime();
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Study Activities</h1>
          <p className="text-muted-foreground">{activities.length} activities total</p>
        </div>
        <Button
          onClick={onAddActivity}
          size="sm"
          className="rounded-full w-12 h-12 p-0"
        >
          <Plus size={20} />
        </Button>
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {sortedActivities.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No activities yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first study activity</p>
              <Button onClick={onAddActivity}>
                <Plus size={16} className="mr-2" />
                Add Activity
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedActivities.map((activity) => (
            <Card
              key={activity.id}
              className={cn(
                "border-2 transition-all",
                activity.completed ? "bg-muted/30 border-primary/30" : "hover:border-primary/50"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleActivity(activity.id)}
                    className="flex-shrink-0"
                  >
                    {activity.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-medium text-foreground",
                          activity.completed && "line-through text-muted-foreground"
                        )}>
                          {activity.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{activity.subject}</p>
                        {activity.notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {activity.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end space-y-1 text-sm flex-shrink-0">
                        <div className="flex items-center space-x-1 text-primary">
                          <Clock size={14} />
                          <span className="font-medium">{activity.duration}min</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs font-medium text-foreground">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>


      {/* Botão Flutuante de Adicionar */}
      {sortedActivities.length > 0 && (
        // Posição ajustada para ficar acima da barra de navegação
        <div className="fixed bottom-44 right-4 mb-safe-bottom">
          <Button
            onClick={onAddActivity}
            size="lg"
            className="rounded-full w-14 h-14 p-0 shadow-lg"
          >
            <Plus size={24} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudyScreen;