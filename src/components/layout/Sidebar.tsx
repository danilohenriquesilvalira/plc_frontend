import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Activity, Users, Settings, LogOut, Menu } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, text: 'Dashboard', path: '/' },
    { icon: <Database className="w-5 h-5" />, text: 'PLCs', path: '/plcs' },
    { icon: <Activity className="w-5 h-5" />, text: 'Monitoramento', path: '/plcmonitor' },
    { icon: <Users className="w-5 h-5" />, text: 'Usuários', path: '/admin/users' },  // Updated path here
    { icon: <Settings className="w-5 h-5" />, text: 'Configurações', path: '/settings' },
  ];

  return (
    <aside
      className={`bg-slate-800 min-h-screen p-4 flex flex-col transition-all duration-300 border-r border-slate-700 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Container do cabeçalho: centraliza o botão se o sidebar estiver fechado */}
      <div className={`flex items-center mb-8 ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && (
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            PLC Collector
          </span>
        )}
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white focus:outline-none transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                    isActive ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center ${
                      isOpen ? 'p-2 rounded-lg bg-slate-700 group-hover:bg-slate-600' : 'w-full'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {isOpen && <span className="ml-3">{item.text}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition-all duration-200"
        >
          <span className="p-2 rounded-lg bg-slate-700">
            <LogOut className="w-5 h-5" />
          </span>
          {isOpen && <span className="ml-3">Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;