import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "/mock-api",
  timeout: 2500,
});
