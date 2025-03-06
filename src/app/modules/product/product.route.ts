import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { ProductValidationSchema } from "./product.validation";
import { productController } from "./product.controller";

const router = Router();

router.post('/create-product', auth(USER_ROLE.admin), validateRequest(ProductValidationSchema.createProductValidation), productController.createProductIntoDb)

router.get('/', productController.getAllProduct)

export const productRoute = router;