"use client";

import { signup } from "@/service/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LucideEye, LucideEyeClosed } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    pwd: "",
    pwdConfirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    pwd: false,
    pwdConfirm: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valida formato de e-mail
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.username ||
      !formData.pwd ||
      !formData.pwdConfirm
    ) {
      setError("Todos os campos são obrigatórios.");
      return false;
    }

    if (formData.pwd !== formData.pwdConfirm) {
      setError("As senhas não coincidem.");
      return false;
    }

    if (formData.pwd.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    if (!validateEmail(formData.email)) {
      setError("Por favor, insira um e-mail válido.");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        username: formData.username,
        pwd: formData.pwd,
      });

      setSuccess("Registro realizado com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Erro ao registrar usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center">
      <div className="w-full max-w-md flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Registrar Usuário</h2>
        <form className="w-full" onSubmit={handleRegister}>
          {["name", "email", "username"].map((field, index) => (
            <input
              key={index}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
          ))}

          {["pwd", "pwdConfirm"].map((field, index) => (
            <div key={index} className="mb-4 relative">
              <input
                type={showPassword[field] ? "text" : "password"}
                name={field}
                placeholder={
                  field === "pwdConfirm" ? "Confirme a Senha" : "Senha"
                }
                value={formData[field]}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={() => togglePasswordVisibility(field)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                {showPassword[field] ? (
                  <LucideEye width={20} />
                ) : (
                  <LucideEyeClosed width={20} />
                )}
              </span>
            </div>
          ))}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 bg-blue-500 text-white rounded-lg ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
        </form>
        <Link href="/login" className="mt-4 text-blue-500 link">
          Já possui uma conta? Acesse aqui.
        </Link>
      </div>
    </div>
  );
}
