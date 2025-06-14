import React, { useEffect, useState } from "react";
import { sendAlertTest } from "../api/alert_test";
import { getAlertTemplates } from "../api/alert_templates";

const ALL_CHANNELS = ["email", "telegram", "push"];

const EXAMPLES = {
  cert_expiry: { user: "admin", domain: "example.com", expires: "2025-12-31" },
  backup_fail: { details: "No space left on device" },
  login_failed: { user: "alice", ip: "1.2.3.4" }
};

const AlertTestPage: React.FC = () => {
  const [event, setEvent] = useState("cert_expiry");
  const [channel, setChannel] = useState("telegram");
  const [params, setParams] = useState<any>(EXAMPLES[event]);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [templates, setTemplates] = useState<any>({});

  useEffect(() => {
    (async () => setTemplates(await getAlertTemplates()))();
  }, []);
  useEffect(() => {
    setParams(EXAMPLES[event]);
  }, [event]);

  function handleParamChange(key: string, value: string) {
    setParams((p: any) => ({ ...p, [key]: value }));
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setResult("Отправка...");
    const r = await sendAlertTest(event, channel, params);
    setResult("Готово! " + (r?.ok ? "Успех" : "Ошибка"));
    setMessage(r?.message || "");
  }

  // Поддержка предпросмотра
  function renderTemplate(tpl: string, vars: any) {
    if (!tpl) return "";
    try {
      return tpl.replace(/{(\w+)}/g, (_, k) => vars[k] ?? "");
    } catch {
      return "";
    }
  }

  const eventChannels = Object.keys(templates[event] || {});

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Тест алертов и предпросмотр</h1>
      <form onSubmit={handleSend} className="mb-4 flex flex-col gap-4 max-w-lg">
        <div>
          <label className="block mb-1">Событие</label>
          <select value={event} onChange={e => setEvent(e.target.value)} className="border px-2 py-1 rounded w-full">
            {Object.keys(templates).map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Канал</label>
          <select value={channel} onChange={e => setChannel(e.target.value)} className="border px-2 py-1 rounded w-full">
            {eventChannels.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Переменные:</label>
          {Object.keys(params || {}).map(k => (
            <div key={k} className="flex gap-2 mb-1">
              <span className="min-w-[80px]">{k}</span>
              <input className="border px-1 py-1 rounded w-full" value={params[k]} onChange={e => handleParamChange(k, e.target.value)} />
            </div>
          ))}
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Отправить тестовое сообщение
        </button>
      </form>
      <div className="mb-4">
        <div className="font-semibold">Предпросмотр:</div>
        <div className="bg-gray-100 rounded p-4 font-mono">{renderTemplate(templates[event]?.[channel], params)}</div>
      </div>
      <div>
        {result && <div className="text-green-700 mb-2">{result}</div>}
        {message && (
          <>
            <div className="font-semibold">Реальное сообщение:</div>
            <div className="bg-gray-200 rounded p-4 font-mono">{message}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlertTestPage;
