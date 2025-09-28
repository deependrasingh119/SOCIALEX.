# SocialX - Full-Stack Social Media Platform

<div align="center">
  <h3>🚀 A Modern Social Media Application Built with React & Node.js</h3>
  
  ![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
  ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
  ![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socket.io)
</div>

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

SocialX is a full-featured social media platform that enables users to share posts, stories, chat in real-time, and build their social network. Built with modern web technologies, it provides a seamless user experience similar to popular social platforms.

### 🎯 Key Highlights
- **Real-time Chat** with Socket.io
- **Stories Feature** with 24-hour auto-expiration
- **Post Management** with likes, comments, and media support
- **User Authentication** with JWT tokens
- **Follow System** for building social connections
- **Responsive Design** with Bootstrap 5
- **MongoDB Integration** for scalable data storage

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login
- JWT-based secure authentication
- User profiles with customizable information
- Password encryption with bcrypt
- Follow/Unfollow functionality

### 📱 Posts & Content
- Create, edit, and delete posts
- Like and comment on posts
- Media upload support
- User timeline and feed
- Search functionality for posts

### 📖 Stories
- Create stories with text and media
- 24-hour automatic expiration
- View tracking system
- Stories from followed users
- Real-time story updates

### 💬 Real-time Chat
- One-on-one messaging
- Instant message delivery with Socket.io
- Chat history persistence
- Online/offline status indicators
- Message timestamps

### 🔍 Discovery & Social
- User search and discovery
- Following/Followers system
- Activity feeds
- User recommendations

## 🛠 Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **Bootstrap 5.3.8** - Responsive CSS framework
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication
- **Font Awesome** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Database
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling

### Development Tools
- **Create React App** - Frontend tooling
- **nodemon** - Development server auto-restart
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git**
- **MongoDB Atlas account** (free tier available)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/deependrasingh119/SOCIALEX.git
   cd SOCIALEX
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

## 🔧 Environment Setup

### MongoDB Atlas Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string

### Environment Configuration

Create a `.env` file in the `server` directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/socialx?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=6001
CLIENT_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

> ⚠️ **Security Note**: Never commit `.env` files to version control. Use `.env.example` as a template.

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm start
   # Server runs on http://localhost:6001
   ```

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm start
   # React app runs on http://localhost:3000
   ```

### Production Mode

1. **Build the React app**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd server
   NODE_ENV=production npm start
   ```

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile` - Update user profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/post` - Create new post
- `PUT /api/post/:postId` - Update post
- `DELETE /api/post/:postId` - Delete post
- `POST /api/post/:postId/like` - Like/unlike post
- `POST /api/post/:postId/comment` - Add comment

### Stories
- `GET /api/stories` - Get all active stories
- `POST /api/story` - Create new story
- `GET /api/stories/following` - Get stories from followed users
- `POST /api/story/:storyId/view` - Mark story as viewed
- `DELETE /api/story/:storyId` - Delete story

### Chat
- `GET /api/chats` - Get user's chats
- `GET /api/chat/:chatId` - Get chat messages
- `POST /api/chat/start` - Start new chat
- `DELETE /api/chat/:chatId` - Delete chat

### Social
- `POST /api/user/follow/:userId` - Follow user
- `POST /api/user/unfollow/:userId` - Unfollow user

## 📁 Project Structure

```
SOCIALEX/
├── client/                     # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Chat.js
│   │   │   ├── Feed.js
│   │   │   ├── HomePage.js
│   │   │   ├── LandingPage.js
│   │   │   ├── Navbar.js
│   │   │   ├── PostCard.js
│   │   │   ├── Profile.js
│   │   │   └── Stories.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                     # Node.js backend
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── controllers/            # Route controllers
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── createPost.js
│   │   ├── posts.js
│   │   └── story.js
│   ├── middleware/
│   │   └── auth.js             # JWT verification
│   ├── models/                 # Mongoose schemas
│   │   ├── Chats.js
│   │   ├── Post.js
│   │   ├── Stories.js
│   │   └── Users.js
│   ├── routes/
│   │   └── Route.js            # API routes
│   ├── .env.example            # Environment template
│   ├── index.js                # Server entry point
│   ├── mockDatabase.js         # Development fallback
│   ├── package.json
│   └── SocketHandler.js        # Socket.io handlers
├── .gitignore
├── MONGODB_SETUP.md           # Database setup guide
└── README.md
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Environment Variables** - Sensitive data protection
- **CORS Configuration** - Cross-origin request security
- **Input Validation** - Server-side data validation

## 🎨 Frontend Features

- **Responsive Design** - Mobile-first approach with Bootstrap
- **Component-based Architecture** - Reusable React components
- **Real-time Updates** - Socket.io integration for live features
- **Modern UI/UX** - Clean and intuitive interface
- **Loading States** - User feedback for async operations

## 🗄️ Database Schema

### Users Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  profilePic: String,
  bio: String,
  posts: [ObjectId],
  followers: [ObjectId],
  following: [ObjectId],
  createdAt: Date
}
```

### Posts Collection
```javascript
{
  user: ObjectId,
  content: String,
  media: String,
  likes: [ObjectId],
  comments: [{
    user: ObjectId,
    content: String,
    createdAt: Date
  }],
  createdAt: Date
}
```

### Stories Collection
```javascript
{
  user: ObjectId,
  content: String,
  media: String,
  mediaType: String,
  viewers: [{
    user: ObjectId,
    viewedAt: Date
  }],
  createdAt: Date,
  expiresAt: Date
}
```

## 🚦 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 🔄 Development Workflow

1. **Feature Development**
   - Create feature branch from main
   - Develop and test locally
   - Submit pull request

2. **Code Standards**
   - Follow ESLint rules
   - Use meaningful commit messages
   - Add comments for complex logic

3. **Environment Management**
   - Development: Local MongoDB or Atlas
   - Production: MongoDB Atlas with environment variables

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Deependra Singh**
- GitHub: [@deependrasingh119](https://github.com/deependrasingh119)
- Project: [SOCIALEX](https://github.com/deependrasingh119/SOCIALEX)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database solution
- Socket.io for real-time capabilities
- Bootstrap for responsive design
- All open-source contributors

## 📞 Support

If you have any questions or need help setting up the project:

1. Check the [MONGODB_SETUP.md](MONGODB_SETUP.md) for database configuration
2. Open an issue on GitHub
3. Review the API documentation above

---

<div align="center">
  <h3>🌟 If you found this project helpful, please give it a star! ⭐</h3>
</div>
