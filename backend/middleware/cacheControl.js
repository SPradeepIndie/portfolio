/*
 * Cache Control Middleware for Vercel Edge CDN & Browser
 */

/**
 * Sets Vercel Edge CDN and client caching headers for public read requests.
 * @param {number} sMaxAge - Edge cache duration in seconds (default: 300s = 5m)
 * @param {number} staleWhileRevalidate - SWR window in seconds (default: 600s = 10m)
 */
export const cacheControl = (sMaxAge = 300, staleWhileRevalidate = 600) => {
  return (req, res, next) => {
    if (req.method === 'GET') {
      res.setHeader(
        'Cache-Control',
        `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`
      );
    }
    next();
  };
};
