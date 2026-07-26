import React from 'react';
import { 
  Clock, 
  MapPin, 
  Star, 
  ShieldCheck, 
  CreditCard, 
  Mail, 
  CheckCircle, 
  User, 
  Phone, 
  FileText, 
  ArrowRight,
  Code,
  AlertCircle,
  Terminal,
  Zap,
  Lock,
  MessageSquare
} from 'lucide-react';

interface JobDetailsProps {
  onTestFormClick: () => void;
  onViewHandoffClick: () => void;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ onTestFormClick, onViewHandoffClick }) => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
        
        {/* Main Column: Project Details */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-8 shadow-lg">
            {/* Budget & Timeline */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Project Details</h2>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                  $30.00 – $250.00 <span className="text-sm text-slate-400 font-medium">USD</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 border border-slate-700">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>BIDDING ENDS IN 5 DAYS, 10 HOURS</span>
              </div>
            </div>

            {/* Description Text matching Screenshot */}
            <div className="mt-6 text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                My site already looks fine, yet it still lacks a simple but vital feature: visitors cannot send inquiries. I need the underlying functionality that takes a completed contact form, validates the data, and reliably delivers it to my email inbox (or another endpoint we agree on).
              </p>

              <div className="pt-2">
                <h3 className="text-white font-semibold text-base mb-3">Here's what I expect:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="p-1 rounded bg-sky-500/10 text-sky-400 mt-0.5">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                    <span>
                      <strong className="text-slate-100">Front-end form:</strong> Captures name, email, subject, and message, styled to match the existing site cleanly.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="p-1 rounded bg-sky-500/10 text-sky-400 mt-0.5">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                    <span>
                      <strong className="text-slate-100">Server-side logic:</strong> Sanitises inputs, handles spam protection (honeypot or reCAPTCHA), and sends the message as a standard email.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="p-1 rounded bg-sky-500/10 text-sky-400 mt-0.5">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                    <span>
                      <strong className="text-slate-100">Clear notifications:</strong> Success / error notifications so users know whether their submission was delivered.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="p-1 rounded bg-sky-500/10 text-sky-400 mt-0.5">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                    <span>
                      <strong className="text-slate-100">Hand-off documentation:</strong> A brief hand-off note or README explaining where to edit recipient addresses and subject lines.
                    </span>
                  </li>
                </ul>
              </div>

              <p className="pt-2 text-slate-300">
                The site currently runs on a standard LAMP stack, so PHP mailer or a comparable library is fine, though I’m open to alternatives such as <strong className="text-sky-400">Node.js with Nodemailer</strong> if that streamlines deliverability. As long as the form works consistently across the major browsers and mobile devices, I’m happy.
              </p>
            </div>

            {/* Skills Required Pills */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'PHP',
                  'JavaScript',
                  'CSS',
                  'HTML',
                  'Node.js',
                  'Email Handling',
                  'Web Development',
                  'Frontend Development'
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/80 hover:bg-slate-700 hover:text-white transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Solution Banner CTA */}
            <div className="mt-8 bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-lg">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Solution Built & Ready for Testing!</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    We built the full Node.js Express backend API + React JSX front-end with Honeypot spam protection & sanitization.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onTestFormClick}
                  className="w-full sm:w-auto px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Try Form Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>Project ID: 40602592</span>
              <button className="text-slate-400 hover:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Report Project
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Column: About the Client */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>About the Client</span>
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </h3>

            {/* Location & Rating */}
            <div className="space-y-3 pb-5 border-b border-slate-800 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Kingston, United States</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 text-slate-600" />
                  <Star className="w-4 h-4 text-slate-600" />
                  <Star className="w-4 h-4 text-slate-600" />
                  <Star className="w-4 h-4 text-slate-600" />
                </div>
                <span className="font-bold text-white">0.0</span>
                <span className="text-slate-500">(0 reviews)</span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>Member since Jul 24, 2026</span>
              </div>
            </div>

            {/* Client Engagement */}
            <div className="py-5 border-b border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Client Engagement
              </h4>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/60 text-xs text-sky-300 flex items-start gap-2">
                <Lock className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>Upgrade your membership to see client engagement stats.</span>
              </div>
            </div>

            {/* Client Verification */}
            <div className="pt-5 space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Client Verification
              </h4>

              <ul className="space-y-2.5 text-xs">
                <li className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Identity verified</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Payment verified</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Deposit made</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Email verified</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Profile completed</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Phone verified</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Technical Summary Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              Solution Tech Architecture
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Frontend:</span>
                <span className="font-mono text-sky-300">React JSX + Tailwind</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Backend API:</span>
                <span className="font-mono text-sky-300">Node.js + Express</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Spam Defense:</span>
                <span className="font-mono text-emerald-400">Honeypot Trap Field</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Sanitization:</span>
                <span className="font-mono text-emerald-400">HTML Entity Escaping</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Email Dispatch:</span>
                <span className="font-mono text-purple-300">Nodemailer / Log Stream</span>
              </div>
            </div>

            <button
              onClick={onViewHandoffClick}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              View Hand-Off README
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
