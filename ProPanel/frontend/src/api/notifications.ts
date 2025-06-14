import axios from "axios";
import { getToken } from "./auth";

export async function getNotifyConfig() {
  const resp = await axios.get("/api/v1/notifications/config", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function setNotifyConfig(cfg: any) {
  const resp = await axios.post(
    "/api/v1/notifications/config",
    cfg,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function telegramTest(message: string) {
  const resp = await axios.post(
    "/api/v1/notifications/telegram_test",
    { message },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function getNotifyLog(limit = 100) {
  const resp = await axios.get("/api/v1/notifications/log", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { limit }
  });
  return resp.data;
}
