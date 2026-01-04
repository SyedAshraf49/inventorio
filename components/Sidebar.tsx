
import React from 'react';
import { DashboardIcon, ProductIcon, UsersIcon, CategoryIcon, ReportIcon, HistoryIcon } from './Icons';

type View = 'dashboard' | 'products' | 'users' | 'categories' | 'reports' | 'audit';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  userRole: 'admin' | 'staff';
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isSidebarOpen, setIsSidebarOpen, userRole }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, roles: ['admin', 'staff'] },
    { id: 'products', label: 'Products', icon: ProductIcon, roles: ['admin', 'staff'] },
    { id: 'categories', label: 'Categories', icon: CategoryIcon, roles: ['admin'] },
    { id: 'reports', label: 'Reports', icon: ReportIcon, roles: ['admin'] },
    { id: 'audit', label: 'Audit Log', icon: HistoryIcon, roles: ['admin'] },
    { id: 'users', label: 'Users', icon: UsersIcon, roles: ['admin'] },
  ];

  const availableNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-sidebar-bg text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-shrink-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-20 border-b border-white/10">
            <h1 className="text-2xl font-bold text-white tracking-wider">Inventorio</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-2">
            {availableNavItems.map((item) => (
              <a
                key={item.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView(item.id as View);
                  if (window.innerWidth < 768) { // md breakpoint
                    setIsSidebarOpen(false);
                  }
                }}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  currentView === item.id
                    ? 'bg-sidebar-active text-white'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6 mr-3" />
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"></div>}
    </>
  );
};

export default Sidebar;
