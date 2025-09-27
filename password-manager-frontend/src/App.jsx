import Login from "./pages/Login/Login";
import AuthState from "./context/auth/authState";
import CredState from "./context/credential/credState";
import PasswordManager from "./pages/PasswordManager/PasswordManager";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <BrowserRouter>
        <CredState>
          <AuthState>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
              />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<PasswordManager />} />
            </Routes>
          </AuthState>
        </CredState>
      </BrowserRouter>
    </>
  );
}

export default App;
