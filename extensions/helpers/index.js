// strip off whitespaces from string
module.exports.optimizeQuery = function (query) {
  return query
    .replace('\n', ' ')
    .replace(/\s*\n+\s*|\s+/g, ' ')
    .trim();
};
