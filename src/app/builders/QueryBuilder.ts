/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const search = this?.query?.search;
    if (search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: search, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
  
    const excludeFields = ['search', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);
  
    // Handle price
    if (queryObj.minPrice || queryObj.maxPrice) {
      const priceQuery: Record<string, any> = {};
  
      if (queryObj.minPrice) {
        priceQuery['$gte'] = queryObj.minPrice;
        delete queryObj.minPrice;
      }
  
      if (queryObj.maxPrice) {
        priceQuery['$lte'] = queryObj.maxPrice;
        delete queryObj.maxPrice;
      }
  
      if (Object.keys(priceQuery).length > 0) {
        queryObj['price'] = priceQuery;
      }
    }
  
    // Handle rating
    if (queryObj.minRating || queryObj.maxRating) {
      const ratingQuery: Record<string, any> = {};
  
      if (queryObj.minRating) {
        ratingQuery['$gte'] = queryObj.minRating;
        delete queryObj.minRating;
      }
  
      if (queryObj.maxRating) {
        ratingQuery['$lte'] = queryObj.maxRating;
        delete queryObj.maxRating;
      }
  
      if (Object.keys(ratingQuery).length > 0) {
        queryObj['rating'] = ratingQuery;
      }
    }
  
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }
  

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
