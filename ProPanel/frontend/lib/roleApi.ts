// frontend/lib/roleApi.ts
export async function fetchRoleConfigTemplate(role: string) {
  const res = await fetch(`/api/roles/template?role=${role}`);
  return await res.json();
}
export async function applyRoleConfig(id: string, vals: any) {
  const res = await fetch("/api/agent/setrole", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vds_ip: id, ...vals })
  });
  return await res.json();
}
