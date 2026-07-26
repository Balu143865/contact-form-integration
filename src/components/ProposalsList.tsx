import React from 'react';
import { 
  Star, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Code, 
  Award,
  Zap,
  MessageSquare
} from 'lucide-react';
import { Proposal } from '../types';

const mockProposals: Proposal[] = [
  {
    id: 'prop_1',
    freelancerName: 'Alex R. - Full Stack Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 184,
    verified: true,
    bidAmount: 120,
    deliveryDays: 1,
    pitch: 'I have already implemented and verified your entire contact form solution using Node.js + Express + Nodemailer & Honeypot spam shield! Included is real-time input sanitization, complete validation, and developer hand-off notes.',
    techStack: ['Node.js', 'Express', 'React JSX', 'Honeypot Shield', 'Nodemailer'],
    timestamp: '10 minutes ago',
  },
  {
    id: 'prop_2',
    freelancerName: 'David K. - Backend Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 92,
    verified: true,
    bidAmount: 95,
    deliveryDays: 2,
    pitch: 'Experienced in both LAMP (PHP Mailer) and Node.js solutions. I can provide sanitization, spam trap protection, and a clean configuration file for editing recipient addresses.',
    techStack: ['PHP', 'PHPMailer', 'JavaScript', 'HTML5/CSS3'],
    timestamp: '1 hour ago',
  },
  {
    id: 'prop_3',
    freelancerName: 'Elena M. - Web Security & Dev',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 210,
    verified: true,
    bidAmount: 150,
    deliveryDays: 1,
    pitch: 'Focusing heavily on spam protection and deliverability (SPF/DKIM alignment support). Will deliver a responsive front-end form and robust backend mailer API with error notifications.',
    techStack: ['Node.js', 'TypeScript', 'Express', 'SendGrid API'],
    timestamp: '3 hours ago',
  },
];

export const ProposalsList: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Submitted Freelancer Proposals (147)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Top-rated developers bidding on "Enhance Contact Form Functionality".
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Average Bid</div>
          <div className="text-xl font-bold text-sky-400">$129 USD</div>
        </div>
      </div>

      {/* Proposal Cards */}
      <div className="space-y-4">
        {mockProposals.map((prop) => (
          <div
            key={prop.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={prop.avatar}
                  alt={prop.freelancerName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-sky-500/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{prop.freelancerName}</h3>
                    {prop.verified && (
                      <ShieldCheck className="w-4 h-4 text-sky-400" title="Verified Preferred Freelancer" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold ml-1 text-white">{prop.rating.toFixed(1)}</span>
                    </div>
                    <span>({prop.reviewsCount} reviews)</span>
                    <span>•</span>
                    <span>{prop.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="text-right self-start sm:self-auto bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <div className="text-lg font-bold text-emerald-400">${prop.bidAmount} USD</div>
                <div className="text-[11px] text-slate-400">in {prop.deliveryDays} day</div>
              </div>
            </div>

            {/* Pitch */}
            <p className="text-sm text-slate-300 leading-relaxed">
              "{prop.pitch}"
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap gap-2">
                {prop.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-950 text-sky-300 border border-slate-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors">
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                Chat with Freelancer
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
