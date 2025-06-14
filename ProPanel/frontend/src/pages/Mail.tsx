import React, { useEffect, useState } from "react";
import { getMailDomains, addMailDomain, getMailUsers, addMailUser, issueMailSSL } from "../api/mail";

const Mail: React.FC = () => {
  const [domains, setDomains] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [domainInput, setDomainInput] = useState("");
  const [userInput, setUserInput] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");

  async function fetchData() {
    setDomains(await getMailDomains());
    setUsers(await getMailUsers());
  }

  async function handleAddDomain(e: React.FormEvent) {
    e.preventDefault();
    await addMailDomain(domainInput);
    setDomainInput("");
    setStatus("Домен добавлен");
    fetchData();
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    await addMailUser(userInput.email, userInput.password);
    setUserInput({ email: "", password: "" });
    setStatus("Почтовый ящик добавлен");
    fetchData();
  }

  async function handleIssueSSL() {
    if (!selectedDomain) return;
    setStatus("Выпуск SSL...");
    await issueMailSSL(selectedDomain);
    setStatus("SSL сертификат выпущен");
  }

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Почтовые домены и ящики</h1>

      <form onSubmit={handleAddDomain} className="mb-4 flex gap-2 items-end">
        <input
          value={domainInput}
          onChange={e => setDomainInput(e.target.value)}
          placeholder="mail.example.com"
          className="border px-2 py-1 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Добавить домен
        </button>
      </form>

      <div className="mb-8">
        <div className="font-semibold mb-1">Домены:</div>
        <ul className="mb-2">
          {domains.map((d, idx) => (
            <li key={idx} className="flex items-center gap-4">
              <span>{d}</span>
              <button
                className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                onClick={() => { setSelectedDomain(d); handleIssueSSL(); }}
              >
                SSL
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleAddUser} className="mb-4 flex gap-2 items-end">
        <input
          value={userInput.email}
          onChange={e => setUserInput(u => ({ ...u, email: e.target.value }))}
          placeholder="user@mail.example.com"
          className="border px-2 py-1 rounded"
        />
        <input
          value={userInput.password}
          type="password"
          onChange={e => setUserInput(u => ({ ...u, password: e.target.value }))}
          placeholder="Пароль"
          className="border px-2 py-1 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Добавить ящик
        </button>
      </form>

      <div className="mb-8">
        <div className="font-semibold mb-1">Ящики:</div>
        <ul>
          {users.map((u, idx) => (
            <li key={idx}>{u}</li>
          ))}
        </ul>
      </div>
      {status && <div className="mt-2 text-green-700">{status}</div>}
    </div>
  );
};

export default Mail;
