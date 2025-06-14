import React, { useEffect, useState } from "react";
import { getSystemStats } from "../api/stats";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = 2;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}д ${h}ч ${m}м`;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchStats() {
      try {
        const data = await getSystemStats();
        if (active) setStats(data);
      } catch (e) {
        // handle error
      }
    }
    fetchStats();
    const timer = setInterval(fetchStats, 5000); // Обновление каждые 5 сек
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  if (!stats) return <div className="p-8">Загрузка данных сервера...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Состояние сервера</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">CPU</h2>
          <div className="text-4xl font-bold mb-2">{stats.cpu_percent}%</div>
          <div className="text-gray-500">Ядер: {stats.cpu_cores}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">RAM</h2>
          <div className="text-4xl font-bold mb-2">{stats.ram_percent}%</div>
          <div className="text-gray-500">
            {formatBytes(stats.ram_used)} / {formatBytes(stats.ram_total)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Disk</h2>
          <div className="text-4xl font-bold mb-2">{stats.disk_percent}%</div>
          <div className="text-gray-500">
            {formatBytes(stats.disk_used)} / {formatBytes(stats.disk_total)}
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded p-4">
          <span className="font-semibold">Hostname:</span> {stats.hostname}
        </div>
        <div className="bg-gray-50 rounded p-4">
          <span className="font-semibold">OS:</span> {stats.os}
        </div>
        <div className="bg-gray-50 rounded p-4">
          <span className="font-semibold">Uptime:</span> {formatUptime(stats.uptime)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
