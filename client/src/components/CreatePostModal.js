import React, { useState } from 'react';
import axios from 'axios';
import './CreatePostModal.css';

const CreatePostModal = ({ show, onHide, currentUser, onPostCreated }) => {
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState('post');
  const [location, setLocation] = useState('');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim() && media.length === 0) {
      alert('Please add some content or media to your post');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/post', {
        content: postContent,
        media: media,
        location: location,
        postType: postType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onPostCreated(response.data.post);
      handleClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPostContent('');
    setLocation('');
    setMedia([]);
    setPostType('post');
    onHide();
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload these files to a server or cloud storage
    // For now, we'll create local URLs for preview
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMedia(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content create-post-modal">
          <div className="modal-header">
            <h5 className="modal-title">Create post</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          
          <div className="modal-body">
            {/* User Info */}
            <div className="d-flex align-items-center mb-3">
              <img
                src={currentUser?.profilePic || 'https://via.placeholder.com/40'}
                alt="Profile"
                className="profile-pic me-3"
              />
              <div>
                <h6 className="mb-0">{currentUser?.username}</h6>
                <div className="d-flex align-items-center">
                  <select 
                    className="form-select form-select-sm" 
                    style={{width: 'auto'}}
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                  >
                    <option value="post">Public</option>
                    <option value="story">Story (24h)</option>
                    <option value="friends">Friends Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <textarea
                  className="form-control post-textarea"
                  placeholder={`What's on your mind, ${currentUser?.username}?`}
                  rows="4"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                ></textarea>
              </div>

              {/* Location */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-map-marker-alt text-danger"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Media Upload */}
              <div className="mb-3">
                <label className="form-label">Add to your post</label>
                <div className="upload-options d-flex gap-2">
                  <label className="btn btn-outline-success">
                    <i className="fas fa-image me-2"></i>
                    Photo/Video
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="d-none"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Media Preview */}
              {media.length > 0 && (
                <div className="mb-3">
                  <div className="media-preview">
                    {media.map((item, index) => (
                      <div key={index} className="media-item">
                        <img src={item} alt="Preview" className="preview-image" />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger remove-media"
                          onClick={() => removeMedia(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading || (!postContent.trim() && media.length === 0)}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;