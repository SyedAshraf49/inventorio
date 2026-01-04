import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  // FIX: Updated the type of `icon` to be more specific, indicating it's a React element that accepts a `className`.
  // This resolves the TypeScript error in React.cloneElement.
  icon: React.ReactElement<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: { bg: "bg-blue-100 dark:bg-blue-900/50", text: "text-blue-600 dark:text-blue-400" },
    green: { bg: "bg-green-100 dark:bg-green-900/50", text: "text-green-600 dark:text-green-400" },
    yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/50", text: "text-yellow-600 dark:text-yellow-400" },
    red: { bg: "bg-red-100 dark:bg-red-900/50", text: "text-red-600 dark:text-red-400" },
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105">
      <div className={`p-3 rounded-full ${colorClasses[color].bg}`}>
        {React.cloneElement(icon, { className: `h-6 w-6 ${colorClasses[color].text}` })}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
