// src/components/Layout/Header.tsx
import React from "react";
import LogoutButton from "../auth/LogoutButton";

const Header: React.FC = () => {
  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Sync Tool Admin</h1>
        </div>
        <div>
          <LogoutButton /> {/* Add the LogoutButton here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
