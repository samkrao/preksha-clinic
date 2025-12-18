import axios from "axios";

export const api = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" }
});

export function getToken() {
  return localStorage.getItem("preksha_token");
}
export function setAuth(auth) {
  if (auth?.token) localStorage.setItem("preksha_token", auth.token);
  if (auth?.name) localStorage.setItem("preksha_name", auth.name);
  if (auth?.email) localStorage.setItem("preksha_email", auth.email);
}
export function clearAuth() {
  localStorage.removeItem("preksha_token");
  localStorage.removeItem("preksha_name");
  localStorage.removeItem("preksha_email");
}
export function getAuthInfo() {
  return {
    token: getToken(),
    name: localStorage.getItem("preksha_name"),
    email: localStorage.getItem("preksha_email")
  };
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function register(payload) {
  const res = await api.post("/api/auth/register", payload);
  return res.data;
}
export async function login(payload) {
  const res = await api.post("/api/auth/login", payload);
  return res.data;
}
export async function me() {
  const res = await api.get("/api/me");
  return res.data;
}
export async function createAppointment(payload) {
  const res = await api.post("/api/appointments", payload);
  return res.data;
}
export async function myAppointments() {
  const res = await api.get("/api/appointments/mine");
  return res.data;
}
