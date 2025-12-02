const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

// Enable CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Body parser
server.use(jsonServer.bodyParser);

// Add delay to simulate real API
server.use((req, res, next) => {
  setTimeout(next, 300);
});

// Custom middleware to check for existing email
server.post('/users', (req, res, next) => {
  if (req.method === 'POST') {
    const { email } = req.body;
    const db = router.db.getState();
    const userExists = db.users.some(user => user.email === email);
    
    if (userExists) {
      return res.status(400).json({
        error: 'Email already in use',
        status: 400
      });
    }
    
    // Add default values
    req.body.id = Date.now().toString();
    req.body.createdAt = new Date().toISOString();
    req.body.hasCompletedPayment = false;
  }
  next();
});

// Use default middlewares (logger, static, cors, etc.)
server.use(middlewares);
server.use('/api', router);

// Error handling
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`API available at http://localhost:${port}/api`);
});
