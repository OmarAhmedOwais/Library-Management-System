import { Router } from 'express';

import {
  checkOutBook,
  returnBook,
  getAllBorrowingOverDueDates,
  getAllBorrowingInSpecificPeriod,
  getAllOverDueBorrowingOfTheLastMonth,
  getAllBorrowingInTheLastMonth,
  getBorrowingByUserId,
  getBorrowingOverDueDatesByUserId,
  getMyBorrowing,
  getMyBorrowingOverDueDate,
  getAllBorrowingInSpecificPeriodXLSX,
  getAllOverDueBorrowingOfTheLastMonthXLSX,
  getAllBorrowingInTheLastMonthXLSX,
} from '@/controllers';
import { authMiddleware, allowedTo, rateLimitMiddleware } from '@/middlewares';
//TODO:Validation
import {
  checkOutBookValidation,
  returnBookValidation,
  getBorrowingByUserIdValidation,
  getBorrowingOverDueDatesByUserIdValidation,
  getAllBorrowingInSpecificPeriodValidation,
} from '@/validations';

const borrowingRouter = Router();

borrowingRouter
  .route('/checkOut')
  .all(authMiddleware, allowedTo('BORROWER', 'ADMIN'))
  .post(checkOutBookValidation, checkOutBook);
borrowingRouter
  .route('/return')
  .all(authMiddleware, allowedTo('BORROWER', 'ADMIN'))
  .put(returnBookValidation, returnBook);
borrowingRouter
  .route('/me')
  .all(authMiddleware, allowedTo('BORROWER'))
  .get(getMyBorrowing);
borrowingRouter
  .route('/overdue')
  .all(authMiddleware, allowedTo('ADMIN'))
  .get(getAllBorrowingOverDueDates);
borrowingRouter
  .route('/overdue/me')
  .all(authMiddleware, allowedTo('BORROWER'))
  .get(getMyBorrowingOverDueDate);
borrowingRouter
  .route('/overdue/lastMonth')
  .all(authMiddleware, allowedTo('ADMIN'))
  .get(getAllOverDueBorrowingOfTheLastMonth);
borrowingRouter
  .route('/overdue/lastMonthxlsx')
  .all(authMiddleware, allowedTo('ADMIN'))
  .get(getAllOverDueBorrowingOfTheLastMonthXLSX);
borrowingRouter
  .route('/inPeriod')
  .all(authMiddleware, allowedTo('ADMIN'))
  .get(
    getAllBorrowingInSpecificPeriodValidation,
    getAllBorrowingInSpecificPeriod,
  );
borrowingRouter
  .route('/inPeriodxlsx')
  .all(authMiddleware, allowedTo('ADMIN'))
  .get(
    getAllBorrowingInSpecificPeriodValidation,
    getAllBorrowingInSpecificPeriodXLSX,
  );

borrowingRouter
  .route('/lastMonth')
  .all(authMiddleware, allowedTo('ADMIN'))
  .get(getAllBorrowingInTheLastMonth);
borrowingRouter
  .route('/lastMonthxlsx')
  .all(authMiddleware, allowedTo('ADMIN'))
  .get(getAllBorrowingInTheLastMonthXLSX);
borrowingRouter
  .route('/overdue/:userId')
  .all(authMiddleware, rateLimitMiddleware, allowedTo('ADMIN', 'BORROWER'))
  .get(
    getBorrowingOverDueDatesByUserIdValidation,
    getBorrowingOverDueDatesByUserId,
  );
borrowingRouter
  .route('/:userId')
  .all(authMiddleware, rateLimitMiddleware, allowedTo('ADMIN', 'BORROWER'))
  .get(getBorrowingByUserIdValidation, getBorrowingByUserId);

export { borrowingRouter };
