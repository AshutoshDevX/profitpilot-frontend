import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await api.get("profile");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user info");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const linkClass = (path) =>
    `px-3 py-1 rounded-md transition ${location.pathname === path
      ? "text-indigo-400"
      : "hover:text-indigo-300"
    }`;

  // Get user initials
  const getInitials = () => {
    if (!user?.user_name) return "U";
    const names = user.user_name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  return (
    <div className="fixed top-0 w-full flex justify-center z-50">
      <nav
        className="mt-6 w-[85%] bg-white/10 backdrop-blur-xl
                   border border-white/20
                   text-white px-6 py-3
                   flex justify-between items-center
                   rounded-2xl shadow-xl"
      >
        {/* LOGO */}
        <h1 className="text-xl font-extrabold tracking-wide">
          Profit<span className="text-indigo-400">Pilot</span>
        </h1>

        {/* LINKS */}
        <div className="flex gap-4 items-center text-sm font-medium">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/predict" className={linkClass("/predict")}>
            Predict
          </Link>
          <Link to="/history" className={linkClass("/history")}>
            History
          </Link>
          <Link to="/insights" className={linkClass("/insights")}>
            Insights
          </Link>
          <Link to="/alerts" className={linkClass("/alerts")}>
            Alerts
          </Link>
          <Link to="/budget" className={linkClass("/budget")}>
            Budget
          </Link>

          {/* USER DROPDOWN */}
          <div className="relative ml-4" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl
                       bg-white/10 hover:bg-white/20 transition border border-white/20"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
                            flex items-center justify-center text-white font-bold text-sm">
                {getInitials()}
              </div>
              <span className="hidden md:block max-w-[100px] truncate">
                {user?.user_name || "Account"}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl
                            border border-white/20 rounded-xl shadow-2xl overflow-hidden
                            animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white font-semibold truncate">
                    {user?.user_name || "User"}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {user?.company_name || "No company set"}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-white/10
                             hover:text-white transition"
                  >
                    <span>👤</span>
                    My Profile
                  </Link>
                  <Link
                    to="/insights"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-white/10
                             hover:text-white transition"
                  >
                    <span>💡</span>
                    Insights
                  </Link>
                  <Link
                    to="/export"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-white/10
                             hover:text-white transition"
                  >
                    <span>📥</span>
                    Export Data
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-white/10 py-2">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-2 w-full text-red-400
                             hover:bg-red-500/20 hover:text-red-300 transition"
                  >
                    <span>🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
