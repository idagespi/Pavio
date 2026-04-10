/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from './components/ui/sonner';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { Skeleton } from './components/ui/skeleton';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 flex flex-col gap-4">
        <Skeleton className="h-12 w-48 bg-zinc-800" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 bg-zinc-800" />
          <Skeleton className="h-64 bg-zinc-800" />
          <Skeleton className="h-64 bg-zinc-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30">
      {user ? <Dashboard /> : <Login />}
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

