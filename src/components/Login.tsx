import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Activity, Timer, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Login popup was closed. Please try again.');
      } else if (error.code === 'auth/blocked-at-popup-request') {
        toast.error('Login popup was blocked by your browser.');
      } else {
        toast.error('An error occurred during login.');
        console.error(error);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#000_100%)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
              <Timer className="text-white w-6 h-6 fill-current" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">Pavio</CardTitle>
            <CardDescription className="text-zinc-400">
              Your intelligent half marathon coach. Adaptive, data-driven, and personal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span className="text-xs text-zinc-400">Strava Sync</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <Timer className="w-5 h-5 text-cyan-400" />
                <span className="text-xs text-zinc-400">AI Planning</span>
              </div>
            </div>
            <Button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-white text-black hover:bg-zinc-200 h-12 text-lg font-medium transition-all"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Get Started with Google'
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
