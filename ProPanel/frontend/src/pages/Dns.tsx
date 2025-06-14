import React, { useEffect, useState } from "react";
import { getZones, getRecords, addRecord, deleteRecord } from "../api/dns";

const DnsPage: React.FC = () => {
  const [zones, setZones] = useState<any[]>([]);
  const [zoneId, setZoneId] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [form, setForm] = useState({ type: "A", name: "", content: "" });
  const [status, setStatus] = useState("");

  async function fetchZones() {
    const z = await getZones();
    setZones(z);
    if (z.length > 0) setZoneId(z[0].id);
  }

  async function fetchRecords(zid = zoneId) {
    if (!zid) return;
    setRecords(await getRecords(zid));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await addRecord(zoneId, form.type, form.name, form.content);
    setStatus("Добавлено");
    setForm({ type: "A", name: "", content: "" });
    fetchRecords();
  }

  async function handleDelete(record_id: string) {
    await deleteRecord(zoneId, record_id);
    setStatus("Удалено");
    fetchRecords();
  }

  useEffect(() => { fetchZones(); }, []);
  useEffect(() => { fetchRecords(); }, [zoneId]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">DNS (Cloudflare)</h1>
      <div className="mb-4">
        <label className="font-semibold mr-2">Зона:</label>
        <select value={zoneId} onChange={e => setZoneId(e.target.value)}>
          {zones.map(z => (
            <option key={z.id} value={z.id}>{z.name}</option>
          ))}
        </select>
      </div>
      <form onSubmit={handleAdd} className="mb-4 flex gap-2 items-end">
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          <option value="A">A</option>
          <option value="AAAA">AAAA</option>
          <option value="CNAME">CNAME</option>
          <option value="TXT">TXT</option>
          <option value="MX">MX</option>
        </select>
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Имя" className="border px-2 py-1 rounded" />
        <input value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Значение" className="border px-2 py-1 rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Добавить</button>
      </form>
      {status && <div className="mb-4 text-green-700">{status}</div>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Тип</th>
            <th className="border px-2 py-1">Имя</th>
            <th className="border px-2 py-1">Значение</th>
            <th className="border px-2 py-1">Действия</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r: any) => (
            <tr key={r.id}>
              <td className="border px-2 py-1">{r.type}</td>
              <td className="border px-2 py-1">{r.name}</td>
              <td className="border px-2 py-1">{r.content}</td>
              <td className="border px-2 py-1">
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                  onClick={() => handleDelete(r.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DnsPage;
