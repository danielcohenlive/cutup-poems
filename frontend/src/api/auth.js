import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000"; // FastAPI running here

export async function register({ email, password }) {
  const response = await axios.post(`${BASE_URL}/auth/register`, {
    email,
    password,
  });
  return response.data;
}

export async function login({ email, password }) {
  const response = await axios.post(
    `${BASE_URL}/auth/jwt/login`,
    {
      username: email,
      password,
    },
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return response.data.access_token;
}

export async function getMe(token) {
  const response = await axios.get(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
