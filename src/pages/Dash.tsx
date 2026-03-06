// src/pages/Dash.tsx
import { Link, Routes, Route } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";
import Gamificacao from "./Gamificacao";
import Score from "./Score";
import Perfil from "./Perfil";
import EducacaoFinanceira from "./EducacaoFinanceira";
import Cursos from "./Cursos";

export default function Dash() {
  const [userName, setUserName] = useState("");
   useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  return (
     <div className="p-6 font-sans bg-pink-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-pink-700">
          Olá, {userName || "Usuário"}!
        </h2>
        <button
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
          onClick={() => {
            localStorage.removeItem("userName");
            window.location.href = "/"; // volta para landing/login
          }}
        >
          Sair
        </button>
      </header>

      {/* Score Alternativo */}
      <section className="bg-white text-black shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-pink-700 mb-2">Score Alternativo</h3>
        <p>Seu score atual: <span className="font-semibold text-pink-600">420 / 1000</span></p>
        <p>Status: <span className="text-yellow-600">Em Construção</span></p>
        <p>Cadastro 70% completo</p>
      </section>

      {/* Análise de Renda Informal */}
      <section className="bg-white text-black shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-pink-700 mb-2">Análise de Renda Informal</h3>
        <p>Crédito disponível: <span className="font-semibold text-pink-600">R$ 0</span></p>
        <br></br>
        <Link to="/profile" className="mt-3 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700">
          Continuar Cadastro
        </Link>
      </section>

      {/* Alertas Importantes */}
      <section className="bg-white text-black shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-pink-700 mb-2">Alertas Importantes</h3>
        <ul className="list-disc list-inside text-sm mb-3">
          <li>
            <span className="font-semibold">Pendência na validação</span> – Urgente: 11/04 às 2:45 
            <button className="ml-2 text-pink-600 hover:underline">Ver detalhes</button>
          </li>
          <li>
            <span className="font-semibold">Seu score aumentou!</span> – Ontem: 11/04 às 14:39
          </li>
        </ul>
        <button className="bg-pink-100 text-pink-700 px-3 py-1 rounded-md hover:bg-pink-200">
          Ver Histórico
        </button>
      </section>

      {/* Crédito e Educação Financeira */}
      <section className="bg-white text-black shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-pink-700 mb-2">Crédito e Educação Financeira</h3>
        <p>Crédito disponível: <span className="font-semibold text-pink-600">R$ 0</span></p>
        <button className="mt-2 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700">
          Como Funciona
        </button>
        <h4 className="mt-4 font-semibold text-pink-700">Cursos Financeiros</h4>
        <br></br>
        <Link to="/dash/cursos" className="mt-2 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600">
          Ver Comunidade
        </Link>
      </section>

      {/* Gamificação */}
      <section className="bg-white text-black shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-pink-700 mb-2">Gamificação</h3>
        <p>Você está no <span className="font-semibold text-pink-600">Nível 2</span></p>
        <p>Missão do Dia: Registrar uma conta!</p>
        <br></br>
        <Link to="/dash/gamificacao" className="mt-2 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700">
          Ver Gamificação
        </Link>
      </section>

      {/* Cadastro e Validação */}
      <section className="bg-white text-black shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-pink-700 mb-2">Cadastro e Validação</h3>
        <div className="flex gap-3 mt-2">
          <button className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700">
            Cadastro Voluntário
          </button>
          <button className="bg-pink-400 text-white px-4 py-2 rounded-md hover:bg-pink-500">
            Adicionar Contas e Boletos
          </button>
        </div>
      </section>

      <Routes>
        <Route path="score" element={<Score />} />
        <Route path="gamificacao" element={<Gamificacao />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="educacao" element={<EducacaoFinanceira />} />
        <Route path="cursos" element={<Cursos />} />
      </Routes>

    </div>
  );
}