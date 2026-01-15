// src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart2,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Admin only
  if (!user || user.role !== "admin") return null;

  const linkClasses = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? "bg-blue-700 text-white"
        : "text-gray-100 hover:bg-blue-700 hover:text-white"
    }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-blue-600 text-white flex flex-col shadow-lg">
      
      {/* Header */}
      <div className="px-4 py-4 border-b border-blue-500">
        <h1 className="text-lg font-semibold">
          Welcome, {user.username}
        </h1>
        <p className="text-xs text-blue-100">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link
          to="/admin-dashboard"
          className={linkClasses("/admin-dashboard")}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>

        <Link to="/reception" className={linkClasses("/reception")}>
          <Users size={18} />
          <span>Reception</span>
        </Link>

        <Link
          to="/AdmissionInformation"
          className={linkClasses("/AdmissionInformation")}
        >
          <BookOpen size={18} />
          <span>View Reception</span>
        </Link>
        <Link
          to="/agreement"
          className={linkClasses("/agreement")}
        >
          <BookOpen size={18} />
          <span>View agreement</span>
        </Link>

        {/* <Link
          to="/CompletionAtada"
          className={linkClasses("/CompletionAtada")}
        >
          <BookOpen size={18} />
          <span>Completion of the Atada</span>
        </Link> */}

        <Link to="/reports" className={linkClasses("/reports")}>
          <BarChart2 size={18} />
          <span>Reports</span>
        </Link>
      </nav>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="m-4 flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
