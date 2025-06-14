import axios from "axios";
import { getToken } from "./auth";

export async function certsList() {
  const resp = await axios.get("/api/v1/cert_manager/list", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function renewAll(types?: string[]) {
  const resp = await axios.post(
    "/api/v1/cert_manager/renew",
    { types },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function importCerts(table: any[]) {
  const resp = await axios.post(
    "/api/v1/cert_manager/import",
    table,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function exportCerts() {
  const resp = await axios.get("/api/v1/cert_manager/export", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}
