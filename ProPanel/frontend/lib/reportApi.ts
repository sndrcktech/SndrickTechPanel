// frontend/lib/reportApi.ts
export async function fetchFailoverReports() {
  const res = await fetch("/api/reports/failover");
  return await res.json();
}
