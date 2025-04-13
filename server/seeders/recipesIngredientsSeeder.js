const fs = require('fs');
const mongoose = require('mongoose');
const Ingredient = require('../models/ingredient'); // adjust path
const Recipe = require('../models/recipe'); // adjust path
const fetchUSDAData = require('./utils/fetchUSDA'); // your function
const normalizeIngredient = require('./utils/normalize'); // your cleaner
const connectDB = require('../config/db');

let notFoundCounter = 0;

async function seedRecipes() {
    await connectDB();

    console.log('🧹 Cleaning up collections...');
    await Ingredient.deleteMany({});
    await Recipe.deleteMany({});
    console.log('✅ Cleared Ingredients and Recipes collections!');

    const recipes = JSON.parse(fs.readFileSync('recipes.json', 'utf-8'));
    const totalRecipes = recipes.length;

    let count = 0;

    for (const rawRecipe of recipes) {
        count++;
        const matchedIngredients = [];

        for (const rawIngredient of rawRecipe.ingredients) {
            const normalizedName = normalizeIngredient(rawIngredient);
            if (!normalizedName) continue;

            let ingredientDoc = await Ingredient.findOne({ name: new RegExp(`^${normalizedName}$`, 'i') });

            if (!ingredientDoc) {
                ingredientDoc = await fetchUSDAData(normalizedName);
                if (ingredientDoc.category === "Unknown") {
                    notFoundCounter++;
                }
                ingredientDoc = await Ingredient.create(ingredientDoc); // Now we have the _id
            }

            matchedIngredients.push({
                _id: ingredientDoc._id,
                name: ingredientDoc.name
            });
        }

        await Recipe.create({
            title: rawRecipe.title,
            url: rawRecipe.url,
            imageUrl: rawRecipe.image,
            category: rawRecipe.category,
            rating: rawRecipe.rating,
            calories: rawRecipe.calories,
            prep_time: rawRecipe.prep_time,
            cook_time: rawRecipe.cook_time,
            total_time: rawRecipe.total_time,
            servings: rawRecipe.servings,
            kosher: true,
            rawIngredients: rawRecipe.ingredients,
            matchedIngredients,
            steps: rawRecipe.steps,
        });

        console.log(`🍽️ [${count}/${totalRecipes}] Inserted recipe: ${rawRecipe.title}`);
    }

    console.log('🎉 Done seeding recipes with enriched ingredients!');
    console.log(`❌ Not found ingredients (unknown category): ${notFoundCounter}`);
    await mongoose.disconnect();
}

seedRecipes().catch(err => {
    console.error('❌ Error seeding:', err);
    process.exit(1);
});
