const express = require('express');
const router = express.Router();
const authController = require('../controllers/Auth');
const postController = require('../controllers/createPost');
const postsController = require('../controllers/Posts');

router.post('/login', authController.login);
router.post('/post', postController.create);
router.get('/posts', postsController.getAllPosts);

module.exports = router;