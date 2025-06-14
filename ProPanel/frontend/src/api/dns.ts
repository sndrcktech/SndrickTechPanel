import axios from "axios";
import { getToken } from "./auth";

export async function getZones() {
  const resp = await axios.get("/api/v1/dns/zones", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function getRecords(zone_id: string) {
  const resp = await axios.get("/api/v1/dns/records", {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { zone_id }
  });
  return resp.data;
}

export async function addRecord(zone_id: string, type: string, name: string, content: string) {
  const resp = await axios.post(
    "/api/v1/dns/add",
    { zone_id, type, name, content },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function deleteRecord(zone_id: string, record_id: string) {
  const resp = await axios.post(
    "/api/v1/dns/delete",
    { zone_id, record_id },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
