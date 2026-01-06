import { useState } from "react";
import logo from "./assets/hmbLogo.png";
import "./App.css";
import {
  Button,
  Card,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { AuthResponse } from "./types";
import useHttpsData from "./hooks/useHttpsData";
import { loginURL } from "./hooks/urls";

function App() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { error: errorLogin, postData: postLogin } =
    useHttpsData<AuthResponse>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    var data = {
      email: email,
      password: password,
    };

    let result: AuthResponse | undefined;
    result = await postLogin(loginURL(), data);
    if (result) {
      localStorage.setItem("accessToken", result ? result.token : "");
      if (result && result.token) {
        localStorage.setItem("refreshToken", result ? result.token : "");
      }

      console.log("Login successful. Token stored.");
      // window.location.href = "https://www.youtube.com/";
      window.location.href = "http://localhost:5174/";
    } else {
      if (errorLogin && errorLogin.message) {
        setError(errorLogin.message);
      } else {
        setError("Incorrect credentials. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ backgroundColor: "#ebebeb" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Card
            className="shadow-lg"
            style={{
              width: "25rem",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "25px",
            }}
          >
            <Form onSubmit={handleSubmit}>
              <Card.Img
                className="d-block mx-auto"
                variant="top"
                src={logo}
                style={{ width: "70%", marginTop: "35px" }}
              />
              <Card.Body className="text-center">
                <Card.Title
                  style={{
                    marginBottom: "20px",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#696767",
                  }}
                >
                  Welcome
                </Card.Title>
                {error && (
                  <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
                )}
                <>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Email address"
                    className="mb-3"
                  >
                    <Form.Control
                      className="text-center"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                      className="text-center"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FloatingLabel>
                </>
                <Button
                  variant="outline-secondary"
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: "50px",
                    marginBottom: "50px",
                    fontWeight: "bold",
                    fontSize: "20px",
                    minWidth: "50%",
                  }}
                >
                  {loading ? "Starting..." : "Login"}
                </Button>
              </Card.Body>
            </Form>
          </Card>
        </Row>
      </Container>
    </div>
  );
}

export default App;
