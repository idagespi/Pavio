export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutType = 'easy_run' | 'long_run' | 'speed' | 'strength' | 'rest';
export type WorkoutStatus = 'planned' | 'completed' | 'missed' | 'adjusted';

export interface UserProfile {
  uid: string;
  displayName?: string;
  email: string;
  goal?: string;
  targetTime?: string;
  fitnessLevel?: FitnessLevel;
  weeklyAvailability?: Record<string, string[]>;
  preferences?: Record<string, any>;
  stravaAccessToken?: string;
  stravaRefreshToken?: string;
  stravaTokenExpiresAt?: number;
  lastSyncAt?: string;
}

export interface TrainingPlan {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
}

export interface Workout {
  id: string;
  userId: string;
  planId: string;
  date: string;
  type: WorkoutType;
  title: string;
  description: string;
  targetDistance?: number;
  targetPace?: string;
  status: WorkoutStatus;
  actualDistance?: number;
  actualPace?: string;
  actualHeartRate?: number;
  stravaActivityId?: string;
  weatherInfo?: any;
  fatigueScore?: number;
}

export interface Meal {
  name: string;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre-run' | 'recovery';
  calories?: number;
}

export interface MealPlan {
  id: string;
  userId: string;
  date: string;
  meals: Meal[];
  totalCalories?: number;
}
