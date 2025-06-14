import React, { useEffect, useState } from "react";
import { getAlertTemplates, setAlertTemplates } from "../api/alert_templates";

const ALL_CHANNELS = ["email", "telegram", "push"];

const DEFAULT_VARS = {
  cert_expiry: { user: "admin", domain: "example.com", expires: "2025-12-31" },
  backup_fail: { details: "No space left on device" },
  login_failed: { user: "alice", ip: "1.2.3.4" }
};

const AlertTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<any>({});
  const [info, setInfo] = useState("");

  useEffect(() => {
    (async () => setTemplates(await getAlertTemplates()))();
  }, []);

  function handleChange(event: string, channel: string, value: string) {
    const newTemplates = { ...templates };
    if (!newTemplates[event]) newTemplates[event] = {};
    newTemplates[event][channel] = value;
    setTemplates(newTemplates);
  }

  async function save() {
    await setAlertTemplates(templates);
    setInfo("Шаблоны сохранены!");
  }

  function renderTemplate(tpl: string, vars: any) {
    if (!tpl) return "";
    return tpl.replace(/{(\w+)}/g, (_, k) => vars[k] ?? "");
  }

  const events = Object.keys(templates).length > 0 ? Object.keys(templates) : [
    "cert_expiry", "backup_fail", "login_failed"
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Шаблоны сообщений для алертов</h1>
      <div className="overflow-auto max-h-[70vh] bg-gray-50 rounded p-2">
        <table className="w-full border text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Событие</th>
              {ALL_CHANNELS.map(c => (
                <th key={c} className="border px-2 py-1">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{event}</td>
                {ALL_CHANNELS.map(c => (
                  <td key={c} className="border px-2 py-1">
                    <textarea
                      value={templates[event]?.[c] || ""}
                      onChange={e => handleChange(event, c, e.target.value)}
                      className="w-full h-20 border rounded p-1 text-xs"
                      placeholder={`Текст для ${event}/${c}`}
                    />
                    <div className="mt-1 text-xs text-gray-600">
                      <span className="font-mono">{
                        renderTemplate(templates[event]?.[c] || "", DEFAULT_VARS[event] || {})
                      }</span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4" onClick={save}>
        Сохранить шаблоны
      </button>
      {info && <div className="mb-4 text-green-700">{info}</div>}
      <div className="mt-6 text-sm text-gray-500">
        Используйте переменные в фигурных скобках: <b>{"{user}, {domain}, {expires}, {details}, ..."}</b>
      </div>
    </div>
  );
};

export default AlertTemplatesPage;
