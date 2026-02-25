'use client';

import { useDissemination } from '@/hooks/useApi';
import ChartCard from '@/components/ChartCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line
} from 'recharts';

export default function DisseminationPage() {
  const { data, isLoading, error } = useDissemination();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <ChartCard title="Learners per Channel">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.perChannel}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="channel_type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0f172a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Entity Drill-down</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 font-semibold text-slate-600">Entity Name</th>
                <th className="pb-3 font-semibold text-slate-600">Channel Type</th>
                <th className="pb-3 font-semibold text-slate-600">Total Learners</th>
              </tr>
            </thead>
            <tbody>
              {data.perEntity?.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 text-slate-800">{item.entity_name}</td>
                  <td className="py-3 text-slate-500">{item.channel_type}</td>
                  <td className="py-3 font-medium">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
