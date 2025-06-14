import axios from "axios";
import { getToken } from "./auth";

export async function getSettings() {
  const resp = await axios.get("/api/v1/settings/", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function setSettings(data: any) {
  const resp = await axios.post(
    "/api/v1/settings/",
    data,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
