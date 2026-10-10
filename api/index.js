import app from '../backend/server.js';

export default function handler(req, res) {
  // Ensure req.url starts with /api if stripped by serverless rewrites
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }
  return app(req, res);
}
