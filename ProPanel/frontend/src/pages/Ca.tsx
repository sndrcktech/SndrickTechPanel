import React, { useEffect, useState } from "react";
import { getCaCert, listCerts, getCert, issueCert, initCa, revokeCert } from "../api/ca";

const CaPage: React.FC = () => {
  const [ca, setCa] = useState("");
  const [certs, setCerts] = useState<string[]>([]);
  const [cn, setCn] = useState("");
  const [days, setDays] = useState(365);
  const [selected, setSelected] = useState("");
  const [details, setDetails] = useState<any>(null);
  const [status, setStatus] = useState("");

  async function fetchAll() {
    try {
      setCa(await getCaCert());
    } catch { setCa(""); }
    setCerts(await listCerts());
  }

  async function handleInit() {
    await initCa("SandrickTechPanel Root CA");
    setStatus("CA инициализирован");
    fetchAll();
  }

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    await issueCert(cn, days);
    setStatus("Выпущен сертификат");
    setCn("");
    fetchAll();
  }

  async function handleShow(cn: string) {
    setSelected(cn);
    setDetails(await getCert(cn));
  }

  async function handleRevoke(cn: string) {
    await revokeCert(cn);
    setStatus("Сертификат отозван");
    setDetails(null);
    fetchAll();
  }

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Центр сертификации (CA)</h1>
      {!ca ? (
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleInit}>
            Инициализировать CA
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <div className="font-mono bg-gray-100 rounded p-2 mb-2 max-w-2xl overflow-auto">{ca.slice(0, 120)}...</div>
          <form onSubmit={handleIssue} className="flex gap-2 mb-4 items-end">
            <input value={cn} onChange={e => setCn(e.target.value)} placeholder="CN (FQDN)" className="border px-2 py-1 rounded" required />
            <input value={days} onChange={e => setDays(Number(e.target.value))} type="number" min={1} max={3650} className="border px-2 py-1 rounded w-20" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Выпустить</button>
          </form>
          <div className="mb-2 font-semibold">Сертификаты:</div>
          <ul>
            {certs.map(cn => (
              <li key={cn} className="mb-1 flex gap-2 items-center">
                <span className="font-mono">{cn}</span>
                <button className="bg-green-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleShow(cn)}>
                  Скачать/Показать
                </button>
                <button className="bg-red-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleRevoke(cn)}>
                  Отозвать
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {details && (
        <div className="bg-gray-100 rounded p-4 mt-6 max-w-2xl overflow-auto">
          <h2 className="text-lg font-bold mb-2">{selected}</h2>
          <div>
            <b>CRT:</b>
            <pre className="bg-black text-green-300 p-2 rounded overflow-auto">{details.crt}</pre>
            <b>KEY:</b>
            <pre className="bg-black text-green-300 p-2 rounded overflow-auto">{details.key}</pre>
            <b>CSR:</b>
            <pre className="bg-black text-green-300 p-2 rounded overflow-auto">{details.csr}</pre>
          </div>
        </div>
      )}
      {status && <div className="mt-4 text-green-700">{status}</div>}
    </div>
  );
};

export default CaPage;
