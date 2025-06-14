import axios from "axios";
import { getToken } from "./auth";

export async function listWpSites() {
  const resp = await axios.get("/api/v1/wordpress/list", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function installWp(domain: string) {
  const resp = await axios.post(
    "/api/v1/wordpress/install",
    { domain },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function deleteWp(domain: string) {
  const resp = await axios.post(
    "/api/v1/wordpress/delete",
    { domain },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
