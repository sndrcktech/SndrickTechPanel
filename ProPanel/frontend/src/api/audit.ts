import axios from "axios";
import { getToken } from "./auth";

export async function getAuditLog(params: { user?: string; action?: string; after?: number; before?: number }) {
  const resp = await axios.get("/api/v1/audit/", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params,
  });
  return resp.data;
}
