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

export const userRoute = router;
