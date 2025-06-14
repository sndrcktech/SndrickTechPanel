import axios from "axios";
import { getToken } from "./auth";

export async function listAgents() {
  const resp = await axios.get("/api/v1/agents/list", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function unregisterAgent(id: string) {
  const resp = await axios.post(
    "/api/v1/agents/unregister",
    { id },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
