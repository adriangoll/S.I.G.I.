/**
 * Verifica conexión SMTP y envío de prueba (solo dev).
 * Uso: npx tsx scripts/verify-smtp.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import { getEmailFrom, getSmtpTransporter } from '../src/config/email/smtp-transporter.js';
import sendEmail from '../src/modules/notificacionesXEmail/service/nodemailer.service.js';
import { enviarEmailRecuperacionContrasenia } from '../src/modules/auth/service/recuperacionEmail.service.js';

async function main() {
  const transporter = getSmtpTransporter();
  console.log('→ Verificando conexión SMTP...');
  await transporter.verify();
  console.log('✓ Conexión SMTP OK');
  console.log(`  From: ${getEmailFrom()}`);

  const testTo = process.env.SMTP_TEST_TO ?? process.env.SMTP_USER!;
  console.log(`→ Enviando notificación de prueba a ${testTo}...`);
  const notif = await sendEmail(testTo, 'SIGI · Prueba SMTP', 'Mensaje de verificación del seed SMTP Ferozo.', 'Sistema SIGI');
  if (notif === 'error') {
    throw new Error('Falló sendEmail (notificaciones)');
  }
  console.log('✓ Notificación de prueba enviada');

  console.log(`→ Enviando email de recuperación de prueba a ${testTo}...`);
  await enviarEmailRecuperacionContrasenia(
    testTo,
    'Usuario Prueba',
    'http://localhost:5173/restablecer-contrasenia/token-prueba',
    60,
  );
  console.log('✓ Email de recuperación enviado (revisar bandeja o logs si hubo error silencioso)');

  console.log('\nVerificación SMTP completada.');
}

main().catch((err) => {
  console.error('❌ Verificación SMTP falló:', (err as Error).message);
  process.exit(1);
});
