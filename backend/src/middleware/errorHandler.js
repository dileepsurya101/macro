/**
 * Express error-handling middleware.
 * Must be registered last with app.use(errorHandler).
 */
export function errorHandler(err, req, res, next) {
  console.error('[errorHandler]', err.message || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}
