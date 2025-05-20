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
setlocal enabledelayedexpansion

echo ===============================================
echo     DATABASE SYNCHRONIZATION CLIENT TOOL     
echo ===============================================
echo This tool synchronizes data between your local
echo SQL Anywhere database and the central server.
echo -----------------------------------------------
echo.

:: Set the client ID
set CLIENT_ID=${config.clientId}

:: Get directory where the bat file is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

:: Check if we're using the packaged executable or Node.js script
if exist "%SCRIPT_DIR%\\clientside-synctool.exe" (
    echo Running packaged sync tool...
    "%SCRIPT_DIR%\\clientside-synctool.exe" --clientId=%CLIENT_ID% --no-prompt
) else if exist "%SCRIPT_DIR%\\src\\sync-client.js" (
    echo Checking for Node.js...
    where node >nul 2>nul
    if !ERRORLEVEL! NEQ 0 (
        echo ERROR: Node.js is not installed or not in PATH
        echo Please install Node.js from https://nodejs.org/
        pause
        exit /b 1
    )
    
    echo Running Node.js sync tool...
    node "%SCRIPT_DIR%\\src\\sync-client.js" --clientId=%CLIENT_ID% --no-prompt
) else (
    echo ERROR: Could not find sync-client executable or script.
    echo Current directory: %SCRIPT_DIR%
    echo.
    echo Please make sure:
    echo 1. This bat file is in the same directory as sync-client.exe, or
    echo 2. There is a src\\sync-client.js file in this directory
    echo.
    echo If you're using this batch file separately from the sync tool,
    echo please make sure you've downloaded and extracted the sync client tool.
    pause
    exit /b 1
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Sync failed with error code %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Sync completed successfully!`;
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
                <p className="font-mono break-all">
                  {config.accessToken.substring(0, 10)}...
                </p>
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

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md">
            <h3 className="font-bold text-yellow-800 mb-2">
              Important Instructions
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-yellow-800">
              <li>
                Download both the <strong>Config JSON</strong> and{" "}
                <strong>Batch File</strong> above.
              </li>
              <li>
                Place both files in the same directory as your sync client tool
                (where sync-client.exe or src/sync-client.js is located).
              </li>
              <li>
                Double-click the batch file to run the synchronization process.
              </li>
              <li>
                If you receive any errors, please check that Node.js is
                installed or contact support.
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserConfig;
