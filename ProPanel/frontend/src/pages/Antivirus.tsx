import React, { useEffect, useState } from "react";
import { getAvHistory, avScan, getAvReport } from "../api/antivirus";

const AntivirusPage: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [path, setPath] = useState("/");
  const [engine, setEngine] = useState("clamav");
  const [status, setStatus] = useState("");
  const [report, setReport] = useState("");

  async function fetchHistory() {
    setHistory(await getAvHistory());
  }

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Сканирование...");
    setReport("");
    const res = await avScan(path, engine);
    if (res.ok) {
      setStatus("Сканирование завершено");
      fetchHistory();
    } else {
      setStatus("Ошибка: " + res.error);
    }
  }

  async function handleShowReport(filename: string) {
    setReport(await getAvReport(filename));
  }

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Антивирус ClamAV / Maldet</h1>
      <form onSubmit={handleScan} className="mb-4 flex gap-2 items-end">
        <input
          value={path}
          onChange={e => setPath(e.target.value)}
          placeholder="Путь для сканирования"
          className="border px-2 py-1 rounded"
          required
        />
        <select value={engine} onChange={e => setEngine(e.target.value)}>
          <option value="clamav">ClamAV</option>
          <option value="maldet">Maldet</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Сканировать
        </button>
      </form>
      {status && <div className="mb-4 text-green-700">{status}</div>}

      <div className="font-semibold mb-2">История сканирований:</div>
      <ul>
        {history.map((f, i) => (
          <li key={i} className="mb-1">
            <button className="underline text-blue-700" onClick={() => handleShowReport(f)}>
              {f}
            </button>
          </li>
        ))}
      </ul>
      {report && (
        <div className="mt-4">
          <div className="font-semibold mb-2">Отчёт:</div>
          <pre className="bg-black text-green-300 p-4 rounded max-h-96 overflow-auto">{report}</pre>
        </div>
      )}
    </div>
  );
};

export default AntivirusPage;
