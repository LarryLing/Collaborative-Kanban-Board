import { Request } from "express";
import { RowDataPacket } from "mysql2/promise";
import {
  AuthFlowType,
  GetTokensFromRefreshTokenCommand,
  AdminUserGlobalSignOutCommand,
  AdminInitiateAuthCommand,
  AdminDeleteUserCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { jwtDecode } from "jwt-decode";

import cognito from "../config/cognito.js";
import db from "../config/db.js";
import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from "../constants.js";
import {
  AuthRequest,
  PasswordResetBody,
  ConfirmSignUpBody,
  SignUpBody,
  RequestConfirmationCode,
  LoginBody,
  IDTokenPayload,
  Response,
} from "../types.js";

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.auth) {
      console.error("Failed to get user: User is not authorized to make request");

      res.status(401).json({
        message: "Failed to get user",
        error: "User is not authorized to make request",
      });

      return;
    }

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      console.error("Failed to get user: Refresh token not found in cookies");

      res.status(401).json({
        message: "Failed to get user",
        error: "Refresh token not found in cookies",
      });

      return;
    }

    const getTokensFromRefreshTokenCommand = new GetTokensFromRefreshTokenCommand({
      ClientId: COGNITO_CLIENT_ID,
      RefreshToken: refreshToken,
    });

    const getTokensFromRefreshTokenResponse = await cognito.send(getTokensFromRefreshTokenCommand);

    if (!getTokensFromRefreshTokenResponse.AuthenticationResult) {
      throw new Error("Could not regenerate tokens with the provided refresh token");
    }

    const { IdToken, AccessToken, RefreshToken } = getTokensFromRefreshTokenResponse.AuthenticationResult;

    if (!IdToken || !AccessToken || !RefreshToken) {
      throw new Error("User pool tokens were not generated");
    }

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Successfully regenerated tokens",
      data: {
        idToken: IdToken,
        accessToken: AccessToken,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to get user:", errorMessage);

    res.status(401).json({
      message: "Failed to get user",
      error: errorMessage,
    });
  }
}

export async function resetPassword(req: Request<object, object, PasswordResetBody>, res: Response) {
  try {
    const { email, password, confirmationCode } = req.body;

    const confirmForgotPasswordCommand = new ConfirmForgotPasswordCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: password,
    });

    await cognito.send(confirmForgotPasswordCommand);

    res.status(200).json({ message: "Successfully reset password" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to reset password:", errorMessage);

    res.status(500).json({
      message: "Failed to reset password",
      error: errorMessage,
    });
  }
}

export async function confirmSignUp(req: Request<object, object, ConfirmSignUpBody>, res: Response) {
  try {
    const { email, confirmationCode } = req.body;

    const confirmSignUpCommand = new ConfirmSignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
    });

    await cognito.send(confirmSignUpCommand);

    res.status(200).json({ message: "Successfully confirmed sign up" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to confirm sign up:", errorMessage);

    res.status(500).json({
      message: "Failed to confirm sign up",
      error: errorMessage,
    });
  }
}

export async function signUp(req: Request<object, object, SignUpBody>, res: Response) {
  try {
    const { given_name, family_name, email, password } = req.body;

    const signUpCommand = new SignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "given_name",
          Value: given_name,
        },
        {
          Name: "family_name",
          Value: family_name,
        },
        {
          Name: "email",
          Value: email,
        },
      ],
    });

    await cognito.send(signUpCommand);

    const now = new Date();
    const currentTimestamp = now.toISOString().slice(0, 19).replace("T", " ");

    await db.execute(
      `INSERT INTO users (id, given_name, family_name, email, created_at)
      VALUES (?, ?, ?, ?, ?)`,
      [email, given_name, family_name, email, currentTimestamp],
    );

    res.status(201).json({ message: "Successfully signed up new user" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to sign up new user:", errorMessage);

    res.status(500).json({
      message: "Failed to sign up new user",
      error: errorMessage,
    });
  }
}

export async function resendSignUp(req: Request<object, object, RequestConfirmationCode>, res: Response) {
  try {
    const { email } = req.body;

    const resendConfirmationCodeCommand = new ResendConfirmationCodeCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
    });

    await cognito.send(resendConfirmationCodeCommand);

    res.status(200).json({ message: "Successfully resent sign up confirmation code" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to resend sign up confirmation code:", errorMessage);

    res.status(500).json({
      message: "Failed to resend sign up confirmation code",
      error: errorMessage,
    });
  }
}

export async function login(req: Request<object, object, LoginBody>, res: Response) {
  try {
    const { email, password } = req.body;

    const adminInitiateAuthCommand = new AdminInitiateAuthCommand({
      UserPoolId: COGNITO_USER_POOL_ID,
      ClientId: COGNITO_CLIENT_ID,
      AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const adminInitiateAuthResponse = await cognito.send(adminInitiateAuthCommand);

    if (!adminInitiateAuthResponse.AuthenticationResult) {
      throw new Error("Authentication failed");
    }

    const { IdToken, AccessToken, RefreshToken } = adminInitiateAuthResponse.AuthenticationResult;

    if (!IdToken || !AccessToken || !RefreshToken) {
      throw new Error("User pool tokens were not generated");
    }

    const { sub, email: userEmail, given_name, family_name } = jwtDecode<IDTokenPayload>(IdToken);

    const [userRows] = await db.execute<RowDataPacket[]>(
      `SELECT *
      FROM users
      WHERE id = ?
      LIMIT 1`,
      [sub],
    );

    if (!userRows || userRows.length === 0) {
      const now = new Date();
      const currentTimestamp = now.toISOString().slice(0, 19).replace("T", " ");

      await db.execute(
        `INSERT INTO users (id, given_name, family_name, email, created_at)
        VALUES (?, ?, ?, ?, ?)`,
        [sub, given_name, family_name, userEmail, currentTimestamp],
      );
    }

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Successfully logged in returning user",
      data: {
        idToken: IdToken,
        accessToken: AccessToken,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to login returning user:", errorMessage);

    res.status(500).json({
      message: "Failed to login returning user",
      error: errorMessage,
    });
  }
}

export async function logout(req: AuthRequest, res: Response) {
  try {
    if (!req.auth) {
      console.error("Failed to logout user: User is not authorized to make request");

      res.status(401).json({
        message: "Failed to logout user",
        error: "User is not authorized to make request",
      });

      return;
    }

    const { id } = req.auth;

    const adminUserGlobalSignOutCommand = new AdminUserGlobalSignOutCommand({
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: id,
    });

    await cognito.send(adminUserGlobalSignOutCommand);

    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Successfully logged out user" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to logout user:", errorMessage);

    res.status(500).json({
      message: "Failed to logout user",
      error: errorMessage,
    });
  }
}

export async function requestPasswordReset(req: AuthRequest<object, object, RequestConfirmationCode>, res: Response) {
  try {
    const { email } = req.body;

    const forgotPasswordCommand = new ForgotPasswordCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
    });

    await cognito.send(forgotPasswordCommand);

    res.status(200).json({ message: "Successfully requested password reset" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to request password reset:", errorMessage);

    res.status(500).json({
      message: "Failed to request password reset",
      error: errorMessage,
    });
  }
}

export async function deleteUser(req: AuthRequest, res: Response) {
  try {
    if (!req.auth) {
      console.error("Failed to delete user: User is not authorized to make request");

      res.status(401).json({
        message: "Failed to delete user",
        error: "User is not authorized to make request",
      });

      return;
    }

    const { id } = req.auth;

    const adminDeleteUserCommand = new AdminDeleteUserCommand({
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: id,
    });

    await cognito.send(adminDeleteUserCommand);

    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Successfully deleted user" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to delete user:", errorMessage);

    res.status(500).json({
      message: "Failed to delete user",
      error: errorMessage,
    });
  }
}
