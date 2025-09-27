const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const routes = require('./routes/Route');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = 6001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route for React app connection
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is connected!', 
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// API routes
app.use('/api', routes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Database connection
mongoose.connect('mongodb://localhost:27017/socialeX', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  server.listen(PORT, () => {
    console.log(`Running @ ${PORT}`);
    console.log(`Socket.io server ready`);
  });
})
.catch((e) => console.log(`Error in db connection ${e}`));