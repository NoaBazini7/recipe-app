const ingredientService = require("../services/ingredientService");


const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await ingredientService.getAllIngredients();
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// Example in Express.js controller
const getIngredientsByName = async (req, res) => {
    const names = req.query.names;

    if (!Array.isArray(names)) {
        return res.status(400).json({error: "names must be an array"});
    }

    try {
        // Fetch all matching ingredients
        const ingredients = await ingredientService.getIngredientsByName(names);

        // Sort according to the order in the `names` array
        const ingredientsMap = new Map();
        ingredients.forEach(ing => ingredientsMap.set(ing.name.toLowerCase(), ing));

        const sortedIngredients = names.map(name => ingredientsMap.get(name.toLowerCase()));

        res.json(sortedIngredients);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
};


const addIngredient = async (req, res) => {
    try {
        const ingredient = await ingredientService.addIngredient(req.body);
        res.status(201).json(ingredient);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const getAllCategories = async (req, res) => {
    try {
        const ingredients = await ingredientService.getAllIngredients();
        const categories = [...new Set(ingredients.map(ingredient => ingredient.category))];
        res.json(categories);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

module.exports = {getAllIngredients, getIngredientsByName, addIngredient, getAllCategories};
