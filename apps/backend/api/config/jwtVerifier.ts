import { CognitoJwtVerifier } from "aws-jwt-verify";

import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from "../constants";

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: COGNITO_CLIENT_ID,
});

export default jwtVerifier;
