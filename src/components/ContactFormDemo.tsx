import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  RefreshCw, 
  RotateCcw,
  Sparkles, 
  Mail, 
  User, 
  Tag, 
  MessageSquare, 
  AlertTriangle,
  Bot,
  Settings,
  Sliders,
  Check,
  Server,
  Info
} from 'lucide-react';
import { ContactFormData, SubmissionResponse } from '../types';

interface ContactFormDemoProps {
  onSubmissionSuccess: (response?: SubmissionResponse) => void;
}

export const ContactFormDemo: React.FC<ContactFormDemoProps> = ({ onSubmissionSuccess }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
    hp_website: '', // Honeypot field - should remain empty for humans
  });

  const [customSubject, setCustomSubject] = useState('');
  const [useCustomSubject, setUseCustomSubject] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState<SubmissionResponse | null>(null);

  // Settings configuration
  const [recipientEmail, setRecipientEmail] = useState('client@example.com');
  const [subjectPrefix, setSubjectPrefix] = useState('[Website Contact Form]');
  const [spamProtectionActive, setSpamProtectionActive] = useState(true);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Fetch current server configuration on load
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.recipientEmail) setRecipientEmail(data.recipientEmail);
        if (data.defaultSubjectPrefix) setSubjectPrefix(data.defaultSubjectPrefix);
        if (typeof data.spamProtectionEnabled === 'boolean') setSpamProtectionActive(data.spamProtectionEnabled);
      })
      .catch((err) => console.log('Could not load server config:', err));
  }, []);

  // Single Field Real-time Validation Rules
  const validateSingleField = (name: string, value: string, isCustomSubj: boolean = useCustomSubject): string => {
    const trimmed = value.trim();

    if (name === 'name') {
      if (!trimmed) return 'Full name is required.';
      if (trimmed.length < 2) return 'Full name must be at least 2 characters.';
    }

    if (name === 'email') {
      if (!trimmed) return 'Email address is required.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return 'Please enter a valid email address (e.g., name@domain.com).';
    }

    if (name === 'subject') {
      const activeSubject = isCustomSubj ? customSubject : value;
      if (!activeSubject.trim()) return 'Please specify a subject for your message.';
    }

    if (name === 'customSubject') {
      if (!value.trim()) return 'Please enter a custom subject line.';
    }

    if (name === 'message') {
      if (!trimmed) return 'Message content is required.';
      if (trimmed.length < 10) return `Message must be at least 10 characters (currently ${trimmed.length}).`;
    }

    return '';
  };

  // Client side validation for full form submit
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const touched: Record<string, boolean> = {
      name: true,
      email: true,
      subject: true,
      message: true,
    };
    if (useCustomSubject) touched.customSubject = true;

    const nameErr = validateSingleField('name', formData.name);
    if (nameErr) errors.name = nameErr;

    const emailErr = validateSingleField('email', formData.email);
    if (emailErr) errors.email = emailErr;

    if (useCustomSubject) {
      const custSubjErr = validateSingleField('customSubject', customSubject);
      if (custSubjErr) errors.subject = custSubjErr;
    } else {
      const subjErr = validateSingleField('subject', formData.subject);
      if (subjErr) errors.subject = subjErr;
    }

    const msgErr = validateSingleField('message', formData.message);
    if (msgErr) errors.message = msgErr;

    setTouchedFields(touched);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    const val = fieldName === 'customSubject' ? customSubject : (formData as any)[fieldName];
    const err = validateSingleField(fieldName, val || '');
    setFieldErrors((prev) => ({
      ...prev,
      [fieldName === 'customSubject' ? 'subject' : fieldName]: err,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time inline validation if field was touched or already has error
    if (touchedFields[name] || fieldErrors[name]) {
      const err = validateSingleField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleCustomSubjectChange = (val: string) => {
    setCustomSubject(val);
    if (touchedFields.customSubject || fieldErrors.subject) {
      const err = validateSingleField('customSubject', val);
      setFieldErrors((prev) => ({ ...prev, subject: err }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionStep(1); // 1: Sanitizing

    const finalSubject = useCustomSubject ? customSubject : formData.subject;

    // Simulate multi-step visual feedback for user clarity
    setTimeout(() => {
      setSubmissionStep(2); // 2: Honeypot & Spam check
      setTimeout(async () => {
        setSubmissionStep(3); // 3: Node.js Express API Dispatch
        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              subject: finalSubject,
              message: formData.message,
              hp_website: formData.hp_website, // Honeypot field
            }),
          });

          const data: SubmissionResponse = await response.json();
          setSubmissionStep(4); // 4: Complete

          setTimeout(() => {
            setIsSubmitting(false);
            setResultMessage(data);

            if (data.success && !data.isSpamTriggered) {
              // Reset message field and touched state for message
              setFormData((prev) => ({ ...prev, message: '' }));
              setTouchedFields((prev) => ({ ...prev, message: false }));
              onSubmissionSuccess(data);
            }
          }, 400);

        } catch (error) {
          console.error('Contact form API error:', error);
          setIsSubmitting(false);
          setResultMessage({
            success: false,
            message: 'Failed to connect to Node.js backend server. Please try again.',
          });
        }
      }, 500);
    }, 400);
  };

  // Preset fills for rapid testing
  const fillPreset = (type: 'valid' | 'bot' | 'invalid-email') => {
    setResultMessage(null);

    if (type === 'valid') {
      setFormData({
        name: 'Alex Rivera',
        email: 'alex.rivera@techcorp.io',
        subject: 'Website Inquiries & Contact Form Integration',
        message: 'Hi there! We loved your portfolio and would like to integrate this Node.js contact form with honeypot spam protection onto our primary corporate portal.',
        hp_website: '', // Human leaves honeypot empty
      });
      setUseCustomSubject(false);
      setTouchedFields({ name: true, email: true, subject: true, message: true });
      setFieldErrors({});
    } else if (type === 'bot') {
      setFormData({
        name: 'SpamBot_v99',
        email: 'cheap-seo@spam-marketing-hub.net',
        subject: 'Urgent SEO Offer - Rank #1 Today!',
        message: 'BUY LINKS NOW! CLICK HERE TO BOOST RANKINGS http://spam-link.biz',
        hp_website: 'http://trap-triggered.com/bot-entry', // BOT TRAP FILLED!
      });
      setUseCustomSubject(false);
      setTouchedFields({ name: true, email: true, subject: true, message: true });
      setFieldErrors({});
    } else if (type === 'invalid-email') {
      setFormData({
        name: 'John Doe',
        email: 'john-doe-invalid-email-format',
        subject: 'General Inquiry',
        message: 'Testing real-time validation error handling for improper email addresses.',
        hp_website: '',
      });
      setUseCustomSubject(false);
      setTouchedFields({ name: true, email: true, subject: true, message: true });
      setFieldErrors({ email: 'Please enter a valid email address (e.g., name@domain.com).' });
    }
  };

  // Clear Form handler: Resets form values and clears all validation error states
  const handleClearForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'General Inquiry',
      message: '',
      hp_website: '',
    });
    setCustomSubject('');
    setUseCustomSubject(false);
    setFieldErrors({});
    setTouchedFields({});
    setResultMessage(null);
    setSubmissionStep(0);
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          defaultSubjectPrefix: subjectPrefix,
          spamProtectionEnabled: spamProtectionActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditingSettings(false);
        setSettingsSavedToast(true);
        setTimeout(() => setSettingsSavedToast(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Live Config Settings Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Backend Route</div>
            <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
              <span>POST /api/contact</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-mono text-xs">Delivers to: {recipientEmail}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {settingsSavedToast && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Config Saved!
            </span>
          )}
          <button
            onClick={() => setIsEditingSettings(!isEditingSettings)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-sky-400" />
            {isEditingSettings ? 'Close Config' : 'Configure Recipient & Subject'}
          </button>
        </div>
      </div>

      {/* Editing Settings Drawer */}
      {isEditingSettings && (
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-xl p-5 mb-8 space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-sky-400" />
            Node.js Backend Email Delivery Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Recipient Inbox Email Address:
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="client@example.com"
              />
              <p className="text-[11px] text-slate-500 mt-1">Where completed inquiry emails will be routed.</p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Default Email Subject Prefix:
              </label>
              <input
                type="text"
                value={subjectPrefix}
                onChange={(e) => setSubjectPrefix(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="[Website Contact Form]"
              />
              <p className="text-[11px] text-slate-500 mt-1">Prepended to all incoming subject lines.</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={spamProtectionActive}
                onChange={(e) => setSpamProtectionActive(e.target.checked)}
                className="rounded border-slate-700 text-sky-500 focus:ring-sky-500 bg-slate-950"
              />
              <span>Enable Honeypot Spam Shield (Auto-trap spambots)</span>
            </label>

            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
            >
              Save Backend Config
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Contact Form + Preset Testers & Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Form Container (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Form Header */}
          <div className="mb-6 pb-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Send Us an Inquiry
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Fill in the form below. Submitted inquiries are processed and validated live by our Node.js server.
              </p>
            </div>
            
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Honeypot Protected</span>
            </div>
          </div>

          {/* Preset Buttons Bar */}
          <div className="mb-6 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Test Autofill Presets:
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillPreset('valid')}
                  className="px-2.5 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-medium transition-all"
                >
                  + Valid Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => fillPreset('bot')}
                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                >
                  <Bot className="w-3 h-3 text-rose-400" />
                  + Bot Payload (Honeypot Test)
                </button>
                <button
                  type="button"
                  onClick={() => fillPreset('invalid-email')}
                  className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition-all"
                >
                  + Invalid Email Format
                </button>
              </div>

              <button
                type="button"
                onClick={handleClearForm}
                disabled={isSubmitting}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                title="Reset all fields and clear validation errors"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Clear Form</span>
              </button>
            </div>
          </div>

          {/* Submission Result Notification Banner */}
          <AnimatePresence>
            {resultMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className={`p-4 mb-6 rounded-xl border flex items-start gap-3 transition-all ${
                  resultMessage.success
                    ? resultMessage.isSpamTriggered
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                {resultMessage.success ? (
                  resultMessage.isSpamTriggered ? (
                    <Bot className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  )
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                )}

                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold">
                    {resultMessage.success
                      ? resultMessage.isSpamTriggered
                        ? 'Spam Bot Trap Triggered!'
                        : 'Message Delivered Successfully!'
                      : 'Submission Error'}
                  </div>
                  <p>{resultMessage.message}</p>
                  {resultMessage.id && (
                    <div className="pt-1 text-[11px] font-mono text-slate-400">
                      Server Tracking ID: {resultMessage.id} | Recipient: {resultMessage.deliveredTo}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* HONEYPOT SPAM TRAP FIELD (Hidden from normal CSS users, but read by automated spambots) */}
            <div className="opacity-0 absolute -z-50 h-0 w-0 overflow-hidden select-none pointer-events-none" aria-hidden="true">
              <label htmlFor="hp_website">Do not fill this field if you are human:</label>
              <input
                type="text"
                id="hp_website"
                name="hp_website"
                value={formData.hp_website || ''}
                onChange={handleInputChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    Your Name <span className="text-rose-400">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('name')}
                    placeholder="e.g. Sarah Jenkins"
                    className={`w-full bg-slate-950 border text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                      touchedFields.name && fieldErrors.name
                        ? 'border-rose-500 focus:ring-rose-500/50 shadow-sm shadow-rose-500/10'
                        : touchedFields.name && !fieldErrors.name && formData.name.trim().length >= 2
                        ? 'border-emerald-500 focus:ring-emerald-500/30 shadow-sm shadow-emerald-500/10'
                        : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500/30'
                    }`}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {touchedFields.name && fieldErrors.name ? (
                    <motion.p
                      key="name-error"
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium overflow-hidden"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{fieldErrors.name}</span>
                    </motion.p>
                  ) : touchedFields.name && !fieldErrors.name && formData.name.trim().length >= 2 ? (
                    <motion.p
                      key="name-success"
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1 font-medium overflow-hidden"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Valid full name</span>
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    Email Address <span className="text-rose-400">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('email')}
                    placeholder="e.g. sarah@example.com"
                    className={`w-full bg-slate-950 border text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                      touchedFields.email && fieldErrors.email
                        ? 'border-rose-500 focus:ring-rose-500/50 shadow-sm shadow-rose-500/10'
                        : touchedFields.email && !fieldErrors.email && formData.email.trim().length > 0
                        ? 'border-emerald-500 focus:ring-emerald-500/30 shadow-sm shadow-emerald-500/10'
                        : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500/30'
                    }`}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {touchedFields.email && fieldErrors.email ? (
                    <motion.p
                      key="email-error"
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium overflow-hidden"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{fieldErrors.email}</span>
                    </motion.p>
                  ) : touchedFields.email && !fieldErrors.email && formData.email.trim().length > 0 ? (
                    <motion.p
                      key="email-success"
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1 font-medium overflow-hidden"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Valid email address</span>
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            {/* Subject Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-sky-400" />
                  Subject Line <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const nextCustom = !useCustomSubject;
                    setUseCustomSubject(nextCustom);
                    if (nextCustom && touchedFields.customSubject) {
                      const err = validateSingleField('customSubject', customSubject, true);
                      setFieldErrors((prev) => ({ ...prev, subject: err }));
                    } else if (!nextCustom && touchedFields.subject) {
                      const err = validateSingleField('subject', formData.subject, false);
                      setFieldErrors((prev) => ({ ...prev, subject: err }));
                    }
                  }}
                  className="text-xs text-sky-400 hover:underline"
                >
                  {useCustomSubject ? 'Select Standard Subject' : '+ Type Custom Subject'}
                </button>
              </div>

              {useCustomSubject ? (
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => handleCustomSubjectChange(e.target.value)}
                  onBlur={() => handleBlur('customSubject')}
                  placeholder="Type your custom subject line..."
                  className={`w-full bg-slate-950 border text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                    (touchedFields.customSubject || touchedFields.subject) && fieldErrors.subject
                      ? 'border-rose-500 focus:ring-rose-500/50 shadow-sm shadow-rose-500/10'
                      : touchedFields.customSubject && !fieldErrors.subject && customSubject.trim().length > 0
                      ? 'border-emerald-500 focus:ring-emerald-500/30 shadow-sm shadow-emerald-500/10'
                      : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500/30'
                  }`}
                />
              ) : (
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('subject')}
                  className={`w-full bg-slate-950 border text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                    touchedFields.subject && fieldErrors.subject
                      ? 'border-rose-500 focus:ring-rose-500/50'
                      : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500/30'
                  }`}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Website Inquiries & Contact Form Integration">Website Inquiries & Contact Form Integration</option>
                  <option value="Project Quote / Estimate">Project Quote / Estimate</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Partnership & Hiring">Partnership & Hiring</option>
                </select>
              )}
              <AnimatePresence mode="wait">
                {fieldErrors.subject ? (
                  <motion.p
                    key="subject-error"
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium overflow-hidden"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.subject}</span>
                  </motion.p>
                ) : (touchedFields.subject || touchedFields.customSubject) && !fieldErrors.subject ? (
                  <motion.p
                    key="subject-success"
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1 font-medium overflow-hidden"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Valid subject line</span>
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Message Area */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                  Your Message <span className="text-rose-400">*</span>
                </label>
                <span className={`text-xs ${formData.message.trim().length >= 10 ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                  {formData.message.length} chars (min 10)
                </span>
              </div>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                onBlur={() => handleBlur('message')}
                placeholder="Write your inquiry here..."
                className={`w-full bg-slate-950 border text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                  touchedFields.message && fieldErrors.message
                    ? 'border-rose-500 focus:ring-rose-500/50 shadow-sm shadow-rose-500/10'
                    : touchedFields.message && !fieldErrors.message && formData.message.trim().length >= 10
                    ? 'border-emerald-500 focus:ring-emerald-500/30 shadow-sm shadow-emerald-500/10'
                    : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500/30'
                }`}
              />
              <AnimatePresence mode="wait">
                {touchedFields.message && fieldErrors.message ? (
                  <motion.p
                    key="message-error"
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium overflow-hidden"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.message}</span>
                  </motion.p>
                ) : touchedFields.message && !fieldErrors.message && formData.message.trim().length >= 10 ? (
                  <motion.p
                    key="message-success"
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1 font-medium overflow-hidden"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Message meets required length</span>
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Stepper progress indicator during submission */}
            <AnimatePresence>
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.98 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 bg-slate-950 rounded-xl border border-sky-500/30 space-y-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-sky-400">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Processing Contact Form Payload...
                    </span>
                    <span>Step {submissionStep} of 4</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    <div className={`h-1.5 rounded-full transition-colors duration-300 ${submissionStep >= 1 ? 'bg-sky-400' : 'bg-slate-800'}`}></div>
                    <div className={`h-1.5 rounded-full transition-colors duration-300 ${submissionStep >= 2 ? 'bg-sky-400' : 'bg-slate-800'}`}></div>
                    <div className={`h-1.5 rounded-full transition-colors duration-300 ${submissionStep >= 3 ? 'bg-sky-400' : 'bg-slate-800'}`}></div>
                    <div className={`h-1.5 rounded-full transition-colors duration-300 ${submissionStep >= 4 ? 'bg-emerald-400' : 'bg-slate-800'}`}></div>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1">
                    {submissionStep === 1 && '1. Sanitizing string inputs (preventing XSS scripts)...'}
                    {submissionStep === 2 && '2. Checking Honeypot spam trap field...'}
                    {submissionStep === 3 && '3. Dispatching POST to Express API `/api/contact`...'}
                    {submissionStep === 4 && '4. Delivery complete! Server acknowledged.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit & Clear Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleClearForm}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white active:scale-[0.98] disabled:opacity-50 shrink-0"
                title="Reset all fields and clear validation error messages"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Clear Form</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
                  isSubmitting
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/25 active:scale-[0.99]'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Inquiry...' : 'Send Message Now'}</span>
              </button>
            </div>
          </form>

        </div>

        {/* Feature Highlights & Server Specs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Feature Card 1: Spam Defense */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Built-In Honeypot Spam Defense
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike invasive reCAPTCHA widgets that slow down page loads and frustrate users with image puzzles, our solution uses an invisible <code className="bg-slate-950 px-1.5 py-0.5 rounded text-sky-300 font-mono text-[11px]">hp_website</code> honeypot trap field.
            </p>
            <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero friction for real human site visitors</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Silently intercepts 99% of automated spambots</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>No third-party cookies or tracker scripts required</span>
              </div>
            </div>
          </div>

          {/* Feature Card 2: Server-Side Sanitization */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
              <Server className="w-5 h-5 text-sky-400" />
              Node.js Express Input Sanitization
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All submitted data passes through server-side sanitization before email formatting or store delivery, escaping HTML tags (&lt;script&gt;, &lt;iframe&gt;) to prevent XSS vulnerability attacks.
            </p>
            <div className="mt-4 font-mono text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1">
              <div className="text-slate-500">// Node.js Sanitization snippet</div>
              <div>cleanName = sanitizeInput(req.body.name);</div>
              <div>cleanEmail = sanitizeInput(req.body.email);</div>
              <div className="text-emerald-400">// Escaped: &lt;script&gt; &rarr; &amp;lt;script&amp;gt;</div>
            </div>
          </div>

          {/* Feature Card 3: Instant Delivery & Logging */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-400" />
              Nodemailer & Simulated Inbox Support
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Supports standard SMTP services (Gmail, SendGrid, Mailtrap) via Nodemailer when credentials are set in environment variables, and defaults to a live in-memory server inbox log so you can inspect deliverability in real time!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
