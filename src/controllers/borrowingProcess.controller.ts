import { Request, Response } from 'express';
import { MessageType } from '@/types/enums';
import { ApiResponse, prisma } from '@/utils';
import expressAsyncHandler from 'express-async-handler';
import { NotFoundError } from '@/error';
import { StatusCodes } from 'http-status-codes';
import * as excel from 'exceljs';
/**
 * @desc    Checkout Book
 * @route   Post /api/v1/borrowing/checkOut
 * @access  Private(user/admin)
 **/
export const checkOutBook = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user!;
    const { bookId} = req.body;
    const book = await prisma.book.findUnique({
      where: {
        id: parseInt(bookId),
      },
    });
    if (!book) {
      throw new NotFoundError([
        { message: 'Book not found', type: MessageType.ERROR },
      ]);
    }
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundError([
        { message: 'User not found', type: MessageType.ERROR },
      ]);
    }
    const bookBorrowed = await prisma.borrowing.create({
      data: {
        bookId: parseInt(bookId),
        userId: id,
        borrowedDate: new Date(),
        returnedDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
    });
    await prisma.book.update({
      where: {
        id: parseInt(bookId),
      },
      data: {
        availableQuantity: book.availableQuantity - 1,
      },
    });
    const response = new ApiResponse({
      statusCode: StatusCodes.CREATED,
      messages: [
        { message: 'Book checked out successfully', type: MessageType.SUCCESS },
      ],
      data: bookBorrowed,
    });
    res.status(response.statusCode).json(response);
  },
);

/**
 * @desc    Return Book
 * @route   PUT /api/v1/borrowing/return
 * @access  Private(user/admin)
 **/
export const returnBook = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user!;
    const { bookId } = req.body;
    const book = await prisma.book.findUnique({
      where: {
        id: parseInt(bookId),
      },
    });
    if (!book) {
      throw new NotFoundError([
        { message: 'Book not found', type: MessageType.ERROR },
      ]);
    }
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundError([
        { message: 'User not found', type: MessageType.ERROR },
      ]);
    }
    const bookReturned = await prisma.borrowing.update({
      where: {
        userId_bookId: {
          userId: id,
          bookId: parseInt(bookId)
        }
      },
      data: {
        returnedDate: new Date(),
      },
    });
    await prisma.book.update({
      where: {
        id: parseInt(bookId),
      },
      data: {
        availableQuantity: book.availableQuantity + 1,
      },
    });
    const response = new ApiResponse({
      messages: [
        { message: 'Book returned out successfully', type: MessageType.SUCCESS },
      ],
      data: bookReturned,
    });
    res.status(response.statusCode).json(response);
  },
);

/**
 * @desc    Get All Borrowing Process For Specific user
 * @route   GET /api/v1/borrowing/:userId
 * @access  Private(admin/user)
 **/
export const getBorrowingByUserId = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    const borrowing = await prisma.borrowing.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        book: true,
      },
    });
    if (!borrowing) {
      throw new NotFoundError([
        { message: 'Borrowing Data For this User not found', type: MessageType.ERROR },
      ]);
    }
    const response = new ApiResponse({
      messages: [
        { message: 'Borrowing Data retrieved successfully', type: MessageType.SUCCESS },
      ],
      data: borrowing,
    });
    res.status(response.statusCode).json(response);
  },
);

/**
 * @desc    Get All Borrowing overdue For Specific user
 * @route   GET /api/v1/borrowing/overdue/:userId
 * @access  Private(admin/user)
 **/
export const getBorrowingOverDueDatesByUserId = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    const borrowing = await prisma.borrowing.findMany({
      where: {
        AND: [
          {
            userId: parseInt(userId),
          },
          {
            returnedDate: {
              lt: new Date(),
            },
          },
        ],
      },
      include: {
        book: true,
      },
    });
    if (!borrowing) {
      throw new NotFoundError([
        { message: 'Borrowing OverDue Date For this User not found', type: MessageType.ERROR },
      ]);
    }
    const response = new ApiResponse({
      messages: [
        { message: 'Borrowing OverDue Date retrieved successfully', type: MessageType.SUCCESS },
      ],
      data: borrowing,
    });
    res.status(response.statusCode).json(response);
  },
);

/**
 * @desc    Get All Borrowing overdue 
 * @route   GET /api/v1/borrowing/overdue
 * @access  Private(admin)
 **/
export const getAllBorrowingOverDueDates= expressAsyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const borrowing = await prisma.borrowing.findMany({
      where: {
        returnedDate: {
          lt: new Date()
        }
      },
      include: {
        book: true,
        user: true,
      },
    });
    if (!borrowing) {
      throw new NotFoundError([
        { message: 'There is No Borrowing Over Due Date', type: MessageType.ERROR },
      ]);
    }
    const response = new ApiResponse({
      messages: [
        { message: 'Borrowing Over Due Date retrieved successfully', type: MessageType.SUCCESS },
      ],
      data: borrowing,
    });
    res.status(response.statusCode).json(response);
    
  },
);

/**
 * @desc    Get All Borrowing In Specific Period
 * @route   GET /api/v1/borrowing/inPeriod
 * @access  Private(admin)
 **/
export const getAllBorrowingInSpecificPeriod= expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {startDate,endDate}=req.body
    const borrowing = await prisma.borrowing.findMany({
      where: {
        borrowedDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        book: true,
        user: true,
      },
    });
    if (!borrowing) {
      throw new NotFoundError([
        { message: 'There is No Borrowing in this Period', type: MessageType.ERROR },
      ]);
    }
    const response = new ApiResponse({
      messages: [
        { message: 'Borrowing Data retrieved successfully', type: MessageType.SUCCESS },
      ],
      data: borrowing,
    });
    res.status(response.statusCode).json(response);
  }
)

/**
 * @desc    Get All Borrowing In Specific Period XLSX
 * @route   GET /api/v1/borrowing/inPeriodxlsx
 * @access  Private(admin)
 **/
export const getAllBorrowingInSpecificPeriodXLSX = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { startDate, endDate } = req.body;
    const borrowing = await prisma.borrowing.findMany({
      where: {
        borrowedDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        book: true,
        user: true,
      },
    });

    if (!borrowing || borrowing.length === 0) {
      throw new NotFoundError([
        { message: 'There is No Borrowing in this Period', type: MessageType.ERROR },
      ]);
    }

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Borrowing Data');
    
    // Add headers to the worksheet
    worksheet.addRow(['Borrowed Date', 'Book Title', 'User Name']);

    // Add data to the worksheet
    borrowing.forEach((record) => {
      worksheet.addRow([
        record.borrowedDate.toISOString(),
        record.book.title,
        record.user.name,
      ]);
    });

    // Set up response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=BorrowingData.xlsx');

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    res.end();
  }
);


/**
 * @desc    Get All Borrowing OverDue Dates Of The Last Month
 * @route   GET /api/v1/borrowing/overdueLastMonth
 * @access  Private(admin)
 **/
export const getAllOverDueBorrowingOfTheLastMonth= expressAsyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const borrowing = await prisma.borrowing.findMany({
      where: {
        returnedDate: {
          lt: new Date(),
          gt: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      },
      include: {
        book: true,
        user: true,
      },
    });
    if (!borrowing) {
      throw new NotFoundError([
        { message: 'There is No Borrowing Over Due For The Last Month', type: MessageType.ERROR },
      ]);
    }
    const response = new ApiResponse({
      messages: [
        { message: 'Borrowing Data Over Due For The Last Month retrieved successfully', type: MessageType.SUCCESS },
      ],
      data: borrowing,
    });
    res.status(response.statusCode).json(response);
  }
)

/**
 * @desc    Get All Borrowing OverDue Dates Of The Last Month
 * @route   GET /api/v1/borrowing/overdueLastMonthxlsx
 * @access  Private(admin)
 **/
export const getAllOverDueBorrowingOfTheLastMonthXLSX = expressAsyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const borrowing = await prisma.borrowing.findMany({
      where: {
        returnedDate: {
          lt: new Date(),
          gt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
      include: {
        book: true,
        user: true,
      },
    });

    if (!borrowing || borrowing.length === 0) {
      throw new NotFoundError([
        { message: 'There is No Borrowing Over Due For The Last Month', type: MessageType.ERROR },
      ]);
    }

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Overdue Borrowing Data');
    
    // Add headers to the worksheet
    worksheet.addRow(['Returned Date', 'Book Title', 'User Name']);

    // Add data to the worksheet
    borrowing.forEach((record) => {
      worksheet.addRow([
        record.returnedDate.toISOString(),
        record.book.title,
        record.user.name,
      ]);
    });

    // Set up response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=OverdueBorrowingData.xlsx');

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    res.end();
  }
);

/**
 * @desc    Get All Borrowing OverDue Dates
 * @route   GET /api/v1/borrowing/LastMonth
 * @access  Private(admin)
 **/
export const getAllBorrowingInTheLastMonth= expressAsyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const borrowing = await prisma.borrowing.findMany({
      where: {
        borrowedDate: {
          gt: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      },
      include: {
        book: true,
        user: true,
      },
    });
    if (!borrowing) {
      throw new NotFoundError([
        { message: 'There is No Borrowing In The Last Month', type: MessageType.ERROR },
      ]);
    }
    const response = new ApiResponse({
      messages: [
        { message: 'Borrowing Data In The Last Month retrieved successfully', type: MessageType.SUCCESS },
      ],
      data: borrowing,
    });
    res.status(response.statusCode).json(response);
  }
);

/**
 * @desc    Get All Borrowing OverDue Dates
 * @route   GET /api/v1/borrowing/LastMonthxlsx
 * @access  Private(admin)
 **/
export const getAllBorrowingInTheLastMonthXLSX = expressAsyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const borrowing = await prisma.borrowing.findMany({
      where: {
        borrowedDate: {
          gt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
      include: {
        book: true,
        user: true,
      },
    });

    if (!borrowing || borrowing.length === 0) {
      throw new NotFoundError([
        { message: 'There is No Borrowing In The Last Month', type: MessageType.ERROR },
      ]);
    }

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Borrowing Data Last Month');
    
    // Add headers to the worksheet
    worksheet.addRow(['Borrowed Date', 'Book Title', 'User Name']);

    // Add data to the worksheet
    borrowing.forEach((record) => {
      worksheet.addRow([
        record.borrowedDate.toISOString(),
        record.book.title,
        record.user.name,
      ]);
    });

    // Set up response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=BorrowingDataLastMonth.xlsx');

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    res.end();
  }
);

/**
 * @desc    Get My All Borrowing Process
 * @route   GET /api/v1/borrowing/me
 * @access  Private(user)
 **/
export const getMyBorrowing = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user!;
    

    const borrowing = await prisma.borrowing.findMany({
      where: {
        userId: id,
      },
      include: {
        book: true,
      },
    });
    if (!borrowing) {
      throw new NotFoundError([
        { message: 'Borrowing Data For this User not found', type: MessageType.ERROR },
      ]);
    }
    const response = new ApiResponse({
      messages: [
        { message: 'Borrowing Data retrieved successfully', type: MessageType.SUCCESS },
      ],
      data: borrowing,
    });
    res.status(response.statusCode).json(response);
  },
);

/**
 * @desc    Get My All Borrowing overdue
 * @route   GET /api/v1/borrowing/overdue/me
 * @access  Private(user)
 **/
export const getMyBorrowingOverDueDate = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user!;

    const borrowing = await prisma.borrowing.findMany({
      where: {
        AND: [
          {
            userId: id,
          },
          {
            returnedDate: {
              lt: new Date(),
            },
          },
        ],
      },
      include: {
        book: true,
      },
    });
    if (!borrowing) {
      throw new NotFoundError([
        { message: 'Borrowing OverDue Date For this User not found', type: MessageType.ERROR },
      ]);
    }
    const response = new ApiResponse({
      messages: [
        { message: 'Borrowing OverDue Date retrieved successfully', type: MessageType.SUCCESS },
      ],
      data: borrowing,
    });
    res.status(response.statusCode).json(response);
  },
);