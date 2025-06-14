// frontend/app/wizard/add-server/page.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addServerViaSSH } from "@/lib/serversApi";

export default function AddServerPage() {
  const [ip, setIp] = useState(""); const [port, setPort] = useState("22");
  const [login, setLogin] = useState("root"); const [password, setPassword] = useState("");
  const [region, setRegion] = useState("EU"); const [status, setStatus] = useState("");

  async function handleAdd() {
    setStatus("Устанавливаем агент...");
    const res = await addServerViaSSH({ ip, port, login, password, region });
    setStatus(res.status === "ok" ? "Добавлено! Теперь назначьте роль." : "Ошибка: " + res.error);
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl mb-6">Добавить новый сервер по SSH</h1>
      <input className="border p-2 rounded w-full mb-2" placeholder="IP/DNS" value={ip} onChange={e => setIp(e.target.value)} />
      <input className="border p-2 rounded w-full mb-2" placeholder="Порт" value={port} onChange={e => setPort(e.target.value)} />
      <input className="border p-2 rounded w-full mb-2" placeholder="Логин" value={login} onChange={e => setLogin(e.target.value)} />
      <input type="password" className="border p-2 rounded w-full mb-2" placeholder="Пароль/ключ" value={password} onChange={e => setPassword(e.target.value)} />
      <select className="border p-2 rounded w-full mb-2" value={region} onChange={e => setRegion(e.target.value)}>
        <option value="EU">Европа</option>
        <option value="RU">Россия</option>
        <option value="AS">Азия</option>
        <option value="US">США</option>
        <option value="ANY">Не важно</option>
      </select>
      <Button onClick={handleAdd} disabled={!ip || !login || !password}>Добавить сервер</Button>
      {status && <div className="mt-4">{status}</div>}
    </div>
  );
}
