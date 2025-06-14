import axios from "axios";
import { getToken } from "./auth";

export async function sendTelegram(message: string) {
  const resp = await axios.post(
    "/api/v1/notify/",
    { message },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
