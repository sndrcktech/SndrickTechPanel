import axios from "axios";
import { getToken } from "./auth";

export async function getAvHistory() {
  const resp = await axios.get("/api/v1/antivirus/history", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function avScan(path: string, engine: string) {
  const resp = await axios.post(
    "/api/v1/antivirus/scan",
    { path, engine },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function getAvReport(filename: string) {
  const resp = await axios.get("/api/v1/antivirus/report", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { filename },
  });
  return resp.data.report;
}
