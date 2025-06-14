import React, { useState } from "react";
import { letsencryptCertStatus, issueLetsencryptCert } from "../api/letsencrypt";

const LetsencryptPage: React.FC = () => {
  const [domain, setDomain] = useState("");
  const [wildcard, setWildcard] = useState(false);
  const [dnsProvider, setDnsProvider] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [info, setInfo] = useState("");

  async function handleCheck() {
    setStatus(await letsencryptCertStatus(domain));
  }

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    await issueLetsencryptCert(domain, wildcard, dnsProvider);
    setInfo("Выпущен и установлен сертификат Let's Encrypt");
    handleCheck();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Let's Encrypt сертификаты</h1>
      <form onSubmit={handleIssue} className="flex gap-2 items-end mb-4">
        <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="Домен" className="border px-2 py-1 rounded" required />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={wildcard} onChange={e => setWildcard(e.target.checked)} />
          Wildcard
        </label>
        {wildcard && (
          <input value={dnsProvider} onChange={e => setDnsProvider(e.target.value)} placeholder="DNS-провайдер (например, cloudflare)" className="border px-2 py-1 rounded" />
        )}
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Выпустить/установить
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

export default LetsencryptPage;
