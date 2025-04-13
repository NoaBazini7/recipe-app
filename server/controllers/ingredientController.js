const ingredientService = require("../services/ingredientService");


const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await ingredientService.getAllIngredients();
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getIngredientByName = async (req, res) => {
    try {
        const ingredient = await ingredientService.getIngredientByName(req.params.name);
        if (!ingredient) return res.status(404).json({ error: "Ingredient not found" });
        res.json(ingredient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addIngredient = async (req, res) => {
    try {
        const ingredient = await ingredientService.addIngredient(req.body);
        res.status(201).json(ingredient);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const ingredients = await ingredientService.getAllIngredients();
        const categories = [...new Set(ingredients.map(ingredient => ingredient.category))];
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllIngredients, getIngredientByName, addIngredient, getAllCategories };
