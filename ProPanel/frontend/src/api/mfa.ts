import axios from "axios";
import { getToken } from "./auth";

export async function setupMfa() {
  const resp = await axios.post("/api/v1/mfa/setup", {}, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export function getMfaQrUrl(secret: string) {
  return `/api/v1/mfa/qr?secret=${encodeURIComponent(secret)}`;
}

export async function verifyMfa(secret: string, code: string) {
  const resp = await axios.post("/api/v1/mfa/verify", { secret, code }, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}
