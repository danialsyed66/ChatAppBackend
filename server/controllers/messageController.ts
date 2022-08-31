import { Response, NextFunction } from 'express';

import { AppError, catchAsync, sendToken } from '../utils';
import { Conversation, Message, User } from '../models';
import { IRequest } from '../interfaces';

export const getMessages = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { conversationId } = req.params;

    if (!conversationId)
      return next(new AppError('Please enter a conversationId.', 400));

    const validConversation = await Conversation.exists({
      $and: [
        { _id: conversationId },
        {
          members: { $in: [req.user?.id] },
        },
      ],
    });

    if (!validConversation)
      return next(
        new AppError(
          'Either the coversation with given id does not exist or you are not a part of it.',
          400
        )
      );

    const messages = await Message.find({
      conversationId,
    });

    res.status(200).json({
      status: 'success',
      data: {
        result: messages.length,
        messages,
      },
    });
  }
);

export const sendMessage = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { conversationId, text } = req.body;

    if (!text)
      return next(new AppError('Text is required to send a message.', 400));
    if (!conversationId)
      return next(new AppError('Please enter a conversationId.', 400));

    const validConversation = await Conversation.exists({
      $and: [
        { _id: conversationId },
        {
          members: { $in: [req.user?.id] },
        },
      ],
    });

    if (!validConversation)
      return next(
        new AppError(
          'Either the coversation with given id does not exist or you are not a part of it.',
          400
        )
      );

    const message = await Message.create({
      conversationId,
      text,
      sender: req.user?.id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        message,
      },
    });
  }
);
