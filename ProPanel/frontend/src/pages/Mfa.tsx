import React, { useState } from "react";
import { setupMfa, getMfaQrUrl, verifyMfa } from "../api/mfa";

const Mfa: React.FC = () => {
  const [secret, setSecret] = useState("");
  const [otpUri, setOtpUri] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");

  async function handleSetup() {
    setStatus("");
    const { secret, otp_uri } = await setupMfa();
    setSecret(secret);
    setOtpUri(otp_uri);
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    try {
      await verifyMfa(secret, code);
      setStatus("Код корректный! MFA активирован.");
    } catch {
      setStatus("Код неверен!");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Двухфакторная аутентификация</h2>
      <button
        className="bg-blue-600 text-white py-2 px-4 rounded mb-4"
        onClick={handleSetup}
      >
        Сгенерировать QR и ключ
      </button>
      {secret && (
        <div className="mb-4">
          <div className="mb-2">Ключ: <code>{secret}</code></div>
          <img src={getMfaQrUrl(secret)} alt="QR" className="mb-2" />
          <div>
            <form onSubmit={handleVerify} className="flex gap-2 items-end">
              <input
                className="border px-2 py-1 rounded"
                placeholder="Код из приложения"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                type="submit"
              >
                Проверить
              </button>
            </form>
          </div>
        </div>
      )}
      {status && <div className="mt-2 text-green-700">{status}</div>}
    </div>
  );
};

export default Mfa;
