import axios from "axios";

export async function uploadLogo(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  await axios.post("/api/v1/ui/logo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function getLogoUrl() {
  return "/api/v1/ui/logo";
}
