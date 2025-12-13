const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const routes = require('./routes/Route');
const SocketHandler = require('./SocketHandler');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Database configuration
const connectDB = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 6001;

// Database connection
let dbConnection = null;

// Initialize database connection
const initializeDatabase = async () => {
  try {
    dbConnection = await connectDB();
    if (dbConnection) {
      console.log('✅ Using MongoDB database');
      global.USE_MONGODB = true;
    } else {
      console.log('⚠️ Using mock database (MongoDB not available)');
      global.USE_MONGODB = false;
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    console.log('⚠️ Falling back to mock database');
    global.USE_MONGODB = false;
  }
};

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Test route for React app connection
app.get('/api/test', (req, res) => {
  res.json({ 
    message: `Backend is connected! (Using ${global.USE_MONGODB ? 'MongoDB' : 'Mock Database'})`, 
    timestamp: new Date().toISOString(),
    database: global.USE_MONGODB ? 'MongoDB' : 'Mock Database',
    status: 'success'
  });
});

// API routes
app.use('/api', routes);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Socket.io handling (simplified for mock database)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server with database initialization
const startServer = async () => {
  // Initialize database first
  await initializeDatabase();
  
  // Start server
  server.listen(PORT, () => {
    console.log(`🚀 Server running @ http://localhost:${PORT}`);
    console.log(`📊 Database: ${global.USE_MONGODB ? 'MongoDB' : 'Mock Database'}`);
    console.log(`🔌 Socket.io server ready`);
  });
};

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});