"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, LogOut, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function NavBar() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-md px-6 py-4 transition-colors">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Open-Source Mentor
        </Link>
        
        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          {status === "loading" ? (
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
          ) : session ? (
            <div 
              className="relative" 
              ref={dropdownRef}
            >
              <button 
                className="flex items-center gap-2 focus:outline-none cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    width={36}
                    height={36}
                    className="rounded-full border border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-indigo-500 transition-all"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 hover:ring-2 hover:ring-indigo-500 transition-all">
                    <User size={20} />
                  </div>
                )}
              </button>

              {/* Hover Card / Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden z-50 transform origin-top-right transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {session.user?.name || "GitHub User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session.user?.email || "No email provided"}
                    </p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer mb-1"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors cursor-pointer"
            >
              Sign In with GitHub
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
