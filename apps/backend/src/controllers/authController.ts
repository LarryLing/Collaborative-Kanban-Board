import type { Response, Request } from "express";
import type {
  AuthRequest,
  LoginBody,
  RequestConfirmationCode,
  PasswordResetBody,
  SignUpBody,
  User,
  IDTokenPayload,
  ConfirmSignUpBody,
} from "../types";
import { RowDataPacket, type ResultSetHeader } from "mysql2/promise";
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
import cognito from "../config/cognito";
import db from "../config/db";
import { jwtDecode } from "jwt-decode";
import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from "../constants";

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
    const { email, confirmationCode, password } = req.body;

    const confirmForgotPasswordConfirm = new ConfirmForgotPasswordCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: password,
    });

    await cognito.send(confirmForgotPasswordConfirm);

    res.status(200).json({
      message: "Successfully reset password",
    });
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
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
    });

    await cognito.send(confirmSignUpCommand);

    res.status(200).json({
      message: "Successfully logged in new user",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to login new user:", errorMessage);

    res.status(500).json({
      message: "Failed to login new user",
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
          Name: "email",
          Value: email,
        },
        {
          Name: "given_name",
          Value: given_name,
        },
        {
          Name: "family_name",
          Value: family_name,
        },
      ],
    });

    const signUpResponse = await cognito.send(signUpCommand);

    const { UserSub } = signUpResponse;

    if (!UserSub) {
      throw new Error("User ID was not generated");
    }

    res.status(201).json({
      message: "Successfully signed up new user",
    });
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
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
    });

    await cognito.send(resendConfirmationCodeCommand);

    res.status(200).json({
      message: "Successfully resent sign up confirmation code",
    });
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
    const admininitiateAuthCommand = new AdminInitiateAuthCommand({
      UserPoolId: COGNITO_USER_POOL_ID,
      ClientId: COGNITO_CLIENT_ID,
      AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const initiateAuthResponse = await cognito.send(admininitiateAuthCommand);

    if (!initiateAuthResponse.AuthenticationResult) {
      throw new Error("Could not initiate auth with the provided credentials");
    }

    const { IdToken, AccessToken, RefreshToken } = initiateAuthResponse.AuthenticationResult;

    if (!IdToken || !AccessToken || !RefreshToken) {
      throw new Error("User pool tokens were not generated");
    }

    const { sub, given_name, family_name } = jwtDecode<IDTokenPayload>(IdToken);

    const [rows] = await db.execute(
      `SELECT 1
      FROM users
      WHERE id = ?`,
      [sub],
    );

    if (!rows || (rows as User[]).length === 0) {
      await db.execute(
        `INSERT INTO users (id, given_name, family_name, email)
        VALUES (?, ?, ?, ?)`,
        [sub, given_name, family_name, email],
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

    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT email
      FROM users
      WHERE id = ?`,
      [id],
    );

    if (!rows || rows.length === 0) {
      res.status(404).json({
        message: "Failed to logout user",
        error: "Could not find user email in database",
      });
    }

    const adminUserGlobalSignOutCommand = new AdminUserGlobalSignOutCommand({
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: rows[0].email as User["email"],
    });

    await cognito.send(adminUserGlobalSignOutCommand);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to logout user", errorMessage);

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

    res.status(200).json({
      message: "Successfully request password reset",
    });
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

    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT email
      FROM users
      WHERE id = ?`,
      [id],
    );

    if (!rows || rows.length === 0) {
      res.status(404).json({
        message: "Failed to delete user",
        error: "Could not find user email in database",
      });
    }

    const adminDeleteUserCommand = new AdminDeleteUserCommand({
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: rows[0].email as User["email"],
    });

    await cognito.send(adminDeleteUserCommand);

    await db.execute<ResultSetHeader>(
      `DELETE FROM users
      WHERE id = ?`,
      [id],
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Successfully deleted user" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to delete user:", errorMessage);

    res.status(500).json({ message: "Failed to delete user", error: errorMessage });
  }
}
