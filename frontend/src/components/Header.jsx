import { useState } from "react";
import { 
  Navbar, 
  Container, 
  Form, 
  Dropdown, 
  Image,
  InputGroup,
  Button
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaSignOutAlt, FaBell, FaHome } from "react-icons/fa";

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));
  const [query, setQuery] = useState("");

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
  };

  return (
    <Navbar
      bg="white"
      expand="lg"
      className="border-bottom shadow-sm py-2"
      sticky="top"
    >
      <Container>
        {/* Brand/Home */}
        <Navbar.Brand 
          className="fw-bold me-3 cursor-pointer d-flex align-items-center"
          onClick={goToHome}
          style={{ cursor: 'pointer' }}
        >
          <FaHome className="me-2 text-primary" />
          <span className="d-none d-sm-inline">SocialHub</span>
        </Navbar.Brand>

        {/* Search - Centered */}
        <div className="flex-grow-1 mx-3" style={{ maxWidth: "600px" }}>
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

        {/* User Menu */}
        <div className="d-flex align-items-center">
          {/* Notifications - Optional */}
          <Button 
            variant="light" 
            size="sm" 
            className="me-2 rounded-circle d-none d-md-block"
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
              <span className="d-none d-md-inline small fw-medium">
                {user?.username}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-sm border-0 mt-2">
              <Dropdown.Header className="small text-muted">
                Signed in as
              </Dropdown.Header>
              <Dropdown.Item className="fw-semibold" disabled>
                <FaUser className="me-2 text-muted" />
                {user?.username}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                onClick={() => navigate("#")}
                className="small"
              >
                <FaUser className="me-2" />
                My Profile
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                onClick={handleLogout} 
                className="text-danger small"
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;