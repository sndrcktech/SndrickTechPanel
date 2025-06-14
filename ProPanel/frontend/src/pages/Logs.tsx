import React, { useEffect, useState } from "react";
import { getServiceLog } from "../api/logs";

const SERVICES = [
  { key: "nginx", label: "Nginx" },
  { key: "postfix", label: "Postfix" },
  { key: "dovecot", label: "Dovecot" },
  { key: "docker", label: "Docker" },
  { key: "panel", label: "Панель" },
  { key: "system", label: "System" },
];

const Logs: React.FC = () => {
  const [selected, setSelected] = useState("nginx");
  const [log, setLog] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchLog() {
    setLoading(true);
    setLog(await getServiceLog(selected, 100));
    setLoading(false);
  }

  useEffect(() => {
    fetchLog();
    const timer = setInterval(fetchLog, 10000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [selected]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Логи сервисов</h1>
      <div className="mb-4 flex items-center gap-4">
        {SERVICES.map(svc => (
          <button
            key={svc.key}
            onClick={() => setSelected(svc.key)}
            className={`px-4 py-2 rounded ${
              selected === svc.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
          >
            {svc.label}
          </button>
        ))}
      </div>
      <div className="bg-black text-green-300 font-mono rounded p-4 overflow-auto h-[60vh]">
        {loading ? "Загрузка..." : (
          <pre className="whitespace-pre-wrap">{log || "Нет данных"}</pre>
        )}
      </div>
    </div>
  );
};

export default Logs;
