const packagingWords = [
    "container", "canned", "package", "packages", "packet", "loaf",
    "large", "medium", "small", "jumbo", "extra",
    "can", "cans", "pounds", "pound", "ounces", "ounce", "cup", "cups",
    "slices", "slice", "teaspoons", "tablespoons", "teaspoon", "tablespoon",
    "inch", "inches", "fl", "oz", "ozs", "chunk", "chunks", "square", "squares",
    "piece", "pieces", "dash", "dashes", "bags", "bag", "bunch", "bunches",
    "bite size", "bites", "pints", "pint", "part", "quart", "quarts", "envelopes",
    "envelope", "bite sized", "carton", "cartons", "heads", "head", "ring", "rings",
    "drop", "drops", "gallon", "gallons", "jar", "jars", "milliliters", "milliliter",
    "bottle", "bottles", "fluid", "liters", "liter", "round", "rounds", "trays", "tray",
    "bunch", "box", "boxes", "strip", "floret", "florets", "ears", "ear", "bite-sized",
    "old bay", "in bias", "hillshire farm rope", "tops",

];

// Words that describe prep or state
const descriptorWords = [
    "root", "warm", "softened", "juiced", "seeded", "separated", "sifted", "long",
    "divided", "clove", "blanched", "wedge", "heated", "cut into", "pitted", "halved",
    "bulk", "pre", "cubed", "cube", "thin", "mild", "pinch", "prepared", "dry", "dash", "smashed",
    "or", "cut", "into", "rinsed", "beaten", "refrigerated", "chopped", "diced", "sliced", "torn",
    "shredded", "lightly", "toasted", "such", "cheerio", "optional", "mashed", "quartered", "cored",
    "wedge", "peeled", "trimmed", "halves", "cubes", "shucked", "wedges", "crumbled", "to cover",
    "grated", "minced", "crushed", "boiled", "cooked", "thinly", "curd", "strips", "top", "cleaned",
    "about", "thick", "then", "new", "skinned", "degrees", "f", "c", "lengthwise", "deveined", "tails left on",
    "roasted", "melted", "thawed", "cook", "serve", "packed", "coarsely", "fresh", "frozen", "ripe",
    "washed", "finely", "uncooked", "whole", "drained", "and", "pre-cooked", "plus", "room temperature",
    "very", "stewed", "broken in half", "split", "white lily", "cholula", "ball park", "crisp", "crisps",
    "more", "if", "as", "needed", "sharp", "to taste", "for frying", "with lime juice and cilantro (such as Rotel)",
    "with", "heart toothpick", "(such as Red Gold)", "from concentrate", "of excess fat", "for garnish",
    "for serving", "tops seeds membranes removed", "cold", "freshly", "for rolling", "casings removed",
    "warmed", "until liquid", "cooled", "at room temperature", "for dusting", "king arthur", "boiling", "pressed",
    "stemmed", "to", "for greasing", "for dusting pan", "pureed", "hulled", "chilled", "tails on",
    "seeds removed", "desired", "cover", "diagonally", "to portion", "zest", "zested", "equal",
    "discarded leaf", "pure", "morton", "broken in half", "food", "from", "chipotle pepper",
    "for coating", "pan", "campbell's", "ez peel type", "shells down the back", "fully", "jimmy dean",
    "flanken across bone", "tiny", "frank's redhot", "tabasco", "valentina", "tails removed", "tail", "left on",
    "husked", "thirds", "white green parts",
];

const ingredientsMap = {
    "dried active yeast": "active yeast",
    "garlic granules": "granulated garlic",
    "dried onion": "dried onion flakes",
    "pickled jalape os": "pickled jalapenos",
    "jalape o pepper": "jalapeno peppers",
    "english cucumber": "cucumber",
    "coarse salt": "kosher salt",
    "steak fillet": "beef tenderloin",
    "almond meal": "almond flour",
    "apple apples": "apple",
    "gluten free chicken broth": "chicken broth",
    "pork beans": "pork and beans can",
    "italian style salad dressing mix": "italian style salad dressing",
    //garlic cloves
    "hard egg": "eggs",
    "hard eggs": "eggs",
    "hot water": "water",
    "chipotle chilies in adobo sauce": "chipotle peppers in adobo sauce",
    "adobo sauce chipotle peppers": "chipotle peppers in adobo sauce",


}

// Build regex patterns
const packagingRegex = new RegExp(`\\b(${packagingWords.join('|')})\\b\\s?`, 'gi');
const descriptorRegex = new RegExp(`\\s*(,|\\b)(${descriptorWords.join('|')})\\b`, 'gi');


const normalize = (str) => {
    return str
        .replace(/\(.*?\)/g, '') // removes (anything in parentheses)
        .toLowerCase()
        .replace(/[^a-z'\s]/g, ' ') // remove punctuation
        .replace(/\s+/g, ' ')
        .trim();
};

function normalizePlural(ingredientName) {
    let normalized = ingredientName.toLowerCase().trim();

    const irregularPlurals = {
        "tomatoes": "tomato",
        "bananas": "banana",
        "carrots": "carrot",
        "apples": "apple",
        "potatoes": "potato",
        "peppers": "pepper",
        "breads": "bread",
        "grapes": "grape",
        "cherries": "cherry",
        "leaves": "leaf",
        "cranberries": "cranberry",
        "mangoes": "mango",
        "strawberries": "strawberry",
    };

    // Split the name into words
    const words = normalized.split(" ");
    const lastWord = words[words.length - 1];

    if (irregularPlurals[lastWord]) {
        words[words.length - 1] = irregularPlurals[lastWord];
    } else if (lastWord.endsWith("s") && !lastWord.endsWith("ss") && lastWord.length > 2 && lastWord !== "flakes") {
        words[words.length - 1] = lastWord.slice(0, -1);
    }

    return words.join(" ");
}

// Assuming you already have something like this:
const normalizeIngredient = (raw) => {
    let ingredient = raw.toLowerCase().trim();

    // Remove fractions like 1 ½, 1/4, etc.
    ingredient = ingredient.replace(/(\d+(\s?\/\s?\d+)?(\s?½)?)/g, '').trim();  // This removes any fractions

    // Remove any quantity numbers (e.g., "2", "1", "½")
    ingredient = ingredient.replace(/^\d+(\.\d+)?(\s?½)?\s?/g, '').trim();

    ingredient = ingredient.replace(packagingRegex, '')
        .replace(descriptorRegex, '')
        .trim();// Remove adjectives like "Large", "Medium", "Small", etc.

    ingredient = normalize(ingredient); // Normalize the ingredient name
    //ingredient = normalizePlural(ingredient); // Normalize plural forms


    return ingredient;
};
module.exports = normalizeIngredient;
