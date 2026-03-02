import React, { useState } from "react";

function CadastroUsuario() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    login: "",
    senha: "",
    endereco: "",
    data_nascimento: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dados = {
      ...formData,
      senha_hash: formData.senha, // ideal: hash no backend
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    };

    try {
      const response = await fetch("http://localhost:8080/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
      } else {
        alert("Erro ao salvar cadastro!");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor!");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Complete seu cadastro</h2>
      <form onSubmit={handleSubmit} className="forms">
        <label>Nome</label>
        <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />

        <label>CPF</label>
        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />

        <label>Telefone</label>
        <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Login</label>
        <input type="text" name="login" value={formData.login} onChange={handleChange} required />

        <label>Senha</label>
        <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />

        <label>Endereço</label>
        <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} required />

        <label>Data de Nascimento</label>
        <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required />

        <button type="submit" style={styles.button}>Salvar</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    max-width: "400px",
    margin: "50px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
  },
 
  button: {
    marginTop: "20px",
    padding: "10px",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default CadastroUsuario;


