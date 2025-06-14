import React, { useEffect, useState } from "react";
import { getAlertMatrixRBAC, setAlertMatrixRBAC, muteAlertRBAC, unmuteAlertRBAC } from "../api/alert_matrix_rbac";

const ALL_CHANNELS = ["email", "telegram", "push"];

const AlertMatrixRBACPage: React.FC = () => {
  const [matrix, setMatrix] = useState<any>({});
  const [tab, setTab] = useState<"global"|"users"|"groups"|"roles">("global");
  const [info, setInfo] = useState("");
  const [muted, setMuted] = useState<{target: string, mutes: any[]}[]>([]);

  useEffect(() => {
    (async () => setMatrix(await getAlertMatrixRBAC()))();
  }, []);

  async function save() {
    await setAlertMatrixRBAC(matrix);
    setInfo("Сохранено!");
  }

  // Mute/unmute helpers
  async function mute(targetType: string, target: string, event: string, channel: string) {
    await muteAlertRBAC({ [targetType]: target, event, channel });
    setInfo(`Muted for ${targetType} ${target}: ${event} via ${channel}`);
  }
  async function unmute(targetType: string, target: string, event: string, channel: string) {
    await unmuteAlertRBAC({ [targetType]: target, event, channel });
    setInfo(`Unmuted for ${targetType} ${target}: ${event} via ${channel}`);
  }

  // View mutes
  useEffect(() => {
    if (tab !== "global") {
      const t = matrix[tab] || {};
      setMuted(Object.entries(t).map(([k, v]: any) => ({
        target: k, mutes: v.mute || []
      })));
    } else {
      setMuted([]);
    }
  }, [matrix, tab]);

  const events = Object.keys(matrix.global || {});

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Расширенная матрица алертов (RBAC)</h1>
      <div className="flex gap-4 mb-4">
        <button className={`px-4 py-2 rounded ${tab === "global" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setTab("global")}>Глобально</button>
        <button className={`px-4 py-2 rounded ${tab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setTab("users")}>Пользователи</button>
        <button className={`px-4 py-2 rounded ${tab === "groups" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setTab("groups")}>Группы</button>
        <button className={`px-4 py-2 rounded ${tab === "roles" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setTab("roles")}>Роли</button>
      </div>
      {tab === "global" && (
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
                      <input
                        type="checkbox"
                        checked={matrix.global[event]?.includes(c) || false}
                        onChange={() => {
                          const newMatrix = { ...matrix };
                          if (!newMatrix.global[event]) newMatrix.global[event] = [];
                          if (newMatrix.global[event].includes(c))
                            newMatrix.global[event] = newMatrix.global[event].filter((ch: string) => ch !== c);
                          else
                            newMatrix.global[event].push(c);
                          setMatrix(newMatrix);
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab !== "global" && (
        <div>
          <div className="mb-2 text-sm text-gray-700">
            Список mute (отключений) по {tab === "users" ? "пользователям" : tab === "groups" ? "группам" : "ролям"}.
            Вы можете отключить/включить оповещения для определённых событий/каналов.
          </div>
          {muted.map(({target, mutes}, i) => (
            <div key={i} className="mb-3">
              <div className="font-bold">{target}</div>
              <ul className="list-disc ml-4">
                {mutes.map((m, j) => (
                  <li key={j}>
                    {m.event || "любое событие"} via {m.channel || "любой канал"} {m.until ? `(до ${new Date(m.until * 1000).toLocaleString()})` : ""}
                    <button className="bg-green-600 text-white text-xs rounded px-2 py-1 ml-2" onClick={() => unmute(tab.slice(0, -1), target, m.event, m.channel)}>
                      Включить снова
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-2">
                <input type="text" placeholder="Событие" id={`event-${target}`} className="border px-1 rounded text-xs" />
                <select id={`channel-${target}`} className="border px-1 rounded text-xs">
                  <option value="">Все</option>
                  {ALL_CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button className="bg-red-600 text-white text-xs rounded px-2 py-1" onClick={() => {
                  const event = (document.getElementById(`event-${target}`) as HTMLInputElement)?.value || undefined;
                  const channel = (document.getElementById(`channel-${target}`) as HTMLSelectElement)?.value || undefined;
                  mute(tab.slice(0, -1), target, event, channel);
                }}>
                  Отключить (Mute)
                </button>
              </div>
            </div>
          ))}
          {muted.length === 0 && <div className="p-4 text-gray-400">Нет mute для этой категории</div>}
        </div>
      )}
      <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4" onClick={save}>
        Сохранить матрицу
      </button>
      {info && <div className="mb-4 text-green-700">{info}</div>}
    </div>
  );
};

export default AlertMatrixRBACPage;
