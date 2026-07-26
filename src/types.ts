export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  hp_website?: string; // Honeypot field for spam protection
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  id?: string;
  timestamp?: string;
  errors?: Record<string, string>;
  isSpamTriggered?: boolean;
  deliveredTo?: string;
  nodemailerUsed?: boolean;
}

export interface EmailLog {
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
}

export interface ServerApiLog {
  id: string;
  method: string;
  endpoint: string;
  statusCode: number;
  timestamp: string;
  durationMs: number;
  payloadSummary: string;
}

export interface AppConfig {
  recipientEmail: string;
  defaultSubjectPrefix: string;
  spamProtectionEnabled: boolean;
  autoResponderEnabled: boolean;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
}

export interface Proposal {
  id: string;
  freelancerName: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  bidAmount: number;
  deliveryDays: number;
  pitch: string;
  techStack: string[];
  timestamp: string;
}
