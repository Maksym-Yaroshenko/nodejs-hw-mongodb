import createHttpError from 'http-errors';

export const notFoundHandler = (req, res, next) => {
  // throw createHttpError(404, 'Route not found');
  next(createHttpError(404, 'Route not found'));
  //   return res.status(404).json({ message: 'Route not found' });
};
