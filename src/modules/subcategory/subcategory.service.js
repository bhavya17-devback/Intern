const Subcategory = require("../../models/Subcategory");

const getSubcategories = async (categoryId) => {
  const filter = categoryId ? { category: categoryId } : {};
  return await Subcategory.find(filter).populate("category", "name");
};

module.exports = { getSubcategories };