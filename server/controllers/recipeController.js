const recipeService = require("../services/recipeService");

const getAllRecipes = async (req, res) => {
    try {
        const recipes = await recipeService.getAllRecipes();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const getRecipesByIDs = async (req, res) => {
    try {
        const recipes = await recipeService.getRecipeById(req.query.recipeIds);
        if (!recipes) return res.status(404).json({error: "Recipes not found"});
        res.json(recipes);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const addRecipe = async (req, res) => {
    try {
        const recipe = await recipeService.addRecipe(req.body);
        res.status(201).json(recipe);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const updateRecipe = async (req, res) => {
    try {
        const updatedRecipe = await recipeService.updateRecipe(req.params.id, req.body);
        if (!updatedRecipe) return res.status(404).json({error: "Recipe not found"});
        res.json(updatedRecipe);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const deletedRecipe = await recipeService.deleteRecipe(req.params.id);
        if (!deletedRecipe) return res.status(404).json({error: "Recipe not found"});
        res.json({message: "Recipe deleted successfully"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const getRecipesByIngredients = async (req, res) => {
    try {
        const allRecipes = await recipeService.getAllRecipes();
        const ingredientNames = req.body.ingredients;
        const filteredRecipes = allRecipes.filter((recipe) => {
            // console.log(recipe.matchedIngredients.map((ingredient) => ingredient.name));
            const recipeIngredientNames = recipe.matchedIngredients.map((ingredient) => ingredient.name);
            return recipeIngredientNames.every((name) =>
                ingredientNames.includes(name)
            );
        });
        res.json(filteredRecipes);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

module.exports = {getAllRecipes, getRecipesByIDs, addRecipe, updateRecipe, deleteRecipe, getRecipesByIngredients};
