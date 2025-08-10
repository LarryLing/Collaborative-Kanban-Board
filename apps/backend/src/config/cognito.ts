import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

if (
  !process.env.AWS_REGION ||
  !process.env.AWS_ACCESS_KEY ||
  !process.env.AWS_SECRET_ACCESS_KEY
) {
  throw new Error("Missing AWS environment variables!");
}

const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default cognito;
