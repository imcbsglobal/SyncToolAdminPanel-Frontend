// src/components/Auth/LogoutButton.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const success = await logout();
      if (success) {
        navigate("/login");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center text-white bg-red-500 hover:bg-red-600 py-1 px-3 rounded-md transition-colors"
    >
      {isLoggingOut ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
      ) : (
        <span className="material-icons text-sm mr-1">logout</span>
      )}
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
