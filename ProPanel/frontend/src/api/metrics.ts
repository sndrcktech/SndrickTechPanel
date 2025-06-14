import axios from "axios";
import { getToken } from "./auth";

export async function queryPrometheus(promql: string) {
  const resp = await axios.get("/api/v1/metrics/query", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { q: promql },
  });
  return resp.data.data;
}

export async function getPrometheusAlerts() {
  const resp = await axios.get("/api/v1/metrics/alerts", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data.data;
}
