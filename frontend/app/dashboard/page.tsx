"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchUserProfile, fetchRecommendations } from "@/lib/api";
import { redirect } from "next/navigation";
import { FolderGit2, Star, GitCommit, Code, AlertCircle, Target, ExternalLink } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }

    if (status === "authenticated" && session?.accessToken) {
      setLoading(true);
      
      // Fetch both profile and recommendations in parallel
      Promise.all([
        fetchUserProfile(session.accessToken),
        fetchRecommendations(session.accessToken)
      ])
        .then(([profileData, recData]) => {
          setProfile(profileData);
          setRecommendations(recData);
          setError(null);
        })
        .catch((err) => {
          setError(err.message || "Failed to load dashboard data.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Redirecting...
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Analyzing your open-source presence and recommending your next issue.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Connection Error</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
              <p className="mt-2 text-xs text-red-600 dark:text-red-500">Ensure the FastAPI backend is running on port 8000.</p>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && !error && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && profile && recommendations && !error && (
          <div className="space-y-12">
            
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contributions & Skill Level */}
              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                    <GitCommit className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contributions</p>
                    <p className="text-2xl font-bold">{profile.total_contributions.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Assessed Skill Level</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
                    {recommendations.primary_language} • {recommendations.skill_level}
                  </span>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Languages</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 h-full">
                  {profile.top_languages.length > 0 ? (
                    profile.top_languages.map((lang: string) => (
                      <span key={lang} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 h-6">
                        {lang}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Not enough data</span>
                  )}
                </div>
              </div>
            </div>

            {/* Recommended Issues */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xl font-semibold">Recommended Issues</h2>
                </div>
              </div>
              
              {recommendations.issues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.issues.map((issue: any, i: number) => (
                    <a
                      key={i}
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-semibold text-[15px] leading-snug text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {issue.title}
                          </h3>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 flex-shrink-0" />
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                          <FolderGit2 className="w-3.5 h-3.5" />
                          {issue.repository}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {issue.labels.map((label: string) => (
                          <span key={label} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
                            {label}
                          </span>
                        ))}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No matching issues found at the moment. Try again later!</p>
                </div>
              )}
            </div>

            {/* Pinned Repositories */}
            <div className="opacity-75">
              <div className="flex items-center gap-2 mb-4">
                <FolderGit2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-xl font-semibold">Pinned Repositories</h2>
              </div>
              
              {profile.pinned_repositories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.pinned_repositories.map((repo: any, i: number) => (
                    <a
                      key={i}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-400 dark:hover:border-gray-600 transition-all cursor-pointer"
                    >
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:underline truncate">
                          {repo.name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {repo.description || "No description provided."}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                        {repo.language && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span>
                            {repo.language}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500" />
                          {repo.stars}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No pinned repositories found on GitHub.</p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
