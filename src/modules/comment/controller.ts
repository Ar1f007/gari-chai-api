import { Request, Response } from 'express';
import { CreateCommentBody, CreateCommentInputs, GetCommentsInputs } from './schema';
import { StatusCodes } from 'http-status-codes';
import { createComment, findComment, findComments } from './service';
import AppError from '../../utils/appError';
import { ZodError } from 'zod';

export async function createCommentHandler(req: Request<{}, {}, CreateCommentInputs>, res: Response) {
  const { isParent, carId, content, userId, parentId } = req.body;

  const commentPayload: CreateCommentBody = { car: carId, user: userId, content };

  try {
    if (isParent) {
      const parentComment = await createComment(commentPayload);
      return res.status(StatusCodes.CREATED).json({ status: 'success', data: parentComment });
    }

    const parentComment = await findComment({ _id: parentId }, { lean: false });

    if (!parentComment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'fail',
        message: 'The comment you are trying to reply is either removed or does not exist',
      });
    }

    if (parentComment.depth > 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: 'Cannot reply more than 1 level deep',
      });
    }

    const childComment = await createComment({ ...commentPayload, parentId: parentComment._id });

    if (!childComment) {
      throw new Error('Failed to create child comment');
    }

    parentComment.depth += 1;
    parentComment.children.push(childComment._id);

    await parentComment.save();

    return res.status(StatusCodes.CREATED).json({ status: 'success', data: childComment });
  } catch (error) {
    throw new AppError(
      error instanceof ZodError ? 'Invalid inputs' : 'Sorry! Something went wrong.',
      error instanceof ZodError ? StatusCodes.UNPROCESSABLE_ENTITY : StatusCodes.BAD_REQUEST,
    );
  }
}

export async function getCommentsHandler(req: Request<GetCommentsInputs['params'], {}, {}>, res: Response) {
  const results = await findComments(
    {
      car: req.params.carId,
    },
    {
      sort: { createdAt: -1 },
      limit: 10,
      populate: [
        {
          path: 'user',
          select: 'name image',
        },
        {
          path: 'children',
          model: 'comment',
        },
      ],
    },
  );

  return res.status(StatusCodes.OK).json({
    status: 'success',
    data: results,
  });
}
