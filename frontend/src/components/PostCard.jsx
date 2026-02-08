import { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Image,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { timeAgo } from "../utils/timeAgo";
import { 
  FaHeart, 
  FaComment, 
  FaEllipsisH, 
  FaEdit, 
  FaTrash,
  FaPaperPlane,
  FaTimes
} from "react-icons/fa";

const PostCard = ({ post, onDeleted, onUpdated }) => {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));
  const isOwner = user?.id === post.userId;

  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editText, setEditText] = useState(post.text || "");
  const [commentText, setCommentText] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const isLiked = likes.includes(user?.username);

  const handleLike = async () => {
    try {
      setLoadingLike(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const res = await axios.post(
        `http://localhost:5000/api/v1/posts/${post._id}/like`,
        { username: user.username },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setLikes(res.data.likes);
      
      if (!isLiked) {
        toast.success("Post liked!", {
          position: "top-center",
          autoClose: 1500,
        });
      }
    } catch (err) {
      toast.error("Failed to like post", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingLike(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setLoadingComment(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const res = await axios.post(
        `http://localhost:5000/api/v1/posts/${post._id}/comment`,
        { 
          username: user.username, 
          text: commentText.trim() 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setComments(res.data.comments);
      setCommentText("");
      
      toast.success("Comment added!", {
        position: "top-center",
        autoClose: 1500,
      });
    } catch (err) {
      toast.error("Failed to add comment", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingComment(false);
    }
  };

  const handleEditSave = async () => {
    if (!editText.trim()) {
      toast.warning("Post text cannot be empty", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoadingEdit(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const res = await axios.put(
        `http://localhost:5000/api/v1/posts/${post._id}`,
        { 
          userId: user.id, 
          text: editText.trim() 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      onUpdated(res.data.post);
      setShowEdit(false);
      
      toast.success("Post updated successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error("Failed to update post", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setLoadingDelete(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      await axios.delete(`http://localhost:5000/api/v1/posts/${post._id}`, {
        data: { userId: user.id },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      onDeleted(post._id);
      
      toast.info("Post deleted", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error("Failed to delete post", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <Card className="border-0 shadow-sm mb-3">
        <Card.Body className="p-3">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" 
                   style={{ width: "40px", height: "40px" }}>
                <span className="fw-semibold text-primary">
                  {post.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <div className="fw-semibold small">{post.username}</div>
                <div className="text-muted" style={{ fontSize: "11px" }}>
                  {timeAgo(post.createdAt)}
                </div>
              </div>
            </div>

            {/* Options Menu */}
            {isOwner && (
              <div className="position-relative">
                <Button
                  variant="link"
                  className="text-muted p-0"
                  onClick={() => setShowOptions(!showOptions)}
                >
                  <FaEllipsisH />
                </Button>
                
                {showOptions && (
                  <div className="position-absolute end-0 mt-1 bg-white border rounded shadow-sm"
                       style={{ zIndex: 1000, minWidth: "120px" }}>
                    <Button
                      variant="link"
                      className="text-dark d-block w-100 text-start px-3 py-2"
                      onClick={() => {
                        setShowEdit(true);
                        setShowOptions(false);
                      }}
                    >
                      <FaEdit className="me-2" size={12} />
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      className="text-danger d-block w-100 text-start px-3 py-2"
                      onClick={() => {
                        handleDelete();
                        setShowOptions(false);
                      }}
                      disabled={loadingDelete}
                    >
                      {loadingDelete ? (
                        <Spinner size="sm" className="me-2" />
                      ) : (
                        <FaTrash className="me-2" size={12} />
                      )}
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Post Text */}
          {post.text && (
            <p className="mb-3" style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
              {post.text}
            </p>
          )}

          {/* Post Image */}
          {post.imageUrl && (
            <div className="mb-3 rounded overflow-hidden">
              <Image
                src={`http://localhost:5000${post.imageUrl}`}
                alt="post"
                fluid
                className="w-100"
                style={{ 
                  maxHeight: "400px",
                  objectFit: "cover" 
                }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex gap-3 border-top pt-2">
            <Button
              variant="link"
              className={`text-decoration-none px-2 ${
                isLiked ? 'text-danger' : 'text-muted'
              }`}
              onClick={handleLike}
              disabled={loadingLike}
            >
              {loadingLike ? (
                <Spinner size="sm" className="me-1" />
              ) : (
                <FaHeart className="me-1" />
              )}
              <span className="small fw-medium">{likes.length}</span>
            </Button>

            <Button
              variant="link"
              className="text-decoration-none text-muted px-2"
              onClick={() => setShowComments(true)}
            >
              <FaComment className="me-1" />
              <span className="small fw-medium">{comments.length}</span>
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Comments Modal */}
      <Modal 
        show={showComments} 
        onHide={() => setShowComments(false)} 
        centered
        size="lg"
      >
        <Modal.Header className="border-0">
          <Modal.Title className="h6">Comments ({comments.length})</Modal.Title>
          <Button
            variant="link"
            className="text-muted p-0"
            onClick={() => setShowComments(false)}
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body className="p-0">
          {comments.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
              {comments.map((comment, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex align-items-start gap-2">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
                         style={{ width: "32px", height: "32px" }}>
                      <span className="fw-semibold small">
                        {comment.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-semibold small">{comment.username}</span>
                        <span className="text-muted" style={{ fontSize: "11px" }}>
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mb-0 small">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Add Comment Form */}
          <div className="border-top p-3">
            <Form onSubmit={handleCommentSubmit}>
              <div className="d-flex gap-2">
                <Form.Control
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={loadingComment}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!commentText.trim() || loadingComment}
                >
                  {loadingComment ? (
                    <Spinner size="sm" />
                  ) : (
                    <FaPaperPlane />
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header className="border-0">
          <Modal.Title className="h6">Edit Post</Modal.Title>
          <Button
            variant="link"
            className="text-muted p-0"
            onClick={() => setShowEdit(false)}
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={4}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Edit your post..."
              disabled={loadingEdit}
              className="mb-2"
            />
            <div className="text-end">
              <small className="text-muted">
                {editText.length}/500
              </small>
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowEdit(false)}
            disabled={loadingEdit}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEditSave}
            disabled={loadingEdit || !editText.trim()}
          >
            {loadingEdit ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostCard;