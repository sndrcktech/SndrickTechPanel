import React, { useEffect, useState } from "react";
import { listVpnClients, createVpnClient, downloadOvpn, revokeVpnClient } from "../api/vpn";

const VpnPage: React.FC = () => {
  const [clients, setClients] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ovpn, setOvpn] = useState("");
  const [status, setStatus] = useState("");

  async function fetchClients() {
    setClients(await listVpnClients());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createVpnClient(name, email);
    setStatus("Клиент создан");
    setName("");
    setEmail("");
    fetchClients();
  }

  async function handleDownload(name: string) {
    setOvpn(await downloadOvpn(name));
    setStatus("");
  }

  async function handleRevoke(name: string) {
    await revokeVpnClient(name);
    setStatus("Клиент отозван");
    fetchClients();
  }

  useEffect(() => { fetchClients(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">OpenVPN/WireGuard: клиенты</h1>
      <form onSubmit={handleCreate} className="mb-4 flex gap-2 items-end">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Имя клиента" className="border px-2 py-1 rounded" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (опционально)" className="border px-2 py-1 rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Создать</button>
      </form>
      {status && <div className="mb-4 text-green-700">{status}</div>}
      <div className="font-semibold mb-2">Клиенты:</div>
      <ul>
        {clients.map((c, i) => (
          <li key={i} className="flex items-center gap-2 mb-1">
            <span className="font-mono">{c}</span>
            <button className="bg-green-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleDownload(c)}>
              Скачать .ovpn
            </button>
            <button className="bg-red-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleRevoke(c)}>
              Отозвать
            </button>
          </li>
        ))}
      </ul>
      {ovpn && (
        <div className="mt-4">
          <div className="font-semibold mb-2">.ovpn конфиг:</div>
          <pre className="bg-black text-green-300 p-2 rounded max-h-96 overflow-auto">{ovpn}</pre>
        </div>
      )}
    </div>
  );
};

export default VpnPage;
