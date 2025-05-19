const fs = require('fs');
const mongoose = require('mongoose');
const Ingredient = require('../models/ingredient'); // adjust path
const Recipe = require('../models/recipe'); // adjust path
const fetchUSDAData = require('./utils/fetchUSDA'); // your function
const normalizeIngredient = require('./utils/normalize'); // your cleaner
const connectDB = require('../config/db');
const categoryMap = require('./utils/ingredientCategoryMap'); // your map

let notFoundCounter = 0;
const categoryCounter = {}; // 🆕 track categories
const mapOfCommons = new Map([]);
const nonKosherKeywords = ['bacon', 'shrimp', 'pork', 'lobster', 'ham', 'crab', 'clam', 'oyster', 'gelatin', 'lard', 'pepperoni', 'squid', 'octopus', 'mollusk', 'shellfish', 'scallop', 'sardine', 'anchovy', 'caviar', 'catfish', 'sturgeon', 'eel', 'frog', 'rabbit', 'venison'];
const dairyCategories = ['Dairy & Eggs'];
const dairyKeywords = [
    "milk", "butter", "cream", "cheese", "yogurt", "curd", "ghee",
    "casein", "whey", "lactose", "custard", "mascarpone", "ricotta",
    "sour cream", "creme", "dairy", "half and half", "milkfat",
    "skimmed milk", "whole milk", "evaporated milk", "condensed milk", "buttermilk", "milk solids",
    "chocolate", "truffle", "caramel", "ganache", "fudge", "nougat",
    "toffee", "pudding", "mousse", "ice cream", "frosting", "glaze",
    "icing", "danish", "croissant", "cheesecake", "tiramisu"
];
const meatCategories = ['Meat, Poultry & Pork'];

const allergenMap = {
    lactose: {
        categories: ['Dairy & Eggs'],
        keywords: dairyKeywords,
    },
    gluten: {
        keywords: ['wheat', 'flour', 'barley', 'rye', 'malt', 'semolina', 'spelt', 'farina', 'durum', 'bread', 'pasta', 'noodle', 'cracker', 'biscuit', 'couscous'],
    },
    nuts: {
        keywords: ['almond', 'cashew', 'walnut', 'pecan', 'hazelnut', 'pistachio', 'macadamia', 'nut'],
    },
    soy: {
        keywords: ['soy', 'soya', 'edamame', 'tofu', 'soybean'],
    },
    eggs: {
        keywords: ['egg', 'eggs', 'egg white', 'egg yolk'],
        categories: ['Dairy & Eggs'],
    },
    fish: {
        keywords: ['salmon', 'tuna', 'trout', 'haddock', 'cod', 'anchovy', 'sardine', 'mackerel'],
        categories: ['Seafood'],
    },
    shellfish: {
        keywords: ['shrimp', 'crab', 'lobster', 'clam', 'scallop', 'oyster', 'mussel'],
        categories: ['Seafood'],
    },
};


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
            const normalizedNames = normalizeIngredient(rawIngredient);

            const ingredientNames = Array.isArray(normalizedNames) ? normalizedNames : [normalizedNames];

            for (const normalizedName of ingredientNames) {

                if (!normalizedName) continue;

                let ingredientDoc = await Ingredient.findOne({name: new RegExp(`^${normalizedName}$`, 'i')});

                if (!ingredientDoc) {
                    ingredientDoc = await fetchUSDAData(normalizedName);

                    //adding to the map of commons
                    mapOfCommons.set(ingredientDoc.name, 1);

                    if (ingredientDoc.category === "Unknown") {
                        notFoundCounter++;
                    }

                    ingredientDoc.category = categoryMap.get(ingredientDoc.category) || ingredientDoc.category;


                    const lowerName = ingredientDoc.name.toLowerCase();
                    const isNonKosher = nonKosherKeywords.some(keyword => lowerName.includes(keyword));
                    ingredientDoc.kosher = !isNonKosher;

                    ingredientDoc = await Ingredient.create(ingredientDoc);
                } else {
                    mapOfCommons.set(ingredientDoc.name, mapOfCommons.get(ingredientDoc.name) + 1);
                }


                // 🆕 Update the category counter
                if (ingredientDoc.category) {
                    categoryCounter[ingredientDoc.category] = (categoryCounter[ingredientDoc.category] || 0) + 1;
                }

                matchedIngredients.push({
                    _id: ingredientDoc._id,
                    name: ingredientDoc.name
                });
            }
        }
        const foundAllergies = new Set();

        let isKosher = true;
        let hasMeat = false;
        let hasDairy = false;

        for (const ing of matchedIngredients) {
            const fullIngredient = await Ingredient.findById(ing._id);
            if (!fullIngredient.kosher) isKosher = false;
            if ((dairyCategories.includes(fullIngredient.category) && !(fullIngredient.name.toLowerCase()).includes("egg")) || (dairyKeywords.some(keyword =>
                fullIngredient.name.toLowerCase().includes(keyword)))) hasDairy = true;
            if (meatCategories.includes(fullIngredient.category)) hasMeat = true;

            for (const [allergy, criteria] of Object.entries(allergenMap)) {
                const nameMatch = criteria.keywords?.some(keyword => fullIngredient.name.includes(keyword));
                const categoryMatch = criteria.categories?.some(category => fullIngredient.category.includes(category));

                // Exclude false positives for gluten-free recipes
                const isGlutenFalsePositive =
                    allergy === "gluten" &&
                    fullIngredient.name.toLowerCase().includes("gluten free");

                if ((nameMatch || categoryMatch) && !isGlutenFalsePositive) {
                    foundAllergies.add(allergy);
                }
            }
        }


        if (hasMeat && hasDairy) {
            isKosher = false;
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
            kosher: isKosher,
            rawIngredients: rawRecipe.ingredients,
            matchedIngredients,
            steps: rawRecipe.steps,
            allergies: Array.from(foundAllergies),
        });

        console.log(`🍽️ [${count}/${totalRecipes}] Inserted recipe: ${rawRecipe.title}`);
    }

    console.log('🎉 Done seeding recipes with enriched ingredients!');
    console.log(`❌ Not found ingredients (unknown category): ${notFoundCounter}`);

    // 🆕 Print the category summary
    console.log('\n📊 Ingredient Categories Summary:');
    for (const [category, count] of Object.entries(categoryCounter)) {
        console.log(`- ${category}: ${count} ingredients`);
    }


    // 🔝 Get top 100 most common ingredients
    const topIngredients = Array.from(mapOfCommons.entries())
        .sort((a, b) => b[1] - a[1]) // sort by frequency descending
        .slice(0, 100) // take top 50
        .map(([name]) => name); // extract only the names

    console.log('\n🔥 Marking top 100 ingredients as common...');
    console.log('Top 100 ingredients:', topIngredients);

// 📝 Update each one in MongoDB
    await Promise.all(topIngredients.map(async (ingredientName) => {
        await Ingredient.findOneAndUpdate(
            {name: new RegExp(`^${ingredientName}$`, 'i')}, // case-insensitive match
            {isCommon: true}
        );
    }));

    console.log('✅ Top 100 ingredients marked as isCommon!');


    await mongoose.disconnect();
}

seedRecipes().catch(err => {
    console.error('❌ Error seeding:', err);
    process.exit(1);
});
