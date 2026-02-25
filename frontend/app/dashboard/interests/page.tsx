'use client';

import { useInterests } from '@/hooks/useApi';
import ChartCard from '@/components/ChartCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];

export default function InterestsPage() {
  const { data, isLoading, error } = useInterests();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Track Demand Heatmap (Bar)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.trackDemand} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis dataKey="track_name" type="category" width={150} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f172a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Learner Motivations">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.motivations}
                dataKey="count"
                nameKey="motivation_name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.motivations?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
