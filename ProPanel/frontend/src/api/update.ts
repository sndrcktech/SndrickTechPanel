import axios from "axios";
import { getToken } from "./auth";

export async function checkUpdate() {
  const resp = await axios.get("/api/v1/update/check", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function doUpgrade() {
  const resp = await axios.post(
    "/api/v1/update/upgrade",
    {},
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
