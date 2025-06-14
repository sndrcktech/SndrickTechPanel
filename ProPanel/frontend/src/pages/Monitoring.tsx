import React, { useEffect, useState } from "react";
import { getMonitorStatus, getMonitorAlerts } from "../api/monitoring";

const color = (level: string) =>
  level === "ok" ? "text-green-700" : level === "error" || level === "critical" ? "text-red-700" : "text-yellow-700";

const MonitoringPage: React.FC = () => {
  const [state, setState] = useState<any>({});
  const [alerts, setAlerts] = useState<any[]>([]);

  async function fetchAll() {
    setState(await getMonitorStatus());
    setAlerts(await getMonitorAlerts());
  }

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Мониторинг/Оповещения</h1>
      <div className="mb-8">
        <div className="font-semibold mb-2">Текущее состояние:</div>
        <table className="w-full border text-xs mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Объект</th>
              <th className="border px-2 py-1">Статус</th>
              <th className="border px-2 py-1">Уровень</th>
              <th className="border px-2 py-1">Время</th>
              <th className="border px-2 py-1">Детали</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(state).map(([name, s]: any) => (
              <tr key={name}>
                <td className="border px-2 py-1">{name}</td>
                <td className={`border px-2 py-1 font-bold ${color(s.level)}`}>{s.status}</td>
                <td className="border px-2 py-1">{s.level}</td>
                <td className="border px-2 py-1">{new Date((s.ts ?? 0) * 1000).toLocaleString()}</td>
                <td className="border px-2 py-1">{JSON.stringify(s.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className="font-semibold mb-2">Последние алерты:</div>
        <table className="w-full border text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Время</th>
              <th className="border px-2 py-1">Объект</th>
              <th className="border px-2 py-1">Статус</th>
              <th className="border px-2 py-1">Уровень</th>
              <th className="border px-2 py-1">Детали</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{new Date((a.ts ?? 0) * 1000).toLocaleString()}</td>
                <td className="border px-2 py-1">{a.name}</td>
                <td className={`border px-2 py-1 font-bold ${color(a.level)}`}>{a.status}</td>
                <td className="border px-2 py-1">{a.level}</td>
                <td className="border px-2 py-1">{JSON.stringify(a.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {alerts.length === 0 && <div className="p-4 text-gray-400">Нет алертов</div>}
      </div>
    </div>
  );
};

export default MonitoringPage;
