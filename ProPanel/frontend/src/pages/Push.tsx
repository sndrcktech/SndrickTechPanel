import React, { useState } from "react";
import { getVapidPublicKey, subscribePush, sendPush } from "../api/push";

const PushPage: React.FC = () => {
  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");

  async function enablePush() {
    setStatus("Включение...");
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const reg = await navigator.serviceWorker.register("/service-worker.js");
      const pubKey = await getVapidPublicKey();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(pubKey),
      });
      await subscribePush(sub.toJSON());
      setStatus("Push включён");
    } else {
      setStatus("Push не поддерживается");
    }
  }

  async function handleSend() {
    await sendPush(msg);
    setStatus("Push отправлен");
  }

  function urlB64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Push-уведомления (PWA)</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={enablePush}>
        Включить push-уведомления
      </button>
      <div className="mb-6">
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          className="border px-2 py-1 rounded w-96"
          placeholder="Текст уведомления"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded ml-2" onClick={handleSend}>
          Отправить
        </button>
      </div>
      {status && <div className="text-green-700">{status}</div>}
      <div className="mt-8 text-gray-500">
        Приложение поддерживает PWA, работает offline, можно "установить" на телефон.
      </div>
    </div>
  );
};

export default PushPage;
