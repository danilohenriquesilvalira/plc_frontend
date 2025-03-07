// Layout.tsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          onLogout={() => console.log('logout')} 
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;  // Adicionado export default