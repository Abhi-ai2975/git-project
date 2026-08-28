"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Sun, Moon, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch for theme toggle by only rendering icon after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle click outside for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl rounded-2xl z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border border-slate-200/50 dark:border-white/10 shadow-2xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-50 hover:opacity-80 transition-opacity">
            Open-Source Mentor
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5" /> /* Placeholder to prevent layout shift */
              )}
            </button>

            {/* Auth State */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none ring-2 ring-transparent focus:ring-cyan-500 rounded-full transition-shadow hover:ring-slate-300 dark:hover:ring-slate-600"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <img
                    src={session.user?.image || "https://github.com/identicons/jasonlong.png"}
                    alt={session.user?.name || "User Avatar"}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-slate-200 dark:border-slate-700 transform transition-all duration-200 origin-top-right z-50 ${
                    dropdownOpen
                      ? "opacity-100 scale-100 pointer-events-auto translateY-0"
                      : "opacity-0 scale-95 pointer-events-none -translate-y-2"
                  }`}
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {session.user?.email || "No email"}
                    </p>
                  </div>
                  
                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      Dashboard
                    </Link>
                    
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn("github")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 dark:bg-slate-50 px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 transition-all hover:bg-slate-800 dark:hover:bg-slate-200 shadow-sm hover:scale-[1.02] active:scale-95"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                Sign In with GitHub
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
