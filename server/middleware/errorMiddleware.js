import logger from '../utils/logger.js';

export default function errorHandler(err, req, res, _next) {
  logger.error('Error processing request %s %s: %o', req.method, req.originalUrl, err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
