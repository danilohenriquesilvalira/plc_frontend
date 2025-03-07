import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Activity, Users, Ship, LogOut, Menu, Table2, Cpu, Monitor, Droplet, Anchor, ArrowUp, Thermometer } from 'lucide-react';

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
    { icon: <Activity className="w-5 h-5" />, text: 'Monitoramento', path: '/monitoramento' },
    { icon: <Monitor className="w-5 h-5" />, text: 'Transporte', path: '/hmi' },
    { icon: <Droplet className="w-5 h-5" />, text: 'Eclusa Régua', path: '/eclusa-regua' },
    { icon: <Anchor className="w-5 h-5" />, text: 'Porta Jusante', path: '/porta-jusante' },
    { icon: <ArrowUp className="w-5 h-5" />, text: 'Porta Montante', path: '/porta-montante' },
    { icon: <Thermometer className="w-5 h-5" />, text: 'Enchimento', path: '/enchimento' }, // Nova opção de menu para Enchimento
    { icon: <Table2 className="w-5 h-5" />, text: 'Tabelas', path: '/tables' },
    { icon: <Users className="w-5 h-5" />, text: 'Usuários', path: '/admin/users' },
    { icon: <Ship className="w-5 h-5" />, text: 'Painel Eclusa', path: '/painel-eclusa' },
  ];

  return (
    <aside
      className={`bg-slate-800/80 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-72' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-screen p-4">
        {/* Logo */}
        <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} mb-8`}>
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-500" />
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-[2px] rounded-xl">
                  <div className="bg-slate-800 p-2 rounded-xl">
                    <Cpu className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                PLC Coletor
              </span>
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-slate-700/50 text-slate-400 hover:text-blue-400 transition-all duration-300"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-xl group transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 relative' 
                    : 'hover:bg-slate-700/50'
                }`}
              >
                {/* Ícone */}
                <div className={`relative ${isActive ? 'group/icon' : ''}`}>
                  {isActive && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-40 group-hover/icon:opacity-60 transition duration-500" />
                  )}
                  <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                      : 'text-slate-400 group-hover:text-blue-400'
                  }`}>
                    {item.icon}
                  </div>
                </div>

                {/* Texto */}
                {isOpen && (
                  <span className={`transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {item.text}
                  </span>
                )}

                {/* Indicador de ativo */}
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Botão de Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 p-2 rounded-xl group hover:bg-red-500/10 transition-all duration-300"
        >
          <div className="relative group/icon">
            <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur opacity-0 group-hover/icon:opacity-40 transition duration-500" />
            <div className="relative p-2 rounded-xl text-red-400 group-hover:text-red-300 transition-colors duration-300">
              <LogOut className="w-5 h-5" />
            </div>
          </div>
          {isOpen && (
            <span className="text-red-400 group-hover:text-red-300 transition-colors duration-300">
              Sair
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;