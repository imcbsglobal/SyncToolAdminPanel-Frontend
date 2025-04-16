// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import UserList from "./components/Users/UserList";
import LogList from "./components/Logs/LogList";
import { api } from "./services/api";

const App: React.FC = () => {
  const [dbInitialized, setDbInitialized] = useState<boolean | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const initialized = await api.initializeDatabase();
        setDbInitialized(initialized);
      } catch (error) {
        console.error("Error checking database:", error);
        setDbInitialized(false);
      } finally {
        setInitializing(false);
      }
    };

    checkDatabase();
  }, []);

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Initializing Data Sync Admin Panel
          </h2>
          <p className="text-gray-600 mb-6">
            Please wait while we set up the application...
          </p>
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (dbInitialized === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center text-red-600 mb-4">
            <span className="material-icons text-5xl">error_outline</span>
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">
            Database Connection Error
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Unable to connect to the database. Please check your server
            configuration and ensure the API server is running.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/logs" element={<LogList />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
