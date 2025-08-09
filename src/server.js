import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { schoolsRouter } from './routes/schools.js';
import { ensureDatabaseConnection, initializeSchema } from './db/pool.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const app = express();

app.use(cors());
// Ensure JSON parsing works correctly in production
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Test endpoint to verify JSON parsing
app.post('/test-json', (req, res) => {
  res.json({
    message: 'JSON parsing test',
    receivedBody: req.body,
    bodyType: typeof req.body,
    headers: req.headers
  });
});

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.method === 'POST') {
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
  }
  next();
});

app.use('/', schoolsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await ensureDatabaseConnection();
    await initializeSchema();
    console.log('Database connection OK; schema ensured');
  } catch (err) {
    console.error('Database/schema init failed (server still running):', err.message);
  }
});

ensureDatabaseConnection()
  .then(() => console.log('Database connection OK'))
  .catch((err) => {
    console.error('Database connection failed (server still running):', err.message);
  });

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'School APIs', version: '1.0.0' },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [],
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


