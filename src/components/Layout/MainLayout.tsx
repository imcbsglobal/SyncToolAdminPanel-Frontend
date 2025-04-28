// src/components/Layout/MainLayout.tsx
import React, { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";
import { useAuth } from "../../context/AuthContext";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify authentication when layout mounts
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        navigate("/login");
      }
    };

    verifyAuth();
  }, [checkAuth, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, this would eventually redirect via the useEffect,
  // but we can also return null to prevent flash of content
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 w-full">
        <Header />
      </div>
      <div className="flex flex-1">
        <div className="fixed top-[72px] left-0 bottom-0">
          <Sidebar />
        </div>
        <main className="flex-1 p-6 bg-gray-100 pl-72 pt-[90px]">
          <div className=" mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
