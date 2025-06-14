import axios from "axios";
import { getToken } from "./auth";

export async function createBackup(label?: string) {
  const resp = await axios.post(
    "/api/v1/backup/create",
    { label },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function listBackups() {
  const resp = await axios.get("/api/v1/backup/list", {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return resp.data;
}

export async function restoreBackup(name: string) {
  const resp = await axios.post(
    "/api/v1/backup/restore",
    { name },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function deleteBackup(name: string) {
  const resp = await axios.post(
    "/api/v1/backup/delete",
    { name },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function uploadBackupS3(name: string, bucket: string, aws_key: string, aws_secret: string, region = "us-east-1") {
  const resp = await axios.post(
    "/api/v1/backup/upload_s3",
    { name, bucket, aws_key, aws_secret, region },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
