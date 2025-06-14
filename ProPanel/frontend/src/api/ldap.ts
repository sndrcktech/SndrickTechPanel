import axios from "axios";
import { getToken } from "./auth";

export async function getLdapUsers() {
  const resp = await axios.get("/api/v1/ldap/users", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function addLdapUser(user: { uid: string, cn: string, sn: string, userPassword: string }) {
  const resp = await axios.post(
    "/api/v1/ldap/users",
    user,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function getLdapGroups() {
  const resp = await axios.get("/api/v1/ldap/groups", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function addLdapGroup(group: { cn: string }) {
  const resp = await axios.post(
    "/api/v1/ldap/groups",
    group,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function addUserToGroup(group: string, uid: string) {
  const resp = await axios.post(
    "/api/v1/ldap/groups/adduser",
    { group, uid },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
