import React from 'react';
import './Stories.css';

const Stories = ({ stories, currentUser }) => {
  return (
    <div className="stories-section mb-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-3">
          <h6 className="card-title mb-3">Stories</h6>
          <div className="stories-container">
            <div className="d-flex overflow-auto">
              {/* Add Your Story */}
              <div className="story-item me-3">
                <div className="story-circle add-story">
                  <img
                    src={currentUser?.profilePic || 'https://via.placeholder.com/60'}
                    alt="Add Story"
                    className="story-avatar"
                  />
                  <div className="add-story-btn">
                    <i className="fas fa-plus"></i>
                  </div>
                </div>
                <div className="story-label">Add Story</div>
              </div>

              {/* Stories from other users */}
              {stories.map((userStories, index) => (
                <div key={index} className="story-item me-3">
                  <div className="story-circle">
                    <img
                      src={userStories.user?.profilePic || 'https://via.placeholder.com/60'}
                      alt={userStories.user?.username}
                      className="story-avatar"
                    />
                  </div>
                  <div className="story-label">{userStories.user?.username}</div>
                </div>
              ))}

              {/* Placeholder stories if empty */}
              {stories.length === 0 && (
                <>
                  <div className="story-item me-3">
                    <div className="story-circle">
                      <img
                        src="https://via.placeholder.com/60"
                        alt="Demo"
                        className="story-avatar"
                      />
                    </div>
                    <div className="story-label">Demo User</div>
                  </div>
                  <div className="story-item me-3">
                    <div className="story-circle">
                      <img
                        src="https://via.placeholder.com/60"
                        alt="Demo"
                        className="story-avatar"
                      />
                    </div>
                    <div className="story-label">John Doe</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stories;