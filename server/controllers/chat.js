const Chat = require('../models/Chats');
const User = require('../models/Users');

const chatController = {
  // Get user's chats
  getUserChats: async (req, res) => {
    try {
      const { userId } = req.user;

      const chats = await Chat.find({
        participants: userId
      })
        .populate('participants', 'username profilePic')
        .populate('messages.sender', 'username profilePic')
        .sort({ lastMessageTime: -1 });

      res.status(200).json({ chats });

    } catch (error) {
      console.error('Get user chats error:', error);
      res.status(500).json({ message: 'Server error fetching chats' });
    }
  },

  // Get specific chat messages
  getChatMessages: async (req, res) => {
    try {
      const { chatId } = req.params;
      const { userId } = req.user;
      const { page = 1, limit = 50 } = req.query;

      const chat = await Chat.findById(chatId)
        .populate('participants', 'username profilePic')
        .populate('messages.sender', 'username profilePic');

      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      // Check if user is participant
      if (!chat.participants.some(p => p._id.toString() === userId)) {
        return res.status(403).json({ message: 'Not authorized to access this chat' });
      }

      // Get paginated messages
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const messages = chat.messages.slice().reverse().slice(startIndex, endIndex).reverse();

      res.status(200).json({
        chat: {
          _id: chat._id,
          participants: chat.participants,
          messages,
          totalMessages: chat.messages.length
        },
        currentPage: page,
        totalPages: Math.ceil(chat.messages.length / limit)
      });

    } catch (error) {
      console.error('Get chat messages error:', error);
      res.status(500).json({ message: 'Server error fetching chat messages' });
    }
  },

  // Start new chat
  startChat: async (req, res) => {
    try {
      const { userId } = req.user;
      const { participantId } = req.body;

      if (userId === participantId) {
        return res.status(400).json({ message: 'Cannot start chat with yourself' });
      }

      // Check if chat already exists
      let chat = await Chat.findOne({
        $or: [
          { participants: [userId, participantId] },
          { participants: [participantId, userId] }
        ]
      }).populate('participants', 'username profilePic');

      if (!chat) {
        // Create new chat
        chat = new Chat({
          participants: [userId, participantId],
          messages: []
        });
        await chat.save();
        await chat.populate('participants', 'username profilePic');
      }

      res.status(200).json({
        message: 'Chat ready',
        chat
      });

    } catch (error) {
      console.error('Start chat error:', error);
      res.status(500).json({ message: 'Server error starting chat' });
    }
  },

  // Delete chat
  deleteChat: async (req, res) => {
    try {
      const { chatId } = req.params;
      const { userId } = req.user;

      const chat = await Chat.findById(chatId);
      
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      // Check if user is participant
      if (!chat.participants.includes(userId)) {
        return res.status(403).json({ message: 'Not authorized to delete this chat' });
      }

      await Chat.findByIdAndDelete(chatId);

      res.status(200).json({ message: 'Chat deleted successfully' });

    } catch (error) {
      console.error('Delete chat error:', error);
      res.status(500).json({ message: 'Server error deleting chat' });
    }
  }
};

module.exports = chatController;