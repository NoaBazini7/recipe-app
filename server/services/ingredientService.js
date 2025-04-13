const Ingredient = require("../models/ingredient");

const getAllIngredients = async () => {
    return Ingredient.find({}).lean(); // Fetches all ingredients
};

const getIngredientByName = async (name) => {
    return Ingredient.findOne({name});
};

const addIngredient = async (ingredientData) => {
    const ingredient = new Ingredient(ingredientData);
    return await ingredient.save();
};

module.exports = { getAllIngredients, getIngredientByName, addIngredient };