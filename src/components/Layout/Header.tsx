// src/components/Layout/Header.tsx
import React from "react";
import LogoutButton from "../auth/LogoutButton";

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-[#FD6A03] to-[#f90] text-white p-4 shadow-md">
      <div className=" mx-auto flex justify-between items-center">
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
