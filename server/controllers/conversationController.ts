import { Response, NextFunction } from 'express';

import { AppError, catchAsync, sendToken } from '../utils';
import { Conversation, User } from '../models';
import { IRequest } from '../interfaces';

export const createOrGetConversation = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const { friendId } = req.body;

    if (!friendId) return next(new AppError('Please enter a friendId.', 400));

    const validFriend = await User.exists({
      $and: [{ _id: { $ne: id } }, { _id: friendId }],
    });

    if (!validFriend)
      return next(new AppError('Friend with given id does not exist.', 404));

    let conversation = await Conversation.findOne({
      members: { $all: [id, friendId] },
    }).populate('members');

    if (conversation)
      return res.status(200).json({
        status: 'success',
        data: { conversation },
      });

    conversation = await Conversation.create({ members: [id, friendId] });

    const members = await User.find({ _id: { $in: conversation.members } });

    res.status(201).json({
      status: 'success',
      data: { conversation: { ...conversation, members } },
    });
  }
);

export const myConversations = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const conversations = await Conversation.find({
      members: { $in: [req.user?.id] },
    })
      .populate('members')
      .sort({ updatedAt: -1 });

    const converers: Set<string> = new Set();

    conversations.forEach(conversation => {
      conversation.members.forEach(member => {
        converers.add(member._id);
      });
    });

    const friends = await User.find({
      _id: { $not: { $in: [...converers] } },
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        result: conversations.length,
        conversations,
        friends,
      },
    });
  }
);
