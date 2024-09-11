import fs from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import createHttpError from 'http-errors';

import { randomBytes } from 'crypto';
import { UsersCollection } from '../models/user.js';
import { SessionsCollection } from '../models/sessions.js';
import {
  ENV_VARS,
  FIFTEEN_MINUTES,
  SMTP,
  TEMPLATES_DIR,
  THIRTY_DAYS,
} from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const newSessions = createSession();

  // console.log(user._id);

  return await SessionsCollection.create({
    userId: user._id,
    ...newSessions,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const sessions = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  //   console.log(sessions);

  if (!sessions) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(sessions.refreshTokenValidUntil);

  if (isSessionTokenExpired)
    throw createHttpError(401, 'Session token expired');

  const newSessions = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return SessionsCollection.create({
    userId: sessions.userId,
    ...newSessions,
  });
};

// ===============================================================

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    ENV_VARS.JWT_SECRET,
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const resetLink = `${ENV_VARS.FRONTEND_HOST}/reset-password?token=${resetToken}`;

  const html = template({
    name: user.name,
    link: resetLink,
  });

  try {
    await sendEmail({
      from: SMTP.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html: html,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (password, token) => {
  let entries;

  try {
    entries = jwt.verify(token, ENV_VARS.JWT_SECRET);
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  console.log(user);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
