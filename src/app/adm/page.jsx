"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import "./style.css";

const Sidebar = () => {
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
          <Link href="/login">
            <LogIn size={30} color="#efefef" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

