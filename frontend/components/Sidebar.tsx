import Link from 'next/link';
import { LayoutDashboard, Users, Map, PieChart, BarChart3, Settings } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Dissemination', icon: BarChart3, href: '/dashboard/dissemination' },
    { name: 'Interests', icon: PieChart, href: '/dashboard/interests' },
    { name: 'Geography', icon: Map, href: '/dashboard/geography' },
    { name: 'Learners', icon: Users, href: '/learners' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">NUMŪ</h1>
        <p className="text-slate-400 text-xs">National Monitoring Dashboard</p>
      </div>
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-6 py-4 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 text-slate-400">
          <Settings size={20} />
          <span className="text-sm">Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
