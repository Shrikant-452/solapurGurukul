import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import './UserManagement.css';

const UserManagement = () => {
  const { getAllUsers, updateUserRole } = useAuth();
  const [users, setUsers] = useState(getAllUsers());

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole);
    setUsers(getAllUsers());
    toast.success(`User role updated to ${newRole}`);
  };

  return (
    <div className="user-management">
      <div className="users-table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-small">{user.name?.[0]}</div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {user.role !== 'admin' && (
                    <button
                      className="btn-outline-small"
                      onClick={() => handleRoleChange(user.id, 'admin')}
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;