import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { MessageType } from '@/types/enums';
import {
  ApiResponse,
  exclude,
  getUserSearchOptions,
  getUserPaginationOptions,
  getUserSortOptions,
  prisma,
} from '@/utils';

/**
 * @desc    Update current user profile
 * @route   PUT /api/v1/users/me
 * @access  Private
 */
export const updateMe = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user!;

    const user = await prisma.user.update({
      where: { id },
      data: req.body,
    });
    const data = exclude(user, ['password']);
    const response = new ApiResponse({
      messages: [
        { message: 'Profile updated successfully', type: MessageType.SUCCESS },
      ],
      data,
    });

    res.status(response.statusCode).json(response);
  },
);

/**
 * @desc    Get user details
 * @route   GET /api/v1/users/me
 * @access  Private
 */
export const getMe = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = exclude(req.user!, ['password']);
    const response = new ApiResponse({
      messages: [
        {
          message: 'User details fetched successfully',
          type: MessageType.SUCCESS,
        },
      ],
      data: user,
    });

    res.status(response.statusCode).json(response);
  },
);

/**
 * @desc    Get all users details
 * @route   GET /api/v1/users
 * @access  Private (admin)
 */
export const getAllUsers = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page, limit, sort, search } = req.query;

    const { currentPage, itemsPerPage } = getUserPaginationOptions(
      page as string | undefined,
      limit as string | undefined,
    );
    const sortOptions = getUserSortOptions(sort as string | undefined);
    const searchOptions = getUserSearchOptions(search as string | undefined);

    const prismaQueryOptions = {
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: sortOptions,
      where: searchOptions,
    };

    const users = await prisma.user.findMany(prismaQueryOptions);
    const totalUsersCount = await prisma.user.count({ where: searchOptions });

    const response = new ApiResponse({
      messages: [
        { message: 'Users retrieved Successfully', type: MessageType.SUCCESS },
      ],
      data: users,
      pagination: {
        total: totalUsersCount,
        page: currentPage,
        pages: Math.ceil(totalUsersCount / itemsPerPage),
        limit: itemsPerPage,
        length: users.length,
      },
    });

    res.status(response.statusCode).json(response);
  },
);

/**
 * @desc    Get user details
 * @route   GET /api/v1/users/:id
 * @access  Private (admin)
 */
export const getUser = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

    const response = new ApiResponse({
      messages: [
        {
          message: 'User details fetched successfully',
          type: MessageType.SUCCESS,
        },
      ],
      data: user,
    });

    res.status(response.statusCode).json(response);
  },
);

/**
 * @desc    Create user
 * @route   POST /api/v1/users
 * @access  Private (admin)
 */
export const createUser = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await prisma.user.create({ data: req.body });

    const response = new ApiResponse({
      messages: [
        {
          message: 'User created successfully',
          type: MessageType.SUCCESS,
        },
      ],
      data: user,
    });

    res.status(response.statusCode).json(response);
  },
);

/**
 * @desc    Update user details
 * @route   PUT /api/v1/users/:id
 * @access  Private (admin)
 */
export const updateUser = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    const response = new ApiResponse({
      messages: [
        {
          message: 'User details updated successfully',
          type: MessageType.SUCCESS,
        },
      ],
      data: user,
    });

    res.status(response.statusCode).json(response);
  },
);

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:id
 * @access  Private (admin)
 */
export const deleteUser = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    await prisma.user.delete({ where: { id: parseInt(id) } });

    const response = new ApiResponse({
      messages: [
        {
          message: 'User deleted successfully',
          type: MessageType.SUCCESS,
        },
      ],
      data: {},
    });

    res.status(response.statusCode).json(response);
  },
);
