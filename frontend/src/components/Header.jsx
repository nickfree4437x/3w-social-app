import { useState } from "react";
import { 
  Navbar, 
  Container, 
  Form, 
  Dropdown, 
  Nav,
  InputGroup,
  Button,
  Offcanvas
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  FaSearch, 
  FaUser, 
  FaSignOutAlt, 
  FaBell, 
  FaHome, 
  FaBars,
  FaTimes,
  FaCog,
  FaUserCircle
} from "react-icons/fa";

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  const [query, setQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch?.(val);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch?.("");
  };

  const goToHome = () => {
    navigate("/feed");
    setShowMobileMenu(false);
  };

  const goToProfile = () => {
    navigate("#");
    setShowMobileMenu(false);
  };

  const goToSettings = () => {
    navigate("#");
    setShowMobileMenu(false);
  };

  return (
    <>
      <Navbar
        bg="white"
        expand="lg"
        className="border-bottom shadow-sm py-2"
        sticky="top"
      >
        <Container fluid="lg">
          {/* Mobile Menu Toggle */}
          <Button
            variant="light"
            className="d-lg-none border-0 me-2"
            onClick={() => setShowMobileMenu(true)}
          >
            <FaBars />
          </Button>

          {/* Brand/Home - Always visible */}
          <Navbar.Brand 
            className="fw-bold cursor-pointer d-flex align-items-center me-0 me-lg-3"
            onClick={goToHome}
            style={{ cursor: 'pointer', flexShrink: 0 }}
          >
            <FaHome className="me-2 text-primary" />
            <span className="d-none d-sm-inline">SocialHub</span>
            <span className="d-inline d-sm-none">SH</span>
          </Navbar.Brand>

          {/* Search - Hidden on extra small, visible on medium+ */}
          <div className="d-none d-md-flex flex-grow-1 mx-0 mx-lg-3" style={{ maxWidth: "500px" }}>
            <InputGroup size="sm">
              <InputGroup.Text className="bg-white border-end-0">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search posts, people..."
                value={query}
                onChange={handleSearch}
                className="border-start-0"
              />
              {query && (
                <Button
                  variant="light"
                  className="border border-start-0"
                  onClick={clearSearch}
                  size="sm"
                >
                  ×
                </Button>
              )}
            </InputGroup>
          </div>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex align-items-center">
            {/* Notifications */}
            <Button 
              variant="light" 
              size="sm" 
              className="me-3 rounded-circle position-relative"
              onClick={() => navigate("#")}
            >
              <FaBell />
            </Button>

            {/* User Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                className="border-0 d-flex align-items-center gap-2 p-1"
              >
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" 
                     style={{ width: "36px", height: "36px" }}>
                  <span className="fw-semibold text-primary">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <span className="fw-medium">
                  {user?.username}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm border-0 mt-2">
                <Dropdown.Header className="small text-muted">
                  Signed in as
                </Dropdown.Header>
                <Dropdown.Item className="fw-semibold" disabled>
                  <FaUserCircle className="me-2 text-muted" />
                  {user?.username}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger small">
                  <FaSignOutAlt className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Mobile User Icon */}
          <div className="d-lg-none">
            <Button
              variant="light"
              className="border-0"
              onClick={() => setShowMobileMenu(true)}
            >
              <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" 
                   style={{ width: "36px", height: "36px" }}>
                <span className="fw-semibold text-primary">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        placement="end"
        className="w-75"
      >
        <Offcanvas.Header className="border-bottom">
          <div className="d-flex align-items-center w-100">
            <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3" 
                 style={{ width: "50px", height: "50px" }}>
              <span className="fw-bold text-primary fs-5">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <Offcanvas.Title className="fw-bold mb-0">{user?.username}</Offcanvas.Title>
              <small className="text-muted">@{user?.username}</small>
            </div>
            <Button
              variant="link"
              className="ms-auto text-muted p-0"
              onClick={() => setShowMobileMenu(false)}
            >
              <FaTimes size={20} />
            </Button>
          </div>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="p-0">
          {/* Mobile Search */}
          <div className="p-3 border-bottom">
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search posts, people..."
                value={query}
                onChange={handleSearch}
                className="border-start-0"
              />
              {query && (
                <Button
                  variant="light"
                  className="border border-start-0"
                  onClick={clearSearch}
                  size="sm"
                >
                  ×
                </Button>
              )}
            </InputGroup>
          </div>

          {/* Mobile Navigation */}
          <Nav className="flex-column">
            <Nav.Link 
              className="d-flex align-items-center py-3 border-bottom"
              onClick={goToHome}
            >
              <FaHome className="me-3" />
              Home
            </Nav.Link>
            
            
            <Nav.Link 
              className="d-flex align-items-center py-3 border-bottom"
              onClick={() => navigate("#")}
            >
              <FaBell className="me-3" />
              Notifications
            </Nav.Link>
            
            <Nav.Link 
              className="d-flex align-items-center py-3 border-bottom text-danger"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-3" />
              Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Mobile Search Bar (for xs screens) */}
      <div className="d-md-none bg-white border-bottom py-2 px-3">
        <InputGroup size="sm">
          <InputGroup.Text className="bg-white border-end-0">
            <FaSearch className="text-muted" />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search posts, people..."
            value={query}
            onChange={handleSearch}
            className="border-start-0"
          />
          {query && (
            <Button
              variant="light"
              className="border border-start-0"
              onClick={clearSearch}
              size="sm"
            >
              ×
            </Button>
          )}
        </InputGroup>
      </div>
    </>
  );
};

export default Header;