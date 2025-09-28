# MongoDB Setup Guide for SocialX

Your SocialX application is now ready to integrate with MongoDB! Here's everything you need to know to get started.

## Current Status
✅ **Complete Application Structure Ready**
- All MongoDB models configured with proper schemas
- Controllers updated to handle MongoDB operations
- Authentication system with JWT tokens
- Real-time chat with Socket.io
- Full API endpoints for posts, stories, chat, and user management
- Mock database system for development without MongoDB

## MongoDB Integration Options

### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Edition**
   - Windows: Download from https://www.mongodb.com/try/download/community
   - macOS: `brew install mongodb-community`
   - Linux: Follow official MongoDB installation guide

2. **Start MongoDB Service**
   ```bash
   # Windows (as service)
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

3. **Create Environment File**
   ```bash
   # In /server directory, copy the example
   cp .env.example .env
   ```

4. **Update .env file with your local MongoDB**
   ```env
   MONGO_URI=mongodb://localhost:27017/socialx
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=6001
   CLIENT_URL=http://localhost:3000
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/atlas
   - Sign up for free tier (512MB storage)

2. **Create Cluster**
   - Choose AWS/Google Cloud/Azure
   - Select free tier region closest to you
   - Wait for cluster creation (2-3 minutes)

3. **Setup Database Access**
   - Go to "Database Access" → "Add New Database User"
   - Choose username/password authentication
   - Create user with read/write permissions

4. **Setup Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Add current IP or 0.0.0.0/0 for all access (development only)

5. **Get Connection String**
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

6. **Update .env file**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/socialx?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=6001
   CLIENT_URL=http://localhost:3000
   ```

### Option 3: Docker MongoDB

1. **Run MongoDB in Docker**
   ```bash
   docker run -d \
     --name mongodb \
     -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=password123 \
     mongo:latest
   ```

2. **Update .env file**
   ```env
   MONGO_URI=mongodb://admin:password123@localhost:27017/socialx?authSource=admin
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=6001
   CLIENT_URL=http://localhost:3000
   ```

## Starting the Application

1. **Install Dependencies** (if not already done)
   ```bash
   cd server
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

3. **Verify Connection**
   - Server will show: `✅ Using MongoDB database` or `⚠️ Using mock database`
   - Visit http://localhost:6001 to see database status
   - Visit http://localhost:6001/api/test for connection test

## Application Features Ready for MongoDB

### 🔐 **Authentication System**
- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- User profiles with follow/unfollow

### 📱 **Posts Management**
- Create, read, update, delete posts
- Like and comment system
- User timeline and feed
- Following users' posts

### 📖 **Stories Feature**
- Create stories with text/media
- 24-hour automatic expiration
- View tracking system
- Stories from followed users

### 💬 **Real-time Chat**
- One-on-one messaging
- Real-time message delivery
- Chat history
- Socket.io integration

### 🔍 **Search & Discovery**
- Search posts by content
- User discovery
- Following recommendations

## Database Schema Overview

### Users Collection
- User authentication and profile data
- Following/followers relationships
- Posts, stories, and chat references

### Posts Collection
- Post content, media, and metadata
- Like and comment systems
- User references and timestamps

### Stories Collection
- Story content with automatic expiration
- Viewer tracking with timestamps
- User references and media support

### Chats Collection
- Chat conversations between users
- Message history with timestamps
- Participant management

## Next Steps After MongoDB Setup

1. **Test all features** with real database
2. **Add sample data** for development
3. **Configure production environment** variables
4. **Set up database backups** (for production)
5. **Monitor database performance**

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MongoDB is running
   - Verify connection string in .env
   - Check network access (Atlas)

2. **Authentication Failed**
   - Verify username/password
   - Check database user permissions
   - Ensure correct authSource

3. **Falls back to Mock Database**
   - This is normal if MongoDB isn't available
   - All features work with mock data
   - Switch when MongoDB is ready

### Getting Help

If you encounter issues:
1. Check server console for error messages
2. Verify MongoDB service is running
3. Test connection string with MongoDB Compass
4. Check firewall/network settings

## What to Tell Me

Please provide:
1. **Which option you chose** (Local/Atlas/Docker)
2. **Your connection string** (remove password)
3. **Any error messages** you encounter
4. **Your preferred database name** (default: socialx)

Example:
"I'm using MongoDB Atlas and my connection string is: `mongodb+srv://myuser:***@cluster0.xxxxx.mongodb.net/socialx`"

The application will automatically detect MongoDB and switch from mock database to real database!