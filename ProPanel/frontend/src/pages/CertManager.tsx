import React, { useEffect, useState } from "react";
import { certsList, renewAll, importCerts, exportCerts } from "../api/cert_manager";

const CertManagerPage: React.FC = () => {
  const [table, setTable] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [renewing, setRenewing] = useState(false);

  async function fetchTable() {
    setTable(await certsList());
  }

  async function handleRenew() {
    setRenewing(true);
    setStatus("Обновление сертификатов...");
    await renewAll();
    setStatus("Все сертификаты обновлены (проверьте статусы)");
    setRenewing(false);
    fetchTable();
  }

  async function handleExport() {
    const data = await exportCerts();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "domains.json";
    a.click();
  }

  useEffect(() => { fetchTable(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Массовое управление сертификатами</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" disabled={renewing} onClick={handleRenew}>
        Массовое обновление
      </button>
      <button className="bg-gray-600 text-white px-4 py-2 rounded mb-4 ml-2" onClick={handleExport}>
        Экспорт списка доменов
      </button>
      {status && <div className="mb-4 text-green-700">{status}</div>}
      <div className="overflow-auto max-h-[70vh] bg-gray-50 rounded p-2">
        <table className="w-full border text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Домен</th>
              <th className="border px-2 py-1">Тип</th>
              <th className="border px-2 py-1">Путь</th>
              <th className="border px-2 py-1">Статус</th>
              <th className="border px-2 py-1">Истекает</th>
              <th className="border px-2 py-1">Дней осталось</th>
              <th className="border px-2 py-1">Ошибка</th>
            </tr>
          </thead>
          <tbody>
            {table.map((c, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{c.domain}</td>
                <td className="border px-2 py-1">{c.type}</td>
                <td className="border px-2 py-1 font-mono">{c.path}</td>
                <td className="border px-2 py-1">{c.exists ? "OK" : "❌"}</td>
                <td className="border px-2 py-1">{c.expires || ""}</td>
                <td className="border px-2 py-1">{c.days_left ?? ""}</td>
                <td className="border px-2 py-1 text-red-600">{c.error || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {table.length === 0 && <div className="p-4 text-gray-400">Нет доменов</div>}
      </div>
    </div>
  );
};

export default CertManagerPage;
