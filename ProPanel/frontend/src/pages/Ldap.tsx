import React, { useEffect, useState } from "react";
import { getLdapUsers, addLdapUser, getLdapGroups, addLdapGroup, addUserToGroup } from "../api/ldap";

const LdapPage: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [userForm, setUserForm] = useState({ uid: "", cn: "", sn: "", userPassword: "" });
  const [groupForm, setGroupForm] = useState({ cn: "" });
  const [status, setStatus] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  async function fetchAll() {
    setUsers(await getLdapUsers());
    setGroups(await getLdapGroups());
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    await addLdapUser(userForm);
    setStatus("Пользователь добавлен");
    setUserForm({ uid: "", cn: "", sn: "", userPassword: "" });
    fetchAll();
  }

  async function handleAddGroup(e: React.FormEvent) {
    e.preventDefault();
    await addLdapGroup(groupForm);
    setStatus("Группа добавлена");
    setGroupForm({ cn: "" });
    fetchAll();
  }

  async function handleAddUserToGroup() {
    await addUserToGroup(selectedGroup, selectedUser);
    setStatus("Пользователь добавлен в группу");
    fetchAll();
  }

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">LDAP управление</h1>

      <form onSubmit={handleAddUser} className="mb-4 flex gap-2 items-end">
        <input value={userForm.uid} onChange={e => setUserForm(f => ({ ...f, uid: e.target.value }))} placeholder="uid" className="border px-2 py-1 rounded" required />
        <input value={userForm.cn} onChange={e => setUserForm(f => ({ ...f, cn: e.target.value }))} placeholder="cn" className="border px-2 py-1 rounded" required />
        <input value={userForm.sn} onChange={e => setUserForm(f => ({ ...f, sn: e.target.value }))} placeholder="sn" className="border px-2 py-1 rounded" required />
        <input value={userForm.userPassword} type="password" onChange={e => setUserForm(f => ({ ...f, userPassword: e.target.value }))} placeholder="password" className="border px-2 py-1 rounded" required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Добавить пользователя</button>
      </form>

      <form onSubmit={handleAddGroup} className="mb-4 flex gap-2 items-end">
        <input value={groupForm.cn} onChange={e => setGroupForm(f => ({ ...f, cn: e.target.value }))} placeholder="cn" className="border px-2 py-1 rounded" required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Добавить группу</button>
      </form>

      <div className="mb-4">
        <span className="font-semibold">Пользователи: </span>
        {users.map(u => <span key={u} className="font-mono mx-1">{u}</span>)}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Группы: </span>
        {groups.map(g => <span key={g} className="font-mono mx-1">{g}</span>)}
      </div>
      <div className="mb-6 flex gap-2 items-end">
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
          <option value="">Пользователь</option>
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
          <option value="">Группа</option>
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAddUserToGroup} disabled={!selectedUser || !selectedGroup}>
          В группу
        </button>
      </div>
      {status && <div className="mt-2 text-green-700">{status}</div>}
    </div>
  );
};

export default LdapPage;
