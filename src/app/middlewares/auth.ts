/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { tokenDecoder } from '../modules/auth/auth.utils';
import { User } from '../modules/user/user.model';
import { TUserRole } from '../modules/user/user.interface';
import { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decoded = tokenDecoder(req);
    const { role, userId } = decoded;
    const user: any = User.findById(userId).lean();
    if (!user) {
      throw new AppError(status.UNAUTHORIZED, 'User not found!');
    }
    if (user.isBlocked) {
      throw new AppError(status.FORBIDDEN, 'User is blocked!');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized for this action!');
    }
    (req as any).user = decoded as JwtPayload & { role: string };
    next();
  });
};

export default auth;
