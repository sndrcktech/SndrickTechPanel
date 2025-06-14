import React, { useEffect, useState } from "react";
import { getNotifyConfig, setNotifyConfig, telegramTest, getNotifyLog } from "../api/notifications";

const NotificationsPage: React.FC = () => {
  const [cfg, setCfg] = useState<any>({});
  const [token, setToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [msg, setMsg] = useState("Test SandrickTechPanel alert");
  const [log, setLog] = useState<any[]>([]);
  const [info, setInfo] = useState("");

  async function fetchConfig() {
    const c = await getNotifyConfig();
    setCfg(c);
    setToken(c.telegram?.bot_token || "");
    setChatId(c.telegram?.chat_id || "");
    setLog(await getNotifyLog());
  }

  async function saveConfig() {
    await setNotifyConfig({
      telegram: { bot_token: token, chat_id: chatId },
      ...cfg
    });
    setInfo("Конфиг сохранён");
    fetchConfig();
  }

  async function testTelegram() {
    await telegramTest(msg);
    setInfo("Тест отправлен в Telegram");
    fetchConfig();
  }

  useEffect(() => { fetchConfig(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Оповещения: Telegram / Push</h1>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Telegram:</h2>
        <div className="flex gap-2 mb-2">
          <input value={token} onChange={e => setToken(e.target.value)} placeholder="Bot Token" className="border px-2 py-1 rounded" />
          <input value={chatId} onChange={e => setChatId(e.target.value)} placeholder="Chat ID" className="border px-2 py-1 rounded" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={saveConfig}>
            Сохранить
          </button>
        </div>
        <div className="flex gap-2 mb-2">
          <input value={msg} onChange={e => setMsg(e.target.value)} className="border px-2 py-1 rounded" />
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={testTelegram}>
            Тест Telegram
          </button>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Журнал отправки уведомлений:</h2>
        <div className="overflow-auto max-h-64 bg-gray-100 rounded p-2">
          <table className="w-full border text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Время</th>
                <th className="border px-2 py-1">Тип</th>
                <th className="border px-2 py-1">Текст</th>
                <th className="border px-2 py-1">Ответ</th>
              </tr>
            </thead>
            <tbody>
              {log.map((e, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{new Date((e.ts ?? 0) * 1000).toLocaleString()}</td>
                  <td className="border px-2 py-1">{e.type}</td>
                  <td className="border px-2 py-1">{e.text}</td>
                  <td className="border px-2 py-1">{e.resp || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {log.length === 0 && <div className="p-4 text-gray-400">Нет уведомлений</div>}
        </div>
      </div>
      {info && <div className="mb-4 text-green-700">{info}</div>}
    </div>
  );
};

export default NotificationsPage;
