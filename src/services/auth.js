import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersCollection } from '../models/user.js';
import { SessionsCollection } from '../models/sessions.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import createHttpError from 'http-errors';

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
