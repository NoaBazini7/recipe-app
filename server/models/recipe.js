const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }, // URL to the recipe
    imageUrl: { type: String},
    category: { type: String, required: true }, // Category of the recipe
    rating: { type: Number}, // Rating of the recipe
    calories: { type: String}, // Calories per serving
    prep_time: { type: String}, // Preparation time
    cook_time: { type: String}, // Cooking time
    total_time: { type: String}, // Total time
    servings: { type: Number}, // Number of servings
    kosher: { type: Boolean}, // Kosher status
    rawIngredients: { type: [String]}, // Original ingredient strings
    matchedIngredients: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
            name: { type: String }
        }
    ],    steps: [String]
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;