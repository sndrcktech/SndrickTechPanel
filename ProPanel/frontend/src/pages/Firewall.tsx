import React, { useEffect, useState } from "react";
import { getFirewallRules, addFirewallRule, deleteFirewallRule } from "../api/firewall";

type Rule = {
  chain: string;
  target: string;
  proto: string;
  opt: string;
  source: string;
  destination: string;
};

const Firewall: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ chain: "INPUT", proto: "tcp", dport: "80", target: "ACCEPT" });
  const [status, setStatus] = useState("");

  async function fetchRules() {
    setLoading(true);
    setRules(await getFirewallRules());
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    const res = await addFirewallRule(form.chain, form.proto, form.dport, form.target);
    setStatus(res.added ? "Правило добавлено!" : "Ошибка: " + (res.error || "unknown"));
    fetchRules();
  }

  useEffect(() => {
    fetchRules();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Фаервол (iptables)</h1>
      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-4 items-end">
        <select value={form.chain} onChange={e => setForm(f => ({ ...f, chain: e.target.value }))}>
          <option>INPUT</option>
          <option>OUTPUT</option>
          <option>FORWARD</option>
        </select>
        <select value={form.proto} onChange={e => setForm(f => ({ ...f, proto: e.target.value }))}>
          <option>tcp</option>
          <option>udp</option>
        </select>
        <input
          value={form.dport}
          onChange={e => setForm(f => ({ ...f, dport: e.target.value }))}
          placeholder="Порт"
          className="border px-2 py-1 rounded"
        />
        <select value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}>
          <option>ACCEPT</option>
          <option>DROP</option>
          <option>REJECT</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Добавить
        </button>
        {status && <span className="ml-4">{status}</span>}
      </form>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Chain</th>
            <th className="border px-2 py-1">Target</th>
            <th className="border px-2 py-1">Proto</th>
            <th className="border px-2 py-1">Source</th>
            <th className="border px-2 py-1">Destination</th>
            {/* Здесь удобно сделать кнопки удаления по номеру, если нужно */}
          </tr>
        </thead>
        <tbody>
          {rules.map((r, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{r.chain}</td>
              <td className="border px-2 py-1">{r.target}</td>
              <td className="border px-2 py-1">{r.proto}</td>
              <td className="border px-2 py-1">{r.source}</td>
              <td className="border px-2 py-1">{r.destination}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Firewall;
