"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { TOKEN_KEY } from "@/middleware";

const BASE_URL = "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function signup(data) {
  const response = await axiosInstance.post("/users/register", data);
  return response.data;
}

export async function login(data) {
  console.log("Service Tentando realizar login");
  const response = await axiosInstance.post("/users/login", data);

  const { token } = response.data;
  if (token) {
    const cookiesData = await cookies();
    cookiesData.set(TOKEN_KEY, token);
  }

  return response.data;
}

export async function logout() {
  const cookiesData = await cookies();
  cookiesData.delete(TOKEN_KEY);
}
