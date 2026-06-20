import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseContext } from "../context/ExpenseContext";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setExpenses, setDashboardExpenses } = useContext(ExpenseContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));

      const userExpenses =
        JSON.parse(localStorage.getItem(`expenses_${user.email}`)) || [];
      const userDashboard =
        JSON.parse(localStorage.getItem(`dashboardExpenses_${user.email}`)) ||
        [];

      setExpenses(userExpenses);
      setDashboardExpenses(userDashboard);

      console.log(`Welcome back, ${user.name}`);

      setTimeout(() =>{
        setLoading(false);
        navigate("/expenses");  
      }, 500);
      
    } else {
      alert("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0b1220] transition-colors relative">

      <div className="w-[400px] rounded-3xl p-8 relative z-10
                      bg-white dark:bg-[#111827]
                      border border-slate-200 dark:border-white/10
                      shadow-xl">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
            <LockClosedIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
            Login to continue tracking expenses
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-slate-400 dark:text-gray-500" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-11 pr-4 py-3 rounded-xl font-medium
                         bg-white/50 dark:bg-black/20
                         border border-slate-200 dark:border-white/10
                         text-slate-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-600/50 dark:focus:ring-blue-500/50
                         transition-all placeholder-slate-400 dark:placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-slate-400 dark:text-gray-500" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-11 pr-11 py-3 rounded-xl font-medium
                         bg-white/50 dark:bg-black/20
                         border border-slate-200 dark:border-white/10
                         text-slate-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-600/50 dark:focus:ring-blue-500/50
                         transition-all placeholder-slate-400 dark:placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl font-semibold
                       bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
                       text-white transition-all shadow-lg shadow-blue-600/30"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm font-medium text-center mt-8
                      text-slate-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
