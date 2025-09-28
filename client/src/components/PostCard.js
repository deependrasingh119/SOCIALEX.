import React, { useState } from 'react';
import axios from 'axios';
import './PostCard.css';

const PostCard = ({ post, currentUser, onPostUpdate }) => {
  const [liked, setLiked] = useState(post.likes?.includes(currentUser?._id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/post/${post._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLiked(response.data.isLiked);
      setLikesCount(response.data.likes);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/post/${post._id}/comment`, {
        comment: comment.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComments([...comments, response.data.comment]);
      setComment('');
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="post-card card border-0 shadow-sm mb-4">
      <div className="card-header bg-white d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img
            src={post.user?.profilePic || 'https://via.placeholder.com/40'}
            alt={post.user?.username}
            className="post-avatar me-3"
          />
          <div>
            <h6 className="mb-0">{post.user?.username}</h6>
            <small className="text-muted">{formatTimeAgo(post.createdAt)}</small>
            {post.location && (
              <div className="text-muted small">
                <i className="fas fa-map-marker-alt me-1"></i>
                {post.location}
              </div>
            )}
          </div>
        </div>
        <div className="dropdown">
          <button className="btn btn-link text-muted" data-bs-toggle="dropdown">
            <i className="fas fa-ellipsis-h"></i>
          </button>
          <ul className="dropdown-menu">
            {post.user?._id === currentUser?._id && (
              <>
                <li><button className="dropdown-item">Edit Post</button></li>
                <li><button className="dropdown-item text-danger">Delete Post</button></li>
                <li><hr className="dropdown-divider" /></li>
              </>
            )}
            <li><button className="dropdown-item">Report Post</button></li>
          </ul>
        </div>
      </div>

      <div className="card-body p-0">
        {/* Post Content */}
        {post.content && (
          <div className="post-content p-3">
            <p className="mb-0">{post.content}</p>
          </div>
        )}

        {/* Post Media */}
        {post.media && post.media.length > 0 && (
          <div className="post-media">
            {post.media.map((mediaItem, index) => (
              <img
                key={index}
                src={mediaItem}
                alt="Post content"
                className="img-fluid w-100"
              />
            ))}
          </div>
        )}

        {/* Post Stats */}
        <div className="post-stats p-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <div className="likes-count">
              {likesCount > 0 && (
                <span className="text-muted small">
                  <i className="fas fa-heart text-danger me-1"></i>
                  {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </span>
              )}
            </div>
            <div className="comments-count">
              {comments.length > 0 && (
                <button 
                  className="btn btn-link p-0 text-muted small"
                  onClick={() => setShowComments(!showComments)}
                >
                  {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Post Actions */}
        <div className="post-actions p-3 border-bottom">
          <div className="row text-center">
            <div className="col-4">
              <button 
                className={`btn btn-light w-100 ${liked ? 'text-danger' : ''}`}
                onClick={handleLike}
              >
                <i className={`fas fa-heart me-2 ${liked ? 'text-danger' : ''}`}></i>
                Like
              </button>
            </div>
            <div className="col-4">
              <button 
                className="btn btn-light w-100"
                onClick={() => setShowComments(!showComments)}
              >
                <i className="fas fa-comment me-2"></i>
                Comment
              </button>
            </div>
            <div className="col-4">
              <button className="btn btn-light w-100">
                <i className="fas fa-share me-2"></i>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="comments-section">
            {/* Existing Comments */}
            <div className="comments-list p-3">
              {comments.map((commentItem, index) => (
                <div key={index} className="comment-item d-flex mb-3">
                  <img
                    src={commentItem.user?.profilePic || 'https://via.placeholder.com/30'}
                    alt={commentItem.user?.username}
                    className="comment-avatar me-2"
                  />
                  <div className="comment-content">
                    <div className="comment-bubble">
                      <strong className="me-2">{commentItem.user?.username}</strong>
                      {commentItem.comment}
                    </div>
                    <small className="text-muted">
                      {formatTimeAgo(commentItem.createdAt)}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="add-comment p-3 border-top">
              <form onSubmit={handleComment} className="d-flex align-items-center">
                <img
                  src={currentUser?.profilePic || 'https://via.placeholder.com/30'}
                  alt="Your avatar"
                  className="comment-avatar me-2"
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit" className="btn btn-primary ms-2">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;