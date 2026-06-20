import {
  ChartBarIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="relative min-h-screen transition-colors duration-300">
      {/* BACKGROUND IMAGE */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{ backgroundImage: "url('/finance-bg.png')" }}
      />
      {/* OVERLAY FOR READABILITY */}
      <div className="fixed inset-0 z-0 bg-slate-50/70 dark:bg-[#020617]/80 backdrop-blur-sm transition-colors duration-300" />

      {/* CONTENT PORTION */}
      <div className="relative z-10">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-28">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight
                           text-slate-900 dark:text-white">
              Manage your expenses <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 drop-shadow-sm">
                with clarity & control
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 dark:text-gray-400 max-w-xl">
              A simple, elegant expense tracker designed to help you
              monitor spending, stay organized, and make better
              financial decisions.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl blur-3xl
                            bg-gradient-to-r from-blue-300/30 to-indigo-300/30
                            dark:from-blue-600/20 dark:to-purple-600/20" />
            <div className="relative bg-white/70 dark:bg-[#0b1220]/60 backdrop-blur-xl
                            border border-white/50 dark:border-white/10
                            rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:shadow-blue-500/10">
              <p className="text-sm text-slate-500 dark:text-gray-400">
                Monthly Overview
              </p>
              <h3 className="text-2xl font-semibold mt-2 text-slate-900 dark:text-white">
                ₹ 12,450 spent
              </h3>
              <div className="mt-6 h-3 w-full bg-slate-100 dark:bg-white/10 rounded-full">
                <div className="h-3 w-[65%] bg-blue-600 rounded-full transition-all" />
              </div>
            </div>
          </div>
          

        </div>
      </section>

      {/* WHY SECTION */}
      <section className="relative py-24">
        {/* Subtle inner background for separation */}
        <div className="absolute inset-0 bg-slate-100/50 dark:bg-[#0b1220]/50 backdrop-blur-md -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center
                         text-slate-900 dark:text-white">
            Why use Expense Tracker?
          </h2>

          <div className="grid md:grid-cols-4 gap-10 mt-16">
            {[
              {
                icon: CurrencyRupeeIcon,
                title: "Track Spending",
                desc: "Log every expense and understand where your money goes.",
              },
              {
                icon: ChartBarIcon,
                title: "Clear Insights",
                desc: "View totals and trends with clean summaries.",
              },
              {
                icon: ClockIcon,
                title: "Save Time",
                desc: "Quick entries without complicated steps.",
              },
              {
                icon: ShieldCheckIcon,
                title: "Private & Secure",
                desc: "All data stays safely in your browser.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-2xl backdrop-blur-lg
                           bg-white/60 dark:bg-slate-800/40
                           border border-white/50 dark:border-white/10
                           transition-all duration-300
                           hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <item.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-gray-400 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mt-16">
            {[
              "Create your account",
              "Add daily expenses",
              "Review and improve spending",
            ].map((step, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl backdrop-blur-lg bg-white/60 dark:bg-slate-800/40
                           border border-white/50 dark:border-white/10
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="text-blue-600 font-semibold text-sm">
                  STEP {i + 1}
                </span>
                <h3 className="mt-3 text-lg font-medium
                               text-slate-900 dark:text-white">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-300/50 dark:border-white/10
                         py-10 backdrop-blur-md bg-white/50 dark:bg-[#0b1220]/50">
        <div className="max-w-7xl mx-auto px-6
                        flex flex-col md:flex-row
                        items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-gray-400">
            © 2026 ExpenseTracker. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Built for learning UI & frontend excellence
          </p>
        </div>
      </footer>
      </div>

    </div>
  );
}
