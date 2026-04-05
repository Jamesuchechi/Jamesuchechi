'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRegister() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">Redirecting...</h2>
        <p className="text-gray-600">Registration is disabled for this portfolio.</p>
      </div>
    </div>
  );
}
