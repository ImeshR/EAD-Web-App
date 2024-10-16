import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import generateHexId  from "../../services/randomId";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !phoneNumber || !address) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all fields",
      });
      return;
    }

    setLoading(true);

    try {
      const id = generateHexId(); 
      const role = "66e9783e59553323609b4f1d";

      const userData = {
        id: id,
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        address: address,
        role: role,
      };

      const response = await axios.post(`/api/User/register`, userData);

      if (response.data.message === "Registration successful") {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: `Welcome ${name}, please login.`,
        });
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Registration error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred during registration. Please try again.",
      });
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
              <h2 className="text-center mb-4">Register</h2>
              <Form onSubmit={handleRegister}>
                <Form.Group
                  className="mb-3"
                  controlId="formBasicName"
                >
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

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

                <Form.Group
                  className="mb-3"
                  controlId="formBasicPhoneNumber"
                >
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="formBasicAddress"
                >
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <a
                  href="/login"
                  className="text-decoration-none"
                >
                  Already have an account? Login
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
