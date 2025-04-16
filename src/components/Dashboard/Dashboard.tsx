// src/components/Dashboard/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { SyncLog, User } from "../../interfaces";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Load users and logs in parallel
        const [userList, logList] = await Promise.all([
          api.listUsers(),
          api.getSyncLogs(),
        ]);

        setUsers(userList);
        setLogs(logList);
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Get counts for summary cards
  const totalUsers = users.length;
  const totalSyncs = logs.length;
  const successfulSyncs = logs.filter(
    (log) => log.status.toLowerCase() === "success"
  ).length;
  const failedSyncs = logs.filter(
    (log) => log.status.toLowerCase() === "error"
  ).length;

  // Get recent logs (last 5)
  const recentLogs = [...logs]
    .sort(
      (a, b) =>
        new Date(b.sync_date).getTime() - new Date(a.sync_date).getTime()
    )
    .slice(0, 5);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return <div className="text-center p-8">Loading dashboard data...</div>;

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-500">
              <span className="material-icons">people</span>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Users</h3>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Total Syncs Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <span className="material-icons">sync</span>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Syncs</h3>
              <p className="text-2xl font-bold">{totalSyncs}</p>
            </div>
          </div>
        </div>

        {/* Successful Syncs Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <span className="material-icons">check_circle</span>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Successful Syncs</h3>
              <p className="text-2xl font-bold">{successfulSyncs}</p>
            </div>
          </div>
        </div>

        {/* Failed Syncs Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500">
              <span className="material-icons">error</span>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Failed Syncs</h3>
              <p className="text-2xl font-bold">{failedSyncs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Recent Sync Activity
        </h3>

        {recentLogs.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No sync logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Database
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {log.client_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.db_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(log.sync_date).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {log.records_synced}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                          log.status
                        )}`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/users"
            className="bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 transition-colors text-center"
          >
            Manage Users
          </a>
          <a
            href="/logs"
            className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            View Sync Logs
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
