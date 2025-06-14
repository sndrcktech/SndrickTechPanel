import React, { useEffect, useState } from "react";
import { promQuery, getAlerts } from "../api/prometheus";

type Alert = {
  labels: { [key: string]: string };
  annotations: { [key: string]: string };
  status: { state: string };
  startsAt: string;
};

const METRICS = [
  { label: "Загрузка CPU (%)", query: "100 - (avg by(instance) (irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)" },
  { label: "RAM usage (байт)", query: "node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes" },
  { label: "Дисковое пространство (байт)", query: "node_filesystem_size_bytes - node_filesystem_free_bytes" },
];

const PrometheusPage: React.FC = () => {
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    async function fetchAll() {
      const ms = await Promise.all(
        METRICS.map(async (m) => {
          const res = await promQuery(m.query);
          let value = "-";
          try {
            if (res.data.result.length > 0)
              value = res.data.result[0].value[1];
          } catch {}
          return { label: m.label, value };
        })
      );
      setMetrics(ms);
      setAlerts(await getAlerts());
    }
    fetchAll();
    const timer = setInterval(fetchAll, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Prometheus Monitoring</h1>
      <div className="mb-8">
        <h2 className="font-semibold mb-2">Ключевые метрики</h2>
        <ul>
          {metrics.map((m, idx) => (
            <li key={idx} className="mb-1">
              <span className="font-semibold">{m.label}:</span> {m.value}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold
