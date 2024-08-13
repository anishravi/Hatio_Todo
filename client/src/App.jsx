import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Authentication from "./Components/auth/Authentication";
import ProtectedRoute from "./Components/route/ProtectedRoute";
import { useEffect, useState } from "react";
import Home from "./Components/home/Home";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  return (
    <>
      <BrowserRouter>
      <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute token={token}>
                <Home token={token} setToken={setToken} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth"
            element={
              <Authentication
                setToken={setToken}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
