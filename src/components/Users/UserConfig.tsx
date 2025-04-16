// src/components/Users/UserConfig.tsx
import React, { useState, useEffect } from "react";
import { UserConfig as UserConfigType } from "../../interfaces";
import { api } from "../../services/api";

interface UserConfigProps {
  clientId: string;
  onClose: () => void;
}

const UserConfig: React.FC<UserConfigProps> = ({ clientId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<UserConfigType | null>(null);
  const [showBatchFile, setShowBatchFile] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const result = await api.getUserConfig(clientId);
        if (result.success && result.config) {
          setConfig(result.config);
        } else {
          setError(result.error || "Failed to load configuration");
        }
      } catch (err) {
        console.error("Error fetching user config:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [clientId]);

  const generateBatchFile = () => {
    if (!config) return "";

    return `@echo off
echo Data Sync Client Starter
echo ------------------------------------------
echo Client ID: ${config.clientId}
echo Database: ${config.dbName}
echo ------------------------------------------
echo.

set CLIENT_ID=${config.clientId}
set ACCESS_TOKEN=${config.accessToken}
set API_URL=${config.apiUrl}

echo Sending data to sync server...
echo.

curl -X POST %API_URL%/api/sync/data ^
  -H "Content-Type: application/json" ^
  -d "{\\"clientId\\": \\"%CLIENT_ID%\\", \\"accessToken\\": \\"%ACCESS_TOKEN%\\", \\"data\\": []}"

echo.
echo Process completed.
echo Press any key to exit...
pause > nul`;
  };

  const handleDownloadConfig = () => {
    if (!config) return;

    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `sync-config-${config.clientId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadBatchFile = () => {
    if (!config) return;

    const batchContent = generateBatchFile();
    const blob = new Blob([batchContent], { type: "application/bat" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `sync-client-${config.clientId}.bat`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center p-8">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Configuration</h2>
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to User List
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {config && (
        <div className="mb-8">
          <div className="border rounded-md p-4 bg-gray-50 mb-4">
            <h3 className="font-bold mb-2">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Client ID</p>
                <p className="font-mono">{config.clientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Database Name</p>
                <p className="font-mono">{config.dbName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">API URL</p>
                <p className="font-mono break-all">{config.apiUrl}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Access Token</p>
                <p className="font-mono break-all">{config.accessToken}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-4">Configuration Files</h3>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleDownloadConfig}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex-1"
              >
                Download Config JSON
              </button>

              <button
                onClick={handleDownloadBatchFile}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex-1"
              >
                Download Batch File
              </button>

              <button
                onClick={() => setShowBatchFile(!showBatchFile)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex-1"
              >
                {showBatchFile ? "Hide" : "Show"} Batch File Content
              </button>
            </div>
          </div>

          {showBatchFile && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Batch File Content</h3>
              <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto whitespace-pre-wrap font-mono text-sm">
                {generateBatchFile()}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserConfig;
