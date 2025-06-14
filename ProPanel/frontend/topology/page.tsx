// frontend/topology/page.tsx
"use client";
import { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import { fetchNetworkLayout, fetchRolesCatalog, applyRoleToVds, replicateRole, triggerFailover } from "@/lib/topologyApi";
import RoleWizard from "@/components/role/RoleWizard";
import { Button } from "@/components/ui/button";

export default function AdvancedNetworkMap() {
  const [nodes, setNodes] = useState([]), [edges, setEdges] = useState([]), [roles, setRoles] = useState([]);
  const [selected, setSelected] = useState(null), [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    fetchNetworkLayout().then(({ nodes, edges }) => { setNodes(nodes); setEdges(edges); });
    fetchRolesCatalog().then(setRoles);
  }, []);

  function onNodeDoubleClick(evt, node) { setSelected(node); }
  async function onRoleChange(e) {
    await applyRoleToVds(selected.id, e.target.value); setWizardOpen(true);
  }
  function handleReplicate() { replicateRole(selected.id); }
  function handleFailover() { triggerFailover(selected.id); }

  return (
    <div className="flex gap-8">
      <div style={{ width: "70vw", height: "75vh", border: "1px solid #eee" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeDoubleClick={onNodeDoubleClick}
          fitView
        ><MiniMap /><Controls /><Background /></ReactFlow>
      </div>
      {selected && (
        <div className="p-4 bg-gray-50 rounded shadow w-96">
          <h2 className="font-bold mb-2">{selected.name} ({selected.category})</h2>
          <div>Роль: <b>{selected.role}</b></div>
          <select className="mt-2 w-full" value={selected.role} onChange={onRoleChange}>
            <option value="">Сменить роль…</option>
            {roles.map(r => <option key={r.role} value={r.role}>{r.title}</option>)}
          </select>
          <Button className="mt-2 w-full" onClick={handleReplicate}>Реплицировать на резервный VDS</Button>
          <Button className="mt-2 w-full" variant="destructive" onClick={handleFailover}>Ввести резерв в строй (Failover)</Button>
          {wizardOpen && <RoleWizard vds={selected} onClose={() => setWizardOpen(false)} />}
        </div>
      )}
    </div>
  );
}
