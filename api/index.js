/**
 * ==============================================================================
 * Vercel Serverless Function Entry Point (/api)
 * ==============================================================================
 * Purpose:
 *   - Acts as the serverless bridge connecting Vercel's Serverless Function runtime
 *     to our Node.js / Express backend application ('../backend/server.js').
 *
 * How it works:
 *   1. Vercel automatically treats any file in the root 'api/' directory as a Serverless
 *      Function endpoint.
 *   2. When an incoming HTTP request hits '/api/*', Vercel's edge router (configured
 *      in 'vercel.json') forwards the request to this handler.
 *   3. This function passes the standard (req, res) objects into Express, executing
 *      all routes, controllers, and middleware without requiring an always-on server.
 *
 * URL Normalization:
 *   - Ensures that 'req.url' starts with '/api' so Express route matchers
 *     (e.g., app.use('/api/blogs', ...)) correctly match the incoming request path.
 * ==============================================================================
 */
import app from '../backend/server.js';


export default function handler(req, res) {
  // Ensure req.url starts with /api if stripped by serverless rewrites
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }
  return app(req, res);
}
