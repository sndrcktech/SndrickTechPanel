import React, { useEffect, useState } from "react";
import { queryPrometheus, getPrometheusAlerts } from "../api/metrics";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const charts = [
  { title: "CPU Usage (%)", query: '100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100)' },
  { title: "RAM Usage (%)", query: '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100' },
  { title: "Disk Usage (%)", query: '(node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_free_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"} * 100' },
];

const Metrics: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [status, setStatus] = useState("");

  async function fetchAll() {
    try {
      const chartData = await Promise.all(charts.map(c => queryPrometheus(c.query)));
      setData(chartData.map((resp, i) => ({
        title: charts[i].title,
        value: resp.result[0]?.value?.[1] ? parseFloat(resp.result[0].value[1]) : 0
      })));
      const alertsResp = await getPrometheusAlerts();
      setAlerts(alertsResp.alerts || []);
      setStatus("");
    } catch {
      setStatus("Ошибка запроса к Prometheus");
    }
  }

  useEffect(() => { fetchAll(); const timer = setInterval(fetchAll, 10000); return () => clearInterval(timer); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Мониторинг (Prometheus)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {data.map((chart, idx) => (
          <div key={idx} className="bg-white rounded shadow p-6 flex flex-col items-center">
            <div className="font-semibold mb-1">{chart.title}</div>
            <div className="text-3xl font-bold mb-2">{chart.value.toFixed(2)}%</div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart width={220} height={80} data={[{value: chart.value}]}>
                <Line type="monotone" dataKey="value" stroke="#3182ce" dot={false} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Alerts</h2>
        {alerts.length === 0 ? (
          <div className="text-gray-600">Нет активных алертов</div>
        ) : (
          <ul>
            {alerts.map((a, i) => (
              <li key={i} className="mb-1 text-red-600 font-mono">
                {a.labels.alertname}: {a.annotations?.description || ""}
              </li>
            ))}
          </ul>
        )}
      </div>
      {status && <div className="mt-2 text-red-700">{status}</div>}
    </div>
  );
};

export default Metrics;
