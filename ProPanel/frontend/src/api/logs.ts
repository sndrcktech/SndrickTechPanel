import axios from "axios";
import { getToken } from "./auth";

export async function getServiceLog(service: string, lines = 100) {
  const resp = await axios.get("/api/v1/logs/", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { name: service, lines },
  });
  return resp.data.log;
}
