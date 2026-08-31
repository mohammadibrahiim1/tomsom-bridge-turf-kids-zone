import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes.js';

// Resolve current directory safely for both ESM (tsx) and bundled CJS
const getDirname = () => {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
};

const currentDir = getDirname();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // CORS and JSON support
  app.use(cors());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API Routes
  app.use('/api', apiRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'টমছম ব্রিজ টার্ফ ও কিডস জোন API',
      timestamp: new Date().toISOString(),
    });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production' && !process.env.CPANEL_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Check multiple possible dist locations for cPanel compatibility
    let distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(path.join(currentDir, 'index.html'))) {
      distPath = currentDir;
    } else if (fs.existsSync(path.join(currentDir, 'dist', 'index.html'))) {
      distPath = path.join(currentDir, 'dist');
    }

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Tomsom Turf & Kids Zone] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

