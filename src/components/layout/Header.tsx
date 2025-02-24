import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Settings, LogOut, Shield, UserCog, Mail } from 'lucide-react';
import ReactDOM from 'react-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        userButtonRef.current && 
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Renderiza o menu dropdown no final do DOM
  const renderUserMenu = () => {
    if (!isUserMenuOpen) return null;

    // Pega a posição do botão do usuário para posicionar o dropdown
    const userButtonRect = userButtonRef.current?.getBoundingClientRect();
    if (!userButtonRect) return null;

    const menuContent = (
      <div 
        ref={menuRef}
        className="fixed w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-lg shadow-slate-900/50 overflow-hidden"
        style={{
          top: `${userButtonRect.bottom + 8}px`,
          right: `${window.innerWidth - userButtonRect.right}px`,
          zIndex: 99999
        }}
      >
        <div className="p-3 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-75 blur transition duration-300" />
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-[1px] rounded-xl">
                <div className="bg-slate-800 p-2 rounded-xl">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-200">Admin</span>
              <span className="text-xs text-slate-400">admin@plc-collector.com</span>
            </div>
          </div>
        </div>
        <div className="py-1">
          <a href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors duration-200">
            <UserCog className="w-4 h-4" />
            <span>Meu Perfil</span>
          </a>
          <a href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors duration-200">
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </a>
          <a href="/messages" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors duration-200">
            <Mail className="w-4 h-4" />
            <span>Mensagens</span>
          </a>
          <a href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors duration-200">
            <Shield className="w-4 h-4" />
            <span>Painel de Controle</span>
          </a>
        </div>
        <div className="border-t border-slate-700/50 py-1">
          <button 
            onClick={onLogout} 
            className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    );

    // Use createPortal para renderizar no final do DOM
    return ReactDOM.createPortal(
      <>
        <div 
          onClick={() => setIsUserMenuOpen(false)} 
          className="fixed inset-0 z-[99990]" 
          style={{ background: 'transparent' }}
        ></div>
        {menuContent}
      </>,
      document.body
    );
  };

  return (
    <header className="bg-slate-800/80 backdrop-blur-xl px-6 py-4 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        {/* Seção Esquerda - Título */}
        <div className="flex items-center gap-6">
          {/* Título da Página */}
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">
              {title}
            </h1>
          </div>
        </div>

        {/* Seção Direita - Ações do Usuário */}
        <div className="flex items-center gap-4">
          {/* Ícone de Configurações */}
          <button className="relative group p-2">
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-all duration-300 group-hover:rotate-90" />
            <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>

          {/* Notificações */}
          <button className="relative group p-2">
            <Bell className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-all duration-300" />
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full shadow-lg">
              2
            </span>
            <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>

          {/* Perfil do Usuário */}
          <div 
            ref={userButtonRef} 
            className="relative flex items-center gap-3 pl-4 border-l border-slate-700/50"
          >
            <div 
              className="relative group cursor-pointer"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-300" />
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-[1px] rounded-xl">
                <div className="bg-slate-800 p-2 rounded-xl group-hover:bg-slate-800/80 transition-colors duration-300">
                  <User className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                </div>
              </div>
            </div>
            <div 
              className="hidden md:flex flex-col cursor-pointer" 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <span className="text-sm font-medium text-slate-200">Admin</span>
              <span className="text-xs text-slate-400">Administrador</span>
            </div>
          </div>
        </div>
      </div>

      {/* Renderizar o menu dropdown fora da hierarquia do DOM */}
      {renderUserMenu()}
    </header>
  );
};

export default Header;