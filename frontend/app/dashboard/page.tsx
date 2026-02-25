'use client';

import { useSummary } from '@/hooks/useApi';
import ChartCard from '@/components/ChartCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Users, GraduationCap, Map as MapIcon, CheckCircle2 } from 'lucide-react';

const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];

export default function OverviewPage() {
  const { data, isLoading, error } = useSummary();

  if (isLoading) return <div>Loading summary...</div>;
  if (error) return <div>Error loading summary</div>;

  const stats = [
    { label: 'Total Learners', value: data.totalLearners, icon: Users, color: 'text-blue-600' },
    { label: 'Completion Rate', value: `${data.completionRate}%`, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Tracks Active', value: data.totalPerTrack?.length || 0, icon: GraduationCap, color: 'text-purple-600' },
    { label: 'Regions Represented', value: data.totalPerRegion?.length || 0, icon: MapIcon, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-full bg-slate-50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Learners per Track">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.totalPerTrack}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="track_name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="count" fill="#0f172a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Regional Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.totalPerRegion}
                dataKey="count"
                nameKey="region"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
              >
                {data.totalPerRegion?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
