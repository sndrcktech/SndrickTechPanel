import axios from "axios";
import { getToken } from "./auth";

export async function getCaCert() {
  const resp = await axios.get("/api/v1/ca/ca", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data.ca;
}

export async function listCerts() {
  const resp = await axios.get("/api/v1/ca/list", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function getCert(cn: string) {
  const resp = await axios.get("/api/v1/ca/get", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { cn }
  });
  return resp.data;
}

export async function issueCert(cn: string, days: number) {
  const resp = await axios.post(
    "/api/v1/ca/issue",
    { cn, days },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function initCa(cn: string) {
  const resp = await axios.post(
    "/api/v1/ca/init",
    { cn },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function revokeCert(cn: string) {
  const resp = await axios.post(
    "/api/v1/ca/revoke",
    { cn },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
