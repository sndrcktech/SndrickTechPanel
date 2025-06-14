import React, { useEffect, useState } from "react";
import { listAgents, unregisterAgent } from "../api/agents";

type Agent = {
  id: string;
  hostname: string;
  ip: string;
  registered_at: number;
  last_ping: number;
  token: string;
};

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [status, setStatus] = useState("");

  async function fetchAgents() {
    setAgents(await listAgents());
  }

  async function handleUnregister(id: string) {
    await unregisterAgent(id);
    setStatus("Агент удалён");
    fetchAgents();
  }

  useEffect(() => { fetchAgents(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Внешние агенты / Ноды</h1>
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Host</th>
            <th className="border px-4 py-2">IP</th>
            <th className="border px-4 py-2">Регистрация</th>
            <th className="border px-4 py-2">Last ping</th>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((a) => (
            <tr key={a.id}>
              <td className="border px-2 py-1">{a.hostname}</td>
              <td className="border px-2 py-1">{a.ip}</td>
              <td className="border px-2 py-1">{new Date(a.registered_at * 1000).toLocaleString()}</td>
              <td className="border px-2 py-1">{new Date(a.last_ping * 1000).toLocaleString()}</td>
              <td className="border px-2 py-1">{a.id.slice(0, 8)}</td>
              <td className="border px-2 py-1">
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                  onClick={() => handleUnregister(a.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {status && <div className="mt-2 text-green-700">{status}</div>}
    </div>
  );
};

export default AgentsPage;
