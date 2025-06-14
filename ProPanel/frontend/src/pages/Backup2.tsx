import React, { useEffect, useState } from "react";
import { getBackups, createBackup, downloadBackup, uploadToS3, getS3Backups, restoreBackup } from "../api/backup2";

const Backup2: React.FC = () => {
  const [backups, setBackups] = useState<string[]>([]);
  const [s3backups, setS3Backups] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  async function fetchAll() {
    setBackups(await getBackups());
    setS3Backups(await getS3Backups());
  }

  async function handleCreate() {
    setStatus("Создание...");
    await createBackup();
    setStatus("Бэкап создан");
    fetchAll();
  }

  async function handleUpload(filename: string) {
    setStatus("Загрузка в S3...");
    await uploadToS3(filename);
    setStatus("Загружено в S3");
  }

  async function handleRestore(filename: string) {
    setStatus("Восстановление...");
    await restoreBackup(filename);
    setStatus("Восстановлено!");
  }

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Резервные копии</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={handleCreate}>
        Создать бэкап
      </button>
      {status && <div className="mb-4 text-green-700">{status}</div>}

      <div className="mb-4">
        <div className="font-semibold mb-2">Локальные бэкапы:</div>
        <ul>
          {backups.map((b, i) => (
            <li key={i} className="flex items-center gap-3 mb-1">
              <span className="font-mono">{b}</span>
              <button className="bg-green-600 text-white px-2 py-1 rounded text-xs" onClick={() => downloadBackup(b)}>
                Скачать
              </button>
              <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleUpload(b)}>
                В S3
              </button>
              <button className="bg-yellow-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleRestore(b)}>
                Восстановить
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-semibold mb-2">S3 бэкапы:</div>
        <ul>
          {s3backups.map((b, i) => (
            <li key={i} className="flex items-center gap-3 mb-1">
              <span className="font-mono">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Backup2;
