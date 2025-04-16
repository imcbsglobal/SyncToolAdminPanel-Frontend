// src/components/Users/UserForm.tsx
import React, { useState } from "react";
import { User, UserFormData } from "../../interfaces";
import { api } from "../../services/api";

interface UserFormProps {
  user: User | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<UserFormData>({
    dbName: user?.db_name || "",
    dbUser: user?.db_user || "",
    dbPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;

      if (user) {
        // Update existing user
        result = await api.updateUser(user.client_id, formData);
        if (result.success) {
          setSuccess(
            `User updated successfully! New access token: ${result.accessToken}`
          );
          setTimeout(() => {
            onSubmit();
          }, 2000);
        } else {
          setError(result.error || "Failed to update user");
        }
      } else {
        // Create new user
        result = await api.createUser(formData);
        if (result.success) {
          setSuccess(
            `User created successfully! Client ID: ${result.clientId}, Access Token: ${result.accessToken}`
          );
          setTimeout(() => {
            onSubmit();
          }, 2000);
        } else {
          setError(result.error || "Failed to create user");
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {user ? "Edit User" : "Add New User"}
        </h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {user && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={user.client_id}
                disabled
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100"
              />
            </div>
          )}

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="dbName"
            >
              Database Name
            </label>
            <input
              id="dbName"
              name="dbName"
              type="text"
              required
              value={formData.dbName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter database name"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="dbUser"
            >
              Database User
            </label>
            <input
              id="dbUser"
              name="dbUser"
              type="text"
              required
              value={formData.dbUser}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter database username"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="dbPassword"
            >
              Database Password
            </label>
            <input
              id="dbPassword"
              name="dbPassword"
              type="password"
              required
              value={formData.dbPassword}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={
                user
                  ? "Enter new password (or leave unchanged)"
                  : "Enter database password"
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Processing..." : user ? "Update User" : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
