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
  GlobalSignOutCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import cognito from "../config/cognito";
import db from "../config/db";

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.auth) {
    res.status(401).json({
      message: "Error retrieving user",
      error: "Not authorized",
    });
    return;
  }

  const { id } = req.auth;

  try {
    const [rows] = await db.execute(
      `SELECT *
      FROM users
      WHERE id = ?`,
      [id],
    );

    if (!rows || (rows as User[]).length === 0) {
      res.status(404).json({
        message: "Error retrieving user",
        error: "User not found in database",
      });
      return;
    }

    res.status(200).json({
      message: "Successfully retrieved user",
      data: (rows as User[])[0],
    });
  } catch (error) {
    console.error("Error retrieving user:", error);

    res.status(500).json({
      message: "Error retrieving user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

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
      throw new Error("Failed to confirm AWS Cognito user sign up");
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
        "Failed to initiate AWS Cognito user auth after confirmation",
      );
    }

    const { IdToken, AccessToken, RefreshToken } =
      initiateAuthResponse.AuthenticationResult;

    if (!IdToken || !AccessToken || !RefreshToken) {
      throw new Error(
        "Failed to generate AWS Cognito tokens after confirmation",
      );
    }

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Confirmed sign up successfully",
      data: {
        idToken: IdToken,
        accessToken: AccessToken,
      },
    });
  } catch (error) {
    console.error("Confirm sign up failed:", error);

    res.status(500).json({
      message: "Confirm sign up failed",
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
      message: "Reset password successfully",
    });
  } catch (error) {
    console.error("Password reset failed:", error);

    res.status(500).json({
      message: "Password reset failed",
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
      throw new Error("Failed to create AWS Cognito user");
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
      message: "Signed up successfully",
      data: user,
    });
  } catch (error) {
    console.error("Sign up failed:", error);

    res.status(500).json({
      message: "Error signing up",
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
      throw new Error("Failed to login AWS Cognito user");
    }

    const { IdToken, AccessToken, RefreshToken } =
      initiateAuthResponse.AuthenticationResult;

    if (!IdToken || !AccessToken || !RefreshToken) {
      throw new Error("Failed to generate AWS Cognito tokens");
    }

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Logged in successfully",
      data: {
        idToken: IdToken,
        accessToken: AccessToken,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);

    res.status(500).json({
      message: "Error logging in",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function logout(req: AuthRequest, res: Response) {
  if (!req.auth) {
    res.status(401).json({
      message: "Error logging out",
      error: "Not authorized",
    });
    return;
  }

  const { accessToken } = req.auth;

  try {
    const globalSignOutCommand = new GlobalSignOutCommand({
      AccessToken: accessToken,
    });

    await cognito.send(globalSignOutCommand);

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out", error);

    res.status(500).json({
      message: "Error logging out",
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
      message: "Request password reset successfully",
    });
  } catch (error) {
    console.error("Request password reset failed:", error);

    res.status(500).json({
      message: "Request password reset failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteUser(req: AuthRequest, res: Response) {
  if (!req.auth) {
    res.status(401).json({
      message: "Error deleting user",
      error: "Not authorized",
    });
    return;
  }

  const { id, accessToken } = req.auth;

  try {
    const deleteUserComand = new DeleteUserCommand({
      AccessToken: accessToken,
    });

    await cognito.send(deleteUserComand);

    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM users
      WHERE id = ?`,
      [id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        message: "Error deleting user",
        error: "User not found in database",
      });
      return;
    }

    res.status(200).json({ message: "Successfully deleted user" });
  } catch (error) {
    console.error("Error deleting user:", error);

    res.status(500).json({ message: "Error deleting user", error });
  }
}
