export interface User {
  id: string;
  name: string;
  email: string;
}
export interface Credentials {
  email: string;
  password: string;
}
export interface ResetRequest {
  token: string;
  password: string;
}
export interface ResetResponse {
  message: string;
  demoLink: string;
}
