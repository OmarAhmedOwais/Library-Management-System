import { Router } from 'express';

import {
  getMe,
  updateMe,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '@/controllers';
import { authMiddleware, allowedTo } from '@/middlewares';
import {
  updateMeValidation,
  updateUserValidation,
  createUserValidation,
  getUserValidation,
  deleteUserValidation,
  getAllUsersValidation,
} from '@/validations';
const userRouter = Router();

userRouter
  .route('/')
  .all(authMiddleware, allowedTo('ADMIN'))
  .get(getAllUsersValidation,getAllUsers)
  .post(createUserValidation, createUser);

userRouter
  .route('/me')
  .all(authMiddleware)
  .put(updateMeValidation, updateMe)
  .get(getMe);

userRouter
  .route('/:id')
  .all(authMiddleware, allowedTo('ADMIN'))
  .get(getUserValidation, getUser)
  .put(updateUserValidation, updateUser)
  .delete(deleteUserValidation, deleteUser);

export { userRouter };
