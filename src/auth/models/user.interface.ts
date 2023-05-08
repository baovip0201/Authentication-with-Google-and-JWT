export interface User {
  id?: number;
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  displayName?: string;
  createdAt?: Date;
  role?: string;
}
