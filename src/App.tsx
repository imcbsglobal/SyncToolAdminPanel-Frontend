// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import UserList from "./components/Users/UserList";
import LogList from "./components/Logs/LogList";
import LoginPage from "./components/auth/LoginPage";
import { api } from "./services/api";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Add this debug component to help diagnose routing/auth issues
const AuthDebugger: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("Current path:", location.pathname);
    console.log("Auth state:", { isAuthenticated, isLoading });
  }, [location.pathname, isAuthenticated, isLoading]);

  return null; // This component doesn't render anything
};

const AppRoutes: React.FC = () => {
  // This component wraps routes and has access to AuthContext
  const { isAuthenticated, isLoading } = useAuth();

  // Debug redirection events
  useEffect(() => {
    console.log("Auth state updated in AppRoutes:", {
      isAuthenticated,
      isLoading,
    });
  }, [isAuthenticated, isLoading]);

  return (
    <>
      <AuthDebugger />
      <Routes>
        {/* Public route - redirect to / if already authenticated */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        {/* Protected routes wrapped in MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/users"
            element={
              <MainLayout>
                <UserList />
              </MainLayout>
            }
          />
          <Route
            path="/logs"
            element={
              <MainLayout>
                <LogList />
              </MainLayout>
            }
          />
        </Route>

        {/* Redirect unmatched routes */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
        />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  const [dbInitialized, setDbInitialized] = useState<boolean | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const initialized = await api.initializeDatabase();
        console.log("Database initialization status:", initialized);
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
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;