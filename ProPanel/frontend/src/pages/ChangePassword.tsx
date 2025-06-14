import React, { useState } from "react";
import { changePassword } from "../api/profile";

const ChangePassword: React.FC = () => {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [status, setStatus] = useState("");

  async function handleChange(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    try {
      await changePassword(oldPwd, newPwd);
      setStatus("Пароль изменён!");
      setOldPwd("");
      setNewPwd("");
    } catch {
      setStatus("Ошибка");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Смена пароля</h2>
      <form onSubmit={handleChange}>
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Старый пароль"
          type="password"
          value={oldPwd}
          onChange={e => setOldPwd(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Новый пароль"
          type="password"
          value={newPwd}
          onChange={e => setNewPwd(e.target.value)}
          required
        />
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          type="submit"
        >
          Сменить
        </button>
        {status && <div className="mt-3 text-green-700">{status}</div>}
      </form>
    </div>
  );
};

export default ChangePassword;
