import axios from "axios";
import { getToken } from "./auth";

export async function getAlertTestLog(params: { event?: string; channel?: string; user?: string; after?: number; before?: number; limit?: number }) {
  const resp = await axios.get("/api/v1/alert_test_log/", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params,
  });
  return resp.data;
}

// ... (предыдущие импорты)
export async function repeatAlertTest(ts: number) {
  const resp = await axios.post(
    "/api/v1/alert_test_log/repeat",
    { ts },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function purgeAlertTestLog(before: number) {
  const resp = await axios.post(
    "/api/v1/alert_test_log/purge",
    { before },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
