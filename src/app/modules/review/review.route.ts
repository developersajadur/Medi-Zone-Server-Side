import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { reviewController } from "./review.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewValidationSchema } from "./review.validation";


const router = Router();


router.post('/create-review', validateRequest(ReviewValidationSchema.createReviewValidation) ,auth(USER_ROLE.customer), reviewController.createReviewIntoDb)

router.get('/', auth(USER_ROLE.admin), reviewController.getAllReviewsFromDb)

router.put('/update-review/:reviewId/product/:productId', validateRequest(ReviewValidationSchema.updateReviewValidation), auth(USER_ROLE.customer), reviewController.updateReviewIntoDb)

router.get('/product-reviews/:slug', reviewController.getReviewBySlugForEachProduct)

router.delete('/delete-review/:reviewId', auth(USER_ROLE.customer, USER_ROLE.admin), reviewController.deleteReviewFromDb)



export const reviewRoute = router;