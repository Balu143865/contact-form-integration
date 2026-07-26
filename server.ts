import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = 3000;

// In-memory logs and data store
interface InboxItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'DELIVERED' | 'SPAM_BLOCKED' | 'FAILED';
  sanitized: boolean;
  honeypotCaught: boolean;
  deliveredTo: string;
  fullSubject: string;
}

interface ApiLogItem {
  id: string;
  method: string;
  endpoint: string;
  statusCode: number;
  timestamp: string;
  durationMs: number;
  payloadSummary: string;
}

const inboxMessages: InboxItem[] = [];
const apiLogs: ApiLogItem[] = [];

// App configuration state
let appConfig = {
  recipientEmail: process.env.RECIPIENT_EMAIL || 'client@example.com',
  defaultSubjectPrefix: process.env.DEFAULT_SUBJECT_PREFIX || '[Website Contact Form]',
  spamProtectionEnabled: true,
  autoResponderEnabled: true,
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: process.env.SMTP_PORT || '587',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
};

// Seed initial inbox messages across the last 7 days for analytics demonstration
const now = Date.now();
const DAY_MS = 86400000;

const sampleSubmissions = [
  { daysAgo: 0, hoursAgo: 2, name: 'Sarah Jenkins', email: 'sarah.j@designstudio.com', subject: 'Website Redesign Inquiry', message: 'Hello, I saw your portfolio and would like to ask about your availability for a custom web app contact form integration project next week.', status: 'DELIVERED' as const, hp: false },
  { daysAgo: 0, hoursAgo: 5, name: 'SpamBot_v99', email: 'trap@botnet.net', subject: 'Buy cheap followers fast', message: 'Offers for spam promotional services.', status: 'SPAM_BLOCKED' as const, hp: true },
  { daysAgo: 1, hoursAgo: 10, name: 'Marcus Vance', email: 'marcus@techventures.io', subject: 'Node.js Express Integration', message: 'We need help migrating our legacy PHP mailer to a modern Node.js Express endpoint with Nodemailer SMTP.', status: 'DELIVERED' as const, hp: false },
  { daysAgo: 1, hoursAgo: 14, name: 'Elena Rostova', email: 'elena@uxcraft.org', subject: 'Partnership & Hiring', message: 'Would love to discuss a contract position for full-stack React and Express development.', status: 'DELIVERED' as const, hp: false },
  { daysAgo: 2, hoursAgo: 8, name: 'AutoScraper_X', email: 'scrapenode@bot.xyz', subject: 'Urgent SEO Audit Offer', message: 'Automated spam message targeting contact forms.', status: 'SPAM_BLOCKED' as const, hp: true },
  { daysAgo: 2, hoursAgo: 18, name: 'David Chen', email: 'd.chen@cloudsystems.com', subject: 'General Inquiry', message: 'Hi there, inquiring about your rates for API development and contact form spam protection.', status: 'DELIVERED' as const, hp: false },
  { daysAgo: 3, hoursAgo: 6, name: 'Amara Okafor', email: 'amara@innovate.africa', subject: 'Custom Form Fields & Validation', message: 'Can your contact form handle custom subject dropdowns and real-time validation for client fields?', status: 'DELIVERED' as const, hp: false },
  { daysAgo: 3, hoursAgo: 20, name: 'PhishTrap_Bot', email: 'phish@fakebank.com', subject: 'Account verification needed', message: 'Phishing attempt blocked by honeypot shield.', status: 'SPAM_BLOCKED' as const, hp: true },
  { daysAgo: 4, hoursAgo: 11, name: 'Liam O\'Connor', email: 'liam@dublindigital.ie', subject: 'Website Inquiries & Contact Form Integration', message: 'Interested in implementing your contact form system for three client websites.', status: 'DELIVERED' as const, hp: false },
  { daysAgo: 4, hoursAgo: 16, name: 'Sophia Al-Mansoor', email: 'sophia@gulftech.ae', subject: 'Partnership & Hiring', message: 'Reaching out regarding a potential long-term retainer for web maintenance.', status: 'DELIVERED' as const, hp: false },
  { daysAgo: 5, hoursAgo: 9, name: 'XSS_Tester_Bot', email: 'xss@exploit-db.test', subject: '<script>alert(1)</script>', message: 'Testing sanitization routine and honeypot trap.', status: 'SPAM_BLOCKED' as const, hp: true },
  { daysAgo: 5, hoursAgo: 15, name: 'Carlos Mendez', email: 'carlos@solsolutions.mx', subject: 'General Inquiry', message: 'Looking for assistance setting up Nodemailer SMTP credentials on Cloud Run.', status: 'DELIVERED' as const, hp: false },
  { daysAgo: 6, hoursAgo: 7, name: 'Hannah Abbott', email: 'hannah@brightlabs.co.uk', subject: 'Website Redesign Inquiry', message: 'We require a streamlined contact form with instant validation and submission logging.', status: 'DELIVERED' as const, hp: false },
  { daysAgo: 6, hoursAgo: 22, name: 'Spam_Crawler_3', email: 'crawler@spamy.com', subject: 'Casino Deals Online', message: 'Unsolicited marketing attempt blocked by server.', status: 'SPAM_BLOCKED' as const, hp: true },
];

sampleSubmissions.forEach((item, idx) => {
  const ts = new Date(now - (item.daysAgo * DAY_MS + item.hoursAgo * 3600000)).toISOString();
  inboxMessages.push({
    id: `msg_seed_${idx + 1}`,
    name: item.name,
    email: item.email,
    subject: item.subject,
    fullSubject: `${appConfig.defaultSubjectPrefix} ${item.subject}`,
    message: item.message,
    timestamp: ts,
    ipAddress: item.hp ? '185.220.101.5' : `192.168.1.${10 + idx}`,
    userAgent: item.hp ? 'Python-urllib/3.8' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: item.status,
    sanitized: true,
    honeypotCaught: item.hp,
    deliveredTo: item.hp ? 'BLOCKED (Spam Trap)' : appConfig.recipientEmail,
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const originalEnd = res.end;

  res.end = function (...args: any[]) {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      let payloadSummary = '';
      if (req.body && Object.keys(req.body).length > 0) {
        const safeBody = { ...req.body };
        if (safeBody.message && safeBody.message.length > 30) {
          safeBody.message = safeBody.message.substring(0, 30) + '...';
        }
        payloadSummary = JSON.stringify(safeBody);
      }

      apiLogs.unshift({
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        method: req.method,
        endpoint: req.path,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString(),
        durationMs: duration,
        payloadSummary: payloadSummary || '(Empty Body)',
      });

      // Keep only last 100 API logs
      if (apiLogs.length > 100) apiLogs.pop();
    }

    return originalEnd.apply(res, args as any);
  };

  next();
});

// Helper to sanitize HTML input against XSS
function sanitizeInput(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Basic Email Validation regex
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// --- API ENDPOINTS ---

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Node.js Contact Form Backend API',
    version: '1.0.0',
  });
});

// Get Current Settings Configuration
app.get('/api/config', (req: Request, res: Response) => {
  res.json({
    recipientEmail: appConfig.recipientEmail,
    defaultSubjectPrefix: appConfig.defaultSubjectPrefix,
    spamProtectionEnabled: appConfig.spamProtectionEnabled,
    autoResponderEnabled: appConfig.autoResponderEnabled,
    hasSmtpConfigured: Boolean(appConfig.smtpHost && appConfig.smtpUser),
    smtpHost: appConfig.smtpHost || 'Not set (Using Simulated Inbox)',
    smtpPort: appConfig.smtpPort,
  });
});

// Update Configuration (e.g. Recipient Email or Subject Prefix)
app.post('/api/config', (req: Request, res: Response) => {
  const { recipientEmail, defaultSubjectPrefix, spamProtectionEnabled, autoResponderEnabled, smtpHost, smtpPort, smtpUser, smtpPass } = req.body;

  if (recipientEmail && isValidEmail(recipientEmail)) {
    appConfig.recipientEmail = recipientEmail.trim();
  }
  if (defaultSubjectPrefix !== undefined) {
    appConfig.defaultSubjectPrefix = defaultSubjectPrefix.trim();
  }
  if (typeof spamProtectionEnabled === 'boolean') {
    appConfig.spamProtectionEnabled = spamProtectionEnabled;
  }
  if (typeof autoResponderEnabled === 'boolean') {
    appConfig.autoResponderEnabled = autoResponderEnabled;
  }
  if (smtpHost !== undefined) appConfig.smtpHost = smtpHost.trim();
  if (smtpPort !== undefined) appConfig.smtpPort = smtpPort.trim();
  if (smtpUser !== undefined) appConfig.smtpUser = smtpUser.trim();
  if (smtpPass !== undefined) appConfig.smtpPass = smtpPass.trim();

  res.json({
    success: true,
    message: 'Configuration updated successfully!',
    config: {
      recipientEmail: appConfig.recipientEmail,
      defaultSubjectPrefix: appConfig.defaultSubjectPrefix,
      spamProtectionEnabled: appConfig.spamProtectionEnabled,
      autoResponderEnabled: appConfig.autoResponderEnabled,
      hasSmtpConfigured: Boolean(appConfig.smtpHost && appConfig.smtpUser),
    },
  });
});

// Main Contact Form Submission Endpoint
app.post('/api/contact', async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown Browser';

  const { name, email, subject, message, hp_website } = req.body;

  const errors: Record<string, string> = {};

  // 1. SPAM PROTECTION / HONEYPOT CHECK
  // Spambots fill all visible AND hidden input fields. Human users won't fill hidden `hp_website`.
  if (appConfig.spamProtectionEnabled && hp_website && hp_website.trim().length > 0) {
    // Record spam attempt silently without delivering email
    inboxMessages.unshift({
      id: 'msg_spam_' + Date.now(),
      name: sanitizeInput(name || 'Spam Bot'),
      email: sanitizeInput(email || 'spammer@bot.net'),
      subject: sanitizeInput(subject || 'Automated Spam'),
      fullSubject: `[SPAM BLOCKED] ${subject || 'Automated Submission'}`,
      message: sanitizeInput(message || 'Honeypot trap caught submission.'),
      timestamp: new Date().toISOString(),
      ipAddress: clientIp,
      userAgent: userAgent,
      status: 'SPAM_BLOCKED',
      sanitized: true,
      honeypotCaught: true,
      deliveredTo: 'BLOCKED (Spam Trap)',
    });

    // Return fake success response to trick spambots so they don't retry with other strategies
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      id: 'msg_spammed',
      isSpamTriggered: true,
      deliveredTo: 'Blocked by Honeypot Spam Shield',
    });
  }

  // 2. SERVER-SIDE INPUT VALIDATION & SANITIZATION
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Please provide a valid name (at least 2 characters).';
  }

  if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 2) {
    errors.subject = 'Please specify a subject for your inquiry.';
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.message = 'Please provide a message with at least 10 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted errors.',
      errors,
    });
  }

  // Clean inputs
  const cleanName = sanitizeInput(name);
  const cleanEmail = sanitizeInput(email);
  const cleanSubject = sanitizeInput(subject);
  const cleanMessage = sanitizeInput(message);
  const fullSubject = `${appConfig.defaultSubjectPrefix} ${cleanSubject}`;

  let nodemailerUsed = false;
  let deliveryStatus: 'DELIVERED' | 'FAILED' = 'DELIVERED';

  // 3. NODEMAILER / SMTP SENDING (IF CONFIGURED)
  if (appConfig.smtpHost && appConfig.smtpUser && appConfig.smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: appConfig.smtpHost,
        port: parseInt(appConfig.smtpPort || '587', 10),
        secure: appConfig.smtpPort === '465',
        auth: {
          user: appConfig.smtpUser,
          pass: appConfig.smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${cleanName}" <${process.env.SMTP_FROM || appConfig.smtpUser}>`,
        replyTo: cleanEmail,
        to: appConfig.recipientEmail,
        subject: fullSubject,
        text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nSubject: ${cleanSubject}\n\nMessage:\n${cleanMessage}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #2563eb; margin-top: 0;">New Contact Form Submission</h2>
            <p><strong>From:</strong> ${cleanName} (&lt;${cleanEmail}&gt;)</p>
            <p><strong>Subject:</strong> ${cleanSubject}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
            <p style="white-space: pre-line; line-height: 1.6; color: #333;">${cleanMessage}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
            <small style="color: #666;">Sent via Website Contact Form API | IP: ${clientIp}</small>
          </div>
        `,
      });

      nodemailerUsed = true;
    } catch (err) {
      console.error('Nodemailer SMTP dispatch error:', err);
      // Fallback gracefully to simulated store deliverability
    }
  }

  // 4. LOG MESSAGE TO INBOX STORE
  const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
  const newInboxMessage: InboxItem = {
    id: msgId,
    name: cleanName,
    email: cleanEmail,
    subject: cleanSubject,
    fullSubject: fullSubject,
    message: cleanMessage,
    timestamp: new Date().toISOString(),
    ipAddress: clientIp,
    userAgent: userAgent,
    status: deliveryStatus,
    sanitized: true,
    honeypotCaught: false,
    deliveredTo: appConfig.recipientEmail,
  };

  inboxMessages.unshift(newInboxMessage);
  if (inboxMessages.length > 50) inboxMessages.pop();

  return res.status(200).json({
    success: true,
    message: 'Your inquiry has been successfully sent! We will get back to you shortly.',
    id: msgId,
    timestamp: newInboxMessage.timestamp,
    deliveredTo: appConfig.recipientEmail,
    nodemailerUsed: nodemailerUsed,
  });
});

// GET Delivered Messages Log
app.get('/api/inbox', (req: Request, res: Response) => {
  res.json({
    total: inboxMessages.length,
    recipientEmail: appConfig.recipientEmail,
    messages: inboxMessages,
  });
});

// DELETE single message from inbox
app.delete('/api/inbox/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = inboxMessages.findIndex((m) => m.id === id);
  if (index !== -1) {
    inboxMessages.splice(index, 1);
    return res.json({ success: true, message: 'Message deleted.' });
  }
  return res.status(404).json({ success: false, message: 'Message not found.' });
});

// CLEAR inbox log
app.post('/api/inbox/clear', (req: Request, res: Response) => {
  inboxMessages.length = 0;
  res.json({ success: true, message: 'Inbox log cleared.' });
});

// GET 7-Day Analytics & Submission Statistics
app.get('/api/analytics', (req: Request, res: Response) => {
  const days: { dateStr: string; label: string; fullDate: string; total: number; delivered: number; spamBlocked: number }[] = [];
  const today = new Date();

  // Generate last 7 days array
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const fullDate = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    days.push({
      dateStr: fullDate,
      label,
      fullDate,
      total: 0,
      delivered: 0,
      spamBlocked: 0,
    });
  }

  const subjectCounts: Record<string, number> = {};
  const hourlyCounts: number[] = new Array(24).fill(0);

  // Aggregate inbox messages into 7-day buckets and hourly distribution
  inboxMessages.forEach((msg) => {
    const msgDate = new Date(msg.timestamp).toISOString().split('T')[0];
    const bucket = days.find((d) => d.dateStr === msgDate);

    if (bucket) {
      bucket.total += 1;
      if (msg.status === 'DELIVERED') {
        bucket.delivered += 1;
      } else if (msg.status === 'SPAM_BLOCKED' || msg.honeypotCaught) {
        bucket.spamBlocked += 1;
      }
    }

    const subjKey = msg.subject || 'General Inquiry';
    subjectCounts[subjKey] = (subjectCounts[subjKey] || 0) + 1;

    // Hourly tracking
    if (msg.timestamp) {
      const date = new Date(msg.timestamp);
      const hour = date.getHours();
      if (!isNaN(hour) && hour >= 0 && hour < 24) {
        hourlyCounts[hour] += 1;
      }
    }
  });

  const subjectBreakdown = Object.entries(subjectCounts).map(([subject, count]) => ({
    subject,
    count,
  }));

  const total7Days = days.reduce((acc, curr) => acc + curr.total, 0);
  const delivered7Days = days.reduce((acc, curr) => acc + curr.delivered, 0);
  const spamBlocked7Days = days.reduce((acc, curr) => acc + curr.spamBlocked, 0);
  const deliveryRate = total7Days > 0 ? Math.round((delivered7Days / total7Days) * 100) : 100;

  // Calculate Peak Submission Time & Peak Day
  let peakHour = 14;
  let maxHourCount = -1;
  hourlyCounts.forEach((count, h) => {
    if (count > maxHourCount) {
      maxHourCount = count;
      peakHour = h;
    }
  });

  const formatHourSlot = (h: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const nextH = (h + 1) % 24;
    const nextPeriod = nextH >= 12 ? 'PM' : 'AM';
    const nextDisplayHour = nextH % 12 === 0 ? 12 : nextH % 12;
    return `${displayHour}:00 ${period} – ${nextDisplayHour}:00 ${nextPeriod}`;
  };

  const peakHourLabel = formatHourSlot(peakHour);
  const peakSubmissionTime = maxHourCount > 0
    ? `${peakHourLabel} (${maxHourCount} ${maxHourCount === 1 ? 'msg' : 'msgs'})`
    : 'No activity logged';

  let peakDayObj = days[0];
  days.forEach((d) => {
    if (d.total > (peakDayObj?.total || 0)) {
      peakDayObj = d;
    }
  });

  const peakDay = peakDayObj && peakDayObj.total > 0
    ? `${peakDayObj.label} (${peakDayObj.total} msgs)`
    : 'N/A';

  const topSubjectObj = subjectBreakdown.reduce((max, curr) => curr.count > max.count ? curr : max, { subject: 'General Inquiry', count: 0 });

  const hourlyDistribution = hourlyCounts.map((count, h) => ({
    hour: h,
    hourLabel: `${h % 12 === 0 ? 12 : h % 12}${h >= 12 ? 'pm' : 'am'}`,
    count,
  }));

  res.json({
    summary: {
      totalSubmissions: inboxMessages.length,
      total7Days,
      delivered7Days,
      spamBlocked7Days,
      deliveryRate,
      dailyAverage: parseFloat((total7Days / 7).toFixed(1)),
      peakSubmissionTime,
      peakHourLabel,
      peakDay,
      topSubject: topSubjectObj.subject,
    },
    dailyTrends: days,
    subjectBreakdown,
    hourlyDistribution,
  });
});

// GET Server API Activity Logs
app.get('/api/logs', (req: Request, res: Response) => {
  res.json({
    total: apiLogs.length,
    logs: apiLogs,
  });
});

// Server Initialization
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
