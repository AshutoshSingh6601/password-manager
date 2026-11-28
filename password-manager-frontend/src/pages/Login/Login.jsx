import { useContext, useEffect } from "react";
import "./Login.css";
import CustInput from "../../components/CustInput";
import CustButton from "../../components/CustButton";
import authContext from "../../context/auth/authContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const {
    loginState,
    setLoginState,
    handleLogin,
    loginType,
    setLoginType,
    handleSignIn,
    isLoading,
    authToken
  } = useContext(authContext);

  const navigate = useNavigate();

  // If already authenticated, redirect to /home
  useEffect(() => {
    const token = authToken || localStorage.getItem("authToken");
    if (token && token !== "undefined" && token !== "null") {
      navigate("/home", { replace: true });
    }
  }, [authToken, navigate]);

  const handleOnChange = (e) => {
    setLoginState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleAuthMode = (mode) => {
    setLoginType(mode);
    setLoginState({ email: "", username: "", password: "" });
  };

  return (
    <div className="flex items-center justify-center min-h-dvh bg-sky-50 px-4">
      <form
        className="w-[95%] mx-auto sm:w-[380px] p-6 sm:p-8 flex flex-col rounded-2xl inset-ring inset-ring-zinc-200 bg-zinc-50 shadow-lg gap-4"
        onSubmit={loginType === "signin" ? handleSignIn : handleLogin}
      >
        <div className="text-center mb-2">
          <h2 className="text-[#2575fc] text-[2rem] font-bold">
            {loginType === "signin" ? "Sign Up" : "Login"}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {loginType === "signin"
              ? "Create your secure master vault"
              : "Enter your credentials to access your vault"}
          </p>
        </div>

        {loginType === "signin" && (
          <CustInput
            type="email"
            placeholder="Email address"
            className="flex flex-col gap-1"
            label="Email"
            name="email"
            required
            disabled={isLoading}
            value={loginState.email}
            onChange={handleOnChange}
            autoComplete="email"
          />
        )}

        <CustInput
          type="text"
          placeholder="Username"
          className="flex flex-col gap-1"
          label="Username"
          name="username"
          required
          disabled={isLoading}
          value={loginState.username}
          onChange={handleOnChange}
          autoComplete="username"
        />

        <CustInput
          type="password"
          placeholder="Master Password"
          className="flex flex-col gap-1"
          label="Password"
          name="password"
          required
          disabled={isLoading}
          value={loginState.password}
          onChange={handleOnChange}
          autoComplete={loginType === "signin" ? "new-password" : "current-password"}
        />

        <CustButton
          type="submit"
          label={loginType === "signin" ? "Create Account" : "Login"}
          className="w-full mt-2 py-3"
          loading={isLoading}
          disabled={isLoading}
        />

        <div className="text-center text-sm text-gray-600 mt-2">
          {loginType === "signin" ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
                onClick={() => toggleAuthMode("login")}
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
                onClick={() => toggleAuthMode("signin")}
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;
