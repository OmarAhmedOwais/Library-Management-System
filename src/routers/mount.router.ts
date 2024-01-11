import { Router } from 'express';
import { authRouter } from './auth.router';
import { userRouter } from './user.router';
import { bookRouter } from './book.router';
import { borrowingRouter } from './borrowingProcess.router';
const mountRouter = Router();

mountRouter.use('/auth', authRouter);
mountRouter.use('/users', userRouter);
mountRouter.use('/books', bookRouter);
mountRouter.use('/borrowing', borrowingRouter);
export { mountRouter };
