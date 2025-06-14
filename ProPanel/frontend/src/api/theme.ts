import axios from "axios";
import { getToken } from "./auth";

export async function getTheme() {
  const resp = await axios.get("/api/v1/theme/theme");
  return resp.data.theme;
}

export async function setTheme(theme: string) {
  const resp = await axios.post(
    "/api/v1/theme/theme",
    { theme },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function uploadLogo(file: File) {
  const data = new FormData();
  data.append("file", file);
  const resp = await axios.post("/api/v1/theme/logo", data, {
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data"
    },
  });
  return resp.data;
}

export function getLogoUrl() {
  return "/api/v1/theme/logo";
}
