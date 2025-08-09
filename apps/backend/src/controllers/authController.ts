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

export async function getMe(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      console.error("Failed to get user: Refresh token not found in cookies");

      res.status(401).json({
        message: "Failed to get user",
        error: "Refresh token not found in cookies",
      });

      return;
    }

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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to get user:", errorMessage);

    res.status(401).json({
      message: "Failed to get user",
      error: errorMessage,
    });
  }
}

export async function confirmSignUp(
  req: Request<object, object, ConfirmSignUpBody>,
  res: Response,
) {
  try {
    const { email, confirmationCode } = req.body;
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to login new user:", errorMessage);

    res.status(500).json({
      message: "Failed to login new user",
      error: errorMessage,
    });
  }
}

export async function resetPassword(
  req: Request<object, object, PasswordResetBody>,
  res: Response,
) {
  try {
    const { email, confirmationCode, password } = req.body;
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to reset password:", errorMessage);

    res.status(500).json({
      message: "Failed to reset password",
      error: errorMessage,
    });
  }
}

export async function signUp(
  req: Request<object, object, SignUpBody>,
  res: Response,
) {
  try {
    const { givenName, familyName, email, password } = req.body;
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to sign up new user:", errorMessage);

    res.status(500).json({
      message: "Failed to sign up new user",
      error: errorMessage,
    });
  }
}

export async function login(
  req: Request<object, object, LoginBody>,
  res: Response,
) {
  try {
    const { email, password } = req.body;
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
        accessToken: AccessToken,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

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
      console.error(
        "Failed to logout user: User is not authorized to make request",
      );

      res.status(401).json({
        message: "Failed to logout user",
        error: "User is not authorized to make request",
      });

      return;
    }

    const { accessToken } = req.auth;

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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to logout user", errorMessage);

    res.status(500).json({
      message: "Failed to logout user",
      error: errorMessage,
    });
  }
}

export async function requestPasswordReset(
  req: AuthRequest<object, object, RequestPasswordResetBody>,
  res: Response,
) {
  try {
    const { email } = req.body;

    const forgotPasswordCommand = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
    });

    await cognito.send(forgotPasswordCommand);

    res.status(200).json({
      message: "Successfully request password reset",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

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
      console.error(
        "Failed to delete user: User is not authorized to make request",
      );

      res.status(401).json({
        message: "Failed to delete user",
        error: "User is not authorized to make request",
      });

      return;
    }

    const { id, accessToken } = req.auth;

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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to delete user:", errorMessage);

    res
      .status(500)
      .json({ message: "Failed to delete user", error: errorMessage });
  }
}
