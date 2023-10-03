import { api } from "./apiClient";

export function getCustomerInfo() {
  return api.get("customer");
}

//TODO: just here for reference in passing content in
export function login({ email, password }) {
  return api.post("auth/login", { email, password }, { authorization: false });
}
