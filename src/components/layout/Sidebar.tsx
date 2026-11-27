
import {
  LayoutDashboard,
  UsersRound,
  Wallet,
  ArrowLeftRight,
  PieChart,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { label: 'Visão geral', path: '/', icon: LayoutDashboard },
  { label: 'Meus grupos', path: '/groups', icon: UsersRound },
  { label: 'Despesas', path: '/expenses', icon: Wallet },
  { label: 'Acertos', path: '/settlements', icon: ArrowLeftRight },
];

export function Sidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white p-6 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-12 flex items-center gap-3">
        <div className="rounded-xl bg-primary-600 p-2.5 text-white">
          <PieChart size={24} />
        </div>

        <div>
          <h1 className="text-xl font-bold">Splitly</h1>
          <p className="text-xs text-slate-500">
            Divida sem complicações
          </p>
        </div>
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Menu principal
      </p>

      <nav className="space-y-2">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
