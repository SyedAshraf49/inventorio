
import React from 'react';
import { mockUsers } from '../data/users';
import { type User } from '../types';

const Users: React.FC = () => {
    return (
        <div className="bg-card p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-foreground mb-6">User Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-secondary">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {mockUsers.map((user: User) => (
                            <tr key={user.id} className="hover:bg-secondary">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground capitalize">{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Users;
