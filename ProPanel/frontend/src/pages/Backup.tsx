import React, { useEffect, useState } from "react";
import { createBackup, listBackups, restoreBackup, deleteBackup, uploadBackupS3 } from "../api/backup";

const BackupPage: React.FC = () => {
  const [backups, setBackups] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [label, setLabel] = useState("");
  const [showS3, setShowS3] = useState(false);
  const [s3, setS3] = useState({ name: "", bucket: "", aws_key: "", aws_secret: "", region: "us-east-1" });

  async function fetchList() {
    setBackups(await listBackups());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createBackup(label);
    setStatus("Бэкап создан");
    setLabel("");
    fetchList();
  }

  async function handleRestore(name: string) {
    await restoreBackup(name);
    setStatus("Восстановлено из бэкапа: " + name);
  }

  async function handleDelete(name: string) {
    await deleteBackup(name);
    setStatus("Бэкап удалён");
    fetchList();
  }

  async function handleUploadS3(e: React.FormEvent) {
    e.preventDefault();
    await uploadBackupS3(s3.name, s3.bucket, s3.aws_key, s3.aws_secret, s3.region);
    setStatus("Выгружено в S3");
    setShowS3(false);
  }

  useEffect(() => { fetchList(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Резервное копирование и восстановление</h1>
      <form onSubmit={handleCreate} className="mb-4 flex gap-2 items-end">
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Метка (опционально)" className="border px-2 py-1 rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Создать бэкап
        </button>
      </form>
      {status && <div className="mb-4 text-green-700">{status}</div>}
      <div className="overflow-auto max-h-[60vh] bg-gray-50 rounded p-2">
        <table className="w-full border text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Файл</th>
              <th className="border px-2 py-1">Действия</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((b, i) => (
              <tr key={i}>
                <td className="border px-2 py-1 font-mono">{b}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button className="bg-green-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleRestore(b)}>
                    Восстановить
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleDelete(b)}>
                    Удалить
                  </button>
                  <button className="bg-blue-800 text-white px-2 py-1 rounded text-xs" onClick={() => { setS3(s => ({ ...s, name: b })); setShowS3(true); }}>
                    В S3
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {backups.length === 0 && <div className="p-4 text-gray-400">Нет бэкапов</div>}
      </div>
      {showS3 && (
        <form onSubmit={handleUploadS3} className="mt-4 bg-gray-200 rounded p-4 flex flex-col gap-2 max-w-lg">
          <div className="font-bold mb-2">Выгрузить в S3</div>
          <input value={s3.bucket} onChange={e => setS3({ ...s3, bucket: e.target.value })} placeholder="S3 bucket" className="border px-2 py-1 rounded" required />
          <input value={s3.aws_key} onChange={e => setS3({ ...s3, aws_key: e.target.value })} placeholder="AWS Key" className="border px-2 py-1 rounded" required />
          <input value={s3.aws_secret} onChange={e => setS3({ ...s3, aws_secret: e.target.value })} placeholder="AWS Secret" className="border px-2 py-1 rounded" required />
          <input value={s3.region} onChange={e => setS3({ ...s3, region: e.target.value })} placeholder="Регион" className="border px-2 py-1 rounded" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
            Выгрузить
          </button>
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowS3(false)} type="button">
            Отмена
          </button>
        </form>
      )}
    </div>
  );
};

export default BackupPage;
