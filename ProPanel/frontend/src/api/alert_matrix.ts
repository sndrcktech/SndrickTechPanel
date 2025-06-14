import axios from "axios";
import { getToken } from "./auth";

export async function getAlertMatrix() {
  const resp = await axios.get("/api/v1/alert_matrix/", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function setAlertMatrix(matrix: any) {
  const resp = await axios.post(
    "/api/v1/alert_matrix/",
    matrix,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
