import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'docPreinscriptos');

const filesToCreate = [
  { userId: 1, files: ['analitico-juan.pdf', 'partida-juan.pdf', 'foto-juan.jpg', 'CUS-001.pdf', 'ISA-001.pdf'] },
  { userId: 2, files: ['analitico-ana.pdf', 'partida-ana.pdf', 'foto-ana.jpg', 'CUS-002.pdf', 'ISA-002.pdf', 'EMMAC-002.pdf'] },
  { userId: 3, files: ['analitico-pedro.pdf', 'partida-pedro.pdf', 'foto-pedro.jpg', 'CUS-003.pdf', 'ISA-003.pdf'] }
];

filesToCreate.forEach(({ userId, files }) => {
  const userDir = path.join(UPLOADS_DIR, String(userId));
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  files.forEach(file => {
    const filePath = path.join(userDir, file);
    // Un PDF mínimo para que el navegador lo intente renderizar o descargar
    fs.writeFileSync(filePath, `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << >> /MediaBox [0 0 500 500] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 50 >>\nstream\nBT /F1 24 Tf 100 200 Td (Documento de Prueba) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000216 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n310\n%%EOF\n`);
    console.log(`Creado dummy file: ${filePath}`);
  });
});
