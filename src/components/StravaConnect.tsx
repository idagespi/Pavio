import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Activity, CheckCircle2 } from 'lucide-react';
import { getStravaAuthUrl } from '../services/stravaService';
import { useAuth } from '../hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

export default function StravaConnect() {
  const { profile, user, refreshProfile } = useAuth();
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'STRAVA_AUTH_SUCCESS' && user) {
        const { access_token, refresh_token, expires_at } = event.data.payload;
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            stravaAccessToken: access_token,
            stravaRefreshToken: refresh_token,
            stravaTokenExpiresAt: expires_at,
            lastSyncAt: new Date().toISOString()
          });
          await refreshProfile();
          toast.success('Strava connected successfully!');
        } catch (error) {
          console.error('Error saving Strava tokens:', error);
          toast.error('Failed to save Strava connection.');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user, refreshProfile]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const url = await getStravaAuthUrl();
      window.open(url, 'strava_oauth', 'width=600,height=700');
    } catch (error) {
      console.error('Strava connect error:', error);
      toast.error('Failed to initiate Strava connection.');
    } finally {
      setConnecting(false);
    }
  };

  if (profile?.stravaAccessToken) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        className="bg-cyan-500/10 border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/20 gap-2 cursor-default"
      >
        <Activity className="w-4 h-4" />
        Strava Connected
        <CheckCircle2 className="w-3 h-3" />
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleConnect} 
      disabled={connecting}
      variant="outline" 
      size="sm"
      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 gap-2"
    >
      <Activity className="w-4 h-4 text-cyan-400" />
      Connect Strava
    </Button>
  );
}
