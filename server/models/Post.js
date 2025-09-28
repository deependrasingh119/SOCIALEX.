const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  media: [{
    type: String
  }],
  location: {
    type: String,
    default: ''
  },
  postType: {
    type: String,
    enum: ['post', 'story'],
    default: 'post'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  comments: [commentSchema]
}, {timestamps: true});

const Post = mongoose.model("posts", postSchema);
module.exports = Post;