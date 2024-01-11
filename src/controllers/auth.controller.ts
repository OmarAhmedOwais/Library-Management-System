import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '@/error';
import {
  ApiResponse,
  Password,
  cryptoHash,
  generateToken,
  prisma,
  sendForgetPasswordEmail,
} from '@/utils';
import { MessageType } from '@/types/enums';

/** ---------------------------------------------------------------------------------- */

/**
 * @desc    signup a new user & set token in cookie
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
interface SignupBody {
  email: string;
  password: string;
  name: string;
}
export const signup = expressAsyncHandler(async (req, res, next) => {
  const { email, password, name } = <SignupBody>req.body;

  const isUserExists = await prisma.user.findUnique({ where: { email } });

  if (isUserExists) {
    throw new BadRequestError([
      { message: 'Email already exists', type: MessageType.ERROR },
    ]);
  }

  const hashedPassword = Password.hash(password);

  // TODO: Update user if token exists in the sessions

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  const token = generateToken({ id: user.id });

  req.session = { token };

  const response = new ApiResponse({
    messages: [
      {
        message: 'Signed up successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    data: {},
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */
/**
 * @desc    Signin & set token in cookie
 * @route   POST /api/v1/auth/signin
 * @access  Public
 */
interface SigninBody {
  email: string;
  password: string;
}
export const signin = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = <SigninBody>req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  const message = 'Email or password is incorrect';

  if (!user) {
    throw new BadRequestError([{ message, type: MessageType.ERROR }]);
  }

  const isPasswordMatch = Password.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new BadRequestError([{ message, type: MessageType.ERROR }]);
  }

  const token = generateToken({ id: user.id });

  req.session = { token };

  const response = new ApiResponse({
    messages: [
      {
        message: 'Signed in successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.CREATED,
    data: {},
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */
/**
 * @desc    Signout user & clear cookie
 * @route   POST /api/v1/auth/signout
 * @access  Private
 */
export const signout = expressAsyncHandler(async (req, res, next) => {
  req.session = null;

  const response = new ApiResponse({
    messages: [
      {
        message: 'Signed out successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.OK,
    data: {},
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */

/**
 * @desc    Forget password
 * @route   POST /api/v1/auth/forget-password
 * @access  Public
 */

interface ForgetPasswordBody {
  email: string;
}
export const forgetPassword = expressAsyncHandler(async (req, res, next) => {
  const { email } = <ForgetPasswordBody>req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new BadRequestError([
      { message: 'Email not found', type: MessageType.ERROR },
    ]);
  }

  await sendForgetPasswordEmail(email);

  const response = new ApiResponse({
    messages: [
      {
        message: 'Reset password code sent successfully',
        type: MessageType.SUCCESS,
      },
      {
        message: 'Please check your email',
        type: MessageType.INFO,
      },
    ],
    statusCode: StatusCodes.OK,
    data: {},
  });

  res.status(response.statusCode).json(response);
});

/** ---------------------------------------------------------------------------------- */

/**
 * @desc    Reset password
 * @route   PATCH /api/v1/auth/reset-password
 * @access  Public
 */

interface ResetPasswordBody {
  password: string;
  code: string;
}

export const resetPassword = expressAsyncHandler(async (req, res, next) => {
  const { password, code } = <ResetPasswordBody>req.body;

  const hashedCode = cryptoHash(code);
  const currentTime = new Date().getTime();

  const forgetPassword = await prisma.forgetPassword.findUnique({
    where: {
      code: hashedCode,
      expiredAt: { gt: currentTime },
    },
  });

  if (!forgetPassword) {
    throw new BadRequestError([
      { message: 'Invalid code or expired', type: MessageType.ERROR },
    ]);
  }

  const hashedPassword = Password.hash(password);

  const user = await prisma.user.update({
    where: {
      email: forgetPassword.email,
    },
    data: {
      password: hashedPassword,
      passwordChangeAt: new Date(),
    },
  });

  await prisma.forgetPassword.deleteMany({
    where: {
      email: forgetPassword.email,
    },
  });

  const token = generateToken({ id: user.id });

  req.session = { token };

  const response = new ApiResponse({
    messages: [
      {
        message: 'Password reset successfully',
        type: MessageType.SUCCESS,
      },
    ],
    statusCode: StatusCodes.OK,
    data: {},
  });

  res.status(response.statusCode).json(response);
});
