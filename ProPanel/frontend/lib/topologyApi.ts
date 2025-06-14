// frontend/lib/topologyApi.ts
export async function fetchNetworkLayout() {
  const res = await fetch("/api/topology/layout");
  return await res.json();
}
export async function fetchRolesCatalog() {
  const res = await fetch("/api/roles");
  return await res.json();
}
export async function applyRoleToVds(id: string, role: string) {
  const res = await fetch("/api/topology/applyrole", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vds_id: id, role })
  });
  return await res.json();
}
export async function replicateRole(id: string) {
  const res = await fetch("/api/topology/swap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ primary_id: id, reserve_id: "" }) // reserve_id выбрать из UI
  });
  return await res.json();
}
export async function triggerFailover(id: string) {
  const res = await fetch("/api/failover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ primary_id: id })
  });
  return await res.json();
}
