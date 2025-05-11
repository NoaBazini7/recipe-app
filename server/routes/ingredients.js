const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController"); // Import the controller

// Route to get all ingredients
router.get("/", ingredientController.getAllIngredients);

// Route to get an ingredient by name
//router.get("/:name", ingredientController.getIngredientByName);

// Route to get all categories of ingredients
router.get("/categories", ingredientController.getAllCategories);

// Route to add a new ingredient
router.post("/", ingredientController.addIngredient);

// Route to get ingredients by IDs
router.get("/getIngredientsByName", ingredientController.getIngredientsByName);

module.exports = router;
