import axios from "axios";
import { getToken } from "./auth";

export async function getServices() {
  const resp = await axios.get("/api/v1/services/", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function restartService(name: string) {
  const resp = await axios.post(
    `/api/v1/services/restart/${name}`,
    {},
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
