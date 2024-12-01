"use client";

import { login } from "@/service/api";
import { LucideEye, LucideEyeClosed } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", pwd: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valida formato de e-mail
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!credentials.email || !credentials.pwd) {
      console.log("Campos vazios");
      setError("Preencha todos os campos.");
      return;
    }

    if (!validateEmail(credentials.email)) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    setIsLoading(true);

    try {
      await login(credentials);
      window.location.href = "/adm";
    } catch (err) {
      console.error("Erro ao realizar login", err);
      setError(err?.response?.data?.error || "Erro ao realizar login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center">
      <div className="w-full max-w-md flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="email"
              placeholder="Insira seu email"
              value={credentials.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="pwd"
              placeholder="Insira sua senha"
              value={credentials.pwd}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >
              {showPassword ? (
                <LucideEye width={20} />
              ) : (
                <LucideEyeClosed width={20} />
              )}
            </span>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-2 rounded-lg font-semibold ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            {isLoading ? "Entrando..." : "Acessar"}
          </button>
        </form>

        <div className="mb-4 mt-4">
          <Link href="/register" className="text-blue-500 hover:underline">
            Cadastrar-se
          </Link>
        </div>
      </div>
    </div>
  );
}
