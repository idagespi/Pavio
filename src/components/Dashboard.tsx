import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTrainingData } from '../hooks/useTrainingData';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Activity, Calendar, Utensils, Settings, LogOut, Cloud, Timer } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import PlanGenerator from './PlanGenerator';
import { WorkoutCard } from './WorkoutCard';
import StravaConnect from './StravaConnect';
import { getSydneyWeather } from '../services/weatherService';
import { getCoachingAdvice } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const { profile } = useAuth();
  const { activePlan, workouts, loading } = useTrainingData();
  const [weather, setWeather] = useState<any>(null);
  const [advice, setAdvice] = useState<string>('');
  const [adviceLoading, setAdviceLoading] = useState(false);

  useEffect(() => {
    getSydneyWeather().then(setWeather);
  }, []);

  useEffect(() => {
    if (workouts.length > 0 && weather) {
      setAdviceLoading(true);
      getCoachingAdvice(workouts.slice(0, 5), {}, weather)
        .then(setAdvice)
        .finally(() => setAdviceLoading(false));
    }
  }, [workouts, weather]);

  const today = new Date().toISOString().split('T')[0];
  const todaysWorkout = workouts.find(w => w.date === today);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Timer className="text-white w-5 h-5 fill-current" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Pavio</h1>
        </div>
        <div className="flex items-center gap-4">
          <StravaConnect />
          <Button variant="ghost" size="icon" onClick={() => signOut(auth)} className="text-zinc-400 hover:text-white">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {!activePlan ? (
        <PlanGenerator />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Today's Focus */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Today's Focus</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="w-24 h-24" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-zinc-400">Workout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {todaysWorkout ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white">{todaysWorkout.title}</h3>
                          <p className="text-zinc-400 text-sm mt-1">{todaysWorkout.description}</p>
                        </div>
                        {todaysWorkout.targetDistance && (
                          <div className="flex gap-4">
                            <div className="bg-zinc-800 px-3 py-1 rounded-md">
                              <span className="text-xs text-zinc-500 block">Distance</span>
                              <span className="text-lg font-mono font-bold text-cyan-400">{todaysWorkout.targetDistance}km</span>
                            </div>
                            {todaysWorkout.targetPace && (
                              <div className="bg-zinc-800 px-3 py-1 rounded-md">
                                <span className="text-xs text-zinc-500 block">Target Pace</span>
                                <span className="text-lg font-mono font-bold text-cyan-400">{todaysWorkout.targetPace}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-zinc-500 italic">No workout scheduled for today. Rest up!</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium text-zinc-400">Coach's Advice</CardTitle>
                    <Timer className="w-4 h-4 text-cyan-500" />
                  </CardHeader>
                  <CardContent>
                    {adviceLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 bg-zinc-800 rounded w-full animate-pulse" />
                        <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                      </div>
                    ) : (
                      <p className="text-zinc-200 leading-relaxed italic">"{advice}"</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <Tabs defaultValue="schedule" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Plan Overview</h2>
                  <TabsList className="bg-zinc-900 border-zinc-800">
                    <TabsTrigger value="schedule" className="data-[state=active]:bg-zinc-800">Schedule</TabsTrigger>
                    <TabsTrigger value="progress" className="data-[state=active]:bg-zinc-800">Progress</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="schedule" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workouts.slice(0, 6).map((workout, i) => (
                      <WorkoutCard key={workout.id || i} workout={workout} index={i} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="progress">
                  <Card className="bg-zinc-900 border-zinc-800 h-64 flex items-center justify-center">
                    <p className="text-zinc-500">Progress charts coming soon...</p>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
          </div>

          {/* Right Column: Stats & Weather */}
          <div className="space-y-8">
            <section>
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Conditions</h2>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6">
                  {weather ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                          <Cloud className="text-blue-400 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</p>
                          <p className="text-zinc-400 text-sm capitalize">{weather.weather[0].description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500 uppercase">Sydney, AU</p>
                        <p className="text-xs text-zinc-400 mt-1">Humidity: {weather.main.humidity}%</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-12 bg-zinc-800 rounded animate-pulse" />
                  )}
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Nutrition</h2>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Daily Fueling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Utensils className="w-4 h-4 text-cyan-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Pre-run: Oatmeal + Banana</p>
                      <p className="text-xs text-zinc-500">Quick carbs for energy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Utensils className="w-4 h-4 text-cyan-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Recovery: Protein Shake + Rice</p>
                      <p className="text-xs text-zinc-500">Muscle repair & glycogen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
