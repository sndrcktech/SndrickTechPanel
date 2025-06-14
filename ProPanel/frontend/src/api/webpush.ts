export async function subscribeWebPush(subscription: any) {
  const resp = await fetch("/api/v1/webpush/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription)
  });
  return resp.json();
}

export async function unsubscribeWebPush(subscription: any) {
  const resp = await fetch("/api/v1/webpush/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription)
  });
  return resp.json();
}

export async function getWebPushPublicKey() {
  const resp = await fetch("/api/v1/webpush/public_key");
  return (await resp.json()).publicKey;
}
