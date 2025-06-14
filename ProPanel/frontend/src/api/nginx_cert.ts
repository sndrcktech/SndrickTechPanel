import axios from "axios";
import { getToken } from "./auth";

export async function nginxCertStatus(cn: string) {
  const resp = await axios.get("/api/v1/nginx_cert/status", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { cn }
  });
  return resp.data;
}

export async function issueNginxCert(cn: string, days: number) {
  const resp = await axios.post(
    "/api/v1/nginx_cert/issue",
    { cn, days },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
