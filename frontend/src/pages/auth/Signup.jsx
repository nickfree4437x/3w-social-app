import { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaArrowRight,
  FaCheck
} from "react-icons/fa";

const Signup = () => {
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "" 
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.username) newErrors.username = "Username is required";
    else if (form.username.length < 3) 
      newErrors.username = "Username must be at least 3 characters";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.password))
      newErrors.password = "Must contain uppercase and number";

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm password";
    else if (form.password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!agreeTerms) newErrors.terms = "You must agree to the terms";

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

      await axios.post("https://threew-social-app-jf3q.onrender.com/api/v1/auth/signup", form);

      toast.success("🎉 Account created successfully! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { text: "At least 6 characters", met: form.password.length >= 6 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(form.password) },
    { text: "Contains a number", met: /[0-9]/.test(form.password) },
  ];

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 py-4">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <Card.Body className="p-4 p-md-5">
              
              {/* Header */}
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 p-3 rounded-circle mb-3">
                  <FaUser className="text-primary" size={24} />
                </div>
                <h3 className="fw-bold mb-1">Create Account</h3>
                <p className="text-muted">Join our community today</p>
              </div>

              <Form onSubmit={handleSubmit} noValidate>
                
                {/* Username */}
                <Form.Group className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaUser className="text-muted" />
                    </span>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter username"
                      value={form.username}
                      onChange={handleChange}
                      isInvalid={!!errors.username}
                      className="border-start-0"
                    />
                  </div>
                  {errors.username && (
                    <Form.Text className="text-danger small d-block mt-1">
                      {errors.username}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaEnvelope className="text-muted" />
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      className="border-start-0"
                    />
                  </div>
                  {errors.email && (
                    <Form.Text className="text-danger small d-block mt-1">
                      {errors.email}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaLock className="text-muted" />
                    </span>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      className="border-start-0"
                    />
                    <Button
                      variant="light"
                      className="border border-start-0"
                      onClick={() => setShowPassword((prev) => !prev)}
                      type="button"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-muted" />
                      ) : (
                        <FaEye className="text-muted" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <Form.Text className="text-danger small d-block mt-1">
                      {errors.password}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaLock className="text-muted" />
                    </span>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors({ ...errors, confirmPassword: "" });
                      }}
                      isInvalid={!!errors.confirmPassword}
                      className="border-start-0"
                    />
                    <Button
                      variant="light"
                      className="border border-start-0"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      type="button"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-muted" />
                      ) : (
                        <FaEye className="text-muted" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <Form.Text className="text-danger small d-block mt-1">
                      {errors.confirmPassword}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Password Requirements */}
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="mb-2 small fw-semibold">Password Requirements:</h6>
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="d-flex align-items-center mb-1">
                      <FaCheck 
                        size={12} 
                        className={`me-2 ${req.met ? 'text-success' : 'text-muted'}`} 
                      />
                      <small className={req.met ? 'text-success' : 'text-muted'}>
                        {req.text}
                      </small>
                    </div>
                  ))}
                </div>

                {/* Terms Agreement */}
                <Form.Group className="mb-4">
                  <Form.Check 
                    type="checkbox"
                    id="agreeTerms"
                    label={
                      <span className="small">
                        I agree to the{" "}
                        <Link to="/terms" className="text-decoration-none text-primary">
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-decoration-none text-primary">
                          Privacy Policy
                        </Link>
                      </span>
                    }
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      setErrors({ ...errors, terms: "" });
                    }}
                    isInvalid={!!errors.terms}
                  />
                  {errors.terms && (
                    <Form.Text className="text-danger small d-block mt-1">
                      {errors.terms}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-100 py-2 fw-semibold mb-3"
                  disabled={loading}
                  variant="primary"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="mb-0 small">
                    Already have an account?{" "}
                    <Link 
                      to="/" 
                      className="text-decoration-none fw-semibold text-primary"
                    >
                      Log In
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
