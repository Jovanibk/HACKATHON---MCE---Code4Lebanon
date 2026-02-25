import React from 'react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className }) => {
  return (
    <div className={cn("bg-white p-6 rounded-lg border border-slate-200 shadow-sm", className)}>
      <h3 className="text-lg font-semibold mb-4 text-slate-800">{title}</h3>
      <div className="h-[300px] w-full">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
