import React, { useEffect, useState } from "react";
import { getAuditLog } from "../api/audit";

const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [user, setUser] = useState("");
  const [action, setAction] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");

  async function fetchLog() {
    setStatus("Загрузка...");
    const after = dateFrom ? Date.parse(dateFrom) / 1000 : undefined;
    const before = dateTo ? Date.parse(dateTo) / 1000 : undefined;
    setLogs(await getAuditLog({ user, action, after, before }));
    setStatus("");
  }

  useEffect(() => { fetchLog(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Журнал действий пользователей (Audit Log)</h1>
      <div className="flex gap-2 mb-4">
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="Пользователь" className="border px-2 py-1 rounded" />
        <input value={action} onChange={e => setAction(e.target.value)} placeholder="Действие" className="border px-2 py-1 rounded" />
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border px-2 py-1 rounded" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border px-2 py-1 rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={fetchLog}>Фильтровать</button>
      </div>
      {status && <div className="mb-2 text-gray-600">{status}</div>}
      <div className="overflow-auto max-h-[70vh] bg-gray-50 rounded p-2">
        <table className="w-full border text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Время</th>
              <th className="border px-2 py-1">Пользователь</th>
              <th className="border px-2 py-1">Действие</th>
              <th className="border px-2 py-1">Детали</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((e, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{new Date((e.ts ?? 0) * 1000).toLocaleString()}</td>
                <td className="border px-2 py-1">{e.user}</td>
                <td className="border px-2 py-1">{e.action}</td>
                <td className="border px-2 py-1 whitespace-pre-wrap">{JSON.stringify(e.details, null, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <div className="p-4 text-gray-400">Нет записей</div>}
      </div>
    </div>
  );
};

export default AuditPage;
