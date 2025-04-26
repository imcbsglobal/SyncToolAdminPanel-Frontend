import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bypassLoading, setBypassLoading] = useState(false);
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Add timeout to automatically bypass loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Auth check taking too long, bypassing loading state");
        setBypassLoading(true);
      }
    }, 3000); // 3 seconds timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!username || !password) {
      setSubmitError("Please enter both username and password");
      return;
    }

    console.log("Attempting login...");
    const success = await login({ username, password });
    console.log("Login result:", success);

    if (success) {
      navigate("/");
    }
  };

  // Show login form if bypass is active, regardless of loading state
  const showLoginForm = !isLoading || bypassLoading;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Super Admin Login
        </h1>

        {(error || submitError) && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <div className="flex items-center">
              <span className="material-icons mr-2">error_outline</span>
              <p>{error || submitError}</p>
            </div>
          </div>
        )}

        {!showLoginForm ? (
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="mb-4">Checking authentication status...</p>
            <button
              onClick={() => setBypassLoading(true)}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Bypass Loading
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                autoFocus
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
              disabled={isLoading && !bypassLoading}
            >
              {isLoading && !bypassLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <span className="material-icons mr-2">login</span>
                  Login
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
