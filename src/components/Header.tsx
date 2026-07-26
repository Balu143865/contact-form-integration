import React, { useState } from 'react';
import { 
  Briefcase, 
  Send, 
  Terminal, 
  FileText, 
  Users, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Server,
  Zap,
  Sun,
  Moon,
  BarChart3,
  Smartphone,
  Monitor,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeTab: 'details' | 'form-demo' | 'server-logs' | 'analytics' | 'handoff' | 'proposals';
  setActiveTab: (tab: 'details' | 'form-demo' | 'server-logs' | 'analytics' | 'handoff' | 'proposals') => void;
  inboxCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  inboxCount
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'details' as const, label: 'Project Details', icon: Briefcase },
    { id: 'form-demo' as const, label: 'Live Contact Form', icon: Send, badge: 'Working Demo' },
    { id: 'server-logs' as const, label: 'Node.js API & Inbox', icon: Terminal, count: inboxCount },
    { id: 'analytics' as const, label: 'Analytics & Metrics', icon: BarChart3 },
    { id: 'handoff' as const, label: 'Developer Hand-off & README', icon: FileText },
    { id: 'proposals' as const, label: 'Proposals (147)', icon: Users },
  ];

  const handleSelectTab = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };
  return (
    <header className="bg-[#0f172a] text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-xl no-print">
      {/* Top Freelancer Nav Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2 sm:gap-4 border-b border-slate-800/80 text-xs sm:text-sm">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-sky-500/10 text-sky-400 px-2.5 py-1.5 rounded-lg border border-sky-500/20 flex items-center gap-1.5 font-medium text-xs">
            <Briefcase className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-slate-200 font-semibold truncate max-w-[150px] sm:max-w-none">Freelancer Project Replica</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 font-mono text-xs hidden md:inline">Project ID: 40602592</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[11px] sm:text-xs px-2 py-1 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="hidden xs:inline sm:inline">Node.js API</span> Backend Ready
          </div>
          <a 
            href="#demo"
            onClick={(e) => { e.preventDefault(); setActiveTab('form-demo'); }}
            className="flex items-center gap-1 bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-semibold transition-all shadow-md shadow-sky-600/20 whitespace-nowrap"
          >
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Test Form</span>
          </a>
        </div>
      </div>

      {/* Main Job Title & Bid Summary */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Enhance Contact Form Functionality
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Open
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 flex-wrap">
              <span>Full-Stack Web Development</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-sky-400 font-medium text-xs sm:text-sm">JSX Frontend + Node.js Express API</span>
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-5 w-full lg:w-auto bg-slate-900/80 p-2.5 sm:p-3.5 rounded-xl border border-slate-800">
            <div className="text-center px-1 sm:px-2">
              <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Bids</div>
              <div className="text-lg sm:text-2xl font-bold text-slate-100 mt-0.5">147</div>
            </div>

            <div className="h-7 sm:h-8 w-px bg-slate-800"></div>

            <div className="text-center px-1 sm:px-2">
              <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Avg Bid</div>
              <div className="text-lg sm:text-2xl font-bold text-sky-400 mt-0.5">$129 <span className="text-[10px] sm:text-xs text-slate-400 font-normal">USD</span></div>
            </div>

            <div className="h-7 sm:h-8 w-px bg-slate-800"></div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button 
                onClick={toggleTheme}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all border border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-sky-400" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800 flex items-center justify-center min-h-[34px] min-w-[34px]"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4 text-sky-400" /> : <Menu className="w-4 h-4 text-slate-300" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-800 space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-3 py-1">
              Select Project View
            </div>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tab.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] bg-emerald-500/20 text-emerald-300 rounded font-mono">
                        {tab.badge}
                      </span>
                    )}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="px-2 py-0.5 text-[10px] bg-sky-500 text-slate-950 font-bold rounded-full">
                        {tab.count}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation Tabs (Desktop & Horizontal Scroll) */}
        <nav className="hidden md:flex space-x-1 sm:space-x-3 mt-8 border-b border-slate-800 overflow-x-auto scrollbar-none pb-px">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'details'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Project Details
          </button>

          <button
            onClick={() => setActiveTab('form-demo')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'form-demo'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Send className="w-4 h-4" />
            Live Contact Form
            <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 rounded font-mono">
              Working Demo
            </span>
          </button>

          <button
            onClick={() => setActiveTab('server-logs')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'server-logs'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Node.js API & Inbox
            {inboxCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-sky-500 text-slate-950 font-bold rounded-full">
                {inboxCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'analytics'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics & Metrics
          </button>

          <button
            onClick={() => setActiveTab('handoff')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'handoff'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Developer Hand-off & README
          </button>

          <button
            onClick={() => setActiveTab('proposals')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'proposals'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Proposals (147)
          </button>
        </nav>
      </div>
    </header>
  );
};
