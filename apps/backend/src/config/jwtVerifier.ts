import { CognitoJwtVerifier } from "aws-jwt-verify";

if (!process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_CLIENT_ID) {
  throw new Error("Missing Cognito Environment Variables");
}

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID,
});

export default jwtVerifier;
