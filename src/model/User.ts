export interface User {
  id?: number; // Optional during creation
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role?: "customer" | "admin"; // optional if default is 'customer'
  accessToken?: string;
  refreshToken?: string;
}
