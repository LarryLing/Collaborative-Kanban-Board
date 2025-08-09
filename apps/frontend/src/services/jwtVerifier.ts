import { CognitoJwtVerifier } from "aws-jwt-verify";

if (
  !import.meta.env.VITE_COGNITO_USER_POOL_ID ||
  !import.meta.env.VITE_COGNITO_CLIENT_ID
) {
  throw new Error("Missing Cognito Environment Variables");
}

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
});

export default jwtVerifier;
