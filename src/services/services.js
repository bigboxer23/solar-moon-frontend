import { api } from "./apiClient";

export function getCustomer() {
  return api.get("customer");
}

export function updateCustomer(customerData) {
  return api.post("customer", customerData);
}

//TODO: just here for reference in passing content in
export function login({ email, password }) {
  return api.post("auth/login", { email, password }, { authorization: false });
}
