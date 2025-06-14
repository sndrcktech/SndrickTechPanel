import React, { useEffect, useState } from "react";
import { getSettings, setSettings } from "../api/settings";

const SettingsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getSettings().then(setData);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setData((d: any) => ({ ...d, [name]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await setSettings(data);
    setStatus("Сохранено");
  }

  if (!data) return <div className="p-8">Загрузка настроек...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Глобальные настройки</h1>
      <form onSubmit={handleSave}>
        <label className="block mb-2">
          Название панели:
          <input
            name="panel_name"
            value={data.panel_name}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </label>
        <label className="block mb-2">
          Временная зона:
          <input
            name="timezone"
            value={data.timezone}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </label>
        <label className="block mb-2">
          Email администратора:
          <input
            name="admin_email"
            value={data.admin_email}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </label>
        <label className="block mb-2">
          SMTP host:
          <input
            name="smtp_host"
            value={data.smtp_host}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </label>
        <label className="block mb-2">
          SMTP порт:
          <input
            name="smtp_port"
            type="number"
            value={data.smtp_port}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </label>
        <label className="block mb-2">
          SMTP user:
          <input
            name="smtp_user"
            value={data.smtp_user}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </label>
        <label className="block mb-2">
          SMTP password:
          <input
            name="smtp_pass"
            type="password"
            value={data.smtp_pass}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </label>
        <label className="block mb-2">
          Домены (через запятую):
          <input
            name="domains"
            value={Array.isArray(data.domains) ? data.domains.join(",") : data.domains}
            onChange={e =>
              setData((d: any) => ({ ...d, domains: e.target.value.split(",").map((x: string) => x.trim()) }))
            }
            className="border px-2 py-1 rounded w-full"
          />
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4" type="submit">
          Сохранить
        </button>
        {status && <span className="ml-4 text-green-700">{status}</span>}
      </form>
    </div>
  );
};

export default SettingsPage;
