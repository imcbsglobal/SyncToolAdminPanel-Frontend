// src/components/Layout/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: "dashboard" },
    { name: "Users", path: "/users", icon: "people" },
    { name: "Sync Logs", path: "/logs", icon: "history" },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6 text-center">Admin Console</h2>
      </div>

      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                <span className="material-icons mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
