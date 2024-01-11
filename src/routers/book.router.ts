import { Router } from 'express';

import {
  createBook,
  getAllBooks,
  getBook,
  deleteBook,
  updateBook,
} from '@/controllers';
import { authMiddleware, allowedTo, rateLimitMiddleware } from '@/middlewares';
import {
  createBookValidation,
  deleteBookValidation,
  getAllBooksValidation,
  getBookValidation,
  updateBookValidation,
} from '@/validations';

const bookRouter = Router();

bookRouter
  .route('/')
  .get(getAllBooksValidation, rateLimitMiddleware, getAllBooks)
  .all(authMiddleware, allowedTo('ADMIN'))
  .post(createBookValidation, createBook);

bookRouter
  .route('/:id')
  .get(getBookValidation, rateLimitMiddleware, getBook)
  .all(authMiddleware, allowedTo('ADMIN'))
  .put(updateBookValidation, updateBook)
  .delete(deleteBookValidation, deleteBook);
export { bookRouter };
