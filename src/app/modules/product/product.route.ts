import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidationSchema } from './product.validation';
import { productController } from './product.controller';
import { upload } from '../../utils/sendImageToCloudinary';

const router = Router();

router.post(
    '/create-product',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
      },
      validateRequest(ProductValidationSchema.createProductValidation),
    productController.createProductIntoDb
);


router.put(
    '/update-product/:id',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
      },
      validateRequest(ProductValidationSchema.updateProductValidation),
    productController.updateProductInDbController
);

router.delete(
    '/delete-product/:id',
    auth(USER_ROLE.admin),
    productController.deletedProductFromDB
)

  

router.get('/', productController.getAllProduct);

export const productRoute = router;
