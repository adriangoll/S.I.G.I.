import nodemailer from 'nodemailer';
import type Transporter from 'nodemailer/lib/mailer/index.js';
import dotenv from 'dotenv';

dotenv.config();

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

function assertSmtpConfig(): void {
  const missing: string[] = [];
  if (!SMTP_HOST) missing.push('SMTP_HOST');
  if (!SMTP_USER) missing.push('SMTP_USER');
  if (!SMTP_PASS) missing.push('SMTP_PASS');
  if (missing.length > 0) {
    console.warn(
      `[SMTP] Faltan variables de entorno: ${missing.join(', ')}. ` +
        'El envío de correos fallará hasta configurarlas en .env',
    );
  }
}

assertSmtpConfig();

let transporter: Transporter | null = null;

export function getSmtpTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

/** Remitente formateado para nodemailer (nombre + dirección). */
export function getEmailFrom(): string {
  if (process.env.SMTP_FROM?.trim()) {
    return process.env.SMTP_FROM.trim();
  }
  if (SMTP_USER) {
    return `Instituto Superior <${SMTP_USER}>`;
  }
  return 'Instituto Superior <no-reply@institutocalamuchita.com>';
}
