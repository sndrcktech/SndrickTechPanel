import React, { useState } from "react";
import { login, setToken } from "../api/auth";

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await login(email, password);
      setToken(data.access_token);
      onLogin();
    } catch (err) {
      setError("Неверный email или пароль");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4 text-center font-bold">Вход в SandrickTechPanel</h2>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;
