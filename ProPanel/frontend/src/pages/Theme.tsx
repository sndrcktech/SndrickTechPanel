import React, { useEffect, useState } from "react";
import { getTheme, setTheme, uploadLogo, getLogoUrl } from "../api/theme";

const ThemePage: React.FC = () => {
  const [theme, setThemeState] = useState("light");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getTheme().then(setThemeState);
    setLogoUrl(getLogoUrl());
  }, []);

  async function handleThemeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setThemeState(value);
    await setTheme(value);
    setStatus("Тема изменена");
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      await uploadLogo(e.target.files[0]);
      setLogoUrl(getLogoUrl() + "?" + Date.now()); // Форсируем обновление
      setStatus("Логотип загружен");
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Настройки интерфейса</h1>
      <div className="mb-4">
        <label className="font-semibold mr-2">Тема:</label>
        <select value={theme} onChange={handleThemeChange}>
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
          {/* Добавляй другие темы по мере необходимости */}
        </select>
      </div>
      <div className="mb-4">
        <label className="font-semibold mr-2">Загрузить логотип:</label>
        <input type="file" accept=".png,.jpg,.jpeg,.svg" onChange={handleLogoChange} />
      </div>
      <div className="mb-4">
        <label className="font-semibold mr-2">Текущий логотип:</label>
        {logoUrl && (
          <img src={logoUrl} alt="Logo" style={{ maxHeight: 60, background: "#fff", borderRadius: 6, padding: 4 }} />
        )}
      </div>
      {status && <div className="mt-2 text-green-700">{status}</div>}
    </div>
  );
};

export default ThemePage;
