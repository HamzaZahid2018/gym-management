import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="text-white text-center">
        <h1 className="text-5xl font-bold mb-4">💪 Gym Management System</h1>
        <p className="text-xl">Loading...</p>
      </div>
    </div>
  );
}
