const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");


router.get("/", recipeController.getAllRecipes);

//router.get("/:id", recipeController.getRecipeById);

router.post("/", recipeController.addRecipe);

//router.put("/:id", recipeController.updateRecipe);

//router.delete("/:id", recipeController.deleteRecipe);

router.post("/filteredRecipes", recipeController.getRecipesByIngredients);

module.exports = router;

