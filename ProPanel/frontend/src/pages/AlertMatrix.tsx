import React, { useEffect, useState } from "react";
import { getAlertMatrix, setAlertMatrix } from "../api/alert_matrix";

const ALL_CHANNELS = ["email", "telegram", "push"];

const AlertMatrixPage: React.FC = () => {
  const [matrix, setMatrix] = useState<any>({});
  const [info, setInfo] = useState("");

  useEffect(() => {
    (async () => setMatrix(await getAlertMatrix()))();
  }, []);

  async function handleChange(eventType: string, channel: string) {
    const newMatrix = { ...matrix };
    if (!newMatrix[eventType]) newMatrix[eventType] = [];
    if (newMatrix[eventType].includes(channel)) {
      newMatrix[eventType] = newMatrix[eventType].filter((ch: string) => ch !== channel);
    } else {
      newMatrix[eventType].push(channel);
    }
    setMatrix(newMatrix);
  }

  async function save() {
    await setAlertMatrix(matrix);
    setInfo("Сохранено!");
  }

  const eventTypes = Object.keys(matrix).length > 0 ? Object.keys(matrix) : [
    "cert_expiry", "backup_fail", "backup_ok", "login_failed", "system_critical", "vpn_revoke"
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Матрица оповещений (Alert Matrix)</h1>
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
            {eventTypes.map((event, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{event}</td>
                {ALL_CHANNELS.map(c => (
                  <td key={c} className="border px-2 py-1">
                    <input
                      type="checkbox"
                      checked={matrix[event]?.includes(c) || false}
                      onChange={() => handleChange(event, c)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4" onClick={save}>
        Сохранить матрицу
      </button>
      {info && <div className="mb-4 text-green-700">{info}</div>}
      <div className="mt-6 text-sm text-gray-500">
        Управляйте, какие каналы используются для каждого события. <br />
        Например: только "ошибки backup" через Telegram, только "истечение сертификатов" через email.
      </div>
    </div>
  );
};

export default AlertMatrixPage;
