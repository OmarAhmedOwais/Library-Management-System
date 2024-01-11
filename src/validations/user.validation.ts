import { body, param, query } from 'express-validator';
import { User, Prisma } from '@prisma/client';

import { validationMiddleware } from '@/middlewares';

const VALID_ORDERS = [Prisma.SortOrder.asc, Prisma.SortOrder.desc];
const VALID_FIELDS: (keyof User)[] = [
  'name',
  'email',
  'role',
  'active',
  'createdAt',
  'id',
  'updatedAt',
];

export const getAllUsersValidation = [
  query('page')
    .optional()
    .isInt()
    .isLength({ min: 1 })
    .default(1)
    .withMessage('Page Must be Positive value'),
  query('limit')
    .optional()
    .notEmpty()
    .isInt()
    .isLength({ min: 1 })
    .default(10)
    .withMessage('Limit Must be Positive value'),
  query('sort')
    .optional()
    .isString()
    .withMessage('Sort Must be String')
    .custom((value: string) => {
      if (value) {
        const sortArray = value.split(',');
        const isValid = sortArray.every((sortOption) => {
          const [field, order] = sortOption.split(':') as [
            keyof User,
            Prisma.SortOrder,
          ];
          return VALID_FIELDS.includes(field) && VALID_ORDERS.includes(order);
        });
        if (!isValid) {
          throw new Error('Sort parameter is invalid');
        }
      }
      return true;
    })
    .withMessage('Sort parameter is invalid'),
  query('search').optional().isString().withMessage('Search Must be String'),
  validationMiddleware,
];
export const updateMeValidation = [
  body('name').optional().isString().withMessage('name must be string'),
  validationMiddleware,
];
export const updateUserValidation = [
  param('id')
    .notEmpty()
    .withMessage('user id is required')
    .isInt()
    .withMessage('Id Must Be Integer'),
  body('name').optional().isString().withMessage('name must be string'),
  body('email').optional().isEmail().withMessage('Invalid Email'),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be string')
    .trim()
    .isIn(['BORROWER', 'ADMIN'])
    .withMessage('Role must be BORROWER, ADMIN'),
  validationMiddleware,
];
export const createUserValidation = [
  body('name').notEmpty().withMessage('name is required'),
  body('email').notEmpty().withMessage('email is required'),
  body('password').notEmpty().withMessage('password is required'),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be string')
    .trim()
    .isIn(['BORROWER', 'ADMIN'])
    .withMessage('Role must be BORROWER, ADMIN'),
  validationMiddleware,
];
export const getUserValidation = [
  param('id')
    .notEmpty()
    .withMessage('user id is required')
    .isInt()
    .withMessage('Id Must Be Integer'),
  validationMiddleware,
];
export const deleteUserValidation = [
  param('id')
    .notEmpty()
    .withMessage('user id is required')
    .isInt()
    .withMessage('Id Must Be Integer'),
  validationMiddleware,
];
