if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("Missing AWS environment variables!");
}

export const AWS_REGION = process.env.AWS_REGION;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (
  !process.env.RDS_HOSTNAME ||
  !process.env.RDS_USERNAME ||
  !process.env.RDS_PASSWORD ||
  !process.env.RDS_PORT ||
  !process.env.RDS_DB_NAME
) {
  throw new Error("Missing RDS environment variables!");
}

export const RDS_HOSTNAME = process.env.RDS_HOSTNAME;
export const RDS_USERNAME = process.env.RDS_USERNAME;
export const RDS_PASSWORD = process.env.RDS_PASSWORD;
export const RDS_PORT = Number(process.env.RDS_PORT);
export const RDS_DB_NAME = process.env.RDS_DB_NAME;

if (!process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_CLIENT_ID) {
  throw new Error("Missing Cognito Environment Variables");
}

export const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
export const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

export const PORT = Number(process.env.PORT) || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const OWNER = "Owner" as const;
export const COLLABORATOR = "Collaborator" as const;
