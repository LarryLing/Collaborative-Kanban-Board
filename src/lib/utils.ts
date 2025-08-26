import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { BACKEND_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function invokeAPI(endpoint: string, method: RequestInit["method"], body?: BodyInit) {
  const credentials: RequestCredentials = "include";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const accessToken: null | string = localStorage.getItem("accessToken");
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${BACKEND_URL.replace(/\/$/, "")}${endpoint}`, {
    body,
    credentials,
    headers,
    method,
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  return response;
}
