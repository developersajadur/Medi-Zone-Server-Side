/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidationSchema } from './product.validation';
import { productController } from './product.controller';
import { upload } from '../../utils/sendImageToCloudinary';
import AppError from '../../errors/AppError';
import status from 'http-status';

const router = Router();

router.post(
    '/create-product',
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
      validateRequest(ProductValidationSchema.createProductValidation),
    productController.createProductIntoDb
);


router.put(
  '/update-product/:id',
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
  validateRequest(ProductValidationSchema.updateProductValidation),
  productController.updateProductInDbController
);


router.delete(
    '/delete-product/:id',
    auth(USER_ROLE.admin),
    productController.deletedProductFromDB
)

router.get('/product-slug/:slug', productController.getOneProductBySlug)

router.get('/product-id/:id', productController.getOneProductById)


router.get('/', productController.getAllProduct);

export const productRoute = router;
