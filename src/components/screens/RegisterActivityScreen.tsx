import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudy } from '@/context/StudyContext';
import { toast } from '@/hooks/use-toast';

interface RegisterActivityScreenProps {
  onBack: () => void;
}

const RegisterActivityScreen: React.FC<RegisterActivityScreenProps> = ({ onBack }) => {
  const { addActivity } = useStudy();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: '',
    time: '',
    duration: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.date || !formData.time || !formData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addActivity({
      title: formData.title,
      subject: formData.subject,
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration),
      notes: formData.notes || undefined,
    });

    toast({
      title: "Activity Added! 🎉",
      description: "Your study activity has been saved successfully.",
    });

    // Reset form and go back
    setFormData({
      title: '',
      subject: '',
      date: '',
      time: '',
      duration: '',
      notes: '',
    });
    onBack();
  };

  // Set default date to today
  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: today }));
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-medium text-foreground">Add Activity</h1>
          <p className="text-muted-foreground">Create a new study session</p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Activity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Activity Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Activity Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Review Chapter 5"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="rounded-2xl"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="rounded-2xl"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="rounded-2xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="rounded-2xl"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                placeholder="60"
                min="1"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="rounded-2xl"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or objectives..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="rounded-2xl resize-none"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full rounded-2xl h-12 text-base font-medium"
            >
              <Save size={20} className="mr-2" />
              Save Activity
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterActivityScreen;