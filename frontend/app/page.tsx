"use client";

import { Play, CheckCircle, Zap, Map, TrendingUp } from "lucide-react";
import { signIn } from "next-auth/react";

function ContributionGraph() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-70 flex items-center justify-center">
      {/* Grid of squares */}
      <div className="grid grid-cols-[repeat(45,minmax(12px,1fr))] gap-1.5 p-8 transform -skew-y-3 scale-110 translate-x-12 -translate-y-8">
        {Array.from({ length: 600 }).map((_, i) => {
          // Deterministic pseudo-random distribution
          const score = (i * 17 + (i % 3) * 11) % 100;
          let color = "bg-slate-800/20";
          if (score > 40) color = "bg-emerald-900/40";
          if (score > 65) color = "bg-emerald-700/40";
          if (score > 85) color = "bg-emerald-500/40";
          
          return (
            <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
          );
        })}
      </div>
      {/* Radial fade overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_10%,_#020617_75%)]" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col pt-32 sm:pt-40 overflow-hidden text-slate-50 selection:bg-cyan-500/30">
      {/* Git Commit Background */}
      <ContributionGraph />
      
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950/90 to-slate-950"></div>
      <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Floating Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Column */}
          <div className="flex flex-col items-start text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              OPEN SOURCE, REAL IMPACT
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Stop Prompting.<br/>
              Start <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Building.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
              You know the theory. Now write the code. Transition from AI-prompting to hands-on development by fixing real, curated open-source issues.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
              <button 
                onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                className="group relative inline-flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-200 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                <span>Continue with GitHub</span>
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 pointer-events-none"></div>
              </button>
              
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:border-slate-600 group">
                <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                <span>See How It Works</span>
              </button>
            </div>
            
            {/* Features Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-800/50 w-full">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Smart Matching</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Map className="w-4 h-4 text-blue-400" />
                  <span>Step-by-Step Guidance</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Track & Grow</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Visual Showcase */}
          <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
            {/* Ambient glow behind editor */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 blur-[80px] rounded-full"></div>
            
            {/* Editor Window */}
            <div className="relative animate-float bg-gray-900/80 backdrop-blur-xl rounded-xl ring-1 ring-white/10 shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-slate-950/50">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="ml-2 text-xs font-medium text-slate-500">src/components/hero.tsx</div>
              </div>
              
              {/* Code Area */}
              <div className="p-4 sm:p-6 font-mono text-sm sm:text-base text-slate-300 overflow-x-auto">
                <div className="flex">
                  <span className="w-8 shrink-0 text-slate-600 select-none">1</span>
                  <span>export function Hero() {"{"}</span>
                </div>
                <div className="flex">
                  <span className="w-8 shrink-0 text-slate-600 select-none">2</span>
                  <span className="pl-4">return (</span>
                </div>
                <div className="flex">
                  <span className="w-8 shrink-0 text-slate-600 select-none">3</span>
                  <span className="pl-8">&lt;div className="hero"&gt;</span>
                </div>
                
                {/* Diff lines */}
                <div className="flex bg-red-500/10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-1 my-1">
                  <span className="w-8 shrink-0 text-red-500 select-none">-</span>
                  <span className="pl-12 text-red-400">&lt;h1&gt;Hello World&lt;/h1&gt;</span>
                </div>
                <div className="flex bg-green-500/10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-1 my-1 relative">
                  <span className="w-8 shrink-0 text-green-500 select-none">+</span>
                  <span className="pl-12 text-green-400 font-medium">&lt;h1 className="text-cyan-400"&gt;Start Building&lt;/h1&gt;</span>
                  {/* Subtle glow on added line */}
                  <div className="absolute inset-0 bg-green-400/5 blur-md"></div>
                </div>
                
                <div className="flex">
                  <span className="w-8 shrink-0 text-slate-600 select-none">6</span>
                  <span className="pl-8">&lt;/div&gt;</span>
                </div>
                <div className="flex">
                  <span className="w-8 shrink-0 text-slate-600 select-none">7</span>
                  <span className="pl-4">);</span>
                </div>
                <div className="flex">
                  <span className="w-8 shrink-0 text-slate-600 select-none">8</span>
                  <span>{"}"}</span>
                </div>
              </div>
            </div>
            
            {/* Floating Toast Notification */}
            <div className="absolute -bottom-6 -right-2 sm:-right-8 animate-float-delayed bg-gray-800 backdrop-blur-md ring-1 ring-white/10 rounded-lg p-4 shadow-2xl flex items-center gap-3 z-20">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Pull request merged!</p>
                <p className="text-xs text-slate-400">Your fix is now in production.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
