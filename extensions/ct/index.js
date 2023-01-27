const { getFacetProductProjectionQuery } = require('./customQueries');

module.exports.ctCustomQueries = {
  getFacetProducts: ({ variables }) => {
    return { query: getFacetProductProjectionQuery, variables };
  }
};
