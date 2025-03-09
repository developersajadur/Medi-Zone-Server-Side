import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';
import { tokenDecoder } from '../auth/auth.utils';

const createUserIntoDb = catchAsync(async (req, res) => {
  const user = await userService.createUserIntoDb(req?.body);
  const responseData = {
    _id: user._id,
    name: user.fullName,
    email: user.email,
    phone: user.phoneNumber,
    role: user.role,
  };
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'WOW! Registration successful',
    data: responseData,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers(req?.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: users,
  });
});

const getMe = catchAsync(async (req, res) => {
      const decoded = tokenDecoder(req);
      const { userId } = decoded;
  const user = await userService.getMe(userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User retrieved successfully',
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req);
  const { userId } = decoded;
  const updatedUser = await userService.updateUser(userId, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User updated successfully',
    data: updatedUser,
  })
})



const changePassword = catchAsync(async (req, res) => {
  const { newPassword, currentPassword } = req.body;
  const decoded = tokenDecoder(req);
  const { userId } = decoded;
  const updatedUser = await userService.changePassword(userId, newPassword, currentPassword);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Password updated successfully',
    data: updatedUser,
  })
})


const getMyOrders = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req);
  const { userId } = decoded;
  const userOrders = await userService.getMyOrders(userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User orders retrieved successfully',
    data: userOrders,
  })
})

export const userController = {
  createUserIntoDb,
  getAllUsers,
  getMe,
  updateUser,
  changePassword,
  getMyOrders
};
