import { EVENTS_ENDPOINT, EVENTS_REGION, EVENTS_DEFAULT_AUTH_MODE, EVENTS_API_KEY } from "@/lib/constants";
import { Amplify } from "aws-amplify";

Amplify.configure({
  API: {
    Events: {
      endpoint: EVENTS_ENDPOINT,
      region: EVENTS_REGION,
      defaultAuthMode: EVENTS_DEFAULT_AUTH_MODE,
      apiKey: EVENTS_API_KEY,
    },
  },
});
