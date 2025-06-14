import axios from "axios";
import { getToken } from "./auth";

export async function getLogList() {
  const resp = await axios.get("/api/v1/logs_adv/list", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function tailLog(log: string, lines = 200, filter = "") {
  const resp = await axios.get("/api/v1/logs_adv/tail", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { log, lines, filter },
  });
  return resp.data;
}
