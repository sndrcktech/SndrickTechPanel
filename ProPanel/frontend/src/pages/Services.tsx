import React, { useEffect, useState } from "react";
import { getServices, restartService } from "../api/services";

type Service = {
  name: string;
  active: boolean;
};

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [restarting, setRestarting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function fetchServices() {
    try {
      setLoading(true);
      setServices(await getServices());
      setLoading(false);
    } catch (e) {
      setError("Ошибка загрузки статусов сервисов");
    }
  }

  async function handleRestart(name: string) {
    setRestarting(name);
    await restartService(name);
    await fetchServices();
    setRestarting(null);
  }

  useEffect(() => {
    fetchServices();
    const timer = setInterval(fetchServices, 8000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Сервисы системы</h1>
      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Сервис</th>
            <th className="border px-4 py-2">Статус</th>
            <th className="border px-4 py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {services.map((svc) => (
            <tr key={svc.name}>
              <td className="border px-4 py-2">{svc.name}</td>
              <td className="border px-4 py-2">
                {svc.active ? (
                  <span className="text-green-600 font-bold">Active</span>
                ) : (
                  <span className="text-red-600 font-bold">Inactive</span>
                )}
              </td>
              <td className="border px-4 py-2">
                <button
                  className={`px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 ${
                    restarting === svc.name ? "opacity-50 cursor-wait" : ""
                  }`}
                  onClick={() => handleRestart(svc.name)}
                  disabled={restarting === svc.name}
                >
                  {restarting === svc.name ? "Рестарт..." : "Рестарт"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Services;
