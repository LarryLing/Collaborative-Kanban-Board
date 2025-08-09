import type { Response, Request } from "express";
import type {
  AuthRequest,
  ConfirmSignUpBody,
  LoginBody,
  RequestPasswordResetBody,
  PasswordResetBody,
  SignUpBody,
  User,
} from "../types";
import { type ResultSetHeader } from "mysql2/promise";
import {
  AuthFlowType,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  DeleteUserCommand,
  ForgotPasswordCommand,
  GetTokensFromRefreshTokenCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import cognito from "../config/cognito";
import db from "../config/db";

export async function confirmSignUp(
  req: Request<object, object, ConfirmSignUpBody>,
  res: Response,
) {
  const { email, confirmationCode } = req.body;

  try {
    const confirmSignUpCommand = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
    });

    const { Session } = await cognito.send(confirmSignUpCommand);

    if (!Session) {
      throw new Error("Session token was not generated");
    }

    const initiateAuthCommand = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_AUTH,
      AuthParameters: {
        USERNAME: email,
      },
      ClientId: process.env.COGNITO_CLIENT_ID,
      Session: Session,
    });

    const initiateAuthResponse = await cognito.send(initiateAuthCommand);

    if (!initiateAuthResponse.AuthenticationResult) {
      throw new Error(
        "Could not initiate auth with the provided session token",
      );
    }

    const { IdToken, AccessToken, RefreshToken } =
      initiateAuthResponse.AuthenticationResult;

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
      message: "Successfully logged in new user",
      data: {
        idToken: IdToken,
        accessToken: AccessToken,
      },
    });
  } catch (error) {
    console.error("Failed to login new user:", error);

    res.status(500).json({
      message: "Failed to login new user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function resetPassword(
  req: Request<object, object, PasswordResetBody>,
  res: Response,
) {
  const { email, confirmationCode, password } = req.body;

  try {
    const confirmForgotPasswordConfirm = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: password,
    });

    await cognito.send(confirmForgotPasswordConfirm);

    res.status(200).json({
      message: "Successfully reset password",
    });
  } catch (error) {
    console.error("Failed to reset password:", error);

    res.status(500).json({
      message: "Failed to reset password",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function signUp(
  req: Request<object, object, SignUpBody>,
  res: Response,
) {
  const { givenName, familyName, email, password } = req.body;

  try {
    const signUpCommand = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "given_name",
          Value: givenName,
        },
        {
          Name: "family_name",
          Value: familyName,
        },
      ],
    });

    const signUpResponse = await cognito.send(signUpCommand);

    if (!signUpResponse.UserSub) {
      throw new Error("User subject was not generated");
    }

    const user: User = {
      id: signUpResponse.UserSub,
      givenName: givenName,
      familyName: familyName,
      email: email,
    };

    await db.execute(
      `INSERT IGNORE INTO users (id, given_name, family_name, email)
      VALUES (?, ?, ?, ?)`,
      [signUpResponse.UserSub, givenName, familyName, email],
    );

    res.status(201).json({
      message: "Successfully signed up new user",
      data: user,
    });
  } catch (error) {
    console.error("Failed to sign up new user:", error);

    res.status(500).json({
      message: "Failed to sign up new user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function login(
  req: Request<object, object, LoginBody>,
  res: Response,
) {
  const { email, password } = req.body;

  try {
    const initiateAuthCommand = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
      ClientId: process.env.COGNITO_CLIENT_ID,
    });

    const initiateAuthResponse = await cognito.send(initiateAuthCommand);

    if (!initiateAuthResponse.AuthenticationResult) {
      throw new Error("Could not initiate auth with the provided credentials");
    }

    const { IdToken, AccessToken, RefreshToken } =
      initiateAuthResponse.AuthenticationResult;

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
      message: "Successfully logged in returning user",
      data: {
        idToken: IdToken,
        accessToken: AccessToken,
      },
    });
  } catch (error) {
    console.error("Failed to login returning user:", error);

    res.status(500).json({
      message: "Failed to login returning user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function logout(req: AuthRequest, res: Response) {
  if (!req.auth) {
    res.status(401).json({
      message: "Failed to logout user",
      error: "User is not authorized to make request",
    });
    return;
  }

  const { accessToken } = req.auth;

  try {
    const globalSignOutCommand = new GlobalSignOutCommand({
      AccessToken: accessToken,
    });

    await cognito.send(globalSignOutCommand);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Failed to logout user", error);

    res.status(500).json({
      message: "Failed to logout user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function requestPasswordReset(
  req: AuthRequest<object, object, RequestPasswordResetBody>,
  res: Response,
) {
  const { email } = req.body;

  try {
    const forgotPasswordCommand = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
    });

    await cognito.send(forgotPasswordCommand);

    res.status(200).json({
      message: "Successfully request password reset",
    });
  } catch (error) {
    console.error("Failed to request password reset:", error);

    res.status(500).json({
      message: "Failed to request password reset",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function refreshTokens(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({
      message: "Failed to refresh tokens",
      error: "Refresh token not found in cookies",
    });
  }

  try {
    const getTokensFromRefreshTokenCommand =
      new GetTokensFromRefreshTokenCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        RefreshToken: refreshToken,
      });

    const getTokensFromRefreshTokenResponse = await cognito.send(
      getTokensFromRefreshTokenCommand,
    );

    if (!getTokensFromRefreshTokenResponse.AuthenticationResult) {
      throw new Error(
        "Could not regenerate tokens with the provided refresh token",
      );
    }

    const { IdToken, AccessToken, RefreshToken } =
      getTokensFromRefreshTokenResponse.AuthenticationResult;

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
    console.error("Failed to regenerate tokens:", error);

    res.status(401).json({
      message: "Failed to regenerate tokens",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteUser(req: AuthRequest, res: Response) {
  if (!req.auth) {
    res.status(401).json({
      message: "Failed to delete user",
      error: "User is not authorized to make request",
    });
    return;
  }

  const { id, accessToken } = req.auth;

  try {
    const deleteUserComand = new DeleteUserCommand({
      AccessToken: accessToken,
    });

    await cognito.send(deleteUserComand);

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
    console.error("Failed to delete user:", error);

    res.status(500).json({ message: "Failed to delete user", error });
  }
}
