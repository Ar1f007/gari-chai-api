import { Request, Response } from 'express';
import { CreateCommentBody, CreateCommentInputs, GetCommentsInputs, UpdateCommentInputs } from './schema';
import { StatusCodes } from 'http-status-codes';
import { createComment, findComment, findComments } from './service';
import AppError from '../../utils/appError';
import { ZodError } from 'zod';

export async function createCommentHandler(req: Request<{}, {}, CreateCommentInputs>, res: Response) {
  const { isChild, car, content, user, parentId } = req.body;

  const commentPayload: CreateCommentBody = { car, user, content };

  try {
    if (!isChild) {
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

    if (parentComment.depth > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: 'Cannot reply more than 1 level deep',
      });
    }

    const childComment = await createComment({ ...commentPayload, parentId: parentComment._id, depth: 1 });

    if (!childComment) {
      throw new Error('Failed to create child comment');
    }

    // childComment.depth += 1;
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
      car: req.params.id,
      parentId: { $exists: false },
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
          populate: [
            {
              path: 'user',
              select: 'name image',
            },
          ],
        },
      ],
    },
  );

  return res.status(StatusCodes.OK).json({
    status: 'success',
    data: results,
  });
}

export async function editCommentContentHandler(
  req: Request<UpdateCommentInputs['params'], {}, UpdateCommentInputs['body']>,
  res: Response,
) {
  const currentUserId = req.user?.id;

  const comment = await findComment({ _id: req.params.id }, { lean: false });

  if (!comment) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No comment was found',
    });
  }

  if (currentUserId !== comment.user.toString()) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'fail',
      message: 'Unauthorized to update this comment',
    });
  }

  comment.content = req.body.commentBody.content;

  const updatedComment = await comment.save();

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Updated successfully',
    data: updatedComment,
  });
}

export async function deleteCommentHandler(req: Request<UpdateCommentInputs['params'], {}, {}>, res: Response) {
  if (!req?.user?.id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'fail',
      message: 'Please login to continue',
    });
  }

  const currentUserId = req.user.id;

  const comment = await findComment({ _id: req.params.id }, { lean: false });

  if (!comment) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Comment was not found',
    });
  }

  if (comment.user.toString() !== currentUserId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'fail',
      message: 'Unauthorized access: Please login to continue',
    });
  }

  await comment.deleteOne();

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Successfully deleted!',
  });
}
