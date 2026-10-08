import axios from "axios";
import { fakeAdapter } from "./fake/adapter";
export const client = axios.create({
  baseURL: "/api",
  timeout: 10000,
  adapter: fakeAdapter,
});
