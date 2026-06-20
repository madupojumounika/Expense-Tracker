import { useContext, useState, useMemo } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Expenses() {
  const {
    expenses,
    setExpenses,
    dashboardExpenses,
    setDashboardExpenses,
  } = useContext(ExpenseContext);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [activeView, setActiveView] = useState("expenses");
  const [editingId, setEditingId] = useState(null);

  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(10);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const categories = ["Food", "Transport", "Entertainment", "Bills", "Medical", "Other"];

  const isFormValid = title && amount && category;

  const handleSaveExpense = () => {
    if (!user) {
      setMessage("Please login to manage expenses");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    if (!isFormValid) return;

    if (editingId) {
      setExpenses(
        expenses.map((e) =>
          e.id === editingId
            ? { ...e, title, amount: Number(amount), category }
            : e
        )
      );
      setDashboardExpenses(
        dashboardExpenses.map((e) =>
          e.id === editingId
            ? { ...e, title, amount: Number(amount), category }
            : e
        )
      );
      setEditingId(null);
    } else {
      setExpenses([
        ...expenses,
        {
          id: Date.now(),
          title,
          amount: Number(amount),
          category,
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    setTitle("");
    setAmount("");
    setCategory("");
  };

  const handleEditExpense = (expense) => {
    setEditingId(expense.id);
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteExpense = (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    setExpenses(expenses.filter((e) => e.id !== id));
    setDashboardExpenses(dashboardExpenses.filter((e) => e.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setTitle("");
      setAmount("");
      setCategory("");
    }
  };

  const handleRemoveFromDashboard = (id) => {
    setDashboardExpenses(dashboardExpenses.filter((e) => e.id !== id));
  };

  const handleAddToDashboard = (expense) => {
    const exists = dashboardExpenses.find((e) => e.id === expense.id);
    if (exists) return;

    const confirmMove = window.confirm(
      "Add this expense to dashboard? It will remain in expenses list."
    );
    if (!confirmMove) return;

    setDashboardExpenses([...dashboardExpenses, expense]);
  };

  const formatDateTime = (iso) =>
    new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const handleDownloadCSV = () => {
    if (expenses.length === 0) return alert("No expenses to download");
    const headers = ["Title", "Amount", "Category", "Date"];
    const csvContent = [
      headers.join(","),
      ...expenses.map(e => `"${e.title}",${e.amount},"${e.category}","${new Date(e.createdAt).toLocaleDateString("en-IN")}"`)
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (expenses.length === 0) return alert("No expenses to download");
    const doc = new jsPDF();
    doc.text("My Expenses", 14, 15);
    
    const tableData = expenses.map(e => [
      e.title,
      `Rs ${e.amount}`,
      e.category,
      new Date(e.createdAt).toLocaleDateString("en-IN")
    ]);
    
    autoTable(doc, {
      head: [['Title', 'Amount', 'Category', 'Date']],
      body: tableData,
      startY: 20,
    });
    
    doc.save("expenses.pdf");
  };

  const handleDownloadWord = () => {
    if (expenses.length === 0) return alert("No expenses to download");
    
    const tableRows = expenses.map(e => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${e.title}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">Rs ${e.amount}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${e.category}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${new Date(e.createdAt).toLocaleDateString("en-IN")}</td>
      </tr>
    `).join("");

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Expenses</title></head>
      <body>
        <h2>My Expenses</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Title</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Amount</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Category</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredExpenses = useMemo(() => {
    const data =
      activeCategory === "All"
        ? expenses
        : expenses.filter((e) => e.category === activeCategory);

    return data.slice(0, visibleCount);
  }, [expenses, activeCategory, visibleCount]);

  const totalFilteredCount =
    activeCategory === "All"
      ? expenses.length
      : expenses.filter((e) => e.category === activeCategory).length;

  const hasMore = totalFilteredCount > visibleCount;

//  dashboard
  const categoryData = useMemo(() => {
    const data = {};
    dashboardExpenses.forEach((e) => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return data;
  }, [dashboardExpenses]);

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "#1E40AF",
          "#059669",
          "#B91C1C",
          "#CA8A04",
          "#7C3AED",
          "#DB2777",
        ],
        borderWidth: 0,
      },
    ],
  };

  const dailyData = useMemo(() => {
    const data = {};
    dashboardExpenses.forEach((e) => {
      const date = new Date(e.createdAt).toLocaleDateString("en-IN");
      data[date] = (data[date] || 0) + e.amount;
    });
    return data;
  }, [dashboardExpenses]);

  const barData = {
    labels: Object.keys(dailyData),
    datasets: [
      {
        label: "Daily Expenses (₹)",
        data: Object.values(dailyData),
        backgroundColor: "#3B82F6",
        borderRadius: 6,
        barThickness: 14,
      },
    ],
  };

  const btnBaseLight = "bg-slate-200 text-slate-800 hover:bg-slate-300";
  const btnBaseDark = "bg-[#0b1220] border border-white/10 text-white hover:bg-white/5";
  const categoryBtnBaseLight = "bg-slate-200 text-slate-800 hover:bg-slate-300";
  const categoryBtnBaseDark = "bg-[#0b1220] border border-white/10 text-white hover:bg-white/5";
  const disabledBtn = "bg-gray-400 text-gray-200 cursor-not-allowed pointer-events-none";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Expenses
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track, organize and analyze your spending
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
              className="px-4 py-2.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              Download
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            {isDownloadMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111827] rounded-xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden z-50">
                <button
                  onClick={() => { handleDownloadPDF(); setIsDownloadMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition cursor-pointer"
                >
                  Download as PDF
                </button>
                <button
                  onClick={() => { handleDownloadCSV(); setIsDownloadMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition cursor-pointer border-t border-slate-100 dark:border-white/5"
                >
                  Download as Excel (CSV)
                </button>
                <button
                  onClick={() => { handleDownloadWord(); setIsDownloadMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition cursor-pointer border-t border-slate-100 dark:border-white/5"
                >
                  Download as Word
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ADD EXPENSE */}
        <div className="bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <h3 className="font-medium mb-4 text-slate-900 dark:text-white">
            {editingId ? "Edit Expense" : "Add New Expense"}
          </h3>

          <div className="flex flex-wrap gap-4 items-center">
            <input
              placeholder="Expense title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-60 px-4 py-2.5 rounded-xl border bg-white dark:bg-[#0b1220] focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
            />

            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-36 px-4 py-2.5 rounded-xl border bg-white dark:bg-[#0b1220] focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-44 px-4 py-2.5 rounded-xl border bg-white dark:bg-[#0b1220] focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 dark:text-slate-300"
            >
              <option value="" hidden>Select Category</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <button
              onClick={handleSaveExpense}
              disabled={!isFormValid}
              className={`px-6 py-2.5 rounded-xl font-medium transition ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  : disabledBtn
              }`}
            >
              {editingId ? "Update Expense" : "Add Expense"}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setAmount("");
                  setCategory("");
                }}
                className="px-6 py-2.5 rounded-xl font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:text-white transition cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          {message && <p className="text-red-500 mt-3">{message}</p>}
        </div>

        {/* VIEW TOGGLE */}
        <div className="mt-10 flex gap-4">
          {["expenses", "dashboard"].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-5 py-2.5 rounded-xl border font-medium transition cursor-pointer ${
                activeView === view
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-[#0b1220] dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              }`}
            >
              {view === "expenses" ? "All Expenses" : "Dashboard"}
            </button>
          ))}
        </div>

        {/* EXPENSES */}
        {activeView === "expenses" && (
          <>
            {/* CATEGORY FILTER */}
            <div className="mt-6 flex gap-3 flex-wrap">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(10);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-[#0b1220] dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* LIST */}
            <div className="mt-6 space-y-4">
              {filteredExpenses.map((exp) => {
                const isAdded = dashboardExpenses.some((e) => e.id === exp.id);

                return (
                  <div
                    key={exp.id}
                    className="flex justify-between bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 hover:shadow-md transition cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {exp.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        ₹ {exp.amount} · {exp.category}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDateTime(exp.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEditExpense(exp)}
                          className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition text-sm font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                      {isAdded ? (
                        <span className="text-green-600 font-medium text-sm">
                          Added to dashboard
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddToDashboard(exp)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition text-sm font-medium cursor-pointer"
                        >
                          Add to Dashboard
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VIEW MORE / VIEW LESS */}
            {totalFilteredCount > 10 && (
              <div className="mt-6 flex justify-center gap-4">
                {visibleCount < totalFilteredCount && (
                  <button
                    onClick={() => setVisibleCount((p) => p + 10)}
                    className="px-6 py-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-[#0b1220] dark:text-white dark:hover:bg-white/5 transition cursor-pointer font-medium"
                  >
                    View More
                  </button>
                )}

                {visibleCount > 10 && (
                  <button
                    onClick={() => setVisibleCount(10)}
                    className="px-6 py-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-[#0b1220] dark:text-white dark:hover:bg-white/5 transition cursor-pointer font-medium"
                  >
                    View Less
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* DASHBOARD */}
        {activeView === "dashboard" && (
          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#0b1220] p-6 rounded-2xl border dark:border-white/10 shadow-sm">
                <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">
                  Expenses by Category
                </h3>
                <div className="h-[240px]">
                  <Pie data={pieData} />
                </div>
              </div>

              <div className="bg-white dark:bg-[#0b1220] p-6 rounded-2xl border dark:border-white/10 shadow-sm">
                <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">
                  Daily Expenses
                </h3>
                <div className="h-[240px]">
                  <Bar
                    data={barData}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          grid: { color: "rgba(148,163,184,0.1)" },
                          ticks: { color: "#94a3b8" },
                        },
                        x: {
                          grid: { display: false },
                          ticks: { color: "#94a3b8" },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* DASHBOARD EXPENSES LIST */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">
                Dashboard Expenses List
              </h3>
              {dashboardExpenses.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">
                  No expenses added to dashboard yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {dashboardExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex justify-between bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 hover:shadow-md transition"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {exp.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          ₹ {exp.amount} · {exp.category}
                        </p>
                      </div>
                      <div className="flex gap-4 items-center">
                        <button
                          onClick={() => {
                            setActiveView("expenses");
                            handleEditExpense(exp);
                          }}
                          className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveFromDashboard(exp.id)}
                          className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition text-sm font-medium cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
