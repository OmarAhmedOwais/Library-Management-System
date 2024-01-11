import { Router } from 'express';

import {
  forgetPassword,
  resetPassword,
  signin,
  signout,
  signup,
} from '@/controllers';
import {
  forgetPasswordValidation,
  resetPasswordValidation,
  signinValidation,
  signupValidation,
} from '@/validations';
import { authMiddleware } from '@/middlewares';

const authRouter = Router();

authRouter.route('/signup').post(signupValidation, signup);
authRouter.route('/signin').post(signinValidation, signin);
authRouter.route('/signout').post(authMiddleware, signout);
authRouter
  .route('/forgetPassword')
  .post(forgetPasswordValidation, forgetPassword);
authRouter
  .route('/resetPassword')
  .patch(resetPasswordValidation, resetPassword);

export { authRouter };
