import status from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import { userSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import bcrypt from 'bcrypt'
import config from '../../config';
import { Order } from '../order/order.model';

const createUserIntoDb = async (user: TUser) => {
  const isUserExist = await User.findOne({
    $or: [{ email: user.email }, { phoneNumber: user.phoneNumber }],
  }).lean();

  if (isUserExist) {
    if (isUserExist.phoneNumber === user.phoneNumber) {
      throw new AppError(
        status.BAD_REQUEST,
        'User with this phone number already exists',
      );
    }
    if (isUserExist.email === user.email) {
      throw new AppError(
        status.BAD_REQUEST,
        'User with this email already exists',
      );
    }
  }

  const result = await User.create(user);
  return result;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find().lean(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  return { result, meta };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  return user;
};

const updateUser = async (userId: string, updatedUserData: Partial<TUser>) => {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updatedUserData },
    { new: true },
  );

  return updatedUser;
};

const changePassword = async (userId: string, newPassword: string, currentPassword: string) => {
  const user = await User.findById(userId).select('+password').lean();
  if(!user){
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if(!passwordMatch){
    throw new AppError(status.UNAUTHORIZED, 'Invalid current password!');
  }
  if (currentPassword === newPassword) {
    throw new AppError(
      status.BAD_REQUEST,
      'New password cannot be the same as the current password!',
    );
  }
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.salt_rounds),
  );
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword, },
    { new: true, runValidators: true },
  ).lean();
  return updatedUser;
}

const getMyOrders = async (userId: string) => {
  const orders = await Order.find({ user: userId }).lean();
  return orders;
}

export const userService = {
  createUserIntoDb,
  getAllUsers,
  getMe,
  updateUser,
  changePassword,
  getMyOrders
};
