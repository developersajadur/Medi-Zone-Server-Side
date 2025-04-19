/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
import validateRequest from '../../middlewares/validateRequest';
import { categoryValidationSchema } from './category.validation';
import { categoryController } from './category.controller';
import status from 'http-status';
import AppError from '../../errors/AppError';

const router = Router();

router.post(
  '/create-category',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data);
      next();
    } catch (error: any) {
      next(new AppError(status.BAD_REQUEST, error.message || "Invalid JSON format in request body."));
    }
  },
  validateRequest(categoryValidationSchema.createCategoryValidation),
  categoryController.createCategoryIntoDb,
);

router.get('/', categoryController.getAllCategory);

router.get('/:id', categoryController.getCategoryById);

router.put(
    '/update-category/:id',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = JSON.parse(req.body.data);
        next();
      } catch (error: any) {
        next(new AppError(status.BAD_REQUEST, error.message || "Invalid JSON in request body."));
      }
    },
    validateRequest(categoryValidationSchema.updateCategoryValidation),
    categoryController.updateCategoryIntoDb
  );


router.delete('/delete-category/:id', auth(USER_ROLE.admin), categoryController.deletedCategoryFromDB);
  

export const categoryRoute = router;
