import axios from "axios";
import { getToken } from "./auth";

export async function getSystemStats() {
  const resp = await axios.get("/api/v1/stats/system", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}
