import { body, param } from 'express-validator';

import { validationMiddleware } from '@/middlewares';

export const checkOutBookValidation = [
  body('bookId')
    .notEmpty()
    .withMessage('book id is required')
    .isInt()
    .withMessage('bookId Must Be Integer'),
  validationMiddleware,
];

export const returnBookValidation = [
  body('bookId')
    .notEmpty()
    .withMessage('book id is required')
    .isInt()
    .withMessage('bookId Must Be Integer'),
  validationMiddleware,
];

export const getBorrowingByUserIdValidation = [
  param('userId')
    .notEmpty()
    .withMessage('user id is required')
    .isInt()
    .withMessage('Id Must Be Integer'),
  validationMiddleware,
];

export const getBorrowingOverDueDatesByUserIdValidation = [
  param('userId')
    .notEmpty()
    .withMessage('user id is required')
    .isInt()
    .withMessage('Id Must Be Integer'),
  validationMiddleware,
];

export const getAllBorrowingInSpecificPeriodValidation = [
  body('startDate')
    .notEmpty()
    .withMessage('startDate is required')
    .isISO8601()
    .withMessage('Invalid startDate'),
  body('endDate')
    .notEmpty()
    .withMessage('endDate is required')
    .isISO8601()
    .withMessage('Invalid endDate'),
  validationMiddleware,
];

