/* eslint-disable @typescript-eslint/no-explicit-any */
import slugify from 'slugify';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import QueryBuilder from '../../builders/QueryBuilder';
import { productSearchableFields } from './product.constant';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';



const createProductIntoDb = async (product: TProduct, file?: Express.Multer.File) => {
  // console.log(product);

  // Generate unique slug
  let slug = slugify(product.name, { lower: true, strict: true }).replace(/[^\w\s-]/g, '');
  let counter = 1;
  while (await Product.findOne({ slug })) {
    slug = slugify(product.name, { lower: true, strict: true }).replace(/[^\w\s-]/g, '') + `-${counter}`;
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




const getAllProduct = async(query: Record<string, unknown>) => {
    const productQuery = new QueryBuilder(
        Product.find({isDeleted: false}),
        query
    )
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

    const result = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return { result, meta };
}


export const productService = {
  createProductIntoDb,
  getAllProduct,
};
