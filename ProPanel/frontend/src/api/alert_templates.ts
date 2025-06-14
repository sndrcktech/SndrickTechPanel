import axios from "axios";
import { getToken } from "./auth";

export async function getAlertTemplates() {
  const resp = await axios.get("/api/v1/alert_templates/", {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return resp.data;
}

export async function setAlertTemplates(templates: any) {
  const resp = await axios.post(
    "/api/v1/alert_templates/",
    templates,
    { headers: { Authorization: `Bearer ${getToken()}` }
  });
  return resp.data;
}
