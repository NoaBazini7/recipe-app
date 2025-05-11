const Ingredient = require("../models/ingredient");

const getAllIngredients = async () => {
    return Ingredient.find({}).lean(); // Fetches all ingredients
};

const getIngredientsByName = async (names) => {
    return Ingredient.find({name: {$in: names}}).lean(); // Fetches ingredients by names
};

const addIngredient = async (ingredientData) => {
    const ingredient = new Ingredient(ingredientData);
    return await ingredient.save();
};


module.exports = {getAllIngredients, getIngredientsByName, addIngredient,};