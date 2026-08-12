const app = require("../src/app");

module.exports = (req, res) => {
  // Handle OPTIONS requests for preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).end();
    return;
  }
  
  // For all other requests, let the Express app handle them
  app(req, res);
};
