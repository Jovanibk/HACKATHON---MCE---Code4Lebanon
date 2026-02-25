'use client';

import { useGeography } from '@/hooks/useApi';
import ChartCard from '@/components/ChartCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function GeographyPage() {
  const { data, isLoading, error } = useGeography();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <ChartCard title="Learners per Region">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.learnersPerRegion}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0f172a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Channel Effectiveness by Region">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.channelEffectiveness}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Note: This simplified view assumes we might need to pivot data for better stacked bars, 
                  but showing raw channel_type counts per region for now */}
              <Bar dataKey="count" fill="#334155" name="Learner Count" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
        <h3 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
          Gap Detection Indicator
        </h3>
        <p className="text-amber-700 text-sm">
          The following regions show significantly lower registration volumes compared to national averages:
        </p>
        <ul className="mt-4 list-disc list-inside text-amber-900 font-medium">
          {data.learnersPerRegion?.filter((r: any) => r.count < 5).map((r: any) => (
            <li key={r.region}>{r.region} ({r.count} registrations)</li>
          ))}
          {data.learnersPerRegion?.filter((r: any) => r.count < 5).length === 0 && (
            <li>No major gaps detected.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
