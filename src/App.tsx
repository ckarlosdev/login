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
import { useAuthStore } from "./hooks/authStore";
import useUser from "./hooks/useUser";

function App() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: user } = useUser();
  const { login } = useAuthStore();

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

    try {
      const result: AuthResponse | undefined = await postLogin(
        loginURL(),
        data
      );
      if (result && result.token) {
        login(result.token);

        localStorage.setItem("auth_token", result ? result.token : "");
        if (user) {
          localStorage.setItem("auth_user", JSON.stringify(user));
          console.log("User logged correctly:", user);
        }

        window.location.href = "https://ckarlosdev.github.io/binder-webapp/";
      } else {
        if (errorLogin && errorLogin.message) {
          setError(errorLogin.message);
        } else {
          setError("Incorrect credentials. Please try again.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
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
