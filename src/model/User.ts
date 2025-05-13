export interface User {
  id?: number; // Optional during creation
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  image: string;
  role?: "customer" | "admin"; // optional if default is 'customer'
  accessToken?: string;
  refreshToken?: string;
  username: string;
  gender: string;
  birthDate?: string; // Optional if not provided by new JSON
  phone?: string; // Optional if not provided by new JSON
}
