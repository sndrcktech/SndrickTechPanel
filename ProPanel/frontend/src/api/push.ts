import axios from "axios";
import { getToken } from "./auth";

export async function getVapidPublicKey() {
  const resp = await axios.get("/api/v1/push/vapid");
  return resp.data.publicKey;
}

export async function subscribePush(sub: any) {
  const resp = await axios.post(
    "/api/v1/push/subscribe",
    sub,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function sendPush(message: string) {
  const resp = await axios.post(
    "/api/v1/push/send",
    { message },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
