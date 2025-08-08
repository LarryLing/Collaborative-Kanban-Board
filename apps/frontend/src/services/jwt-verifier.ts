import { CognitoJwtVerifier } from "aws-jwt-verify";

if (
  !import.meta.env.VITE_COGNITO_USER_POOL_ID ||
  !import.meta.env.VITE_COGNITO_CLIENT_ID
) {
  throw new Error("Missing Cognito Environment Variables");
}

export const verifier = CognitoJwtVerifier.create({
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  tokenUse: "id",
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
});
