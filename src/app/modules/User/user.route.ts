import { Router } from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidationSchema } from './user.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(UserValidationSchema.createUserValidation),
  userController.createUserIntoDb,
);
router.get('/', auth(USER_ROLE.admin), userController.getAllUsers);

router.get('/profile/get-me', auth(USER_ROLE.admin, USER_ROLE.customer), userController.getMe);

router.put(
  '/profile/update-me',
  validateRequest(UserValidationSchema.updateUserValidation),
  auth(USER_ROLE.admin, USER_ROLE.customer),
  userController.updateUser)

router.patch(
  '/profile/change-password',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  userController.changePassword)


router.get('/profile/get-my-orders', auth(USER_ROLE.customer), userController.getMyOrders)

export const userRoute = router;
