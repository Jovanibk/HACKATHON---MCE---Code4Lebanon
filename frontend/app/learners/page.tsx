'use client';

import React, { useState } from 'react';
import { useLearners } from '@/hooks/useApi';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

export default function LearnersPage() {
  const [page, setPage] = useState(1);
  const [regionFilter, setRegionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error } = useLearners(page, regionFilter, searchQuery);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Learner Directory</h2>
            <p className="text-slate-500">Unified profile management</p>
          </div>
        </header>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 w-full md:w-64">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search learners..." 
                className="bg-transparent border-none focus:outline-none text-sm w-full"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-slate-400" />
                <select 
                  className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none"
                  value={regionFilter}
                  onChange={(e) => { setRegionFilter(e.target.value); setPage(1); }}
                >
                  <option value="">All Regions</option>
                  <option value="Beirut">Beirut</option>
                  <option value="Mount Lebanon">Mount Lebanon</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="Bekaa">Bekaa</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Name</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Email</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Region</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Tracks</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Loading learners...</td></tr>
                ) : data?.learners?.length > 0 ? (
                  data.learners.map((learner: any) => (
                    <tr key={learner.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{learner.name}</div>
                        <div className="text-xs text-slate-500">{learner.employment_status}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{learner.email}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{learner.region}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {learner.tracks || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/learners/${learner.id}`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No learners found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing page {page} of {Math.ceil((data?.total || 0) / 10)}
            </p>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                disabled={!data || page * 10 >= data.total}
                onClick={() => setPage(p => p + 1)}
                className="p-2 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
