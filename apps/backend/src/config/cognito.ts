import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

if (!process.env.AWS_REGION) {
  throw new Error("Missing AWS environment variables!");
}

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export default client;
