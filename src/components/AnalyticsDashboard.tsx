import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Bot, 
  RefreshCw, 
  BarChart3, 
  AreaChart as AreaIcon, 
  PieChart as PieIcon,
  Calendar,
  Zap,
  Inbox,
  Filter,
  Download,
  FileSpreadsheet,
  Check,
  Printer,
  Clock,
  Activity,
  Flame,
  Sparkles,
  Layers
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DailyTrend {
  dateStr: string;
  label: string;
  fullDate: string;
  total: number;
  delivered: number;
  spamBlocked: number;
}

interface SubjectItem {
  subject: string;
  count: number;
}

interface HourlyItem {
  hour: number;
  hourLabel: string;
  count: number;
}

interface AnalyticsData {
  summary: {
    totalSubmissions: number;
    total7Days: number;
    delivered7Days: number;
    spamBlocked7Days: number;
    deliveryRate: number;
    dailyAverage: number;
    peakSubmissionTime?: string;
    peakHourLabel?: string;
    peakDay?: string;
    topSubject?: string;
  };
  dailyTrends: DailyTrend[];
  subjectBreakdown: SubjectItem[];
  hourlyDistribution?: HourlyItem[];
}

const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f43f5e', '#a78bfa', '#382bf8'];

// Enhanced Recharts Daily Breakdown Tooltip
const CustomDailyTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const dataPoint = payload[0]?.payload as DailyTrend;
  if (!dataPoint) return null;

  const total = dataPoint.total ?? (dataPoint.delivered + dataPoint.spamBlocked);
  const delivered = dataPoint.delivered ?? 0;
  const spamBlocked = dataPoint.spamBlocked ?? 0;
  const rate = total > 0 ? Math.round((delivered / total) * 100) : 100;

  return (
    <div className="bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 text-slate-100 dark:text-slate-100 light:text-slate-900 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md min-w-[230px] text-xs space-y-2.5 z-50 pointer-events-none">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div>
          <span className="font-bold text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 block">
            {dataPoint.label}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono">
            {dataPoint.fullDate}
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-400 dark:text-sky-400 light:text-sky-600 border border-sky-500/30 font-bold text-[10px]">
          {total} {total === 1 ? 'Payload' : 'Payloads'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-emerald-400 dark:text-emerald-400 light:text-emerald-600">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Valid Delivered:
          </span>
          <span className="font-bold">
            {delivered} <span className="text-[10px] opacity-80">({total > 0 ? ((delivered / total) * 100).toFixed(0) : 0}%)</span>
          </span>
        </div>

        <div className="flex items-center justify-between text-amber-400 dark:text-amber-400 light:text-amber-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Bot className="w-3.5 h-3.5" />
            Spam Trapped:
          </span>
          <span className="font-bold">
            {spamBlocked} <span className="text-[10px] opacity-80">({total > 0 ? ((spamBlocked / total) * 100).toFixed(0) : 0}%)</span>
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">
          <span>Delivery Clean Rate:</span>
          <span className="font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">{rate}%</span>
        </div>
        <div className="w-full bg-slate-800 dark:bg-slate-800 light:bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-sky-400 to-emerald-400 transition-all duration-300"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Enhanced Recharts Pie Chart Tooltip
const CustomPieTooltip: React.FC<any> = ({ active, payload, total }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const subjectName = item.name;
  const count = item.value;
  const pct = total && total > 0 ? ((count / total) * 100).toFixed(1) : '0';

  return (
    <div className="bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 text-slate-100 dark:text-slate-100 light:text-slate-900 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1 min-w-[180px] pointer-events-none">
      <p className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">{subjectName}</p>
      <div className="flex items-center justify-between text-sky-400 font-semibold pt-1">
        <span>Inquiries:</span>
        <span className="font-bold">{count} ({pct}%)</span>
      </div>
    </div>
  );
};

export const AnalyticsDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'stackedBar' | 'area' | 'pie'>('stackedBar');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      let csvContent = '';

      // Try fetching detailed inbox logs
      const res = await fetch('/api/inbox');
      if (res.ok) {
        const json = await res.json();
        const messages: any[] = json.messages || [];

        const headers = ['Tracking ID', 'Timestamp', 'Name', 'Email', 'Subject', 'Status', 'Honeypot Caught', 'IP Address', 'Message'];
        const rows = messages.map((m) => [
          m.id,
          new Date(m.timestamp).toISOString(),
          m.name,
          m.email,
          m.subject,
          m.status,
          m.honeypotCaught ? 'Yes' : 'No',
          m.ipAddress,
          m.message.replace(/\n/g, ' ')
        ]);

        const escapeCsvField = (field: any) => {
          const str = String(field ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };

        csvContent = [
          headers.map(escapeCsvField).join(','),
          ...rows.map((row) => row.map(escapeCsvField).join(','))
        ].join('\r\n');
      } else if (data) {
        // Fallback to daily trend summary
        const headers = ['Date', 'Label', 'Total Submissions', 'Delivered Messages', 'Spam Blocked'];
        const rows = data.dailyTrends.map((d) => [
          d.dateStr,
          d.label,
          d.total,
          d.delivered,
          d.spamBlocked
        ]);

        const escapeCsvField = (field: any) => {
          const str = String(field ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };

        csvContent = [
          headers.map(escapeCsvField).join(','),
          ...rows.map((row) => row.map(escapeCsvField).join(','))
        ].join('\r\n');
      }

      if (csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `contact_form_analytics_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      }
    } catch (err) {
      console.error('CSV Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const openStandalonePrintWindow = () => {
    try {
      const printWindow = window.open('', '_blank', 'width=900,height=800');
      if (!printWindow) {
        alert('Pop-up blocked. Please allow pop-ups or use the Print button in the modal.');
        return;
      }

      const reportHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Contact Form Executive Analytics Report</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 32px; color: #0f172a; line-height: 1.5; background: #fff; }
              .header { border-b: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
              h1 { font-size: 22px; font-weight: 800; margin: 0 0 4px 0; color: #0f172a; }
              .meta { font-size: 12px; color: #64748b; }
              .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
              .kpi-card { border: 1px solid #cbd5e1; padding: 16px; border-radius: 8px; background: #f8fafc; }
              .kpi-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; }
              .kpi-value { font-size: 26px; font-weight: 800; margin-top: 6px; color: #0f172a; }
              .kpi-sub { font-size: 11px; margin-top: 4px; font-weight: 600; }
              table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
              th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
              th { background-color: #f1f5f9; font-weight: 700; color: #334155; }
              tr:nth-child(even) { background-color: #f8fafc; }
              .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
              .badge-delivered { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
              .badge-spam { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
              .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
              .print-btn { background: #0284c7; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
              @media print { .no-print { display: none !important; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1>Contact Form Analytics Executive Report</h1>
                <div class="meta">7-Day Performance & Honeypot Protection Summary &bull; Generated: ${new Date().toLocaleString()}</div>
              </div>
              <button class="print-btn no-print" onclick="window.print()">Print / Save PDF</button>
            </div>

            <div class="kpi-grid">
              <div class="kpi-card">
                <div class="kpi-label">7-Day Submissions</div>
                <div class="kpi-value">${data?.summary.total7Days ?? 0}</div>
                <div class="kpi-sub" style="color: #0284c7;">~${data?.summary.dailyAverage ?? 0}/day avg</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Delivered Messages</div>
                <div class="kpi-value" style="color: #059669;">${data?.summary.delivered7Days ?? 0}</div>
                <div class="kpi-sub" style="color: #059669;">${data?.summary.deliveryRate ?? 100}% Success</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Spam Honeypot Trapped</div>
                <div class="kpi-value" style="color: #d97706;">${data?.summary.spamBlocked7Days ?? 0}</div>
                <div class="kpi-sub" style="color: #d97706;">Bot Shield Active</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Total Inbox Store</div>
                <div class="kpi-value">${data?.summary.totalSubmissions ?? 0}</div>
                <div class="kpi-sub" style="color: #64748b;">Backend Express Log</div>
              </div>
            </div>

            <h3>Daily Breakdown (Last 7 Days)</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Payload Count</th>
                  <th>Delivered</th>
                  <th>Spam Blocked</th>
                  <th>Delivery Rate</th>
                </tr>
              </thead>
              <tbody>
                ${data?.dailyTrends.map(d => {
                  const rate = d.total > 0 ? Math.round((d.delivered / d.total) * 100) : 100;
                  return `
                    <tr>
                      <td><strong>${d.label}</strong> (${d.fullDate})</td>
                      <td><strong>${d.total}</strong></td>
                      <td><span class="badge badge-delivered">${d.delivered} Delivered</span></td>
                      <td><span class="badge badge-spam">${d.spamBlocked} Blocked</span></td>
                      <td><strong>${rate}%</strong></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <h3 style="margin-top: 28px;">Subject Category Breakdown</h3>
            <table>
              <thead>
                <tr>
                  <th>Inquiry Subject</th>
                  <th>Count</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                ${data?.subjectBreakdown.map(s => {
                  const pct = data.summary.totalSubmissions > 0 
                    ? ((s.count / data.summary.totalSubmissions) * 100).toFixed(1) 
                    : '0';
                  return `
                    <tr>
                      <td>${s.subject}</td>
                      <td><strong>${s.count}</strong></td>
                      <td>${pct}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <div class="footer">
              Confidential Operational Report &bull; Node.js Express & Nodemailer Contact System
            </div>

            <script>
              setTimeout(() => { window.print(); }, 400);
            </script>
          </body>
        </html>
      `;

      printWindow.document.write(reportHtml);
      printWindow.document.close();
    } catch (e) {
      console.error('Standalone print window failed:', e);
    }
  };

  const handlePrint = () => {
    setIsPrintModalOpen(true);
    // Also attempt native browser print
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.warn('Native window.print failed, printable modal available', e);
      }
    }, 200);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Theme-aware color parameters for Recharts
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8"
    >
      {/* Top Banner Header */}
      <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white rounded-2xl p-6 border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                Contact Form Analytics Dashboard
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
                Visualizing form submission activity and honeypot spam protection over the last 7 days
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>

          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all shadow-md disabled:opacity-50 ${
              exportSuccess
                ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
          >
            {exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                CSV Downloaded!
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                Export CSV
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            title="Print or Save PDF Report"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all shadow-md"
          >
            <Printer className="w-3.5 h-3.5 text-sky-400" />
            Print Report
          </button>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md shadow-sky-600/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Executive Operational Summary Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800 dark:border-slate-800 light:border-slate-200 light:bg-white rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-inner">
              <Activity className="w-5 h-5 text-sky-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">
                  Key Operational Analytics Summary
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
                  Live Log Synthesis
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-0.5">
                Real-time metrics compiled directly from Node.js Express backend submission logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs shrink-0">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">Peak Window:</span>
            <span className="font-bold text-amber-400 dark:text-amber-400 light:text-amber-600">
              {data?.summary.peakSubmissionTime || '2:00 PM – 3:00 PM'}
            </span>
          </div>
        </div>

        {/* Highlight Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
          {/* Highlight 1: Total Submissions */}
          <div className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 p-4 rounded-xl border border-slate-800/90 dark:border-slate-800/90 light:border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Submissions Logged
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-100 dark:text-slate-100 light:text-slate-900">
                  {data?.summary.totalSubmissions ?? 0}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ({data?.summary.total7Days ?? 0} in 7d)
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Stored active in-memory payload records</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
          </div>

          {/* Highlight 2: Average Daily Volume */}
          <div className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 p-4 rounded-xl border border-slate-800/90 dark:border-slate-800/90 light:border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Average Daily Volume
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-sky-400">
                  ~{data?.summary.dailyAverage ?? 0}
                </span>
                <span className="text-xs text-sky-300 font-semibold">msgs / day</span>
              </div>
              <p className="text-[10px] text-slate-500">7-day rolling submission average</p>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          {/* Highlight 3: Peak Submission Time & Peak Day */}
          <div className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 p-4 rounded-xl border border-slate-800/90 dark:border-slate-800/90 light:border-slate-200 flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Peak Submission Time & Day
              </span>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-lg font-black text-amber-400 leading-tight">
                  {data?.summary.peakHourLabel || '2:00 PM – 3:00 PM'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Peak Volume Day: <strong className="text-slate-300">{data?.summary.peakDay || 'Mon'}</strong>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 24-Hour Traffic Intensity Bar Strip */}
        {data?.hourlyDistribution && data.hourlyDistribution.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800/60 dark:border-slate-800/60 light:border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 flex-wrap gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                24-Hour Submission Volume Distribution Map:
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Peak Hour: <strong className="text-amber-400">{data.summary.peakHourLabel}</strong>
              </span>
            </div>
            <div className="grid grid-cols-24 gap-1 h-7 items-end bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 p-1 rounded-xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
              {data.hourlyDistribution.map((item) => {
                const maxCount = Math.max(...data.hourlyDistribution!.map(h => h.count), 1);
                const heightPct = Math.max(15, Math.round((item.count / maxCount) * 100));
                const isPeak = item.count === maxCount && item.count > 0;
                return (
                  <div
                    key={item.hour}
                    title={`${item.hourLabel}: ${item.count} ${item.count === 1 ? 'submission' : 'submissions'}`}
                    className={`rounded-xs transition-all duration-300 cursor-pointer ${
                      isPeak
                        ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                        : item.count > 0
                        ? 'bg-sky-500 hover:bg-sky-400'
                        : 'bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-300'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1 px-0.5">
              <span>12am</span>
              <span>6am</span>
              <span>12pm</span>
              <span>6pm</span>
              <span>11pm</span>
            </div>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: 7-Day Total */}
        <div className="p-5 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">7-Day Submissions</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">
              {data?.summary.total7Days ?? 0}
            </span>
            <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
              ~{data?.summary.dailyAverage ?? 0}/day
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Total inbound contact payloads received</p>
        </div>

        {/* Card 2: Delivered */}
        <div className="p-5 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivered Messages</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-400 dark:text-emerald-400 light:text-emerald-600">
              {data?.summary.delivered7Days ?? 0}
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {data?.summary.deliveryRate ?? 100}% Success
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Sanitized & dispatched to client inbox</p>
        </div>

        {/* Card 3: Spam Blocked */}
        <div className="p-5 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spam Honeypot Trapped</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-400 dark:text-amber-400 light:text-amber-600">
              {data?.summary.spamBlocked7Days ?? 0}
            </span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Protected
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Caught by hidden honeypot field</p>
        </div>

        {/* Card 4: Total All-Time Logged */}
        <div className="p-5 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inbox Count</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">
              {data?.summary.totalSubmissions ?? 0}
            </span>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              Active Store
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Total stored in Node.js backend memory</p>
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="p-6 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl space-y-6">
        {/* Chart View Selector & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              7-Day Submission Trends & Analysis
            </h3>
            <p className="text-xs text-slate-400">
              Daily breakdown of valid delivered forms versus blocked spam attempts
            </p>
          </div>

          <div className="flex items-center bg-slate-950 dark:bg-slate-950 light:bg-slate-100 p-1 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300">
            <button
              onClick={() => setChartType('stackedBar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                chartType === 'stackedBar'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 light:hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Stacked Bar
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                chartType === 'area'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 light:hover:text-slate-800'
              }`}
            >
              <AreaIcon className="w-3.5 h-3.5" />
              Area Volume
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                chartType === 'pie'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 light:hover:text-slate-800'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              Subject Mix
            </button>
          </div>
        </div>

        {/* Recharts Visualization */}
        <div className="h-80 w-full pt-2">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-sky-400" />
              <span>Loading 7-day visualization analytics...</span>
            </div>
          ) : !data || data.dailyTrends.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No submission records found for the past 7 days.
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={chartType}
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'stackedBar' ? (
                    <BarChart data={data.dailyTrends} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                      <XAxis dataKey="label" stroke={textColor} fontSize={12} tickLine={false} />
                      <YAxis stroke={textColor} fontSize={12} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomDailyTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
                      <Bar 
                        dataKey="delivered" 
                        name="Delivered Messages" 
                        fill="#38bdf8" 
                        stackId="a" 
                        radius={[0, 0, 4, 4]} 
                        isAnimationActive={true}
                        animationDuration={1200}
                        animationEasing="ease-out"
                        animationBegin={100}
                      />
                      <Bar 
                        dataKey="spamBlocked" 
                        name="Spam Honeypot Trapped" 
                        fill="#fbbf24" 
                        stackId="a" 
                        radius={[4, 4, 0, 0]} 
                        isAnimationActive={true}
                        animationDuration={1200}
                        animationEasing="ease-out"
                        animationBegin={300}
                      />
                    </BarChart>
                  ) : chartType === 'area' ? (
                    <AreaChart data={data.dailyTrends} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="deliveredColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                      <XAxis dataKey="label" stroke={textColor} fontSize={12} tickLine={false} />
                      <YAxis stroke={textColor} fontSize={12} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomDailyTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        name="Total Submissions" 
                        stroke="#38bdf8" 
                        fillOpacity={1} 
                        fill="url(#totalColor)" 
                        strokeWidth={2} 
                        isAnimationActive={true}
                        animationDuration={1200}
                        animationEasing="ease-out"
                        animationBegin={100}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="delivered" 
                        name="Delivered" 
                        stroke="#34d399" 
                        fillOpacity={1} 
                        fill="url(#deliveredColor)" 
                        strokeWidth={2} 
                        isAnimationActive={true}
                        animationDuration={1200}
                        animationEasing="ease-out"
                        animationBegin={350}
                      />
                    </AreaChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={data.subjectBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="subject"
                        label={({ subject, percent }) => `${subject} (${(percent * 100).toFixed(0)}%)`}
                        isAnimationActive={true}
                        animationDuration={1000}
                        animationEasing="ease-out"
                        animationBegin={100}
                      >
                        {data.subjectBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip total={data?.summary.totalSubmissions} />} />
                      <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Printable Executive Report Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-start print-modal-container">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl p-8 space-y-6 relative my-8 print:my-0 print:border-none print:shadow-none">
            {/* Modal Control Bar (Hidden when printing) */}
            <div className="no-print flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-lg text-slate-900">Executive Print Report Preview</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow transition-colors print-keep"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
                <button
                  onClick={openStandalonePrintWindow}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  Open Standalone Print Tab
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Close report preview"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Print Printable Document Header */}
            <div className="border-b-2 border-sky-600 pb-4 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Contact Form Executive Performance Report
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  7-Day Analytics, Daily Inbound Trends, & Honeypot Protection Summary
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Server:</strong> Node.js Express API</p>
              </div>
            </div>

            {/* KPI Summary Grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold uppercase text-slate-500">7-Day Submissions</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{data?.summary.total7Days ?? 0}</div>
                <div className="text-[11px] text-sky-600 font-semibold mt-1">~{data?.summary.dailyAverage ?? 0}/day avg</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-[10px] font-bold uppercase text-emerald-700">Delivered Messages</div>
                <div className="text-2xl font-extrabold text-emerald-700 mt-1">{data?.summary.delivered7Days ?? 0}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">{data?.summary.deliveryRate ?? 100}% Delivered</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-[10px] font-bold uppercase text-amber-700">Honeypot Trapped</div>
                <div className="text-2xl font-extrabold text-amber-700 mt-1">{data?.summary.spamBlocked7Days ?? 0}</div>
                <div className="text-[11px] text-amber-600 font-semibold mt-1">Spam Shielded</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold uppercase text-slate-500">Total Inbox Store</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{data?.summary.totalSubmissions ?? 0}</div>
                <div className="text-[11px] text-slate-500 mt-1">Stored Records</div>
              </div>
            </div>

            {/* 7-Day Table Breakdown */}
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-3">Daily Submission Metrics (Last 7 Days)</h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Date</th>
                      <th className="p-3">Total Submissions</th>
                      <th className="p-3">Delivered</th>
                      <th className="p-3">Spam Trapped</th>
                      <th className="p-3">Delivery Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {data?.dailyTrends.map((d) => {
                      const rate = d.total > 0 ? Math.round((d.delivered / d.total) * 100) : 100;
                      return (
                        <tr key={d.dateStr} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold">{d.label} ({d.fullDate})</td>
                          <td className="p-3 font-bold">{d.total}</td>
                          <td className="p-3 text-emerald-700 font-semibold">{d.delivered}</td>
                          <td className="p-3 text-amber-700 font-semibold">{d.spamBlocked}</td>
                          <td className="p-3 font-bold">{rate}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subject Distribution Table */}
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-3">Inquiry Subject Categories</h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Category</th>
                      <th className="p-3">Count</th>
                      <th className="p-3">Percentage Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {data?.subjectBreakdown.map((s) => {
                      const pct = data.summary.totalSubmissions > 0
                        ? ((s.count / data.summary.totalSubmissions) * 100).toFixed(1)
                        : '0';
                      return (
                        <tr key={s.subject} className="hover:bg-slate-50">
                          <td className="p-3 font-medium">{s.subject}</td>
                          <td className="p-3 font-bold">{s.count}</td>
                          <td className="p-3">{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Printable Footer */}
            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 flex justify-between items-center">
              <span>Confidential Operational Report &bull; Node.js Express Backend</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
