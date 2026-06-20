class APIFeatures {
  constructor(Model, query) {
    const isQuery = Model?.constructor?.name === 'Query';
    this.Model = isQuery ? Model?.model : Model;
    this.queryObj = { ...query };
    this.query = isQuery ? Model : Model.find();
    this.pagination = {};
  }

  // ======================
  // 📌 FILTER (query only)
  // ======================
  filter() {
    const excluded = ['page', 'limit', 'sort', 'order', 'select', 'fields'];
    const filterObj = { ...this.queryObj };
    excluded.forEach(f => delete filterObj[f]);

    let filterString = JSON.stringify(filterObj);
    filterString = filterString.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`
    );

    const parsedFilter = JSON.parse(filterString);
    if (Object.keys(parsedFilter).length > 0) {
      this.query = this.query.where(parsedFilter);
    }
    return this;
  }

  sort(defaultSort = '-createdAt') {
    const sortParam = this.queryObj.sort || this.queryObj.order;
    const sortBy = sortParam
      ? sortParam.split(',').join(' ')
      : defaultSort;
    this.query = this.query.sort(sortBy);
    return this;
  }

  limitFields(forbidden = ['password', '__v']) {
    const requested = this.queryObj.fields || this.queryObj.select;
    if (requested) {
      const fields = requested
        .split(',')
        .filter((field) => !forbidden.includes(field))
        .join(' ');
      this.query = this.query.select(fields);
    } else if (forbidden.length > 0) {
      const excludedFields = forbidden.map((field) => `-${field}`).join(' ');
      this.query = this.query.select(excludedFields);
    }
    return this;
  }

  select(forbidden = ['password', '__v']) {
    if (this.queryObj.select) {
      const fields = this.queryObj.select
        .split(',')
        .filter(f => !forbidden.includes(f))
        .join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  paginate(options = {}) {
    const { defaultLimit = 10, maxLimit = 100 } = options;
    const page = Math.max(+this.queryObj.page || 1, 1);
    let limit = +this.queryObj.limit || defaultLimit;
    if (limit > maxLimit) limit = maxLimit;
    const skip = (page - 1) * limit;
    this.pagination = { page, limit };
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  populate(path, select = '') {
    this.query = this.query.populate(path, select);
    return this;
  }

  async execute() {
    const excluded = ['page', 'limit', 'sort', 'order', 'select', 'fields'];
    const filterObj = { ...this.queryObj };
    excluded.forEach(f => delete filterObj[f]);

    let filterString = JSON.stringify(filterObj);
    filterString = filterString.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`
    );

    const parsedFilter = JSON.parse(filterString);
    const totalResults = await this.Model.countDocuments(parsedFilter);
    const data = await this.query;
    const { page, limit } = this.pagination;

    return {
      status: 'success',
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(totalResults / limit) : 0,
      totalResults,
      resultsCount: data.length,
      data
    };
  }
}

module.exports = APIFeatures;