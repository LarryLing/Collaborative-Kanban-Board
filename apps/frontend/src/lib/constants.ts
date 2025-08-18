if (
  !import.meta.env.VITE_EVENTS_ENDPOINT ||
  !import.meta.env.VITE_EVENTS_REGION ||
  !import.meta.env.VITE_EVENTS_DEFAULT_AUTH_MODE ||
  !import.meta.env.VITE_EVENTS_API_KEY
) {
  throw new Error("Missing Events Environment Variables");
}

export const EVENTS_ENDPOINT = import.meta.env.VITE_EVENTS_ENDPOINT as string;
export const EVENTS_REGION = import.meta.env.VITE_EVENTS_REGION as string;
export const EVENTS_DEFAULT_AUTH_MODE = import.meta.env
  .VITE_EVENTS_DEFAULT_AUTH_MODE as "apiKey" | "iam" | "oidc" | "userPool";
export const EVENTS_API_KEY = import.meta.env.VITE_EVENTS_API_KEY as string;

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  ? (import.meta.env.VITE_BACKEND_URL as string)
  : "http://localhost:3000/";

export const OWNER = "Owner" as const;
export const COLLABORATOR = "Collaborator" as const;
export const LIST = "List" as const;
export const CARD = "Card" as const;
