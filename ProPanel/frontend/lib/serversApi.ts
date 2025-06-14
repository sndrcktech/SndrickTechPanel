// frontend/lib/serversApi.ts
export async function addServerViaSSH(data: any) {
  const res = await fetch("/api/servers/addssh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}
