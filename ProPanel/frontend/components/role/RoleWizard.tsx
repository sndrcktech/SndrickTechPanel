// frontend/components/role/RoleWizard.tsx
"use client";
import { useState, useEffect } from "react";
import { fetchRoleConfigTemplate, applyRoleConfig } from "@/lib/roleApi";
import { Button } from "../ui/button";

export default function RoleWizard({ vds, onClose }) {
  const [steps, setSteps] = useState([]), [curr, setCurr] = useState(0), [vals, setVals] = useState({});
  useEffect(() => { fetchRoleConfigTemplate(vds.role).then(setSteps); }, [vds.role]);
  function onChange(e, name) { setVals({ ...vals, [name]: e.target.value }); }
  async function next() { if (curr + 1 < steps.length) setCurr(curr + 1); else { await applyRoleConfig(vds.id, vals); onClose(); } }
  return (
    <div className="fixed z-50 bg-white shadow-lg p-8 top-20 left-1/3 w-2/5 rounded">
      <h3 className="font-bold mb-2">Пошаговая настройка роли: {vds.role}</h3>
      {steps.length && steps[curr] && (
        <div>
          <label className="block mb-2">{steps[curr].label}</label>
          <input className="border rounded w-full p-2" value={vals[steps[curr].name] || ""} onChange={e => onChange(e, steps[curr].name)} />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>Отмена</Button>
            <Button onClick={next}>{curr + 1 < steps.length ? "Далее" : "Применить"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
