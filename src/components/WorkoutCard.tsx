import * as React from 'react';
import { Workout } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin, Zap, Dumbbell, Coffee, Timer } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const typeIcons = {
  easy_run: MapPin,
  long_run: Timer,
  speed: Zap,
  strength: Dumbbell,
  rest: Coffee,
};

const typeColors = {
  easy_run: 'text-cyan-400 bg-cyan-400/10',
  long_run: 'text-blue-400 bg-blue-400/10',
  speed: 'text-purple-400 bg-purple-400/10',
  strength: 'text-emerald-400 bg-emerald-400/10',
  rest: 'text-zinc-400 bg-zinc-400/10',
};

interface WorkoutCardProps {
  workout: Workout;
  index: number;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, index }) => {
  const Icon = typeIcons[workout.type] || MapPin;
  const colorClass = typeColors[workout.type] || typeColors.easy_run;

  const date = new Date(workout.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group">
        <CardContent className="p-4 flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-500 uppercase">{date}</span>
              <Badge variant="outline" className="text-[10px] uppercase border-zinc-700 text-zinc-400">
                {workout.status}
              </Badge>
            </div>
            <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
              {workout.title}
            </h4>
            <p className="text-xs text-zinc-500 truncate">{workout.description}</p>
          </div>
          {workout.targetDistance && (
            <div className="text-right shrink-0">
              <span className="text-sm font-mono font-bold text-white">{workout.targetDistance}</span>
              <span className="text-[10px] text-zinc-500 block">KM</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
