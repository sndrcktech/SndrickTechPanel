// frontend/lib/policyApi.ts
export async function fetchPolicies() {
  const res = await fetch("/api/policies");
  return await res.json();
}
export async function applyPolicyToCategory(cat: string) {
  const res = await fetch("/api/policy/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category: cat, action: "apply" })
  });
  return await res.json();
}
export async function approveChange(id: string) {
  const res = await fetch("/api/policy/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  return await res.json();
}
