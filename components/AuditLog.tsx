
import React from 'react';
import { type AuditLog } from '../types';

interface AuditLogProps {
  logs: AuditLog[];
}

const AuditLogView: React.FC<AuditLogProps> = ({ logs }) => {
  return (
    <div className="bg-card p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-foreground mb-6">System Audit Log</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-secondary">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date & Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-secondary">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {log.user}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.action.includes('Delete') ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400' :
                      log.action.includes('Update') || log.action.includes('Edit') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                    }`}>
                      {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-foreground">
                  {log.details}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-10 text-muted-foreground">
                  No audit trail records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogView;
