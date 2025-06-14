// frontend/app/reports/page.tsx
"use client";
import { useEffect, useState } from "react";
import { fetchFailoverReports } from "@/lib/reportApi";
export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  useEffect(() => { fetchFailoverReports().then(setReports); }, []);
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Отчёты по доступности и резервированию</h1>
      <table>
        <thead><tr><th>Дата</th><th>Событие</th><th>Основной</th><th>Резерв</th><th>Длительность</th><th>Комментарий</th></tr></thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.id}><td>{r.time}</td><td>{r.event}</td><td>{r.primary}</td><td>{r.reserve}</td><td>{r.downtime}</td><td>{r.comment}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
