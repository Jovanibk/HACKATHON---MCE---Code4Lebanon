'use client';

import { useParams } from 'next/navigation';
import { useLearner } from '@/hooks/useApi';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Target } from 'lucide-react';
import Link from 'next/link';

export default function LearnerProfilePage() {
  const { id } = useParams();
  const { data, isLoading, error } = useLearner(id as string);

  if (isLoading) return <div className="p-8">Loading profile...</div>;
  if (error || !data || data.length === 0) return <div className="p-8 text-red-500">Learner not found.</div>;

  const learner = data[0];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <Link href="/learners" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Directory</span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Unified Learner Profile</h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Admin & Demographics */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 border-4 border-white shadow-sm">
                  <User size={48} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{learner.name}</h3>
                <p className="text-slate-500 text-sm">{learner.job_level}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-slate-600">{learner.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-slate-600">{learner.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-slate-600">{learner.city}, {learner.region}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Briefcase size={16} /> Demographics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Employment</span>
                  <span className="font-medium">{learner.employment_status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Industry</span>
                  <span className="font-medium">{learner.industry}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Experience</span>
                  <span className="font-medium">{learner.years_experience} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Age Range</span>
                  <span className="font-medium">{learner.age_range}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Program Data & Provider Status */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <GraduationCap size={16} /> Program Preferences
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Training Track</p>
                  <p className="text-lg font-semibold text-slate-900">{learner.track_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Motivation</p>
                  <p className="text-lg font-semibold text-slate-900">{learner.motivation_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Format</p>
                  <p className="text-slate-700">{learner.preferred_format}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Skill Level</p>
                  <p className="text-slate-700">{learner.skill_level}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Target size={16} /> Training Provider Status
              </h4>
              <div className="space-y-6">
                {data.map((entry: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h5 className="font-bold text-slate-900">{entry.provider_name}</h5>
                        <p className="text-xs text-slate-500">Aggregated Status</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        entry.completion_status === 'Completed' ? 'bg-green-100 text-green-700' :
                        entry.completion_status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {entry.completion_status || 'Not Started'}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{Math.round(entry.progress_percentage || 0)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${entry.progress_percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Dissemination Info</h4>
              <div className="flex gap-8">
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1">Source Type</p>
                  <p className="text-sm">{learner.channel_type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1">Entity Name</p>
                  <p className="text-sm">{learner.entity_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
