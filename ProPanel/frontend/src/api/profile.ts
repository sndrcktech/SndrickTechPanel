import axios from "axios";
import { getToken } from "./auth";

export async function changePassword(old_password: string, new_password: string) {
  const resp = await axios.post(
    "/api/v1/profile/change_password",
    { old_password, new_password },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
