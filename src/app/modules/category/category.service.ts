import slugify from 'slugify';
import { TCategory } from './category.interface';
import { Category } from './category.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import QueryBuilder from '../../builders/QueryBuilder';
import { categorySearchableFields } from './category.constant';
import AppError from '../../errors/AppError';
import status from 'http-status';

const createCategoryIntoDb = async (
  product: TCategory,
  file?: Express.Multer.File,
) => {
  let slug = slugify(product.name, { lower: true, strict: true }).replace(
    /[^\w\s-]/g,
    '',
  );
  let counter = 1;
  while (await Category.findOne({ slug }).lean()) {
    slug =
      slugify(product.name, { lower: true, strict: true }).replace(
        /[^\w\s-]/g,
        '',
      ) + `-${counter}`;
    counter++;
  }
  product.slug = slug;

  if (file) {
    const { secure_url } = await sendImageToCloudinary(slug, file.path);
    product.image = secure_url as string;
  }

  const result = await Category.create(product);
  return result;
};

const getAllCategory = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find().lean(), query)
    .search(categorySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const categories = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();

  return { categories, meta };
};

const getCategoryById = async (id: string) => {
  const category = await Category.findById(id).lean();
  if (!category || category.isDelete) {
    throw new AppError(status.NOT_FOUND, 'Category not found');
  }
  return category;
};


const updateCategoryIntoDb = async (
    categoryId: string,
    category: Partial<TCategory>,
    file?: Express.Multer.File
  ) => {
    const existingCategory = await Category.findById(categoryId).lean();
  
    if (!existingCategory || existingCategory.isDelete) {
      throw new AppError(status.NOT_FOUND, "Category not found");
    }
  
    if (category.name) {
      let slug = slugify(category.name, { lower: true, strict: true }).replace(/[^\w\s-]/g, '');
      let counter = 1;
  
      while (await Category.findOne({ _id: { $ne: categoryId }, slug })) {
        slug = `${slugify(category.name, { lower: true, strict: true }).replace(/[^\w\s-]/g, '')}-${counter}`;
        counter++;
      }
      category.slug = slug;
    }
  
    if (file) {
      const { secure_url } = await sendImageToCloudinary(
        `${category.slug || existingCategory.slug}-${Date.now()}`,
        file.path
      );
      category.image = secure_url as string;
    }
  
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $set: category },
      { new: true }
    ).lean();
  
    return updatedCategory;
  };
  

  const deletedCategoryFromDB = async (id: string) => {

    const existingCategory = await Category.findById(id).lean();
    if (!existingCategory || existingCategory.isDelete) {
        throw new AppError(status.NOT_FOUND, 'Category not found');
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { isDelete: true },
      { new: true }
    ).lean();

    return category;
  }

export const categoryService = {
  createCategoryIntoDb,
  getAllCategory,
  getCategoryById,
  updateCategoryIntoDb,
  deletedCategoryFromDB
};
