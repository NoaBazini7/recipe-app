const axios = require("axios");
const Ingredient = require("../../models/ingredient");
require('dotenv').config({path: require('path').resolve(__dirname, '../../.env')});
const API_KEY = process.env.USDA_API_KEY; // Ensure you have this in your .env file
console.log("Using API Key:", API_KEY); // Just to check if it loads

const USDA_API = "https://api.nal.usda.gov/fdc/v1/foods/search";


async function fetchUSDAData(searchName) {
    console.log(`🔍 Searching USDA for: ${searchName}`);
    try {
        // Step 2: Search USDA API
        const usdaResponse = await axios.get(USDA_API, {
            params: {
                api_key: API_KEY,
                query: searchName,
                pageSize: 1
            }
        });

        if (!usdaResponse.data.foods || usdaResponse.data.foods.length === 0) {
            console.log(`❌ No match found for ${searchName}`);
            return await new Ingredient({
                name: searchName,
                category: "Unknown",
                kosher: true,
                description: "No description available",
                caloriesPer100g: 0,
                isCommon: false
            });
        }

        // Step 3: Extract category & calories
        const usdaData = usdaResponse.data.foods[0]; // Best match
        const category = usdaData.foodCategory || "Unknown";
        const calories = usdaData.foodNutrients?.find(n => (n.nutrientName.includes("Energy")) && n.unitName === "KCAL")?.value || 0;


        // Step 4: Save to MongoDB
        return await new Ingredient({
                name: searchName,
                category: category,
                kosher: true,
                description: usdaData.description,
                caloriesPer100g: calories,
                isCommon: false
            }
        );

    } catch (usdaError) {
        console.log(`⚠️ Error fetching USDA data for ${searchName}: ${usdaError.message}`);
    }

    // Step 5: Respect USDA API Rate Limit (Avoid 1000 requests per hour)
    await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 sec delay
}

module.exports = fetchUSDAData;