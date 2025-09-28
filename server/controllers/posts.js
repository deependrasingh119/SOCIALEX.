const { posts, users, findUserById, populatePost } = require('../mockDatabase');

const postsController = {
  // Get all posts (for feed)
  getAllPosts: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      // Sort posts by creation date (newest first)
      const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
      
      // Populate posts with user data
      const populatedPosts = paginatedPosts.map(post => populatePost(post));
      
      res.status(200).json({
        posts: populatedPosts,
        totalPages: Math.ceil(posts.length / limit),
        currentPage: parseInt(page),
        totalPosts: posts.length
      });

    } catch (error) {
      console.error('Get all posts error:', error);
      res.status(500).json({ message: 'Server error fetching posts' });
    }
  },

  // Get posts by specific user
  getUserPosts: async (req, res) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const posts = await Post.find({ user: userId })
        .populate('user', 'username profilePic')
        .populate('comments.user', 'username profilePic')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const totalPosts = await Post.countDocuments({ user: userId });

      res.status(200).json({
        posts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
        totalPosts
      });

    } catch (error) {
      console.error('Get user posts error:', error);
      res.status(500).json({ message: 'Server error fetching user posts' });
    }
  },

  // Get following users posts (personalized feed)
  getFollowingPosts: async (req, res) => {
    try {
      const { userId } = req.user;
      const { page = 1, limit = 10 } = req.query;

      // Get current user's following list
      const currentUser = await User.findById(userId).select('following');
      
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Include user's own posts and posts from people they follow
      const followingIds = [...currentUser.following, userId];

      const posts = await Post.find({ user: { $in: followingIds } })
        .populate('user', 'username profilePic')
        .populate('comments.user', 'username profilePic')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const totalPosts = await Post.countDocuments({ user: { $in: followingIds } });

      res.status(200).json({
        posts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
        totalPosts
      });

    } catch (error) {
      console.error('Get following posts error:', error);
      res.status(500).json({ message: 'Server error fetching following posts' });
    }
  },

  // Search posts
  searchPosts: async (req, res) => {
    try {
      const { query, page = 1, limit = 10 } = req.query;

      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const posts = await Post.find({
        $or: [
          { content: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } }
        ]
      })
        .populate('user', 'username profilePic')
        .populate('comments.user', 'username profilePic')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const totalPosts = await Post.countDocuments({
        $or: [
          { content: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } }
        ]
      });

      res.status(200).json({
        posts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
        totalPosts,
        query
      });

    } catch (error) {
      console.error('Search posts error:', error);
      res.status(500).json({ message: 'Server error searching posts' });
    }
  }
};

module.exports = postsController;
