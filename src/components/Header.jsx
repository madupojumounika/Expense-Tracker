import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const navigate = useNavigate();
  const { resetExpenses } = useContext(ExpenseContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isLoggedIn = !!currentUser;

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    resetExpenses();
    setShowDropdown(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#0b1220]/70 backdrop-blur-md shadow-sm transition-colors duration-300 border-b border-slate-200/50 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 dark:text-indigo-400">
          Expense Tracker
        </h1>

        <nav className="flex gap-6 items-center relative">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/expenses"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors duration-300"
          >
            Expenses
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            title="Toggle theme"
          >
            {theme === "light" ? (
              <MoonIcon className="h-5 w-5 text-gray-600" />
            ) : (
              <SunIcon className="h-5 w-5 text-yellow-400" />
            )}
          </button>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition-colors duration-300"
            >
              Login
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Icon */}
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-8 h-8 rounded-full bg-blue-600 dark:bg-indigo-500 flex items-center justify-center text-white cursor-pointer select-none transition-all hover:scale-105"
                title="Profile"
              >
                {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
              </div>

              {/* Dropdown Box */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 transition-all duration-200">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{currentUser.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
