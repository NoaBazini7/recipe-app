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
        const ingredientNames = req.body.ingredients || [];
        const mode = req.body.mode || "fridge";
        const tolerance = parseInt(req.body.tolerance) || 0;
        const kosherOnly = req.body.kosherOnly || false;
        const complexity = req.body.complexity || null;
        const allergies = req.body.userAllergies || [];

        const filteredRecipes = allRecipes.filter((recipe) => {
            const recipeIngredientNames = recipe.matchedIngredients.map(
                (ingredient) => ingredient.name
            );

            console.log("Recipe name: ", recipe.title);
            const matchedCount = recipeIngredientNames.filter((name) =>
                ingredientNames.includes(name)
            ).length;

            const missingCount = recipeIngredientNames.length - matchedCount;

            // ❌ Kosher-only filter
            if (kosherOnly && !recipe.isKosher) return false;

            console.log("ingredient count: ", recipeIngredientNames.length);

            // ❌ Complexity filter
            if (complexity === "simple" && recipeIngredientNames.length > 5) return false;
            if (complexity === "intermediate" &&
                (recipeIngredientNames.length < 6 || recipeIngredientNames.length > 10)) return false;
            if (complexity === "complex" && recipeIngredientNames.length <= 10) return false;

            // ❌ Allergy filter
            if (allergies.length > 0 && recipe.allergies.some(allergy => allergies.includes(allergy))) return false;

            // ✅ Filtering logic
            if (mode === "fridge") {
                return recipeIngredientNames.every((name) =>
                    ingredientNames.includes(name)
                );
            } else if (mode === "inspiration") {
                return matchedCount > 0 && missingCount <= tolerance;
            }

            return false;
        });

        res.json(filteredRecipes);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};


module.exports = {getAllRecipes, getRecipesByIDs, addRecipe, updateRecipe, deleteRecipe, getRecipesByIngredients};
