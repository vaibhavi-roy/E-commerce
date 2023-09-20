class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    //search for product using name
    search() {
        const keyword = this.queryStr.keyword
            ? { //create keyword using regex

                name: {
                    $regex: this.queryStr.keyword,
                    $options: 'i' //case insensitive
                },
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }
    //filter product using category
    filter() {
        const queryCopy = { ...this.queryStr };//pass by value

        //removing some fields for category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(field => {
            delete queryCopy[field];
        });

        //Filter for price and rating

        let queryStr = JSON.stringify(queryCopy);   //convert object to string
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); //for price in range (/\b()\b/g)
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
};

module.exports = ApiFeatures;