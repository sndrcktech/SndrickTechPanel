import axios from "axios";
import { getToken } from "./auth";

export async function listUserCerts() {
  const resp = await axios.get("/api/v1/user_cert/list", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function getUserCert(username: string) {
  const resp = await axios.get("/api/v1/user_cert/get", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { username }
  });
  return resp.data;
}

export async function issueUserCert(username: string, email: string, days: number) {
  const resp = await axios.post(
    "/api/v1/user_cert/issue",
    { username, email, days },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function revokeUserCert(username: string) {
  const resp = await axios.post(
    "/api/v1/user_cert/revoke",
    { username },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
