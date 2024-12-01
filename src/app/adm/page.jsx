"use client";

import { logout } from "@/service/api";
import { LogOut } from "lucide-react";
import "./style.css";

const Sidebar = () => {
  async function handleLogout() {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  return (
    <div className="container">
      <div className="titulo">
        <h1>Seja Bem-vindo, Administrador!</h1>
      </div>

      <div className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li>
            <a href="/cadastro">Cadastro de Professores</a>
          </li>
          <li>
            <a href="/cadastro">Cadastro de Alunos</a>
          </li>
          <li>
            <a href="/cadastro">Cadastro de Eventos</a>
          </li>
          <li>
            <a href="/cadastro">Cadastro de Agendamentos</a>
          </li>
          <li>
            <a href="/cadastro">Cadastro de Profissionais</a>
          </li>
          <li>
            <a href="/cadastro">Cadastro de Usuários</a>
          </li>
        </ul>
        <div className="login-icon">
          <LogOut size={30} color="#efefef" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
