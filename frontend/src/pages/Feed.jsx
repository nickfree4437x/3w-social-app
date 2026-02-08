import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { 
  Container, 
  Button, 
  Spinner, 
  Row, 
  Col, 
  Card,
  Alert 
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import Header from "../components/Header";
import FeedControls from "../components/FeedControls";
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const createPostRef = useRef(null);

  const fetchPosts = async (pageNo = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const res = await axios.get(
        `https://threew-social-app-jf3q.onrender.com//v1/posts?page=${pageNo}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const { posts: newPosts, totalPages } = res.data;

      setTotalPages(totalPages);
      setPosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
      setPage(pageNo);
      
    } catch (err) {
      console.error("Fetch posts error", err);
      setError("Failed to load posts. Please try again.");
      
      toast.error("Failed to load posts", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, false);
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    toast.success("Post created successfully!", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const handleDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    toast.info("Post deleted", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const handleUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
    toast.success("Post updated!", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const loadMore = () => {
    if (page < totalPages && !loadingMore) {
      fetchPosts(page + 1, true);
    }
  };

  const handleSearch = (query) => {
    setSearch(query);
    if (query) {
      toast.info(`Searching for: ${query}`, {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    const filterLabels = {
      all: "All Posts",
      liked: "Most Liked",
      commented: "Most Commented",
      forYou: "For You"
    };
    toast.info(`Filter: ${filterLabels[newFilter]}`, {
      position: "top-center",
      autoClose: 1500,
    });
  };

  // Search + Filter
  const filteredPosts = posts
    .filter((p) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        p.username?.toLowerCase().includes(q) ||
        p.text?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aScore = (a.likes?.length || 0) * 2 + (a.comments?.length || 0);
      const bScore = (b.likes?.length || 0) * 2 + (b.comments?.length || 0);

      if (filter === "liked")
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      if (filter === "commented")
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      if (filter === "forYou") return bScore - aScore;
      return 0;
    });

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ top: "20px" }}
      />
      
      <div className="min-vh-100 py-3">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} lg={8} xl={6}>
              
              {/* Header Card */}
              <Card className="border-0 shadow-sm mb-3">
                <Card.Body className="p-3">
                  <Header onSearch={handleSearch} />
                </Card.Body>
              </Card>

              {/* Create Post Section */}
              <div ref={createPostRef}>
                <Card className="border-0 shadow-sm mb-3">
                  <Card.Body className="p-3">
                    <CreatePost onPostCreated={handlePostCreated} />
                  </Card.Body>
                </Card>
              </div>

              {/* Feed Controls */}
              <Card className="border-0 shadow-sm mb-3">
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0 fw-semibold">Feed</h6>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() =>
                        createPostRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
                      }
                    >
                      <FaPlus className="me-1" />
                      New Post
                    </Button>
                  </div>
                  
                  <FeedControls
                    filter={filter}
                    setFilter={handleFilterChange}
                  />
                  
                  {search && (
                    <div className="mt-2">
                      <small className="text-muted">
                        <FaSearch size={12} className="me-1" />
                        Searching: "{search}"
                      </small>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Error Message */}
              {error && !loading && (
                <Alert variant="warning" className="mb-3">
                  {error}
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    className="ms-2"
                    onClick={() => fetchPosts(1, false)}
                  >
                    Retry
                  </Button>
                </Alert>
              )}

              {/* Initial Loader */}
              {loading && posts.length === 0 && (
                <Card className="border-0 shadow-sm mb-3">
                  <Card.Body className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 mb-0 text-muted">Loading posts...</p>
                  </Card.Body>
                </Card>
              )}

              {/* Empty State */}
              {!loading && filteredPosts.length === 0 && posts.length > 0 && (
                <Card className="border-0 shadow-sm mb-3">
                  <Card.Body className="text-center py-4">
                    <FaFilter className="text-muted mb-2" size={24} />
                    <p className="mb-1">No posts match your filter</p>
                    <small className="text-muted">
                      Try changing your search or filter
                    </small>
                  </Card.Body>
                </Card>
              )}

              {!loading && posts.length === 0 && !error && (
                <Card className="border-0 shadow-sm mb-3">
                  <Card.Body className="text-center py-5">
                    <p className="mb-2">No posts yet</p>
                    <small className="text-muted d-block mb-3">
                      Be the first to create a post!
                    </small>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        createPostRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
                      }
                    >
                      <FaPlus className="me-1" />
                      Create First Post
                    </Button>
                  </Card.Body>
                </Card>
              )}

              {/* Posts Feed */}
              {filteredPosts.map((post, index) => (
                <div key={post._id} className="mb-3">
                  <PostCard
                    post={post}
                    onDeleted={handleDeleted}
                    onUpdated={handleUpdated}
                  />
                </div>
              ))}

              {/* Load More Spinner */}
              {loadingMore && (
                <div className="text-center my-4">
                  <Spinner animation="border" size="sm" />
                  <p className="mt-2 text-muted small">Loading more posts...</p>
                </div>
              )}

              {/* Load More Button */}
              {page < totalPages && !loadingMore && !loading && (
                <div className="text-center my-4">
                  <Button
                    variant="outline-primary"
                    onClick={loadMore}
                    disabled={loadingMore}
                  >
                    Load More Posts
                  </Button>
                  <p className="mt-2 text-muted small">
                    Showing {posts.length} of many posts
                  </p>
                </div>
              )}

              {/* End of Feed */}
              {!loading && posts.length > 0 && page >= totalPages && (
                <div className="text-center mt-4 mb-5">
                  <hr className="mb-3" />
                  <p className="text-muted small mb-0">
                    You've reached the end of the feed
                  </p>
                </div>
              )}

            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Feed;