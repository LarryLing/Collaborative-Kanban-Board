import { Amplify } from "aws-amplify";

if (
  !import.meta.env.VITE_EVENTS_ENDPOINT ||
  !import.meta.env.VITE_EVENTS_REGION ||
  !import.meta.env.VITE_EVENTS_DEFAULT_AUTH_MODE ||
  !import.meta.env.VITE_EVENTS_API_KEY
) {
  throw new Error("Missing Events Environment Variables");
}

Amplify.configure({
  API: {
    Events: {
      endpoint: import.meta.env.VITE_EVENTS_ENDPOINT,
      region: import.meta.env.VITE_EVENTS_REGION,
      defaultAuthMode: import.meta.env.VITE_EVENTS_DEFAULT_AUTH_MODE,
      apiKey: import.meta.env.VITE_EVENTS_API_KEY,
    },
  },
});
