import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { initDatabase } from './config/db.js';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import scholarshipsRoutes from './routes/scholarships.js';
import eligibilityRoutes from './routes/eligibility.js';
import applicationsRoutes from './routes/applications.js';
import documentsRoutes from './routes/documents.js';
import verificationRoutes from './routes/verification.js';
import paymentsRoutes from './routes/payments.js';
import notificationsRoutes from './routes/notifications.js';
import jagoRoutes from './routes/jago.js';
import officerRoutes from './routes/officer.js';
import auditLogsRoutes from './routes/auditLogs.js';
import mockRoutes from './routes/mockIntegrations.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Render provides PORT automatically
const PORT = process.env.PORT || 5000;

// Initialize SQLite database and seed schema
initDatabase();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads & sample documents
const uploadsDir = path.join(__dirname, '../uploads');
const sampleDocsDir = path.join(__dirname, '../public/sample-docs');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(sampleDocsDir)) {
  fs.mkdirSync(sampleDocsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));
app.use('/sample-docs', express.static(sampleDocsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/scholarships', scholarshipsRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/jago', jagoRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/audit-logs', auditLogsRoutes);
app.use('/api/mock', mockRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'TRINEX Core API Server',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found on TRINEX server.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[TRINEX Server Error]', err.stack);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message ||
      'An internal TRINEX service error occurred. Please try again.',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : undefined
  });
});

// IMPORTANT FOR RENDER:
// Listen on 0.0.0.0 so Render can access the server.
app.listen(PORT, '0.0.0.0', () => {
  console.log('=======================================================');
  console.log(`  TRINEX Backend Server running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log('  Tagline: "One Platform. Every Scholarship. Smarter Access."');
  console.log('=======================================================');
});