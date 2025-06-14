import axios from "axios";
import { getToken } from "./auth";

export async function promQuery(query: string) {
  const resp = await axios.get("/api/v1/prometheus/query", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { query },
  });
  return resp.data;
}

export async function getAlerts() {
  const resp = await axios.get("/api/v1/prometheus/alerts", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}
