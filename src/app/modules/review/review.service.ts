import status from 'http-status';
import AppError from '../../errors/AppError';
import { TReview } from './review.interface';
import { Review } from './review.model';
import { Product } from '../product/product.model';
import QueryBuilder from '../../builders/QueryBuilder';
import { reviewSearchableFields } from './review.constant';
import { User } from '../user/user.model';
import { USER_ROLE } from '../user/user.constant';

const createReviewIntoDb = async (payload: TReview) => {
  const isExistProduct = await Product.findById(payload.productId).lean();
  if (!isExistProduct || isExistProduct.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Product not found');
  }

  const isExistReview = await Review.findOne({
    productId: payload.productId,
    userId: payload.userId,
  }).lean();
  if (isExistReview) {
    throw new AppError(
      status.CONFLICT,
      'You have already reviewed this product',
    );
  }

  const result = await Review.create(payload);
  return result;
};

const getAllReviewsFromDb = async (query: Record<string, unknown>) => {
  const reviewQuery = new QueryBuilder(
    Review.find({ isDeleted: false }).lean(),
    query,
  )
    .search(reviewSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const reviews = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();
  return { reviews, meta };
};

const updateReviewIntoDb = async (
  payload: Partial<TReview>,
  reviewId: string,
  userId: string,
  productId: string
) => {
  const isExistReview = await Review.findById(reviewId).lean();
  if (!isExistReview || isExistReview.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Review not found');
  }


    if (isExistReview.userId.toString() !== userId) {
        throw new AppError(status.FORBIDDEN, 'You are not authorized to update this review');
    }

  const isExistProduct = await Product.findById(productId).lean();
  if (!isExistProduct || isExistProduct.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Product not found');
  }
  const result = await Review.findByIdAndUpdate(
    reviewId,
    { $set: payload },
    { new: true },
  ).lean();
  return result;
};

const getReviewBySlugForEachProduct = async (slug: string, query: Record<string, unknown>) => {

    const product = await Product.findOne({ slug, isDeleted: false }).lean();

    if (!product) {
        throw new Error(`Product with slug "${slug}" not found.`);
    }

    const reviewQuery = new QueryBuilder(
        Review.find({ isDeleted: false, productId: product._id }).lean(),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const reviews = await reviewQuery.modelQuery;
    const meta = await reviewQuery.countTotal();

    return { reviews, meta };
};

const deleteReviewFromDb = async (reviewId: string, userId: string) => {
    const isExistReview = await Review.findById(reviewId).lean();
    if (!isExistReview || isExistReview.isDeleted) {
        throw new AppError(status.NOT_FOUND, 'Review not found');
    }
    const user = await User.findById(userId).lean();
    if (!user || user.isBlocked) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }
    if(user.role === USER_ROLE.customer){
        if(isExistReview.userId.toString() !== userId) {
            throw new AppError(status.FORBIDDEN, 'You are not authorized to delete this review');
        }
    }
    const result = await Review.findByIdAndUpdate(
        reviewId,
        { $set: { isDeleted: true } },
        { new: true }
    ).lean();
    return result;
}

export const ReviewService = {
  createReviewIntoDb,
  getAllReviewsFromDb,
  updateReviewIntoDb,
  getReviewBySlugForEachProduct,
  deleteReviewFromDb
};
