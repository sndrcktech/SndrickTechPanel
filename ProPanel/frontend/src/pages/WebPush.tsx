import React, { useEffect, useState } from "react";
import { getWebPushPublicKey, subscribeWebPush, unsubscribeWebPush } from "../api/webpush";

const WebPushPage: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [info, setInfo] = useState("");

  async function doSubscribe() {
    if (!("serviceWorker" in navigator)) return;
    const reg = await navigator.serviceWorker.register("/service-worker.js");
    const key = await getWebPushPublicKey();
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key)
    });
    await subscribeWebPush(sub.toJSON());
    setSubscribed(true);
    setInfo("Подписка оформлена");
  }

  async function doUnsubscribe() {
    if (!("serviceWorker" in navigator)) return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await unsubscribeWebPush(sub.toJSON());
      await sub.unsubscribe();
      setSubscribed(false);
      setInfo("Подписка удалена");
    }
  }

  useEffect(() => {
    (async () => {
      if (!("serviceWorker" in navigator)) return;
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setSubscribed(!!sub);
    })();
  }, []);

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const raw = window.atob(base64);
    const output = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
    return output;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Web Push / PWA уведомления</h1>
      <div className="mb-4">
        {subscribed ? (
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={doUnsubscribe}>
            Отписаться
          </button>
        ) : (
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={doSubscribe}>
            Подписаться на Push
          </button>
        )}
      </div>
      {info && <div className="text-green-700">{info}</div>}
      <div className="mt-6 text-sm text-gray-500">
        После подписки уведомления будут приходить даже при закрытом браузере/экране.<br />
        <b>Важно:</b> разрешите уведомления для сайта!
      </div>
    </div>
  );
};

export default WebPushPage;
