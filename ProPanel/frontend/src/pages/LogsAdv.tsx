import React, { useEffect, useState } from "react";
import { getLogList, tailLog } from "../api/logs_advanced";

const LogsAdv: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [selected, setSelected] = useState("panel");
  const [lines, setLines] = useState(200);
  const [filter, setFilter] = useState("");
  const [logData, setLogData] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  async function fetchList() {
    setLogs(await getLogList());
  }

  async function fetchLog() {
    setStatus("Загрузка...");
    try {
      const d = await tailLog(selected, lines, filter);
      setLogData(d.lines || []);
      setStatus("");
    } catch {
      setStatus("Ошибка загрузки");
    }
  }

  useEffect(() => { fetchList(); }, []);
  useEffect(() => { fetchLog(); }, [selected, lines, filter]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Просмотр логов</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        {logs.map(log => (
          <button
            key={log}
            className={`px-4 py-2 rounded ${selected === log ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setSelected(log)}
          >
            {log}
          </button>
        ))}
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="number"
          value={lines}
          min={10}
          max={2000}
          onChange={e => setLines(Number(e.target.value))}
          className="border px-2 py-1 rounded w-24"
          placeholder="Строк"
        />
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border px-2 py-1 rounded w-52"
          placeholder="Фильтр по слову"
        />
        <button className="bg-blue-500 text-white rounded px-3 py-1" onClick={fetchLog}>
          Обновить
        </button>
      </div>
      <div className="bg-black text-green-300 font-mono rounded p-4 overflow-auto h-[60vh]">
        {status || (
          <pre className="whitespace-pre-wrap text-xs">
            {logData.length === 0 ? "Нет данных" : logData.join("")}
          </pre>
        )}
      </div>
    </div>
  );
};

export default LogsAdv;
