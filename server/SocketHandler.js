const Chat = require('./models/Chats');
const User = require('./models/Users');

const SocketHandler = (io) => {
  // Store active users
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins with their user ID
    socket.on('user-connect', async (userId) => {
      activeUsers.set(userId, socket.id);
      socket.userId = userId;
      
      // Notify friends that user is online
      const user = await User.findById(userId).populate('following');
      if (user) {
        user.following.forEach(friend => {
          const friendSocketId = activeUsers.get(friend._id.toString());
          if (friendSocketId) {
            io.to(friendSocketId).emit('friend-online', {
              userId: userId,
              username: user.username
            });
          }
        });
      }

      console.log(`User ${userId} connected with socket ${socket.id}`);
    });

    // Join chat room
    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { chatId, receiverId, message, messageType = 'text' } = data;
        const senderId = socket.userId;

        // Find or create chat
        let chat = await Chat.findOne({
          $or: [
            { participants: [senderId, receiverId] },
            { participants: [receiverId, senderId] }
          ]
        });

        if (!chat) {
          chat = new Chat({
            participants: [senderId, receiverId],
            messages: []
          });
        }

        // Add message to chat
        const newMessage = {
          sender: senderId,
          message,
          messageType,
          timestamp: new Date(),
          isRead: false
        };

        chat.messages.push(newMessage);
        chat.lastMessage = message;
        chat.lastMessageTime = new Date();
        await chat.save();

        // Populate sender info for the message
        await chat.populate('messages.sender', 'username profilePic');
        const messageToSend = chat.messages[chat.messages.length - 1];

        // Send message to both users
        const receiverSocketId = activeUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive-message', {
            chatId: chat._id,
            message: messageToSend,
            senderId
          });
        }

        // Send confirmation to sender
        socket.emit('message-sent', {
          chatId: chat._id,
          message: messageToSend
        });

        console.log(`Message sent from ${senderId} to ${receiverId}`);

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Mark messages as read
    socket.on('mark-messages-read', async (data) => {
      try {
        const { chatId } = data;
        const userId = socket.userId;

        await Chat.updateOne(
          { _id: chatId },
          {
            $set: {
              'messages.$[elem].isRead': true
            }
          },
          {
            arrayFilters: [
              { 'elem.sender': { $ne: userId }, 'elem.isRead': false }
            ]
          }
        );

        // Notify other participants
        const chat = await Chat.findById(chatId);
        chat.participants.forEach(participantId => {
          if (participantId.toString() !== userId) {
            const participantSocketId = activeUsers.get(participantId.toString());
            if (participantSocketId) {
              io.to(participantSocketId).emit('messages-read', {
                chatId,
                readBy: userId
              });
            }
          }
        });

      } catch (error) {
        console.error('Mark messages read error:', error);
      }
    });

    // User is typing
    socket.on('typing', (data) => {
      const { chatId, receiverId } = data;
      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-typing', {
          chatId,
          userId: socket.userId
        });
      }
    });

    // User stopped typing
    socket.on('stop-typing', (data) => {
      const { chatId, receiverId } = data;
      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-stop-typing', {
          chatId,
          userId: socket.userId
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      if (socket.userId) {
        activeUsers.delete(socket.userId);
        
        // Notify friends that user went offline
        const user = await User.findById(socket.userId).populate('following');
        if (user) {
          user.following.forEach(friend => {
            const friendSocketId = activeUsers.get(friend._id.toString());
            if (friendSocketId) {
              io.to(friendSocketId).emit('friend-offline', {
                userId: socket.userId
              });
            }
          });
        }
        
        console.log(`User ${socket.userId} disconnected`);
      }
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = SocketHandler;
