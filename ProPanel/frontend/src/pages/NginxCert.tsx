import React, { useState } from "react";
import { nginxCertStatus, issueNginxCert } from "../api/nginx_cert";

const NginxCertPage: React.FC = () => {
  const [cn, setCn] = useState("");
  const [days, setDays] = useState(365);
  const [status, setStatus] = useState<any>(null);
  const [info, setInfo] = useState("");

  async function handleCheck() {
    setStatus(await nginxCertStatus(cn));
  }

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    await issueNginxCert(cn, days);
    setInfo("Выпущен и установлен сертификат для Nginx");
    handleCheck();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Сертификаты для Nginx</h1>
      <form onSubmit={handleIssue} className="flex gap-2 items-end mb-4">
        <input value={cn} onChange={e => setCn(e.target.value)} placeholder="Домен" className="border px-2 py-1 rounded" required />
        <input type="number" value={days} onChange={e => setDays(Number(e.target.value))} className="border px-2 py-1 rounded w-20" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Выпустить и установить
        </button>
      </form>
      <button className="bg-gray-600 text-white px-4 py-2 rounded mb-4" onClick={handleCheck}>
        Проверить статус
      </button>
      {status && (
        status.installed
          ? <div className="mb-4 text-green-700">Установлен, истекает: {status.expires}</div>
          : <div className="mb-4 text-red-600">Не установлен</div>
      )}
      {info && <div className="text-green-700">{info}</div>}
    </div>
  );
};

export default NginxCertPage;
