import { body, param, query } from 'express-validator';
import { validationMiddleware } from '@/middlewares';
import { Book, Prisma } from '@prisma/client';
import { prisma } from '@/utils';
import slugify from 'slugify';
const VALID_ORDERS = [Prisma.SortOrder.asc, Prisma.SortOrder.desc];
const VALID_FIELDS: (keyof Book)[] = [
  'ISBN',
  'active',
  'author',
  'availableQuantity',
  'borrowed',
  'createdAt',
  'description',
  'id',
  'shelfLocation',
  'title',
  'updatedAt',
  'slug',
];

export const getAllBooksValidation = [
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
    .custom((value: string, { req }) => {
      if (value) {
        const sortArray = value.split(',');
        const isValid = sortArray.every((sortOption) => {
          const [field, order] = sortOption.split(':') as [
            keyof Book,
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

export const createBookValidation = [
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }).custom(async (value: string,{req}) => {
      const book = await prisma.book.findUnique({
        where: {
          slug: req.body.slug,
        },
      });
      if (book) {
        throw new Error('Title already exists');
      }
    }),
  body('ISBN')
    .notEmpty()
    .withMessage('ISBN is required')
    .isISBN()
    .withMessage('Not valid ISBN')
    .custom(async (value: string) => {
      const book = await prisma.book.findUnique({
        where: {
          ISBN: value,
        },
      });
      if (book) {
        throw new Error('ISBN already exists');
      }
    }),
  body('author')
    .notEmpty()
    .withMessage('author is required')
    .isString()
    .withMessage(' Author Must be String'),
  body('description')
    .notEmpty()
    .isString()
    .withMessage('description Must Be String'),
  body('shelfLocation')
    .notEmpty()
    .isString()
    .withMessage('shelfLocation Must Be String'),
  body('availableQuantity')
    .notEmpty()
    .withMessage('availableQuantity is required')
    .isInt()
    .isLength({ min: 1 }),
  body('slug').optional(),
  validationMiddleware,
];

export const getBookValidation = [
  param('id')
    .notEmpty()
    .withMessage('Book Id is required')
    .isInt()
    .withMessage('Book Id Must be Integer'),
  validationMiddleware,
];

export const updateBookValidation = [
  param('id')
    .notEmpty()
    .withMessage('Book Id is required')
    .isInt()
    .withMessage('Book Id Must be Integer'),
  body('title')
    .optional()
    .isString()
    .withMessage('title Must be String')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  body('ISBN')
    .optional()
    .isISBN()
    .withMessage('Not valid ISBN')
    .custom(async (value: string) => {
      const book = await prisma.book.findUnique({
        where: {
          ISBN: value,
        },
      });
      if (book) {
        throw new Error('ISBN already exists');
      }
      return true;
    }),
  body('author').optional().isString().withMessage(' Author Must be String'),
  body('description')
    .optional()
    .isString()
    .withMessage('description Must Be String'),
  body('shelfLocation')
    .optional()
    .isString()
    .withMessage('shelfLocation Must Be String'),
  body('availableQuantity')
    .optional()
    .isInt()
    .isLength({ min: 1 })
    .withMessage('availableQuantity Must Be Positive Number'),
  body('slug').optional(),
  validationMiddleware,
];

export const deleteBookValidation = [
  param('id')
    .notEmpty()
    .withMessage('Book Id is required')
    .isInt()
    .withMessage('Book Id Must be Integer'),
  validationMiddleware,
];
