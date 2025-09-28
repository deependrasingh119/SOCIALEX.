import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = ({ currentUser }) => {
  const [userProfile, setUserProfile] = useState(currentUser);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    about: currentUser?.about || '',
    profilePic: currentUser?.profilePic || ''
  });

  useEffect(() => {
    if (currentUser) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/api/profile/${currentUser._id}`);
      setUserProfile(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`/api/posts/user/${currentUser._id}`);
      setUserPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserProfile(response.data.user);
      setIsEditing(false);
      
      // Update localStorage
      localStorage.setItem('userData', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            
            {/* Profile Header */}
            <div className="profile-header card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <img
                      src={userProfile?.profilePic || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      className="profile-image"
                    />
                  </div>
                  <div className="col">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h2 className="mb-1">{userProfile?.username}</h2>
                        <p className="text-muted mb-2">{userProfile?.email}</p>
                        <p className="mb-3">{userProfile?.about || 'No bio available'}</p>
                        
                        <div className="profile-stats d-flex gap-4">
                          <div className="stat-item">
                            <strong>{userPosts.length}</strong>
                            <span className="text-muted ms-1">Posts</span>
                          </div>
                          <div className="stat-item">
                            <strong>{userProfile?.followers?.length || 0}</strong>
                            <span className="text-muted ms-1">Followers</span>
                          </div>
                          <div className="stat-item">
                            <strong>{userProfile?.following?.length || 0}</strong>
                            <span className="text-muted ms-1">Following</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <button
                          className="btn btn-primary"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
              <div className="edit-profile card border-0 shadow-sm mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Edit Profile</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-3">
                      <label className="form-label">Profile Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.profilePic}
                        onChange={(e) => setFormData({...formData, profilePic: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">About</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.about}
                        onChange={(e) => setFormData({...formData, about: e.target.value})}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">Update</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* User Posts */}
            <div className="user-posts">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4>My Posts</h4>
                <span className="text-muted">{userPosts.length} posts</span>
              </div>

              {userPosts.length === 0 ? (
                <div className="no-posts text-center py-5">
                  <i className="fas fa-camera fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No posts yet</h5>
                  <p className="text-muted">Share your first post to get started!</p>
                </div>
              ) : (
                <div className="posts-grid">
                  {userPosts.map((post, index) => (
                    <div key={post._id} className="post-thumbnail">
                      {post.media && post.media.length > 0 ? (
                        <img
                          src={post.media[0]}
                          alt="Post"
                          className="post-image"
                        />
                      ) : (
                        <div className="text-post">
                          <p>{post.content?.substring(0, 100)}...</p>
                        </div>
                      )}
                      <div className="post-overlay">
                        <div className="post-stats">
                          <span><i className="fas fa-heart"></i> {post.likes?.length || 0}</span>
                          <span><i className="fas fa-comment"></i> {post.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;