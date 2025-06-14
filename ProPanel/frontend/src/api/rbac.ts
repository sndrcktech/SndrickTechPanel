import axios from "axios";
import { getToken } from "./auth";

export async function getUsers() {
  const resp = await axios.get("/api/v1/rbac/users", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function addUser(user: any) {
  const resp = await axios.post(
    "/api/v1/rbac/users/add",
    user,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function deleteUser(username: string) {
  const resp = await axios.post(
    "/api/v1/rbac/users/delete",
    { username },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function getRoles() {
  const resp = await axios.get("/api/v1/rbac/roles", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function addRole(role: any) {
  const resp = await axios.post(
    "/api/v1/rbac/roles/add",
    role,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function deleteRole(name: string) {
  const resp = await axios.post(
    "/api/v1/rbac/roles/delete",
    { name },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function updateRole(role: any) {
  const resp = await axios.post(
    "/api/v1/rbac/roles/update",
    role,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
