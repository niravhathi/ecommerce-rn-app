// src/api/APIConstants.ts

export const APIConstant = {
  BASE_URL: "https://dummyjson.com", // Base URL'https://dummyjson.com/products'https://api.escuelajs.co/api/v1
  PRODUCTS: "/products", // Products endpoint
  PRODUCT_BY_ID: (id: number) => `/products/${id}`, // Product details by ID
  CATEGORY: "/products/categories", // Categories endpoint
  PRODUCT_FILTER: (filters: Record<string, any>) => {
    let url = "/products?";
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        url += `${key}=${value}&`;
      }
    }
    return url.slice(0, -1); // Removes trailing '&'
  },
  PRODUCT_SORT: (category?: string, sort?: string, order?: string) => {
    if (category) {
      return `/products/category/${category.replace(
        /\s+/g,
        "-"
      )}?sortBy=${sort}&order=${order || "asc"}`;
    }
    return `/products?sortBy=${sort}&order=${order || "asc"}`;
  },
  PRODUCT_SEARCH_BY_CATEGORY: (category: string) =>
    `/products/category/${category.replace(/\s+/g, "-")}`, // Products by category
  AUTH_LOGIN: "/user/login",
  AUTH_PROFILE: "/auth/profile",
  RECIPES: "/recipes",
  REGISTER_USER: "/user/add",
};
