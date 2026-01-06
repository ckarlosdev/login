export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
  userId: string;
};
