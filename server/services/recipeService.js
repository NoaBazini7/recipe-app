const Recipe = require("../models/recipe");

const getAllRecipes = async () => {
    return Recipe.find(); // Fetches all recipes
};

const getRecipeById = async (id) => {
    return Recipe.findById(id); // Fetches a recipe by ID
};

const addRecipe = async (recipeData) => {
    const recipe = new Recipe(recipeData);
    return await recipe.save();
};

const updateRecipe = async (id, recipeData) => {
    return Recipe.updateOne(id, recipeData) // Updates a recipe by ID
};

const deleteRecipe = async (id) => {
    return Recipe.deleteOne(id); // Deletes a recipe by ID
};

module.exports = {getAllRecipes, getRecipeById, addRecipe, updateRecipe, deleteRecipe};
