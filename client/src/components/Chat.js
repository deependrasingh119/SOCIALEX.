import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './Chat.css';

const Chat = ({ currentUser }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:6001');
    setSocket(newSocket);

    // Join with user ID
    newSocket.emit('user-connect', currentUser._id);

    // Listen for online/offline status
    newSocket.on('friend-online', (data) => {
      setOnlineUsers(prev => [...prev, data.userId]);
    });

    newSocket.on('friend-offline', (data) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    });

    // Listen for new messages
    newSocket.on('receive-message', (data) => {
      if (selectedChat && data.chatId === selectedChat._id) {
        setMessages(prev => [...prev, data.message]);
      }
      // Update chat list to show new message
      fetchChats();
    });

    fetchChats();

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser._id]);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/chats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(response.data.chats || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const selectChat = async (chat) => {
    setSelectedChat(chat);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/chat/${chat._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.chat.messages || []);
      
      // Join chat room
      if (socket) {
        socket.emit('join-chat', chat._id);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !socket) return;

    const otherUser = selectedChat.participants.find(p => p._id !== currentUser._id);
    
    socket.emit('send-message', {
      chatId: selectedChat._id,
      receiverId: otherUser._id,
      message: newMessage.trim()
    });

    setNewMessage('');
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherUser = (chat) => {
    return chat.participants.find(p => p._id !== currentUser._id);
  };

  return (
    <div className="chat-container">
      <div className="container-fluid">
        <div className="row h-100">
          
          {/* Chat List Sidebar */}
          <div className="col-md-4 col-lg-3 chat-sidebar">
            <div className="chat-header p-3 border-bottom">
              <h5 className="mb-0">Chats</h5>
              <div className="search-bar mt-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search conversations..."
                />
              </div>
            </div>
            
            <div className="chats-list">
              {chats.length === 0 ? (
                <div className="no-chats p-4 text-center">
                  <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                  <h6 className="text-muted">No conversations yet</h6>
                  <p className="text-muted small">Start chatting with your friends!</p>
                </div>
              ) : (
                chats.map((chat) => {
                  const otherUser = getOtherUser(chat);
                  const isOnline = onlineUsers.includes(otherUser?._id);
                  
                  return (
                    <div
                      key={chat._id}
                      className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
                      onClick={() => selectChat(chat)}
                    >
                      <div className="d-flex align-items-center p-3">
                        <div className="position-relative">
                          <img
                            src={otherUser?.profilePic || 'https://via.placeholder.com/45'}
                            alt={otherUser?.username}
                            className="chat-avatar"
                          />
                          {isOnline && <div className="online-indicator"></div>}
                        </div>
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{otherUser?.username}</h6>
                          <p className="text-muted small mb-0">
                            {chat.lastMessage ? 
                              chat.lastMessage.length > 30 ? 
                                chat.lastMessage.substring(0, 30) + '...' : 
                                chat.lastMessage
                              : 'No messages yet'
                            }
                          </p>
                        </div>
                        {chat.lastMessageTime && (
                          <div className="chat-time text-muted small">
                            {formatTime(chat.lastMessageTime)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="col-md-8 col-lg-9 chat-main">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="chat-main-header p-3 border-bottom bg-white">
                  <div className="d-flex align-items-center">
                    <img
                      src={getOtherUser(selectedChat)?.profilePic || 'https://via.placeholder.com/40'}
                      alt={getOtherUser(selectedChat)?.username}
                      className="chat-avatar me-3"
                    />
                    <div>
                      <h6 className="mb-0">{getOtherUser(selectedChat)?.username}</h6>
                      <small className="text-muted">
                        {onlineUsers.includes(getOtherUser(selectedChat)?._id) ? 'Online' : 'Offline'}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="messages-area">
                  <div className="messages-container p-3">
                    {messages.length === 0 ? (
                      <div className="no-messages text-center py-5">
                        <i className="fas fa-comment-dots fa-3x text-muted mb-3"></i>
                        <h6 className="text-muted">Start the conversation</h6>
                        <p className="text-muted small">Send a message to get things started!</p>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <div
                          key={index}
                          className={`message ${message.sender === currentUser._id ? 'sent' : 'received'}`}
                        >
                          <div className="message-bubble">
                            {message.message}
                          </div>
                          <div className="message-time">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div className="message-input-area p-3 border-top bg-white">
                  <form onSubmit={sendMessage} className="d-flex align-items-center">
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Type something..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="no-chat-selected d-flex align-items-center justify-content-center h-100">
                <div className="text-center">
                  <i className="fas fa-comment-dots fa-4x text-muted mb-3"></i>
                  <h4 className="text-muted">Select a conversation</h4>
                  <p className="text-muted">Choose from your existing conversations or start a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;