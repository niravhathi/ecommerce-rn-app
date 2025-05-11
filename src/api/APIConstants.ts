// src/api/APIConstants.ts

export const APIConstant = {
  BASE_URL: "https://api.escuelajs.co/api/v1", // Base URL
  PRODUCTS: "/products?limit=100&offset=10", // Products endpoint
  PRODUCT_BY_ID: (id: number) => `/products/${id}`, // Product details by ID
  CATEGORY: "/categories", // Categories endpoint
  PRODUCT_FILTER: (filters: Record<string, any>) => {
    let url = "/products?";
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        url += `${key}=${value}&`;
      }
    }
    return url.slice(0, -1); // Removes trailing '&'
  },
  AUTH_LOGIN: "/auth/login",
  AUTH_PROFILE: "/auth/profile",
};
