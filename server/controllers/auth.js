const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { users, findUserById, findUserByEmail, generateId } = require('../mockDatabase');

const auth = {
  // Register new user
  register: async (req, res) => {
    try {
      const { username, email, password, profilePic, about } = req.body;

      // Check if user already exists
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = {
        _id: generateId(),
        username,
        email,
        password: hashedPassword,
        profilePic: profilePic || `https://via.placeholder.com/150/007bff/ffffff?text=${username.charAt(0).toUpperCase()}`,
        about: about || '',
        posts: [],
        followers: [],
        following: [],
        createdAt: new Date()
      };

      users.push(newUser);

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        process.env.JWT_SECRET || 'socialeX_secret_key',
        { expiresIn: '7d' }
      );

      // Remove password from response
      const userResponse = { ...newUser };
      delete userResponse.password;

      res.status(201).json({
        message: 'User registered successfully',
        user: userResponse,
        token
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'socialeX_secret_key',
        { expiresIn: '7d' }
      );

      // Remove password from response
      const userResponse = { ...user };
      delete userResponse.password;

      res.status(200).json({
        message: 'Login successful',
        user: userResponse,
        token
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId)
        .select('-password')
        .populate('posts')
        .populate('followers', 'username profilePic')
        .populate('following', 'username profilePic');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error fetching profile' });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { userId } = req.user;
      const { username, about, profilePic } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { username, about, profilePic },
        { new: true }
      ).select('-password');

      res.status(200).json({
        message: 'Profile updated successfully',
        user
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error updating profile' });
    }
  },

  // Follow user
  followUser: async (req, res) => {
    try {
      const { userId } = req.user;
      const { userId: targetUserId } = req.params;

      if (userId === targetUserId) {
        return res.status(400).json({ message: 'Cannot follow yourself' });
      }

      const user = await User.findById(userId);
      const targetUser = await User.findById(targetUserId);

      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.following.includes(targetUserId)) {
        return res.status(400).json({ message: 'Already following this user' });
      }

      user.following.push(targetUserId);
      targetUser.followers.push(userId);

      await user.save();
      await targetUser.save();

      res.status(200).json({ message: 'User followed successfully' });

    } catch (error) {
      console.error('Follow user error:', error);
      res.status(500).json({ message: 'Server error following user' });
    }
  },

  // Unfollow user
  unfollowUser: async (req, res) => {
    try {
      const { userId } = req.user;
      const { userId: targetUserId } = req.params;

      const user = await User.findById(userId);
      const targetUser = await User.findById(targetUserId);

      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.following = user.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId);

      await user.save();
      await targetUser.save();

      res.status(200).json({ message: 'User unfollowed successfully' });

    } catch (error) {
      console.error('Unfollow user error:', error);
      res.status(500).json({ message: 'Server error unfollowing user' });
    }
  }
};

module.exports = auth;