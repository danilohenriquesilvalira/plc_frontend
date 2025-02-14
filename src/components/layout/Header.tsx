// Header.tsx
import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string; // nova prop para definir o título da página
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title }) => {
  return (
    <header className="bg-slate-800 shadow-lg px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={onToggleSidebar} 
          className="mr-4 md:hidden focus:outline-none text-gray-300 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white">2</span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-medium">
            A
          </div>
          <span className="text-gray-300 hidden md:block">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
