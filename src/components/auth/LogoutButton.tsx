// src/components/Auth/LogoutButton.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoMdClose } from "react-icons/io";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutPopUp, setLogoutPopUp] = useState(false);

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
    <div>
      <button
        onClick={() => setLogoutPopUp(!logoutPopUp)}
        disabled={isLoggingOut}
        className="flex items-center text-white bg-[#ffffff4a] cursor-pointer backdrop-blur-2xl py-2 px-6 rounded-md transition-colors"
      >
        {isLoggingOut ? (
          <div className="w-4 h-4 border-2 cursor-pointer border-white border-t-transparent rounded-full animate-spin mr-1"></div>
        ) : (
          <span className="material-icons text-sm mr-1 cursor-pointer">
            logout
          </span>
        )}
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>

      {/* Logout Confirmation */}
      {logoutPopUp && (
        <div className="fixed top-[70px] right-2 w-[300px] z-20 h-[150px] bg-gradient-to-br from-[#ffffff] to-[#ffffff] rounded-2xl backdrop-blur-2xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] py-5">
          <div
            onClick={() => setLogoutPopUp(!logoutPopUp)}
            className="text-[#000] cursor-pointer absolute top-2 right-2"
          >
            <IoMdClose />
          </div>
          <div className="text-[#000] mb-5 font-semibold text-center">
            Are you sure want to logout
          </div>
          <div className="flex justify-center  items-center gap-10">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-6 py-2 bg-[#f00] rounded-lg cursor-pointer shadow-sm font-medium"
            >
              Logout
            </button>
            <button
              onClick={() => setLogoutPopUp(!logoutPopUp)}
              className="px-6 py-2 cursor-pointer bg-[#cafffc] rounded-lg shadow-sm text-[#000] font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutButton;
