import axios from "axios";
import { getToken } from "./auth";

export async function getAlertMatrixRBAC() {
  const resp = await axios.get("/api/v1/alert_matrix_rbac/", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function setAlertMatrixRBAC(matrix: any) {
  const resp = await axios.post(
    "/api/v1/alert_matrix_rbac/",
    matrix,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function muteAlertRBAC(payload: any) {
  const resp = await axios.post(
    "/api/v1/alert_matrix_rbac/mute",
    payload,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function unmuteAlertRBAC(payload: any) {
  const resp = await axios.post(
    "/api/v1/alert_matrix_rbac/unmute",
    payload,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
