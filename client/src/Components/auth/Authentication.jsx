import React, { useEffect, useState } from "react";
import { loginUser, registerUser } from './../../services/auth';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Authentication = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const navigate = useNavigate();


  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === "register") {
        const data = await registerUser(email, password);
        if(data.error) {
          toast.error(data.error)
        }else{
          toast.success("Registered successfully go to login")
          setEmail("")
          setPassword("")
        }
      } else {
        const sucess = await loginUser(email, password);
        if(sucess.error){
          toast.error(sucess.error)
        }else{
          toast.success("Logged in successfully")
          setToken(sucess.token);
          navigate('/')
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <>
      <h2 className="text-2xl flex items-center justify-center mt-32 font-bold mb-6">Welcome to Todo App!</h2>
      <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
        <form >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={handleEmail}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={handlePassword}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
          type="submit"
            disabled={email === "" || password === ""}
            onClick={handleAuth}
            className="bg-blue-500 hover:bg-blue-700 text-red font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {authMode === "register" ? "Register" : "Login"}
          </button>
          <a
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
            className="text-blue-500 cursor-pointer hover:text-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Switch to {authMode === "login" ? "Register" : "Login"}
          </a>
        </div>
        </form>
      </div>
    </>
  );
};

export default Authentication;
