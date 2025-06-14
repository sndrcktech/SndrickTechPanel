import axios from "axios";
import { getToken } from "./auth";

export async function letsencryptCertStatus(domain: string) {
  const resp = await axios.get("/api/v1/letsencrypt/status", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { domain }
  });
  return resp.data;
}

export async function issueLetsencryptCert(domain: string, wildcard: boolean, dns_provider: string) {
  const resp = await axios.post(
    "/api/v1/letsencrypt/issue",
    { domain, wildcard, dns_provider },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
