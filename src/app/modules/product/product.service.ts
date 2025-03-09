/* eslint-disable @typescript-eslint/no-explicit-any */
import slugify from 'slugify';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import QueryBuilder from '../../builders/QueryBuilder';
import { productSearchableFields } from './product.constant';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import AppError from '../../errors/AppError';
import status from 'http-status';

const createProductIntoDb = async (
  product: TProduct,
  file?: Express.Multer.File,
) => {

  let slug = slugify(product.name, { lower: true, strict: true }).replace(
    /[^\w\s-]/g,
    '',
  );
  let counter = 1;
  while (await Product.findOne({ slug }).lean()) {
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

  const result = await Product.create(product);
  return result;
};



const getAllProduct = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find({ isDeleted: false }).lean(),
    query,
  )
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const products = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();
  return { products, meta };
};

const updateProductInDb = async (
  productId: string,
  product: Partial<TProduct>, 
  file?: Express.Multer.File
) => {
  const existingProduct = await Product.findById(productId).lean();
  if (!existingProduct) {
    throw new AppError(status.NOT_FOUND, "Product not found");
  }
  if(existingProduct.isDeleted){
    throw new AppError(status.FORBIDDEN, "Product is deleted");
  }

  // Handle Slug Update
  if (product.name) {
    let slug = slugify(product.name, { lower: true, strict: true }).replace(/[^\w\s-]/g, '');
    let counter = 1;
    while (await Product.findOne({ _id: { $ne: productId }, slug })) {
      slug = slugify(product.name, { lower: true, strict: true }).replace(/[^\w\s-]/g, '') + `-${counter}`;
      counter++;
    }
    product.slug = slug;
  }

  // Handle Image Upload
  if (file) {
    const { secure_url } = await sendImageToCloudinary(product.slug || existingProduct.slug, file.path);
    product.image = secure_url as string;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: product },
    { new: true }
  ).lean();

  return updatedProduct;
};



const deletedProductFromDB = async(productId: string) => {

  const existingProduct = await Product.findById(productId).lean();
  if (!existingProduct) {
    throw new AppError(status.NOT_FOUND, "Product not found");
  }
  if(existingProduct.isDeleted){
    throw new AppError(status.FORBIDDEN, "Product Is Already Deleted");
  }


  const deletedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: { isDeleted: true } },
    { new: true }
  ).lean();

  return deletedProduct;
}


const getOneProductBySlug = async (slug: string) => {
  const product = await Product.findOne({slug}).lean();
  if (!product) {
    throw new AppError(status.NOT_FOUND, "Product not found");
  }else if(product.isDeleted){
    throw new AppError(status.FORBIDDEN, "Product is deleted");
  }
  return product;
}

const getOneProductById = async (id: string) => {
  const product = await Product.findById(id).lean();
  if (!product) {
    throw new AppError(status.NOT_FOUND, "Product not found");
  }else if(product.isDeleted){
    throw new AppError(status.FORBIDDEN, "Product is deleted");
  }
  return product;
}

export const productService = {
  createProductIntoDb,
  getAllProduct,
  updateProductInDb,
  deletedProductFromDB,
  getOneProductBySlug,
  getOneProductById
};
