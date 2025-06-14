import axios from "axios";
import { getToken } from "./auth";

export async function getFirewallRules() {
  const resp = await axios.get("/api/v1/firewall/", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return resp.data;
}

export async function addFirewallRule(chain: string, proto: string, dport: string, target: string) {
  const resp = await axios.post(
    "/api/v1/firewall/add",
    { chain, proto, dport, target },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}

export async function deleteFirewallRule(chain: string, rule_num: number) {
  const resp = await axios.post(
    "/api/v1/firewall/delete",
    { chain, rule_num },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return resp.data;
}
