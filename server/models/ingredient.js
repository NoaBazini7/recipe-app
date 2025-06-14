const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    caloriesPer100g: {type: Number, required: true},
    kosher: {type: Boolean, required: true},
    description: {type: String, required: true},
    isCommon: {type: Boolean, required: true},
}, {versionKey: false});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);
module.exports = Ingredient;