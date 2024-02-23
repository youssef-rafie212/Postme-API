import { Query } from "mongoose";

class APIFeatures {
  public query: Query<any, any>;
  public queryString: Record<string, any>;

  constructor(query: Query<any, any>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(): APIFeatures {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  paginate(): APIFeatures {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  sort(): APIFeatures {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // If no sort field selected we sort by createdAt field
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  fields(): APIFeatures {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // If no fields selected we select all fields except __v field
      this.query = this.query.select("-__v");
    }

    return this;
  }
}

export default APIFeatures;
