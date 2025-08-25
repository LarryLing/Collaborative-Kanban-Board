import { CognitoJwtVerifier } from "aws-jwt-verify";

import { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID } from "../constants";

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: COGNITO_CLIENT_ID,
});

export default jwtVerifier;
