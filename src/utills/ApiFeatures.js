class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "keyword", "category"];
    
    // Remove excluded fields
    excludedFields.forEach((el) => delete queryObj[el]);

    // Handle price fields if they are in the 'price[gte]' format
    Object.keys(queryObj).forEach(key => {
      if (key.includes('price')) {
        delete queryObj[key];
      }
      // Also remove empty strings
      if (queryObj[key] === "") {
        delete queryObj[key];
      }
    });

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  category() {
    const category = this.queryString.category
      ? { category: this.queryString.category }
      : {};

    this.query = this.query.find({ ...category });
    return this;
  }

  price() {
    let priceQuery = {};
    
    // Check both formats: price[gte] and price: { gte: ... }
    const gte = this.queryString['price[gte]'] || (this.queryString.price && this.queryString.price.gte);
    const lte = this.queryString['price[lte]'] || (this.queryString.price && this.queryString.price.lte);

    if (gte || lte) {
        priceQuery.price = {};
        if (gte) priceQuery.price.$gte = Number(gte);
        if (lte) priceQuery.price.$lte = Number(lte);
    }

    this.query = this.query.find(priceQuery);
    return this;
  }

  paginate(resultPerPage) {
    const page = parseInt(this.queryString.page) || 1;
    const skip = resultPerPage * (page - 1);

    this.query = this.query.skip(skip).limit(resultPerPage);
    return this;
  }
}

module.exports = ApiFeatures;
