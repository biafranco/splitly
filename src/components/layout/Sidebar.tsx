import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UsersRound,
  Receipt,
  HandCoins,
  Wallet,
} from 'lucide-react';

const navigation = [
  { label: 'Visão geral', path: '/', icon: LayoutDashboard },
  { label: 'Meus grupos', path: '/groups', icon: UsersRound },
  { label: 'Despesas', path: '/expenses', icon: Receipt },
  { label: 'Acertos', path: '/settlements', icon: HandCoins },
];

export function Sidebar() {
  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white p-5 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="mb-10 flex items-center gap-3">
        <div className="rounded-xl bg-primary-600 p-3 text-white">
          <Wallet size={24} />
        </div>

        <div>
          <h1 className="text-xl font-bold">Splitly</h1>
          <p className="text-xs text-slate-500">
            Divida sem complicações
          </p>
        </div>
      </div>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Menu principal
      </p>

      <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
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

      <div className="mt-auto hidden rounded-xl bg-slate-50 p-4 md:block">
        <p className="text-sm font-semibold">Splitly</p>
        <p className="mt-1 text-xs text-slate-500">
          Seus dados são armazenados neste navegador.
        </p>
        <p className="mt-3 text-xs text-slate-400">Versão 1.0.0</p>
      </div>
    </aside>
  );
}