import React, { useEffect, useState } from "react";
import { getMe } from "../api/users";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getMe().then(setUser);
  }, []);

  if (!user) return <div>Загрузка профиля...</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Профиль пользователя</h2>
      <div className="mb-2"><b>Email:</b> {user.email}</div>
      <div className="mb-2"><b>Имя:</b> {user.full_name || "-"}</div>
      <div className="mb-2"><b>Роль:</b> {user.role}</div>
      <div className="mb-2"><b>Активен:</b> {user.is_active ? "Да" : "Нет"}</div>
      <div className="mb-2"><b>Суперюзер:</b> {user.is_superuser ? "Да" : "Нет"}</div>
      {/* Кнопки смены пароля и прочего — добавить позже */}
    </div>
  );
};

export default Profile;
