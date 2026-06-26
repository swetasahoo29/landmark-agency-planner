"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [stats, setStats] = useState<
    {
      name: string;
      used: number;
      max: number;
      status: string;
    }[]
  >([]);

  useEffect(() => {
    async function calculateCapacity() {
      // Fetch projects and bandwidths
      const { data: projects } = await supabase.from("projects").select("*");
      const { data: bandwidths } = await supabase
        .from("team_bandwidth")
        .select("*");

      const summary = bandwidths?.map((team) => {
        // Sum the hours for this specific team from all projects
        const used = projects?.reduce(
          (acc, p) => acc + (p[`${team.team_name.toLowerCase()}_hours`] || 0),
          0,
        );
        return {
          name: team.name,
          used,
          max: team.max_weekly_hours,
          status:
            used >= team.max_weekly_hours
              ? "🔴 At Capacity"
              : "🟢 Open for Booking",
        };
      });
      setStats(summary || []);
    }
    calculateCapacity();
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-5">Agency Capacity Monitor</h1>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div key={s.name} className="p-4 border rounded shadow">
            <h2 className="font-bold">{s.name}</h2>
            <p>
              Load: {s.used} / {s.max} hours
            </p>
            <p className="text-xl font-bold">{s.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
