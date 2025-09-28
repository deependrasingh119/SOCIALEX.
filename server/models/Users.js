const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: '',
  },
  about: {
    type: String,
    default: '',
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
}, {timestamps: true});

const User = mongoose.model("users", userSchema);
module.exports = User;