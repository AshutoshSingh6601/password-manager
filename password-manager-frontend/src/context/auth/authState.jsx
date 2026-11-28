import { useState, useCallback } from "react";
import AuthContext from "./authContext";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../../utils/AlertMessage";

const AuthState = ({ children }) => {
  const [loginState, setLoginState] = useState({
    email: "",
    username: "",
    password: ""
  });

  const [authToken, setAuthToken] = useState(() => {
    const savedToken = localStorage.getItem("authToken");
    return savedToken && savedToken !== "undefined" && savedToken !== "null" ? savedToken : "";
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("login");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isLoading) return;

    if (!loginState.username.trim() || !loginState.password) {
      errorMessage("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: loginState.username.trim(),
          password: loginState.password
        })
      });

      const data = await response.json();

      if (response.ok && (data.success || data.status === "success")) {
        const token = data.token || data.data?.token;
        if (token) {
          localStorage.setItem("authToken", token);
          setAuthToken(token);
          setLoginState({
            email: "",
            username: "",
            password: ""
          });
          successMessage(data.message || "Logged in successfully!");
          navigate("/home");
        } else {
          errorMessage("Login succeeded but no authentication token was received");
        }
      } else {
        errorMessage(data.message || "Invalid credentials");
      }
    } catch (error) {
      errorMessage(error.message || "Network error. Please check your backend connection");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isLoading) return;

    if (!loginState.username.trim() || !loginState.email.trim() || !loginState.password) {
      errorMessage("Please fill in all fields (username, email, password)");
      return;
    }

    if (loginState.password.length < 6) {
      errorMessage("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/login/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: loginState.username.trim(),
          email: loginState.email.trim(),
          password: loginState.password
        })
      });

      const data = await response.json();

      if (response.ok && (data.success || data.status === "success")) {
        successMessage(data.message || "Account registered successfully! Please log in.");
        setLoginState({
          email: "",
          username: "",
          password: ""
        });
        setLoginType("login");
      } else {
        errorMessage(data.message || "Registration failed");
      }
    } catch (error) {
      errorMessage(error.message || "Network error. Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    setAuthToken("");
    navigate("/");
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        loginState,
        setLoginState,
        handleLogin,
        handleSignIn,
        loginType,
        setLoginType,
        handleLogout,
        authToken,
        setAuthToken,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
