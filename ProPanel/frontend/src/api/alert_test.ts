import axios from "axios";
import { getToken } from "./auth";

export async function sendAlertTest(event: string, channel: string, params: any, to?: string) {
  const resp = await axios.post(
    "/api/v1/alert_test/send",
    { event, channel, params, to },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
