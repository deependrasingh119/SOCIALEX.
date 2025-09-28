const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const postController = require('../controllers/createPost');
const postsController = require('../controllers/posts');

const verifyToken = require('../middleware/auth');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile/:userId', authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);

// Follow routes
router.post('/user/follow/:userId', verifyToken, authController.followUser);
router.post('/user/unfollow/:userId', verifyToken, authController.unfollowUser);

// Post routes
router.post('/post', verifyToken, postController.create);
router.get('/posts', postsController.getAllPosts);
router.get('/posts/user/:userId', postsController.getUserPosts);
router.get('/posts/following', verifyToken, postsController.getFollowingPosts);
router.get('/posts/search', postsController.searchPosts);
router.put('/post/:postId', verifyToken, postController.updatePost);
router.delete('/post/:postId', verifyToken, postController.deletePost);

// Like and comment routes
router.post('/post/:postId/like', verifyToken, postController.likePost);
router.post('/post/:postId/comment', verifyToken, postController.commentOnPost);

// Chat routes
const chatController = require('../controllers/chat');
router.get('/chats', verifyToken, chatController.getUserChats);
router.get('/chat/:chatId', verifyToken, chatController.getChatMessages);
router.post('/chat/start', verifyToken, chatController.startChat);
router.delete('/chat/:chatId', verifyToken, chatController.deleteChat);

// Story routes
const storyController = require('../controllers/story');
router.post('/story', verifyToken, storyController.createStory);
router.get('/stories', storyController.getAllStories);
router.get('/stories/following', verifyToken, storyController.getFollowingStories);
router.get('/stories/user/:userId', storyController.getUserStories);
router.post('/story/:storyId/view', verifyToken, storyController.viewStory);
router.delete('/story/:storyId', verifyToken, storyController.deleteStory);

module.exports = router;