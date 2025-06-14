import React, { useEffect, useState } from "react";
import { checkUpdate, doUpgrade } from "../api/update";

const UpdatePage: React.FC = () => {
  const [info, setInfo] = useState<any>(null);
  const [status, setStatus] = useState("");

  async function fetchUpdate() {
    setStatus("Проверка...");
    const d = await checkUpdate();
    setInfo(d);
    setStatus("");
  }

  async function handleUpgrade() {
    setStatus("Обновление...");
    await doUpgrade();
    setStatus("Обновление завершено! Перезапустите панель (если нужно)");
    fetchUpdate();
  }

  useEffect(() => { fetchUpdate(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Обновление панели</h1>
      {info && (
        <div className="mb-4 border rounded bg-gray-100 p-4">
          <div>Текущая версия: <span className="font-mono">{info.current}</span></div>
          <div>Доступна версия: <span className="font-mono">{info.latest}</span></div>
          {info.is_update && (
            <div className="mt-2 text-yellow-700">
              <a href={info.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">Страница релиза</a>
            </div>
          )}
        </div>
      )}
      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded ${info?.is_update ? "" : "opacity-50 cursor-not-allowed"}`}
        disabled={!info?.is_update}
        onClick={handleUpgrade}
      >
        Обновить панель
      </button>
      {status && <div className="mt-4 text-green-700">{status}</div>}
    </div>
  );
};

export default UpdatePage;
