const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy API requests to the backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
}));

// Serve standalone apps
app.get('/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'standalone.html'));
});

// Serve the main standalone page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'standalone.html'));
});

app.listen(PORT, () => {
  console.log(`Standalone app server running on http://localhost:${PORT}`);
  console.log(`Published apps will be available at: http://localhost:${PORT}/[app-slug]`);
});
