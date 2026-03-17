'use client';
import { useState, useEffect } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/visitor-count');
        const data = await res.json();
        if (data.count !== undefined) {
          setCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching visitor count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  if (loading || count === null) return null;

  return (
    <div className="text-white/40 text-xs flex items-center gap-2">
      <span className="w-1 h-1 bg-green-500/50 rounded-full"></span>
      <span>{count.toLocaleString()} people visited this month</span>
    </div>
  );
}
