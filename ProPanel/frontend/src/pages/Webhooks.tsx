import React, { useEffect, useState } from "react";
import { getWebhooks, addWebhook, deleteWebhook, sendWebhook } from "../api/webhooks";

const WebhooksPage: React.FC = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [form, setForm] = useState({ url: "", method: "POST", headers: "" });
  const [payload, setPayload] = useState("{}");
  const [status, setStatus] = useState("");
  const [resp, setResp] = useState("");

  async function fetchWebhooks() {
    setWebhooks(await getWebhooks());
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await addWebhook({
      url: form.url,
      method: form.method,
      headers: form.headers ? JSON.parse(form.headers) : {},
    });
    setForm({ url: "", method: "POST", headers: "" });
    setStatus("Добавлен");
    fetchWebhooks();
  }

  async function handleDelete(idx: number) {
    await deleteWebhook(idx);
    setStatus("Удалён");
    fetchWebhooks();
  }

  async function handleSend(idx: number) {
    try {
      const res = await sendWebhook(idx, JSON.parse(payload));
      setResp(JSON.stringify(res, null, 2));
      setStatus("Отправлено");
    } catch (e: any) {
      setResp("Ошибка: " + e?.message);
    }
  }

  useEffect(() => { fetchWebhooks(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Webhooks / Интеграции</h1>
      <form onSubmit={handleAdd} className="mb-4 flex gap-2 items-end">
        <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="URL" className="border px-2 py-1 rounded w-96" required />
        <select value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}>
          <option>POST</option>
          <option>GET</option>
        </select>
        <input value={form.headers} onChange={e => setForm(f => ({ ...f, headers: e.target.value }))} placeholder="JSON headers" className="border px-2 py-1 rounded w-96" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Добавить</button>
      </form>
      <div className="mb-6">
        <label className="font-semibold mr-2">Payload:</label>
        <input value={payload} onChange={e => setPayload(e.target.value)} className="border px-2 py-1 rounded w-96" />
      </div>
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">URL</th>
            <th className="border px-2 py-1">Метод</th>
            <th className="border px-2 py-1">Действия</th>
          </tr>
        </thead>
        <tbody>
          {webhooks.map((wh, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{wh.url}</td>
              <td className="border px-2 py-1">{wh.method}</td>
              <td className="border px-2 py-1">
                <button className="bg-green-600 text-white px-2 py-1 rounded text-xs mr-2" onClick={() => handleSend(idx)}>Тест</button>
                <button className="bg-red-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleDelete(idx)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {status && <div className="mb-4 text-green-700">{status}</div>}
      {resp && (
        <div className="mt-4">
          <div className="font-semibold mb-2">Ответ:</div>
          <pre className="bg-black text-green-300 p-4 rounded max-h-96 overflow-auto">{resp}</pre>
        </div>
      )}
    </div>
  );
};

export default WebhooksPage;
