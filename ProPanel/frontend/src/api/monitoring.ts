import axios from "axios";
import { getToken } from "./auth";

export async function getMonitorStatus() {
  const resp = await axios.get("/api/v1/monitoring/status", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function getMonitorAlerts(since = 0) {
  const resp = await axios.get("/api/v1/monitoring/alerts", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { since }
  });
  return resp.data;
}
