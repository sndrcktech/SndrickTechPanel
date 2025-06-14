import React, { useEffect, useState } from "react";
import { getUsers, addUser, deleteUser, getRoles, addRole, deleteRole, updateRole } from "../api/rbac";

const modules = [
  "dashboard", "metrics", "wordpress", "logs", "mail", "vpn", "ca", "backup", "settings", "agents", "dns", "webhooks", "antivirus", "terminal"
];

const RbacPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "user" });
  const [newRole, setNewRole] = useState({ name: "", permissions: [] as string[] });
  const [editRole, setEditRole] = useState<any>(null);
  const [status, setStatus] = useState("");

  async function fetchAll() {
    setUsers(await getUsers());
    setRoles(await getRoles());
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    await addUser(newUser);
    setNewUser({ username: "", password: "", role: "user" });
    setStatus("Пользователь добавлен");
    fetchAll();
  }

  async function handleDeleteUser(username: string) {
    await deleteUser(username);
    setStatus("Пользователь удалён");
    fetchAll();
  }

  async function handleAddRole(e: React.FormEvent) {
    e.preventDefault();
    await addRole({ ...newRole, permissions: Array.from(newRole.permissions) });
    setNewRole({ name: "", permissions: [] });
    setStatus("Роль добавлена");
    fetchAll();
  }

  async function handleDeleteRole(name: string) {
    await deleteRole(name);
    setStatus("Роль удалена");
    fetchAll();
  }

  async function handleUpdateRole() {
    await updateRole(editRole);
    setEditRole(null);
    setStatus("Роль обновлена");
    fetchAll();
  }

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Пользователи и роли (RBAC)</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Пользователи</h2>
        <form onSubmit={handleAddUser} className="flex gap-2 mb-2">
          <input
            value={newUser.username}
            onChange={e => setNewUser(u => ({ ...u, username: e.target.value }))}
            placeholder="Имя пользователя"
            className="border px-2 py-1 rounded"
            required
          />
          <input
            value={newUser.password}
            type="password"
            onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))}
            placeholder="Пароль"
            className="border px-2 py-1 rounded"
            required
          />
          <select value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}>
            {roles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
            Добавить
          </button>
        </form>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Имя</th>
              <th className="border px-2 py-1">Роль</th>
              <th className="border px-2 py-1">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{u.username}</td>
                <td className="border px-2 py-1">{u.role}</td>
                <td className="border px-2 py-1">
                  <button className="bg-red-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleDeleteUser(u.username)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Роли и права</h2>
        <form onSubmit={handleAddRole} className="flex gap-2 mb-2">
          <input
            value={newRole.name}
            onChange={e => setNewRole(r => ({ ...r, name: e.target.value }))}
            placeholder="Имя роли"
            className="border px-2 py-1 rounded"
            required
          />
          <div className="flex flex-wrap gap-1">
            {modules.map(m => (
              <label key={m} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={newRole.permissions.includes(m)}
                  onChange={e => {
                    setNewRole(r => ({
                      ...r,
                      permissions: e.target.checked
                        ? [...r.permissions, m]
                        : r.permissions.filter(x => x !== m)
                    }));
                  }}
                />
                <span>{m}</span>
              </label>
            ))}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
            Добавить
          </button>
        </form>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Имя</th>
              <th className="border px-2 py-1">Права</th>
              <th className="border px-2 py-1">Действия</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{r.name}</td>
                <td className="border px-2 py-1">
                  {Array.isArray(r.permissions)
                    ? r.permissions.join(", ")
                    : r.permissions}
                </td>
                <td className="border px-2 py-1">
                  <button
                    className="bg-yellow-600 text-white px-2 py-1 rounded text-xs mr-2"
                    onClick={() => setEditRole(r)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDeleteRole(r.name)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editRole && (
          <div className="mt-4 bg-gray-100 rounded p-4">
            <div className="mb-2 font-semibold">Редактировать роль: {editRole.name}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {modules.map(m => (
                <label key={m} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={editRole.permissions.includes(m)}
                    onChange={e => {
                      setEditRole((r: any) => ({
                        ...r,
                        permissions: e.target.checked
                          ? [...r.permissions, m]
                          : r.permissions.filter((x: string) => x !== m)
                      }));
                    }}
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded mr-2" onClick={handleUpdateRole}>
              Сохранить
            </button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditRole(null)}>
              Отмена
            </button>
          </div>
        )}
      </div>
      {status && <div className="mt-2 text-green-700">{status}</div>}
    </div>
  );
};

export default RbacPage;
