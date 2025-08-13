import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BACKEND_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildUrl(endpoint: string) {
  return `${BACKEND_URL.replace(/\/$/, "")}${endpoint}`;
}
