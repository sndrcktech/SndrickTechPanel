// frontend/app/policy/page.tsx
"use client";
import { useEffect, useState } from "react";
import { fetchPolicies, addPolicy, applyPolicyToCategory, approveChange } from "@/lib/policyApi";
import { Button } from "@/components/ui/button";

export default function PolicyPage() {
  const [policies, setPolicies] = useState([]);
  useEffect(() => { fetchPolicies().then(setPolicies); }, []);
  function handleApply(cat) { applyPolicyToCategory(cat); }
  function handleApprove(id) { approveChange(id); }
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Оркестрация по политике</h1>
      {policies.map(p => (
        <div key={p.id} className="mb-4 border-b pb-2">
          <b>{p.title}</b>: <span>{p.rule}</span>
          <Button className="ml-4" onClick={() => handleApply(p.category)}>Применить к категории</Button>
          {p.needApproval && <Button variant="destructive" onClick={() => handleApprove(p.id)}>Подтвердить (2FA)</Button>}
        </div>
      ))}
    </div>
  );
}
