import status from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import { userSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';

const createUserIntoDb = async (user: TUser) => {
  const isUserExist = await User.findOne({
    $or: [{ email: user.email }, { phoneNumber: user.phoneNumber }],
  }).lean()

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
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  return { result, meta };
};


export const userService = {
  createUserIntoDb,
  getAllUsers,
};
