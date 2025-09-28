// Temporary in-memory database for testing without MongoDB
let users = [
  {
    _id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDBoe.0FE1PFa8C', // "password"
    profilePic: 'https://via.placeholder.com/150/007bff/ffffff?text=JD',
    about: 'Software Developer and Tech Enthusiast',
    posts: [],
    followers: [],
    following: [],
    createdAt: new Date()
  },
  {
    _id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDBoe.0FE1PFa8C', // "password"
    profilePic: 'https://via.placeholder.com/150/28a745/ffffff?text=JS',
    about: 'Designer & Creative Professional',
    posts: [],
    followers: [],
    following: [],
    createdAt: new Date()
  }
];

let posts = [
  {
    _id: '1',
    user: '1',
    content: 'Welcome to SocialeX! This is my first post on this amazing social platform. Excited to connect with everyone!',
    media: [],
    location: 'New York, USA',
    likes: ['2'],
    comments: [
      {
        user: '2',
        comment: 'Welcome to the community! 🎉',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    _id: '2',
    user: '2',
    content: 'Beautiful sunset at the beach today! Sometimes you need to take a moment to appreciate the simple things in life. 🌅',
    media: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: 'Miami Beach, FL',
    likes: ['1'],
    comments: [],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  }
];

let chats = [];
let stories = [];

// Helper functions
const findUserById = (id) => users.find(u => u._id === id);
const findUserByEmail = (email) => users.find(u => u.email === email);
const findPostById = (id) => posts.find(p => p._id === id);
const generateId = () => (Date.now() + Math.random()).toString();

// Populate posts with user data
const populatePost = (post) => {
  const user = findUserById(post.user);
  return {
    ...post,
    user: user ? {
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic
    } : null,
    comments: post.comments.map(comment => ({
      ...comment,
      user: findUserById(comment.user) ? {
        _id: findUserById(comment.user)._id,
        username: findUserById(comment.user).username,
        profilePic: findUserById(comment.user).profilePic
      } : null
    }))
  };
};

module.exports = {
  users,
  posts,
  chats,
  stories,
  findUserById,
  findUserByEmail,
  findPostById,
  generateId,
  populatePost
};