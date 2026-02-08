import { useEffect, useState } from "react";
import { Form, Button, Card, Container, InputGroup, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Lock, Mail, Eye, EyeOff } from "lucide-react"; // Optional: install lucide-react for icons

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/feed");
  }, [navigate]);

  const validate = () => {
    const newErrors = {};

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "https://threew-social-app-jf3q.onrender.com//v1/auth/login",
        form
      );

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", res.data.token);
      storage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful! Welcome back 👋", {
        position: "top-center",
        autoClose: 3000,
      });
      
      // Small delay to show success message before navigating
      setTimeout(() => {
        navigate("/feed");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.", {
        position: "top-center",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Container at Top Center */}
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

      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: "12px" }}>
              <Card.Body className="p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 p-3 rounded-circle mb-3">
                    <Lock size={28} className="text-primary" />
                  </div>
                  <h3 className="fw-bold mb-1">Welcome Back</h3>
                  <p className="text-muted">Sign in to your account to continue</p>
                </div>

                <Form onSubmit={handleSubmit} noValidate>
                  {/* Email Field */}
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <Mail size={18} className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        className="border-start-0"
                        style={{ paddingLeft: "0" }}
                      />
                    </InputGroup>
                    {errors.email && (
                      <Form.Text className="text-danger small d-block mt-1">
                        {errors.email}
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-4">
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <Lock size={18} className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        className="border-start-0"
                        style={{ paddingLeft: "0" }}
                      />
                      <Button
                        variant="light"
                        className="border border-start-0"
                        onClick={() => setShowPassword((prev) => !prev)}
                        type="button"
                      >
                        {showPassword ? (
                          <EyeOff size={18} className="text-muted" />
                        ) : (
                          <Eye size={18} className="text-muted" />
                        )}
                      </Button>
                    </InputGroup>
                    {errors.password && (
                      <Form.Text className="text-danger small d-block mt-1">
                        {errors.password}
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-100 py-2 fw-semibold"
                    disabled={loading}
                    variant="primary"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="text-center my-4">
                    <div className="border-bottom d-inline-block" style={{ width: "40%" }}></div>
                    <span className="px-3 small text-muted">or</span>
                    <div className="border-bottom d-inline-block" style={{ width: "40%" }}></div>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className="mb-0 small">
                      Don't have an account?{" "}
                      <Link 
                        to="/signup" 
                        className="text-decoration-none fw-semibold text-primary"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Footer Note */}
            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                By signing in, you agree to our Terms and Privacy Policy
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;