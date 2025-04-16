// src/components/Layout/Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">Data Sync Admin Panel</h1>
      </div>
    </header>
  );
};

export default Header;
