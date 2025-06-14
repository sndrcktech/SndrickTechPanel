import React, { useEffect, useState } from "react";
import { getAlertTestLog, repeatAlertTest, purgeAlertTestLog } from "../api/alert_test_log";

const AlertTestLogPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [event, setEvent] = useState("");
  const [channel, setChannel] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [limit, setLimit] = useState(100);
  const [purgeDate, setPurgeDate] = useState("");

  async function fetchLogs() {
    const after = dateFrom ? Date.parse(dateFrom) / 1000 : undefined;
    const before = dateTo ? Date.parse(dateTo) / 1000 : undefined;
    setLogs(await getAlertTestLog({ event, channel, after, before, limit }));
  }

  useEffect(() => { fetchLogs(); }, []);

  async function handleRepeat(ts: number) {
    const res = await repeatAlertTest(ts);
    alert("Повторено: " + (res?.ok ? "Успех" : "Ошибка") + (res?.message ? `\n${res.message}` : ""));
  }

  async function handlePurge() {
    if (!purgeDate) return;
    const before = Date.parse(purgeDate) / 1000;
    if (window.confirm("Удалить все записи до " + purgeDate + "?")) {
      await purgeAlertTestLog(before);
      fetchLogs();
    }
  }

  function handleExportCSV() {
    const csv =
      "ts\tevent\tchannel\tto\tparams\tmessage\n" +
      logs
        .map((l) =>
          [l.ts, l.event, l.channel, l.to, l.params, l.message]
            .map((x) => (x === undefined ? "" : String(x).replace(/\t/g, " ")))
            .join("\t")
        )
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alert_test_log.csv";
    a.click();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Журнал тестовых алертов</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          value={event}
          onChange={e => setEvent(e.target.value)}
          placeholder="Событие"
          className="border px-2 py-1 rounded"
        />
        <input
          value={channel}
          onChange={e => setChannel(e.target.value)}
          placeholder="Канал"
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
          className="border px-2 py-1 rounded w-20"
          placeholder="limit"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={fetchLogs}>
          Фильтровать
        </button>
      </div>
      <div className="mb-4 flex gap-4 flex-wrap">
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={handleExportCSV}
        >
          Экспорт CSV
        </button>
        <input
          type="date"
          value={purgeDate}
          onChange={e => setPurgeDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={handlePurge}
        >
          Очистить до даты
        </button>
      </div>
      <div className="overflow-auto max-h-[70vh] bg-gray-50 rounded p-2">
        <table className="w-full border text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Время</th>
              <th className="border px-2 py-1">Событие</th>
              <th className="border px-2 py-1">Канал</th>
              <th className="border px-2 py-1">Кому</th>
              <th className="border px-2 py-1">Параметры</th>
              <th className="border px-2 py-1">Сообщение</th>
              <th className="border px-2 py-1">Действия</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{new Date((l.ts ?? 0) * 1000).toLocaleString()}</td>
                <td className="border px-2 py-1">{l.event}</td>
                <td className="border px-2 py-1">{l.channel}</td>
                <td className="border px-2 py-1">{l.to}</td>
                <td className="border px-2 py-1 font-mono">{l.params}</td>
                <td className="border px-2 py-1">{l.message}</td>
                <td className="border px-2 py-1">
                  <button
                    className="bg-blue-600 text-white text-xs rounded px-2 py-1"
                    onClick={() => handleRepeat(l.ts)}
                  >
                    Повторить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <div className="p-4 text-gray-400">Нет записей</div>}
      </div>
    </div>
  );
};

export default AlertTestLogPage;
