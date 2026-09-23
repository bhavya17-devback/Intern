const express = require("express");
const router = express.Router();
const subcategoryController = require("./subcategory.controller");

router.get("/", subcategoryController.getAll);

// YE LINE ZAROORI HAI:
module.exports = router;