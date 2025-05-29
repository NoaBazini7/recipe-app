const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);

router.get("/search", userController.getUserById);

router.post("/", userController.createUser);

router.put("/update", userController.updateUser);

router.delete("/delete", userController.deleteUser);

router.put("/change-password", userController.changePassword);

router.post("/add-recipe", userController.addRecipeToList);

router.post("/remove-recipe", userController.removeRecipeFromList);

router.post("/delete-list", userController.deleteList);

router.get("/saved-recipes", userController.fetchSavedRecipes);

router.put("/fridgeUpdate", userController.updateFridgeIngredients);

module.exports = router;
