import React, { useEffect, useState } from "react";
import { getMailCertStatus, issueMailCert } from "../api/mail_cert";

const MailCertPage: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [cn, setCn] = useState("mail.example.com");
  const [days, setDays] = useState(365);
  const [info, setInfo] = useState("");

  async function fetchStatus() {
    setStatus(await getMailCertStatus());
  }

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    await issueMailCert(cn, days);
    setInfo("Выпущен и установлен новый сертификат");
    fetchStatus();
  }

  useEffect(() => { fetchStatus(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Сертификат для почты (Postfix + Dovecot)</h1>
      {status ? (
        status.installed ? (
          <div className="mb-4">
            <div className="mb-2 text-green-700">Сертификат установлен</div>
            <div className="mb-2">Срок действия: <b>{status.expires}</b></div>
          </div>
        ) : <div className="mb-4 text-red-600">Сертификат не установлен</div>
      ) : null}
      <form onSubmit={handleIssue} className="flex gap-2 items-end mb-4">
        <input value={cn} onChange={e => setCn(e.target.value)} className="border px-2 py-1 rounded" required />
        <input type="number" value={days} onChange={e => setDays(Number(e.target.value))} className="border px-2 py-1 rounded w-20" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Выпустить и установить
        </button>
      </form>
      {info && <div className="text-green-700">{info}</div>}
    </div>
  );
};

export default MailCertPage;
