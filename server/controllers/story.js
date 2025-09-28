const Story = require('../models/Stories');
const User = require('../models/Users');

const storyController = {
  // Create new story
  createStory: async (req, res) => {
    try {
      const { userId } = req.user;
      const { content, media, mediaType } = req.body;

      if (!content && !media) {
        return res.status(400).json({ message: 'Story content or media is required' });
      }

      const newStory = new Story({
        user: userId,
        content: content || '',
        media: media || '',
        mediaType: mediaType || 'text',
        viewers: []
      });

      await newStory.save();

      // Populate user data for response
      const populatedStory = await Story.findById(newStory._id)
        .populate('user', 'username profilePic');

      res.status(201).json({
        message: 'Story created successfully',
        story: populatedStory
      });

    } catch (error) {
      console.error('Create story error:', error);
      res.status(500).json({ message: 'Server error creating story' });
    }
  },

  // Get all active stories
  getAllStories: async (req, res) => {
    try {
      const stories = await Story.find({
        expiresAt: { $gt: new Date() }
      })
        .populate('user', 'username profilePic')
        .populate('viewers.user', 'username profilePic')
        .sort({ createdAt: -1 });

      // Group stories by user
      const groupedStories = {};
      stories.forEach(story => {
        const userId = story.user._id.toString();
        if (!groupedStories[userId]) {
          groupedStories[userId] = {
            user: story.user,
            stories: []
          };
        }
        groupedStories[userId].stories.push(story);
      });

      res.status(200).json({
        stories: Object.values(groupedStories)
      });

    } catch (error) {
      console.error('Get all stories error:', error);
      res.status(500).json({ message: 'Server error fetching stories' });
    }
  },

  // Get user's stories
  getUserStories: async (req, res) => {
    try {
      const { userId } = req.params;

      const stories = await Story.find({
        user: userId,
        expiresAt: { $gt: new Date() }
      })
        .populate('user', 'username profilePic')
        .populate('viewers.user', 'username profilePic')
        .sort({ createdAt: -1 });

      res.status(200).json({ stories });

    } catch (error) {
      console.error('Get user stories error:', error);
      res.status(500).json({ message: 'Server error fetching user stories' });
    }
  },

  // View story (add viewer)
  viewStory: async (req, res) => {
    try {
      const { storyId } = req.params;
      const { userId } = req.user;

      const story = await Story.findById(storyId);
      
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }

      if (story.expiresAt <= new Date()) {
        return res.status(410).json({ message: 'Story has expired' });
      }

      // Check if user already viewed this story
      const alreadyViewed = story.viewers.some(
        viewer => viewer.user.toString() === userId
      );

      if (!alreadyViewed) {
        story.viewers.push({
          user: userId,
          viewedAt: new Date()
        });
        await story.save();
      }

      // Populate and return updated story
      const updatedStory = await Story.findById(storyId)
        .populate('user', 'username profilePic')
        .populate('viewers.user', 'username profilePic');

      res.status(200).json({
        message: 'Story viewed successfully',
        story: updatedStory
      });

    } catch (error) {
      console.error('View story error:', error);
      res.status(500).json({ message: 'Server error viewing story' });
    }
  },

  // Delete story
  deleteStory: async (req, res) => {
    try {
      const { storyId } = req.params;
      const { userId } = req.user;

      const story = await Story.findById(storyId);
      
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }

      if (story.user.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to delete this story' });
      }

      await Story.findByIdAndDelete(storyId);

      res.status(200).json({ message: 'Story deleted successfully' });

    } catch (error) {
      console.error('Delete story error:', error);
      res.status(500).json({ message: 'Server error deleting story' });
    }
  },

  // Get following users stories
  getFollowingStories: async (req, res) => {
    try {
      const { userId } = req.user;

      // Get current user's following list
      const currentUser = await User.findById(userId).select('following');
      
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Include user's own stories and stories from people they follow
      const followingIds = [...currentUser.following, userId];

      const stories = await Story.find({
        user: { $in: followingIds },
        expiresAt: { $gt: new Date() }
      })
        .populate('user', 'username profilePic')
        .populate('viewers.user', 'username profilePic')
        .sort({ createdAt: -1 });

      // Group stories by user
      const groupedStories = {};
      stories.forEach(story => {
        const userIdKey = story.user._id.toString();
        if (!groupedStories[userIdKey]) {
          groupedStories[userIdKey] = {
            user: story.user,
            stories: []
          };
        }
        groupedStories[userIdKey].stories.push(story);
      });

      res.status(200).json({
        stories: Object.values(groupedStories)
      });

    } catch (error) {
      console.error('Get following stories error:', error);
      res.status(500).json({ message: 'Server error fetching following stories' });
    }
  }
};

module.exports = storyController;