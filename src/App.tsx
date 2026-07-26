import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Send, 
  Terminal, 
  BarChart3, 
  FileText
} from 'lucide-react';
import { Header } from './components/Header';
import { JobDetails } from './components/JobDetails';
import { ContactFormDemo } from './components/ContactFormDemo';
import { ServerInboxConsole } from './components/ServerInboxConsole';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DeveloperHandoff } from './components/DeveloperHandoff';
import { ProposalsList } from './components/ProposalsList';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState<'details' | 'form-demo' | 'server-logs' | 'analytics' | 'handoff' | 'proposals'>('details');
  const [inboxCount, setInboxCount] = useState<number>(0);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Poll inbox message count for header badge
  useEffect(() => {
    const checkInbox = async () => {
      try {
        const res = await fetch('/api/inbox');
        const data = await res.json();
        if (data && typeof data.total === 'number') {
          setInboxCount(data.total);
        }
      } catch (e) {
        // Silently handle initial boot delay
      }
    };

    checkInbox();
    const interval = setInterval(checkInbox, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-slate-950 flex flex-col pb-16 md:pb-0">
      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inboxCount={inboxCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'details' && (
          <JobDetails
            onTestFormClick={() => setActiveTab('form-demo')}
            onViewHandoffClick={() => setActiveTab('handoff')}
          />
        )}

        {activeTab === 'form-demo' && (
          <ContactFormDemo
            onSubmissionSuccess={(res) => {
              setInboxCount((prev) => prev + 1);
              setToast({
                id: res?.id || Date.now().toString(),
                title: 'Message Delivered Successfully!',
                message: res?.message || 'Your inquiry was sanitized and logged to the Node.js Express API backend.',
                actionLabel: 'View in Node.js Inbox',
                onAction: () => setActiveTab('server-logs'),
              });
            }}
          />
        )}

        {activeTab === 'server-logs' && <ServerInboxConsole />}

        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {activeTab === 'handoff' && <DeveloperHandoff />}

        {activeTab === 'proposals' && <ProposalsList />}
      </main>

      {/* Mobile Sticky Quick-Dock Navigation Bar (Only visible on small touch screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-1.5 flex justify-around items-center no-print shadow-2xl">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${
            activeTab === 'details' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px]">Details</span>
        </button>

        <button
          onClick={() => setActiveTab('form-demo')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all relative ${
            activeTab === 'form-demo' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-5 h-5" />
          <span className="text-[10px]">Live Form</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>

        <button
          onClick={() => setActiveTab('server-logs')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all relative ${
            activeTab === 'server-logs' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-5 h-5" />
          <span className="text-[10px]">Inbox</span>
          {inboxCount > 0 && (
            <span className="absolute top-0.5 right-1 px-1.5 py-0.2 text-[9px] bg-sky-500 text-slate-950 font-black rounded-full">
              {inboxCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${
            activeTab === 'analytics' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px]">Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('handoff')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${
            activeTab === 'handoff' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">README</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Freelancer Job Replica Solution • <span className="text-slate-400 font-mono">Enhance Contact Form Functionality</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('details')} className="hover:text-sky-400">Project Details</button>
            <button onClick={() => setActiveTab('form-demo')} className="hover:text-sky-400">Live Form Demo</button>
            <button onClick={() => setActiveTab('server-logs')} className="hover:text-sky-400">Node.js API</button>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-sky-400">Analytics</button>
            <button onClick={() => setActiveTab('handoff')} className="hover:text-sky-400">README Guide</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
