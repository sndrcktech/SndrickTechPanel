import axios from "axios";
import { getToken } from "./auth";

export async function getBackups() {
  const resp = await axios.get("/api/v1/backup2/list", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function createBackup() {
  const resp = await axios.post(
    "/api/v1/backup2/create",
    {},
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function downloadBackup(filename: string) {
  window.open(`/api/v1/backup2/download/${encodeURIComponent(filename)}`);
}

export async function uploadToS3(filename: string) {
  const resp = await axios.post(
    "/api/v1/backup2/upload_s3",
    { filename },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function getS3Backups() {
  const resp = await axios.get("/api/v1/backup2/s3list", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function restoreBackup(filename: string) {
  const resp = await axios.post(
    "/api/v1/backup2/restore",
    { filename },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
