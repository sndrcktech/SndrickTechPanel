import axios from "axios";
import { getToken } from "./auth";

export async function getMailCertStatus() {
  const resp = await axios.get("/api/v1/mail_cert/status", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function issueMailCert(cn: string, days: number) {
  const resp = await axios.post(
    "/api/v1/mail_cert/issue",
    { cn, days },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
