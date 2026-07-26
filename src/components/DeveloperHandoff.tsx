import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Server, 
  Code, 
  Mail, 
  ShieldCheck, 
  Terminal, 
  ExternalLink,
  BookOpen,
  Sliders,
  Sparkles
} from 'lucide-react';

export const DeveloperHandoff: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const envCode = `# .env file configuration
RECIPIENT_EMAIL="your-client-email@domain.com"
DEFAULT_SUBJECT_PREFIX="[Website Contact Form]"

# Optional SMTP Settings for Nodemailer (Leave blank for simulation log mode)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@domain.com"
`;

  const nodeJsCode = `// server.ts - Node.js Express Contact Form Handler with Honeypot & Sanitization
import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());

// 1. EDIT RECIPIENT EMAIL HERE OR IN ENVIRONMENT VARIABLES
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'client@example.com';
const SUBJECT_PREFIX = process.env.DEFAULT_SUBJECT_PREFIX || '[Website Contact Form]';

// XSS Sanitization Helper
function sanitize(str) {
  return String(str || '')
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message, hp_website } = req.body;

  // 2. HONEYPOT SPAM PROTECTION CHECK
  if (hp_website && hp_website.trim().length > 0) {
    // Silent drop for automated bots
    return res.status(200).json({ success: true, message: 'Message sent!' });
  }

  // 3. SERVER-SIDE INPUT VALIDATION
  if (!name || !email || !message || message.length < 10) {
    return res.status(400).json({ success: false, message: 'Invalid input parameters.' });
  }

  const cleanName = sanitize(name);
  const cleanEmail = sanitize(email);
  const cleanSubject = sanitize(subject);
  const cleanMessage = sanitize(message);

  // 4. DISPATCH EMAIL VIA NODEMAILER OR MAIL API
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: \`"\${cleanName}" <\${cleanEmail}>\`,
      to: RECIPIENT_EMAIL,
      subject: \`\${SUBJECT_PREFIX} \${cleanSubject}\`,
      text: cleanMessage,
    });

    return res.status(200).json({ success: true, message: 'Inquiry delivered!' });
  } catch (err) {
    console.error('Mail dispatch error:', err);
    return res.status(500).json({ success: false, message: 'Mail delivery error.' });
  }
});

app.listen(3000, () => console.log('Node.js contact form backend running on port 3000'));
`;

  const phpCode = `<?php
// mail.php - Alternative PHP mailer endpoint for LAMP stack environments
header('Content-Type: application/json');

// EDIT RECIPIENT ADDRESS HERE
$recipient_email = "client@example.com";
$subject_prefix  = "[Website Inquiry]";

// Get JSON POST body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Honeypot spam trap check
if (!empty($data['hp_website'])) {
    echo json_encode(['success' => true, 'message' => 'Message delivered']);
    exit;
}

$name    = htmlspecialchars(trim($data['name'] ?? ''), ENT_QUOTES, 'UTF-8');
$email   = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$subject = htmlspecialchars(trim($data['subject'] ?? ''), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($data['message'] ?? ''), ENT_QUOTES, 'UTF-8');

if (!$name || !$email || strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Validation error']);
    exit;
}

$headers  = "From: " . $name . " <" . $email . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$full_subject = $subject_prefix . " " . $subject;

if (mail($recipient_email, $full_subject, $message, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Thank you! Your message was sent.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mail delivery failed']);
}
?>
`;

  const reactCode = `// ContactForm.jsx - React Frontend Component
import React, { useState } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: 'General Inquiry', message: '', hp_website: ''
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    setStatus(result.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot hidden input */}
      <input type="text" name="hp_website" style={{ display: 'none' }} tabIndex={-1} 
        onChange={e => setFormData({...formData, hp_website: e.target.value})} />

      <input type="text" placeholder="Your Name" required 
        onChange={e => setFormData({...formData, name: e.target.value})} />

      <input type="email" placeholder="Your Email" required 
        onChange={e => setFormData({...formData, email: e.target.value})} />

      <textarea placeholder="Your Message" required 
        onChange={e => setFormData({...formData, message: e.target.value})} />

      <button type="submit">Send Inquiry</button>
      {status && <p>{status}</p>}
    </form>
  );
}
`;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Page Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white">
              Developer Hand-Off Note & Integration Guide
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Documentation on editing recipient addresses, subject line defaults, Nodemailer SMTP configuration, and LAMP/PHP migration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Client Ready
          </span>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card 1: Editing Recipient Email */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg">
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg w-fit">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">1. Where to Edit Recipient Address</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The destination inbox address can be updated in <strong>two easy places</strong> without editing code:
          </p>
          <ul className="text-xs text-slate-300 space-y-2 pt-1 list-disc pl-4">
            <li>
              <strong>Environment File (<code className="text-sky-300">.env</code>):</strong> Set <code className="bg-slate-950 px-1 py-0.5 rounded text-sky-300">RECIPIENT_EMAIL="owner@domain.com"</code>.
            </li>
            <li>
              <strong>Live App Settings Panel:</strong> Open the <strong className="text-slate-100">Live Contact Form</strong> tab and click <strong className="text-sky-400">"Configure Recipient & Subject"</strong> to update the recipient instantly.
            </li>
          </ul>
        </div>

        {/* Card 2: Editing Subject Lines */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg w-fit">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">2. Where to Edit Subject Line Prefixes</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All subject lines are automatically prepended with a identifiable brand prefix for email filter rules:
          </p>
          <ul className="text-xs text-slate-300 space-y-2 pt-1 list-disc pl-4">
            <li>
              <strong>Default Prefix:</strong> Configured in <code className="bg-slate-950 px-1 py-0.5 rounded text-sky-300">server.ts</code> as <code className="text-purple-300">process.env.DEFAULT_SUBJECT_PREFIX</code> (Defaults to <code className="text-slate-200">"[Website Contact Form]"</code>).
            </li>
            <li>
              <strong>Subject Choices:</strong> Form visitors can pick preset subject dropdown options or type custom lines.
            </li>
          </ul>
        </div>

      </div>

      {/* Code Snippets Section */}
      <div className="space-y-6">

        {/* Section A: Node.js Express Code */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-white text-base">Node.js Express Backend Code (`server.ts`)</h3>
            </div>
            <button
              onClick={() => copyToClipboard(nodeJsCode, 'node')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedSection === 'node' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'node' ? 'Copied Node.js Code!' : 'Copy Code'}
            </button>
          </div>

          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs text-sky-300 overflow-x-auto leading-relaxed">
            {nodeJsCode}
          </pre>
        </div>

        {/* Section B: Environment Variables (.env) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Environment Configuration (`.env`)</h3>
            </div>
            <button
              onClick={() => copyToClipboard(envCode, 'env')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedSection === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'env' ? 'Copied Env Variables!' : 'Copy .env'}
            </button>
          </div>

          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed">
            {envCode}
          </pre>
        </div>

        {/* Section C: Alternative PHP Mailer Script */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">Alternative PHP Script for LAMP Stack (`mail.php`)</h3>
            </div>
            <button
              onClick={() => copyToClipboard(phpCode, 'php')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedSection === 'php' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'php' ? 'Copied PHP Script!' : 'Copy mail.php'}
            </button>
          </div>

          <p className="text-xs text-slate-300">
            If deploying to a standard PHP/cPanel web hosting server, upload this <code className="text-purple-300 font-mono">mail.php</code> file to your web root and set the form POST action endpoint to <code className="text-purple-300 font-mono">/mail.php</code>.
          </p>

          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed">
            {phpCode}
          </pre>
        </div>

        {/* Section D: React Component Code */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">React JSX Frontend Component (`ContactForm.jsx`)</h3>
            </div>
            <button
              onClick={() => copyToClipboard(reactCode, 'react')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedSection === 'react' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'react' ? 'Copied React Code!' : 'Copy JSX'}
            </button>
          </div>

          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
            {reactCode}
          </pre>
        </div>

      </div>

    </div>
  );
};
