
import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, LowStockIcon, OutOfStockIcon } from './Icons';
import { type Notification } from '../types';

interface NotificationBellProps {
    notifications: Notification[];
    onMarkAllAsRead: () => void;
    onClearNotifications: () => void;
}

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
};

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, onMarkAllAsRead, onClearNotifications }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={handleToggle} className="relative text-muted-foreground hover:text-foreground focus:outline-none">
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-popover rounded-lg shadow-xl border border-border z-50">
                    <div className="p-3 border-b border-border flex justify-between items-center sticky top-0 bg-popover z-10">
                        <h4 className="font-semibold text-foreground">Notifications</h4>
                        {notifications.length > 0 && (
                            <div className="flex items-center gap-2">
                                <button onClick={onMarkAllAsRead} className="text-xs text-primary hover:underline">Mark all as read</button>
                                <button onClick={onClearNotifications} className="text-xs text-red-600 hover:underline">Archive All</button>
                            </div>
                        )}
                    </div>
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            You're all caught up!
                        </div>
                    ) : (
                        <ul className="divide-y divide-border">
                           {notifications.map(n => (
                                <li key={n.id} className={`p-3 flex items-start gap-3 hover:bg-secondary ${!n.isRead ? 'bg-secondary' : ''}`}>
                                    <div className="flex-shrink-0 mt-1">
                                        {n.type === 'lowStock' && <LowStockIcon className="w-5 h-5 text-yellow-500" />}
                                        {n.type === 'outOfStock' && <OutOfStockIcon className="w-5 h-5 text-red-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-semibold text-foreground">{n.productName}</span> {n.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{timeSince(n.timestamp)}</p>
                                    </div>
                                </li>
                           ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
