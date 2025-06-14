import axios from "axios";
import { getToken } from "./auth";

export async function listVpnClients() {
  const resp = await axios.get("/api/v1/vpn/clients", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function createVpnClient(name: string, email: string) {
  const resp = await axios.post(
    "/api/v1/vpn/create_client",
    { name, email },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function downloadOvpn(name: string) {
  const resp = await axios.get("/api/v1/vpn/download", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { name }
  });
  return resp.data;
}

export async function revokeVpnClient(name: string) {
  const resp = await axios.post(
    "/api/v1/vpn/revoke",
    { name },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
