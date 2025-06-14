import React, { useState } from "react";
import { sendTelegram } from "../api/notify";

const Notify: React.FC = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    try {
      await sendTelegram(message);
      setStatus("Уведомление отправлено!");
      setMessage("");
    } catch {
      setStatus("Ошибка отправки");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Telegram-уведомление</h2>
      <form onSubmit={handleSend}>
        <textarea
          className="w-full p-2 border rounded mb-3"
          rows={4}
          placeholder="Текст сообщения"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          type="submit"
        >
          Отправить
        </button>
        {status && <div className="mt-3 text-green-700">{status}</div>}
      </form>
    </div>
  );
};

export default Notify;
