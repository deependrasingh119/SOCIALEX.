import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stories from './Stories';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import './Feed.css';

const Feed = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchFeed();
    fetchStories();
  }, []);

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const response = await axios.get('/api/stories');
      setStories(response.data.stories || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (loading) {
    return (
      <div className="feed-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            
            {/* Stories Section */}
            <Stories stories={stories} currentUser={currentUser} />

            {/* Create Post Section */}
            <div className="create-post-section">
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <img
                      src={currentUser?.profilePic || 'https://via.placeholder.com/40'}
                      alt="Profile"
                      className="profile-pic me-3"
                    />
                    <button
                      className="form-control text-start text-muted"
                      onClick={() => setShowCreateModal(true)}
                      style={{cursor: 'pointer'}}
                    >
                      What's on your mind, {currentUser?.username}?
                    </button>
                  </div>
                  
                  <div className="post-actions mt-3 pt-3 border-top">
                    <div className="row text-center">
                      <div className="col-4">
                        <button
                          className="btn btn-light w-100"
                          onClick={() => setShowCreateModal(true)}
                        >
                          <i className="fas fa-image text-success me-2"></i>
                          Photo
                        </button>
                      </div>
                      <div className="col-4">
                        <button
                          className="btn btn-light w-100"
                          onClick={() => setShowCreateModal(true)}
                        >
                          <i className="fas fa-video text-danger me-2"></i>
                          Video
                        </button>
                      </div>
                      <div className="col-4">
                        <button
                          className="btn btn-light w-100"
                          onClick={() => setShowCreateModal(true)}
                        >
                          <i className="fas fa-map-marker-alt text-warning me-2"></i>
                          Location
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="posts-feed">
              {posts.length === 0 ? (
                <div className="no-posts text-center py-5">
                  <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">No posts yet</h4>
                  <p className="text-muted">Be the first to share something!</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create First Post
                  </button>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUser={currentUser}
                    onPostUpdate={fetchFeed}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar - Suggested Users */}
          <div className="col-lg-4 col-xl-3 d-none d-lg-block">
            <div className="sticky-top" style={{top: '100px'}}>
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h6 className="card-title mb-0">Suggested for you</h6>
                </div>
                <div className="card-body">
                  <div className="suggested-users">
                    {/* Placeholder for suggested users */}
                    <div className="text-center text-muted py-3">
                      <i className="fas fa-users fa-2x mb-2"></i>
                      <p className="mb-0 small">No suggestions available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        currentUser={currentUser}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Feed;