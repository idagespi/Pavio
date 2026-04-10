import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { generateTrainingPlan } from '../services/geminiService';
import { db } from '../lib/firebase';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Loader2, Timer } from 'lucide-react';

export default function PlanGenerator() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState('Half Marathon');
  const [targetTime, setTargetTime] = useState('2:00:00');
  const [fitnessLevel, setFitnessLevel] = useState('intermediate');

  const handleGenerate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // 1. Generate plan with Gemini
      const planWorkouts = await generateTrainingPlan(goal, targetTime, fitnessLevel as any, {}, startDate);

      // 2. Save Plan to Firestore
      const planRef = await addDoc(collection(db, 'users', user.uid, 'plans'), {
        userId: user.uid,
        startDate,
        endDate,
        status: 'active',
        createdAt: new Date().toISOString(),
        goal,
        targetTime,
        fitnessLevel
      });

      // 3. Save Workouts in batch
      const batch = writeBatch(db);
      planWorkouts.forEach((workout) => {
        const workoutRef = doc(collection(db, 'users', user.uid, 'workouts'));
        batch.set(workoutRef, {
          ...workout,
          userId: user.uid,
          planId: planRef.id,
          status: 'planned'
        });
      });

      await batch.commit();
      toast.success('Training plan generated successfully!');
    } catch (error) {
      console.error('Error generating plan:', error);
      toast.error('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-zinc-100">
            <Timer className="text-cyan-500 w-5 h-5" />
            Create Your Training Plan
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            AI-powered 12-week personalized training schedule.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="goal" className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">Goal Distance</Label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-zinc-100 h-10">
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
                <SelectItem value="5K">5K Run</SelectItem>
                <SelectItem value="10K">10K Run</SelectItem>
                <SelectItem value="Half Marathon">Half Marathon</SelectItem>
                <SelectItem value="Marathon">Full Marathon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="targetTime" className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">Target Time</Label>
              <Input 
                id="targetTime" 
                value={targetTime} 
                onChange={(e) => setTargetTime(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 text-zinc-100 h-10"
                placeholder="HH:MM:SS"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="level" className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">Fitness Level</Label>
              <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-zinc-100 h-10">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white h-11 font-bold transition-all mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Plan'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
