const packagingWords = [
    "container", "canned", "package", "packages", "packet", "loaf",
    "large", "medium", "small", "jumbo", "extra",
    "can", "cans", "pounds", "pound", "ounces", "ounce", "cup", "cups",
    "slices", "slice", "teaspoons", "tablespoons", "teaspoon", "tablespoon",
    "inch", "inches", "fl", "oz", "ozs", "chunk", "chunks", "square", "squares",
    "piece", "pieces", "dash", "dashes", "bags", "bag", "bunch", "bunches",
    "bite-size", "bites", "pints", "pint", "part", "quart", "quarts", "envelopes",
    "envelope", "bite sized", "carton", "cartons", "heads", "head", "ring", "rings",
    "drop", "drops", "gallon", "gallons", "jar", "jars", "milliliters", "milliliter",
    "bottle", "bottles", "fluid", "liters", "liter", "round", "rounds", "trays", "tray",
    "bunch", "box", "boxes", "strip", "floret", "florets", "ears", "ear", "bite-sized",
    "old bay", "in bias", "hillshire farm rope", "tops", "portions", "portion", "pieces",
    "stalk", "stalks",


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
    "for serving", "membranes", "seeds removed", "cold", "freshly", "for rolling", "casings removed",
    "warmed", "until liquid", "cooled", "at room temperature", "for dusting", "king arthur", "boiling", "pressed",
    "stemmed", "to", "for greasing", "for dusting pan", "pureed", "hulled", "chilled", "tails on",
    "desired", "cover", "diagonally", "to portion", "zest", "zested", "equal", "discarded leaf", "pure",
    "morton", "broken in half", "food", "from", "chipotle pepper", "for coating", "pan", "campbell's",
    "EZ peel type", "shells down the back", "fully", "jimmy dean", "flanken across bone", "tiny", "frank's redhot",
    "tabasco", "valentina", "tails removed", "tail", "left on", "husked", "thirds", "white green parts", "membranes",
    "broken", "boneless", "skinless", "skin on", "bone in", "miniature", "on the diagonal", "snipped", "in bias",
    "deep dish",
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
    "hard egg": "eggs",
    "hard eggs": "eggs",
    "hot water": "water",
    "chipotle chilies in adobo sauce": "chipotle peppers in adobo sauce",
    "adobo sauce chipotle peppers": "chipotle peppers in adobo sauce",
    "all purpose wheat flour": "all purpose flour",
    "avocado": "avocado",
    "banana": "bananas",
    "carrot": "carrots",
    "chicken breast meat": "chicken breast",
    "chicken meat": "chicken",
    "cloves cloves garlic": "garlic",
    "cloves garlic": "garlic",
    "cooking spray oil": "cooking spray",
    "dill": "dill pickle",
    "dijon style mustard": "dijon mustard",
    "dried thyme": "dried thyme leaves",
    "egg": "eggs",
    "egg white": "eggs",
    "egg whites": "eggs",
    "egg yolk": "eggs",
    "egg yolks": "eggs",
    "half half": "half and half cream",
    "half half cream": "half and half cream",
    "kernel sweet corn": "kernel corn",
    "leaf lettuce dried": "lettuce",
    "leaf lettuce": "lettuce",
    "lime": "limes",
    "limes in": "limes",
    "lime juice": "limes",
    "lemon": "lemons",
    "of ginger": "ginger",
    "white sugar": "sugar",
    "bread": "white bread",
    "potato": "potatoes",
    "sweet potato": "sweet potatoes",
    "steaks": "beef steak",
    "beef sirloin beef steaks": "sirloin steak",
    "beef sirloin": "sirloin steak",
    "beef eye of roast": "round steak",
    "beef chuck roast": "chuck steak",
    "beef chuck": "chuck steak",
    "flat corned beef brisket": "corned beef brisket",
    "corned beef brisket spice": "corned beef brisket",
    "beef shank bone": "beef shank",
    "ground pork sausage": "pork sausage",
    "pork picnic roast": "pork roast",
    "pork tenderloin": "pork tenderloins",
    "chicken bouillon granules": "chicken bouillon",
    "chicken breast": "chicken breasts",
    "chicken stock": "chicken broth",
    "chicken breast bite size": "chicken breasts",
    "black soy sauce": "soy sauce",
    "dark soy sauce": "soy sauce",
    "chile garlic sauce": "chili garlic sauce",
    "barbecue sauce": "bbq sauce",
    "barbeque sauce": "bbq sauce",
    "sriracha chili garlic sauce": "sriracha sauce",
    "hot pepper sauce": "hot sauce",
    "rag old world style traditional sauce": "ragu sauce",
    "crisco original no stick cooking spray": "cooking spray",
    "nonstick cooking spray": "cooking spray",
    "nonstich spray": "cooking spray",
    "serving nonstick cooking spray": "cooking spray",
    "wheat bread crumbs": "bread crumbs",
    "italian seasoned bread crumbs": "seasoned bread crumbs",
    "gluten free vanilla extract": "vanilla extract",
    "sea salt": "kosher salt",
    "fine table salt": "salt",
    "seasoning salt": "seasoned salt",
    "coarse sea salt": "kosher salt",
    "fine sea salt": "salt",
    "lemon lime flavored carbonated beverage": "lime soda",
    "raw shrimp shelled tails attached": "shrimp",
    "shrimp tails attached": "shrimp",
    "colossal shrimp ez peel type": "colossal shrimp",
    "orange": "oranges",
    "onion": "onions",
    "ranch salad dressing mix": "ranch dressing",
    "ranch dressing mix": "ranch dressing",
    "red bell pepper": "red bell peppers",
    "red pepper": "red bell peppers",
    "red peppers": "red bell peppers",
    "red yellow bell pepper": "red bell peppers",
    "skin on bone in chicken thighs": "chicken thighs",
    "leeks": "leeks",
    "oil": "vegetable oil",
    "tomatoes green chile peppers": "diced tomatoes and green chiles",
    "tomatoes green chiles": "diced tomatoes and green chiles",
    "tomatoes lime juice cilantro": "diced tomatoes with lime juice and cilantro",
    "tomato": "tomatoes",
    "white brown rice": "white rice",
    "red coloring": "red food coloring",
    "green coloring": "green food coloring",
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

const normalizeIngredient = (raw) => {
    let ingredient = raw.toLowerCase().trim();

    // Remove fractions like 1 ½, 1/4, etc.
    ingredient = ingredient.replace(/(\d+(\s?\/\s?\d+)?(\s?½)?)/g, '').trim();

    // Remove any quantity numbers (e.g., "2", "1", "½")
    ingredient = ingredient.replace(/^\d+(\.\d+)?(\s?½)?\s?/g, '').trim();

    ingredient = ingredient.replace(packagingRegex, '')
        .replace(descriptorRegex, '')
        .trim();

    ingredient = normalize(ingredient);

    // Check for "salt" and "pepper" in the ingredient name
    if (ingredient.includes("salt") && ingredient.includes("pepper")) {
        if (ingredient.includes("kosher"))
            return ["kosher salt", "ground black pepper"];
        return ["salt", "ground black pepper"];
    }

    // Map to normalized ingredient if it exists
    if (ingredientsMap[ingredient]) {
        ingredient = ingredientsMap[ingredient];
    }

    return ingredient;
};
module.exports = normalizeIngredient;
