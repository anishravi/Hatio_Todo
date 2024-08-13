import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "/api/auth";

export const registerUser = async (email, password) => {
  const response = await axios
    .post(`${API_URL}/register`, { email, password })
    .then((response) => response.data)
    .catch((error) => error.response.data);
  return response
};

export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password })
    .then((response) => {
      localStorage.setItem("token", response.data.token)
      return response.data
    })
    .catch((error) => error.response.data);
    return response;
};

export const logoutUser = async (setToken) => {
  localStorage.removeItem("token");
  setToken("");
  toast.success("User logged out");
};