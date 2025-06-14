import React, { useEffect, useState } from "react";
import { getUsers } from "../api/users";
import { getRoles, changeUserRole } from "../api/rbac";

type User = {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
  role: string;
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  async function fetchData() {
    setLoading(true);
    setUsers(await getUsers());
    setRoles(await getRoles());
    setLoading(false);
  }

  async function handleRoleChange(email: string, newRole: string) {
    setStatus("");
    await changeUserRole(email, newRole);
    setStatus(`Роль для ${email} изменена`);
    fetchData();
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div className="p-8">Загрузка пользователей...</div>;

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Пользователи</h1>
      {status && <div className="mb-3 text-green-700">{status}</div>}
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Имя</th>
            <th className="border px-4 py-2">Роль</th>
            <th className="border px-4 py-2">Изменить роль</th>
            <th className="border px-4 py-2">Активен</th>
            <th className="border px-4 py-2">Суперюзер</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.id}</td>
              <td className="border px-2 py-1">{u.email}</td>
              <td className="border px-2 py-1">{u.full_name || '-'}</td>
              <td className="border px-2 py-1">{u.role}</td>
              <td className="border px-2 py-1">
                <select
                  value={u.role}
                  onChange={e => handleRoleChange(u.email, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </td>
              <td className="border px-2 py-1">{u.is_active ? "Да" : "Нет"}</td>
              <td className="border px-2 py-1">{u.is_superuser ? "Да" : "Нет"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
