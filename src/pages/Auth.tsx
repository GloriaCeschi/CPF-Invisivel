import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export type User = {
  email?: string;
  pass?: string;
};

export default function Auth() {
  const nav = useNavigate();
  const [tentativa, setTentativa] = useState(0);
  const [login, setLogin] = useState(true);

  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);

  function checkedLogin() {
    if (tentativa < 3) {
      setTentativa(tentativa + 1);
    } else {
      showToast("Volte mais tarde");
      return;
    }

    let loged = users.find(
      (u) => u.email == user?.email && u.pass === user?.pass
    );
    if (loged) {
      showToast("login realizado");
      nav("/dash");
    } else {
      showToast("Email e senha inválidos");
    }
  }

  function handleRegister() {
    if (user?.email && user?.pass) {
      setUsers([...users, user]);
      showToast("Cadastrado com Sucesso!");
    } else {
      showToast("Email e Senha Obrigatorios!");
    }
  }

  const [pToast, sertPtoast] = useState("");

  function showToast(msg: string) {
    sertPtoast(msg);

    setTimeout(() => {
      sertPtoast("");
    }, 5000);
  }

  return (
    <div className="login-container">
      {pToast.length > 0 && (
        <div className="alert">
          <p id="toast">{pToast}</p>
        </div>
      )}

      <h1>Página de login</h1>
      <Link to="/" className="link">
        Voltar
      </Link>

      <input
        type="email"
        placeholder="Digite seu e-mail"
        className="input-field"
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Digite sua senha"
        className="input-field"
        onChange={(e) => setUser({ ...user, pass: e.target.value })}
      />

      {login ? (
        <button className="btn-primary" onClick={() => checkedLogin()}>
          Login
        </button>
      ) : (
        <button className="btn-primary" onClick={() => handleRegister()}>
          Cadastre-se
        </button>
      )}

      <a className="link" onClick={() => setLogin(!login)}>
        {login
          ? "Clique aqui para fazer o seu Cadastro"
          : "Clique aqui para fazer o login"}
      </a>
    </div>
  );
}