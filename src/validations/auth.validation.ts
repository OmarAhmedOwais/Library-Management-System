import { body } from 'express-validator';

import { validationMiddleware } from '@/middlewares';

export const signinValidation = [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validationMiddleware,
];

export const signupValidation = [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name').isString().withMessage('Name must be string'),
  validationMiddleware,
];

export const forgetPasswordValidation = [
  body('email').isEmail().withMessage('Email is invalid'),
  validationMiddleware,
];

export const resetPasswordValidation = [
  body('code')
    .isLength({ min: 6, max: 6 })
    .withMessage('Code must be 6 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validationMiddleware,
];
