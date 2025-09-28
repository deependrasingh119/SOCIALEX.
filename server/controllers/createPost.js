const { posts, users, findUserById, findPostById, generateId, populatePost } = require('../mockDatabase');

const postController = {
  // Create new post
  create: async (req, res) => {
    try {
      const { userId } = req.user;
      const { content, media, location, postType } = req.body;

      // Create new post
      const newPost = {
        _id: generateId(),
        user: userId,
        content: content || '',
        media: media || [],
        location: location || '',
        postType: postType || 'post',
        likes: [],
        comments: [],
        createdAt: new Date()
      };

      posts.push(newPost);

      // Add post to user's posts array
      const user = findUserById(userId);
      if (user) {
        user.posts.push(newPost._id);
      }

      // Populate post with user data for response
      const populatedPost = populatePost(newPost);

      res.status(201).json({
        message: 'Post created successfully',
        post: populatedPost
      });

    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ message: 'Server error creating post' });
    }
  },

  // Update post
  updatePost: async (req, res) => {
    try {
      const { userId } = req.user;
      const { postId } = req.params;
      const { content, media, location } = req.body;

      const post = await Post.findById(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check if user owns the post
      if (post.user.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to edit this post' });
      }

      // Update post
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { content, media, location },
        { new: true }
      ).populate('user', 'username profilePic')
       .populate('comments.user', 'username profilePic');

      res.status(200).json({
        message: 'Post updated successfully',
        post: updatedPost
      });

    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({ message: 'Server error updating post' });
    }
  },

  // Delete post
  deletePost: async (req, res) => {
    try {
      const { userId } = req.user;
      const { postId } = req.params;

      const post = await Post.findById(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check if user owns the post
      if (post.user.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
      }

      // Remove post from user's posts array
      await User.findByIdAndUpdate(userId, {
        $pull: { posts: postId }
      });

      // Delete the post
      await Post.findByIdAndDelete(postId);

      res.status(200).json({ message: 'Post deleted successfully' });

    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({ message: 'Server error deleting post' });
    }
  },

  // Like/Unlike post
  likePost: async (req, res) => {
    try {
      const { userId } = req.user;
      const { postId } = req.params;

      const post = await Post.findById(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const isLiked = post.likes.includes(userId);
      
      if (isLiked) {
        // Unlike the post
        post.likes = post.likes.filter(id => id.toString() !== userId);
      } else {
        // Like the post
        post.likes.push(userId);
      }

      await post.save();

      res.status(200).json({
        message: isLiked ? 'Post unliked' : 'Post liked',
        likes: post.likes.length,
        isLiked: !isLiked
      });

    } catch (error) {
      console.error('Like post error:', error);
      res.status(500).json({ message: 'Server error liking post' });
    }
  },

  // Add comment to post
  commentOnPost: async (req, res) => {
    try {
      const { userId } = req.user;
      const { postId } = req.params;
      const { comment } = req.body;

      const post = await Post.findById(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const newComment = {
        user: userId,
        comment,
        createdAt: new Date()
      };

      post.comments.push(newComment);
      await post.save();

      // Populate the comment with user data
      const updatedPost = await Post.findById(postId)
        .populate('comments.user', 'username profilePic');

      res.status(200).json({
        message: 'Comment added successfully',
        comment: updatedPost.comments[updatedPost.comments.length - 1]
      });

    } catch (error) {
      console.error('Comment post error:', error);
      res.status(500).json({ message: 'Server error adding comment' });
    }
  }
};

module.exports = postController;
