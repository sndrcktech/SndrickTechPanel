import React, { useEffect, useState } from "react";
import { listWpSites, installWp, deleteWp } from "../api/wordpress";

const WordpressPage: React.FC = () => {
  const [sites, setSites] = useState<string[]>([]);
  const [domain, setDomain] = useState("");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<any>(null);

  async function fetchSites() {
    setSites(await listWpSites());
  }

  async function handleInstall(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Установка...");
    try {
      const res = await installWp(domain);
      setResult(res);
      setStatus("WordPress установлен!");
      setDomain("");
      fetchSites();
    } catch (e: any) {
      setStatus(e?.response?.data?.detail || "Ошибка установки");
    }
  }

  async function handleDelete(d: string) {
    await deleteWp(d);
    fetchSites();
    setStatus(`Удалён ${d}`);
  }

  useEffect(() => { fetchSites(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">WordPress сайты</h1>
      <form onSubmit={handleInstall} className="mb-4 flex gap-2 items-end">
        <input
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="Домен (example.com)"
          className="border px-2 py-1 rounded"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Установить
        </button>
      </form>
      {status && <div className="mb-4 text-green-700">{status}</div>}
      {result && (
        <div className="mb-4 border rounded bg-gray-100 p-4 font-mono">
          <div>URL: <a href={result.url} className="text-blue-600" target="_blank" rel="noopener noreferrer">{result.url}</a></div>
          <div>DB: {result.db_name}, User: {result.db_user}, Pass: <span className="text-red-700">{result.db_pass}</span></div>
          <div>Папка: {result.dir}</div>
        </div>
      )}
      <div className="font-semibold mb-2">Сайты:</div>
      <ul>
        {sites.map((s, idx) => (
          <li key={idx} className="flex items-center gap-3 mb-1">
            <span className="font-mono">{s}</span>
            <button
              className="bg-red-600 text-white px-2 py-1 rounded text-xs"
              onClick={() => handleDelete(s)}
            >
              Удалить
            </button>
            <a
              href={`http://${s}/`}
              className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Открыть
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordpressPage;
