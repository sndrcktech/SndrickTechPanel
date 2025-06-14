import axios from "axios";
import { getToken } from "./auth";

export async function getMailDomains() {
  const resp = await axios.get("/api/v1/mail/domains", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function addMailDomain(domain: string) {
  const resp = await axios.post(
    "/api/v1/mail/domains",
    { domain },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function getMailUsers() {
  const resp = await axios.get("/api/v1/mail/users", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function addMailUser(email: string, password: string) {
  const resp = await axios.post(
    "/api/v1/mail/users",
    { email, password },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function issueMailSSL(domain: string) {
  const resp = await axios.post(
    "/api/v1/mail/ssl/issue",
    { domain },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
