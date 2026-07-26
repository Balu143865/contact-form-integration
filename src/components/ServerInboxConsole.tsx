import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Terminal, 
  Trash2, 
  RefreshCw, 
  Mail, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  User, 
  Globe, 
  Code, 
  Server,
  Zap,
  Filter,
  Eye,
  Check
} from 'lucide-react';
import { EmailLog, ServerApiLog } from '../types';

export const ServerInboxConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'apilogs'>('inbox');
  const [inboxMessages, setInboxMessages] = useState<EmailLog[]>([]);
  const [apiLogs, setApiLogs] = useState<ServerApiLog[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<EmailLog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('client@example.com');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DELIVERED' | 'SPAM_BLOCKED'>('ALL');

  const fetchInbox = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/inbox');
      const data = await res.json();
      setInboxMessages(data.messages || []);
      setRecipientEmail(data.recipientEmail || 'client@example.com');
      if (data.messages && data.messages.length > 0 && !selectedMsg) {
        setSelectedMsg(data.messages[0]);
      }
    } catch (e) {
      console.error('Error fetching inbox:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApiLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setApiLogs(data.logs || []);
    } catch (e) {
      console.error('Error fetching API logs:', e);
    }
  };

  useEffect(() => {
    fetchInbox();
    fetchApiLogs();
    const interval = setInterval(() => {
      fetchInbox();
      fetchApiLogs();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleClearInbox = async () => {
    if (window.confirm('Are you sure you want to clear all delivered messages from the inbox log?')) {
      try {
        await fetch('/api/inbox/clear', { method: 'POST' });
        setInboxMessages([]);
        setSelectedMsg(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeleteSingle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/inbox/${id}`, { method: 'DELETE' });
      setInboxMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMsg?.id === id) {
        setSelectedMsg(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredMessages = inboxMessages.filter((m) => {
    if (statusFilter === 'ALL') return true;
    return m.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      
      {/* Console Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white">
              Node.js Server Mail Console & API Log
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time deliverability mailbox and HTTP server request logs. Messages submitted from the contact form land here instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchInbox(); fetchApiLogs(); }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
            Refresh Data
          </button>

          {inboxMessages.length > 0 && (
            <button
              onClick={handleClearInbox}
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Log
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs: Inbox vs API HTTP Logs */}
      <div className="flex items-center space-x-2 mb-6 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'inbox'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Delivered Inquiries Inbox</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/40 text-slate-100 font-mono">
            {inboxMessages.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('apilogs')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'apilogs'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Server HTTP API Traffic Logs</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/40 text-slate-100 font-mono">
            {apiLogs.length}
          </span>
        </button>
      </div>

      {/* TAB 1: INBOX VIEW */}
      {activeTab === 'inbox' && (
        <div className="space-y-6">
          {/* Status Filter Pill Bar */}
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-medium">Filter Status:</span>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  statusFilter === 'ALL' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({inboxMessages.length})
              </button>
              <button
                onClick={() => setStatusFilter('DELIVERED')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  statusFilter === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Delivered ({inboxMessages.filter((m) => m.status === 'DELIVERED').length})
              </button>
              <button
                onClick={() => setStatusFilter('SPAM_BLOCKED')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  statusFilter === 'SPAM_BLOCKED' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Spam Trapped ({inboxMessages.filter((m) => m.status === 'SPAM_BLOCKED').length})
              </button>
            </div>

            <div className="text-slate-400 font-mono text-[11px] hidden sm:block">
              Route: POST /api/contact &rarr; Inbox Log
            </div>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-base font-semibold text-slate-300">No Messages in Inbox Log</p>
              <p className="text-xs max-w-md mx-auto">
                Submit a test message from the <strong className="text-sky-400">Live Contact Form</strong> tab to see how the Node.js backend captures and formats the data!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Message List Side (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 pb-2 border-b border-slate-800">
                  Received Inquiries ({filteredMessages.length})
                </div>

                {filteredMessages.map((msg) => {
                  const isSelected = selectedMsg?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMsg(msg)}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition-all relative ${
                        isSelected
                          ? 'bg-slate-800 border-sky-500 shadow-md'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-white truncate max-w-[160px]">
                          {msg.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            msg.status === 'SPAM_BLOCKED'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {msg.status === 'SPAM_BLOCKED' ? 'Spam Blocked' : 'Delivered'}
                        </span>
                      </div>

                      <div className="text-slate-300 font-medium truncate mb-1">
                        {msg.subject}
                      </div>

                      <p className="text-slate-400 text-[11px] line-clamp-2 mb-2 font-sans">
                        {msg.message}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
                        <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        <button
                          onClick={(e) => handleDeleteSingle(msg.id, e)}
                          className="p-1 hover:text-rose-400 transition-colors"
                          title="Delete Message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Payload Detail View (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                {selectedMsg ? (
                  <div className="space-y-6">
                    {/* Header bar */}
                    <div className="pb-4 border-b border-slate-800 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-white">{selectedMsg.subject}</h3>
                          {selectedMsg.status === 'SPAM_BLOCKED' && (
                            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Honeypot Shield Triggered
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-sky-400 font-mono mt-1">
                          Full Header: {selectedMsg.fullSubject}
                        </p>
                      </div>

                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(selectedMsg.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {/* Meta RFC info block */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block">From:</span>
                        <span className="text-slate-200 font-bold">{selectedMsg.name}</span>
                        <span className="text-slate-400 block">&lt;{selectedMsg.email}&gt;</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">To Recipient Inbox:</span>
                        <span className="text-emerald-400 font-bold">{selectedMsg.deliveredTo}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Sender IP Address:</span>
                        <span className="text-slate-300">{selectedMsg.ipAddress}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Sanitized Status:</span>
                        <span className="text-emerald-400 font-bold">
                          {selectedMsg.sanitized ? 'HTML Escaped & Cleaned' : 'Raw'}
                        </span>
                      </div>
                    </div>

                    {/* Email Message Content */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Message Body
                      </h4>
                      <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                        {selectedMsg.message}
                      </div>
                    </div>

                    {/* Raw JSON Code Snippet */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-sky-400" />
                        Server Memory Payload Inspection (JSON)
                      </h4>
                      <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                        {JSON.stringify(selectedMsg, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-500">
                    Select a message from the left list to view details.
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 2: SERVER API HTTP REQUEST LOGS */}
      {activeTab === 'apilogs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Node.js Express HTTP Traffic Log</h3>
              <p className="text-xs text-slate-400">
                Incoming API requests, HTTP status codes, execution duration, and payload summaries.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">{apiLogs.length} Log Entries</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
            {apiLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      log.method === 'POST' ? 'bg-sky-500/20 text-sky-300' : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {log.method}
                  </span>
                  <span className="text-white font-bold">{log.endpoint}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.statusCode === 200
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {log.statusCode} OK
                  </span>
                </div>

                <div className="flex items-center gap-4 text-slate-400 text-[11px] w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-slate-300 truncate max-w-[200px]" title={log.payloadSummary}>
                    Body: {log.payloadSummary}
                  </span>
                  <span>{log.durationMs}ms</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
