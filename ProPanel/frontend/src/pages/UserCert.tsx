import React, { useEffect, useState } from "react";
import { listUserCerts, getUserCert, issueUserCert, revokeUserCert } from "../api/user_cert";

const UserCertPage: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [days, setDays] = useState(365);
  const [selected, setSelected] = useState("");
  const [details, setDetails] = useState<any>(null);
  const [status, setStatus] = useState("");

  async function fetchUsers() {
    setUsers(await listUserCerts());
  }

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    await issueUserCert(username, email, days);
    setStatus("Выдан сертификат");
    setUsername("");
    setEmail("");
    fetchUsers();
  }

  async function handleShow(username: string) {
    setSelected(username);
    setDetails(await getUserCert(username));
  }

  async function handleRevoke(username: string) {
    await revokeUserCert(username);
    setStatus("Сертификат отозван");
    fetchUsers();
  }

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Сертификаты пользователей (User SSL/S-MIME)</h1>
      <form onSubmit={handleIssue} className="flex gap-2 mb-4 items-end">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Имя пользователя" className="border px-2 py-1 rounded" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (опционально)" className="border px-2 py-1 rounded" />
        <input value={days} type="number" onChange={e => setDays(Number(e.target.value))} className="border px-2 py-1 rounded w-20" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Выдать
        </button>
      </form>
      {status && <div className="mb-4 text-green-700">{status}</div>}
      <div className="font-semibold mb-2">Пользователи с сертификатами:</div>
      <ul>
        {users.map((u, i) => (
          <li key={i} className="mb-1 flex gap-2 items-center">
            <span className="font-mono">{u}</span>
            <button className="bg-green-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleShow(u)}>
              Скачать
            </button>
            <button className="bg-red-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleRevoke(u)}>
              Отозвать
            </button>
          </li>
        ))}
      </ul>
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
    </div>
  );
};

export default UserCertPage;
