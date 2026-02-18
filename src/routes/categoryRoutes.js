const express = require("express");
const { getCategories } = require("../controllers/category");
const router = express.Router();

router.route("/categories").get(getCategories);

module.exports = router;
