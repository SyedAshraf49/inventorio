
import React from 'react';
import { PlusIcon, MenuIcon } from './Icons';
import { type User, type Notification } from '../types';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onAddItem: () => void;
  toggleSidebar: () => void;
  user: User;
  onLogout: () => void;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddItem, toggleSidebar, user, onLogout, notifications, onMarkAllAsRead, onClearNotifications }) => {
  return (
    <header className="flex items-center justify-between h-16 bg-card border-b border-border px-4 sm:px-6 z-10 flex-shrink-0">
      <div className="flex items-center">
         <button onClick={toggleSidebar} className="text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden mr-4">
            <MenuIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold text-foreground hidden sm:block">Welcome, {user.username}</h2>
      </div>
      <div className="flex items-center space-x-4">
        {user.role === 'admin' && (
            <button 
              onClick={onAddItem}
              className="flex items-center justify-center bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 ease-in-out"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Product
            </button>
        )}
         <NotificationBell 
            notifications={notifications}
            onMarkAllAsRead={onMarkAllAsRead}
            onClearNotifications={onClearNotifications}
         />
         <ThemeToggle />
         <button 
          onClick={onLogout}
          className="bg-card py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
