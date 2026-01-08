export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
  userId: string;
};

export type User = {
  id: number;
  fullName: string;
  email: string;
};
