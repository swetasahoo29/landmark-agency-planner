'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [projects, setProjects] = useState<unknown[]>([]);

  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) console.error("Error:", error);
      else setProjects(data || []);
    }
    loadProjects();
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Agency Capacity Planner</h1>
      <pre className="bg-gray-100 p-4 mt-4">{JSON.stringify(projects, null, 2)}</pre>
    </main>
  );
}