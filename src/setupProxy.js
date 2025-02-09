const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',  // Important: This must match the start of your API routes
    createProxyMiddleware({
      target: 'http://127.0.0.1:7000', // Your Flask server address
      changeOrigin: true, // Required for CORS in development
    })
  );
};
