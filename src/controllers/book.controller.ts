import { Request, Response } from 'express';
import { MessageType } from '@/types/enums';
import { ApiResponse, getSearchOptions,getPaginationOptions,getSortOptions, prisma } from '@/utils';
import expressAsyncHandler from 'express-async-handler';
import {NotFoundError } from '@/error';
import { StatusCodes } from 'http-status-codes';

/**
 * @desc    Get All Books
 * @route   GET /api/v1/books
 * @access  Public
 **/
export const getAllBooks = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page, limit, sort, search } = req.query;

        const { currentPage, itemsPerPage } = getPaginationOptions(page as string | undefined, limit as string | undefined);
        const sortOptions = getSortOptions(sort as string | undefined);
        const searchOptions = getSearchOptions(search as string | undefined);

        const prismaQueryOptions = {
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            orderBy: sortOptions,
            where: searchOptions,
        };

        const books = await prisma.book.findMany(prismaQueryOptions);

        const totalBooksCount = await prisma.book.count({ where: searchOptions });

        const response = new ApiResponse({
            messages: [{ message: 'Books retrieved Successfully', type: MessageType.SUCCESS }],
            data: books,
            pagination: {
                total: totalBooksCount,
                page:currentPage,
                pages: Math.ceil(totalBooksCount / itemsPerPage),
                limit:itemsPerPage,
                length:books.length

            },
        });

        res.status(response.statusCode).json(response);
});

/**
 * @desc    Get Book details
 * @route   GET /api/v1/books/:id
 * @access  Public
 **/
export const getBook = expressAsyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
    const book = await prisma.book.findUnique({
      where: { id },
    });
    if (!book) {
            throw new NotFoundError([{ message: 'Book not found', type: MessageType.ERROR }]);
    } 
    const response = new ApiResponse({
      messages: [
        { message: 'Book retrieved Successfully', type: MessageType.SUCCESS },
      ],
      data:book
    });
    res.status(response.statusCode).json(response);
});

/**
 * @desc    CREATE Book
 * @route   POST /api/v1/books
 * @access  Private(admin)
 **/
export const createBook = expressAsyncHandler(async (req: Request, res: Response) => {
  const newBook = req.body;
    const createdBook = await prisma.book.create({
      data: newBook,
    });
    const response = new ApiResponse({
      statusCode:StatusCodes.CREATED,
      messages: [
        { message: 'Book Created Successfully', type: MessageType.SUCCESS },
      ],
      data:createdBook
    });
    res.status(response.statusCode).json(response);
});

/**
 * @desc    Update Book
 * @route   PUT /api/v1/books/:id
 * @access  Private(admin)
 **/
export const updateBook = expressAsyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedBook = req.body;
    await prisma.book.update({
      where: { id },
      data: updatedBook,
    });
    const response = new ApiResponse({
        messages: [
          { message: 'Book Updated Successfully', type: MessageType.SUCCESS },
        ],
        data:updatedBook
      });
      res.status(response.statusCode).json(response);
});

/**
 * @desc    Delete Book
 * @route   DELETE /api/v1/books/:id
 * @access  Private(admin)
 **/
export const deleteBook = expressAsyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
    await prisma.book.delete({
      where: { id },
    });
    const response = new ApiResponse({
      statusCode:StatusCodes.NO_CONTENT,
      messages: [
        { message: 'Book Deleted Successfully', type: MessageType.SUCCESS},
      ],
      data:{}
    });
    res.status(response.statusCode).json(response);
});
