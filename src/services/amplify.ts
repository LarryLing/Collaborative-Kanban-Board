import { Amplify } from "aws-amplify";

import { EVENTS_API_KEY, EVENTS_DEFAULT_AUTH_MODE, EVENTS_ENDPOINT, EVENTS_REGION } from "@/lib/constants";

Amplify.configure({
  API: {
    Events: {
      apiKey: EVENTS_API_KEY,
      defaultAuthMode: EVENTS_DEFAULT_AUTH_MODE,
      endpoint: EVENTS_ENDPOINT,
      region: EVENTS_REGION,
    },
  },
});
