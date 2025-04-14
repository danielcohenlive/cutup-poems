// src/api/poems.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000"; // FastAPI running here

export async function fetchPoems() {
  const response = await axios.get(`${BASE_URL}/poems/`);
  return response.data;
}

export async function fetchPoem(id) {
  const response = await axios.get(`${BASE_URL}/poems/${id}`);
  return response.data;
}

export async function createPoem(poem) {
  const response = await axios.post(`${BASE_URL}/poems/`, poem);
  return response.data;
}

export async function updatePoem(id, poem) {
  const response = await axios.put(`${BASE_URL}/poems/${id}`, poem);
  return response.data;
}
