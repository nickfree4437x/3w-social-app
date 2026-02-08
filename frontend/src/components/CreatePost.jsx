import { useState } from "react";
import {
  Card,
  Form,
  Button,
  Image,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImage, FaTimes, FaPaperPlane } from "react-icons/fa";

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    toast.info("Image removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim() && !image) {
      toast.warning("Write something or add an image to post");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("text", text.trim());
      formData.append("username", user.username);
      formData.append("userId", user.id);
      if (image) formData.append("image", image);

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const res = await axios.post(
        "http://localhost:5000/api/v1/posts", 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      onPostCreated(res.data.post);

      // Reset form
      setText("");
      setImage(null);
      setPreview(null);
      
      // Toast is here
      toast.success("Post created successfully! 🎉");
      
    } catch (err) {
      console.error("Create post error:", err);
      toast.error(
        err.response?.data?.message || "Failed to create post. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <Card className="border-0 shadow-sm mb-3">
      <Card.Body className="p-3">
        <div className="d-flex align-items-start mb-3">
          <div className="flex-shrink-0 me-3">
            <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" 
                 style={{ width: "40px", height: "40px" }}>
              <span className="fw-semibold text-primary">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <div className="flex-grow-1">
            <Form onSubmit={handleSubmit}>
              {/* Textarea */}
              <Form.Control
                as="textarea"
                rows={2}
                placeholder={`What's on your mind, ${user?.username || 'there'}?`}
                className="mb-3 border-0 p-0"
                style={{ 
                  resize: "none",
                  boxShadow: "none",
                  fontSize: "0.95rem"
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={submitting}
              />

              {/* Image Preview */}
              {preview && (
                <div className="mb-3 position-relative rounded overflow-hidden">
                  <Image
                    src={preview}
                    fluid
                    className="w-100"
                    style={{ 
                      maxHeight: "300px",
                      objectFit: "cover" 
                    }}
                  />
                  <Button
                    size="sm"
                    variant="danger"
                    className="position-absolute top-0 end-0 m-2 rounded-circle p-1"
                    style={{ width: "28px", height: "28px" }}
                    onClick={removeImage}
                    disabled={submitting}
                  >
                    <FaTimes size={12} />
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                <div>
                  <Form.Group controlId="imageUpload" className="mb-0">
                    <Form.Label 
                      className="btn btn-sm btn-outline-secondary me-2 mb-0 cursor-pointer"
                      style={{ cursor: "pointer" }}
                    >
                      <FaImage className="me-1" />
                      Photo
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="d-none"
                        disabled={submitting}
                      />
                    </Form.Label>
                  </Form.Group>
                  
                  <small className="text-muted ms-2">
                    {image ? "Image selected" : "Optional"}
                  </small>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting || (!text.trim() && !image)}
                  size="sm"
                  className="px-3"
                >
                  {submitting ? (
                    <>
                      <Spinner 
                        as="span" 
                        animation="border" 
                        size="sm" 
                        className="me-2" 
                      />
                      Posting...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="me-1" />
                      Post
                    </>
                  )}
                </Button>
              </div>

              {/* Character Counter */}
              <div className="text-end mt-2">
                <small className={`text-muted ${text.length > 500 ? 'text-danger' : ''}`}>
                  {text.length}/500
                </small>
                <small className="text-muted ms-3">
                  Press Ctrl+Enter to post
                </small>
              </div>
            </Form>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CreatePost;