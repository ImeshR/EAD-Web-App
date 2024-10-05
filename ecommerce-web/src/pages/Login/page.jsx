import React, { useState, useContext } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../../services/hooks/UserContext";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUserData } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter both email and password",
      });
      return;
    }

    setLoading(true);

    try {
      // Make the login API request
      const response = await axios.post(`/api/User/login`, {
          email: email,
          password: password,
        }
      );

      console.log(response);

      if (response.status === 200) {
        const token = response.data.data.token;
        localStorage.setItem("token", token);

        const decodedToken = jwtDecode(token);
        const userData = {
          id: decodedToken.UserId,
          email: decodedToken.Email,
          role: decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
          name: response.data.data.name,
        };
        console.log("User data:", userData);

        setUserData(userData);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome ${response.data.data.name}!`,
        });

        // Redirect to the dashboard
        if(userData.role === "Admin"){
          window.location.href = "/admin-dashboard";
        } else if(userData.role === "CSR"){
          window.location.href = "/csr-dashboard";
        } else if (userData.role === "Vendor"){
          window.location.href = "/vendor-dashboard";
        }
      }
    } catch (err) {
      // Log the error for debugging purposes
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col
          md={6}
          className="mx-auto"
        >
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleLogin}>
                <Form.Group
                  className="mb-3"
                  controlId="formBasicEmail"
                >
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="formBasicPassword"
                >
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <a
                  href="#"
                  className="text-decoration-none"
                >
                  Forgot password?
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
