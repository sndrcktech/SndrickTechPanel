import axios from "axios";
import { getToken } from "./auth";

export async function getWebhooks() {
  const resp = await axios.get("/api/v1/webhooks/", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function addWebhook(data: any) {
  const resp = await axios.post(
    "/api/v1/webhooks/add",
    data,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function deleteWebhook(index: number) {
  const resp = await axios.post(
    "/api/v1/webhooks/delete",
    { index },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function sendWebhook(index: number, payload: any) {
  const resp = await axios.post(
    "/api/v1/webhooks/send",
    { index, payload },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
