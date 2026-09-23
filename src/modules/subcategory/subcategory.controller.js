const subcategoryService = require("./subcategory.service");

const getAll = async (req, res) => {
  try {
    const { category } = req.query;
    const subcategories = await subcategoryService.getSubcategories(category);
    res.status(200).json({
      success: true,
      count: subcategories.length,
      data: subcategories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// YE LINE ZAROORI HAI:
module.exports = { getAll };