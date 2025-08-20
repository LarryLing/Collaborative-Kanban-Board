import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BACKEND_URL } from "./constants";
import type { Card } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function invokeAPI(endpoint: string, method: RequestInit["method"], body?: BodyInit) {
  const credentials: RequestCredentials = "include";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const accessToken: string | null = localStorage.getItem("accessToken");
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${BACKEND_URL.replace(/\/$/, "")}${endpoint}`, {
    method,
    credentials,
    headers,
    body,
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  return response;
}

export function transformCards(cards: Card[] | undefined) {
  if (!cards) return cards;
}
