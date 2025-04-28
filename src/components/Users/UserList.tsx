// src/components/Users/UserList.tsx
import React, { useState, useEffect } from "react";
import { User } from "../../interfaces";
import { api } from "../../services/api";
import UserForm from "./UserForm";
import UserConfig from "./UserConfig";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [configUser, setConfigUser] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const userList = await api.listUsers();
      setUsers(userList);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowAddForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowAddForm(true);
  };

  const handleDeleteUser = async (clientId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const result = await api.deleteUser(clientId);
        if (result.success) {
          setUsers(users.filter((user) => user.client_id !== clientId));
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user");
      }
    }
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingUser(null);
  };

  const handleFormSubmit = async () => {
    await loadUsers();
    handleFormClose();
  };

  const handleShowConfig = (clientId: string) => {
    setConfigUser(clientId);
  };

  const handleConfigClose = () => {
    setConfigUser(null);
  };

  if (loading) return <div className="text-center p-8">Loading users...</div>;

  if (configUser) {
    return <UserConfig clientId={configUser} onClose={handleConfigClose} />;
  }

  if (showAddForm) {
    return (
      <UserForm
        user={editingUser}
        onSubmit={handleFormSubmit}
        onCancel={handleFormClose}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button
          onClick={handleAddUser}
          className="bg-[#f90] font-medium text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add New User
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No users found. Add your first user to get started.
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y overflow-x-auto divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Database Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Database User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.client_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.client_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.client_name || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.db_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.db_user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.address || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.phone_number || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.username || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.password ? (
                        <span className="flex items-center">
                          <span className="mr-2">••••••••</span>
                          <button
                            onClick={() => alert(`Password: ${user.password}`)}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Show
                          </button>
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <button
                      onClick={() => handleShowConfig(user.client_id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Config
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.client_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
