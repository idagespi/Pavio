import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { Workout, TrainingPlan } from '../types';

export const useTrainingData = () => {
  const { user } = useAuth();
  const [activePlan, setActivePlan] = useState<TrainingPlan | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch active plan
    const plansQuery = query(
      collection(db, 'users', user.uid, 'plans'),
      where('status', '==', 'active'),
      limit(1)
    );

    const unsubscribePlan = onSnapshot(plansQuery, (snapshot) => {
      if (!snapshot.empty) {
        const planDoc = snapshot.docs[0];
        setActivePlan({ id: planDoc.id, ...planDoc.data() } as TrainingPlan);
      } else {
        setActivePlan(null);
      }
    });

    return () => unsubscribePlan();
  }, [user]);

  useEffect(() => {
    if (!user || !activePlan) {
      setWorkouts([]);
      setLoading(false);
      return;
    }

    // Fetch workouts for active plan
    const workoutsQuery = query(
      collection(db, 'users', user.uid, 'workouts'),
      where('planId', '==', activePlan.id),
      orderBy('date', 'asc')
    );

    const unsubscribeWorkouts = onSnapshot(workoutsQuery, (snapshot) => {
      const workoutList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
      setWorkouts(workoutList);
      setLoading(false);
    });

    return () => unsubscribeWorkouts();
  }, [user, activePlan]);

  return { activePlan, workouts, loading };
};
