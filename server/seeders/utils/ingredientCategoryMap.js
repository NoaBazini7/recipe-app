const categoryMap = new Map([
    // 🍎 Fruits & Vegetables
    ["Pre-Packaged Fruit & Vegetables", "Fruits & Vegetables"],
    ["Fruits and Fruit Juices", "Fruits & Vegetables"],
    ["Berries/Small Fruit", "Fruits & Vegetables"],
    ["Dried fruits", "Fruits & Vegetables"],
    ["Tomatoes", "Fruits & Vegetables"],
    ["Onions", "Fruits & Vegetables"],
    ["Lettuce and lettuce salads", "Fruits & Vegetables"],
    ["Canned Vegetables", "Fruits & Vegetables"],
    ["Frozen Vegetables", "Fruits & Vegetables"],
    ["Frozen Fruit & Fruit Juice Concentrates", "Fruits & Vegetables"],
    ["Other red and orange vegetables", "Fruits & Vegetables"],
    ["Other vegetables and combinations", "Fruits & Vegetables"],
    ["Coleslaw, non-lettuce salads", "Fruits & Vegetables"],
    ["Vegetables - Prepared/Processed", "Fruits & Vegetables"],
    ["Fried vegetables", "Fruits & Vegetables"],
    ["French Fries, Potatoes & Onion Rings", "Fruits & Vegetables"],
    ["French fries and other fried white potatoes", "Fruits & Vegetables"],
    ["Other starchy vegetables", "Fruits & Vegetables"],
    ["Cabbage", "Fruits & Vegetables"],
    ["Legumes and Legume Products", "Fruits & Vegetables"],
    ["Vegetables and Vegetable Products", "Fruits & Vegetables"],
    ["Canned Fruit", "Fruits & Vegetables"],
    ["Fruit & Vegetable Juice, Nectars & Fruit Drinks", "Fruits & Vegetables"],


    // 🍞 Breads, Grains & Cereal
    ["Breads & Buns", "Breads, Grains & Cereal"],
    ["Rolls and buns", "Breads, Grains & Cereal"],
    ["Bagels and English muffins", "Breads, Grains & Cereal"],
    ["Yeast breads", "Breads, Grains & Cereal"],
    ["Biscuits, muffins, quick breads", "Breads, Grains & Cereal"],
    ["Bread & Muffin Mixes", "Breads, Grains & Cereal"],
    ["Cereal", "Breads, Grains & Cereal"],
    ["Ready-to-eat cereal, lower sugar", "Breads, Grains & Cereal"],
    ["Cereal bars", "Breads, Grains & Cereal"],
    ["Other Grains & Seeds", "Breads, Grains & Cereal"],
    ["Cereal Grains and Pasta", "Breads, Grains & Cereal"],
    ["Flours & Corn Meal", "Breads, Grains & Cereal"],
    ["Rice", "Breads, Grains & Cereal"],
    ["Pasta by Shape & Type", "Breads, Grains & Cereal"],
    ["All Noodles", "Breads, Grains & Cereal"],
    ["Pasta, noodles, cooked grains", "Breads, Grains & Cereal"],
    ["Pasta mixed dishes, excludes macaroni and cheese", "Breads, Grains & Cereal"],
    ["Pizza Mixes & Other Dry Dinners", "Breads, Grains & Cereal"],
    ["Ready-to-eat cereal, lower sugar (=<21.2g/100g)", "Breads, Grains & Cereal"],
    ["Frozen Bread & Dough", "Breads, Grains & Cereal"],
    ["Crusts & Dough", "Breads, Grains & Cereal"],


    // 🥩 Meat, Poultry & Pork
    ["Bacon, Sausages & Ribs", "Meat, Poultry & Pork"],
    ["Sausages and Luncheon Meats", "Meat, Poultry & Pork"],
    ["Cold cuts and cured meats", "Meat, Poultry & Pork"],
    ["Frankfurters", "Meat, Poultry & Pork"],
    ["Sausages", "Meat, Poultry & Pork"],
    ["Sausages, Hotdogs & Brats", "Meat, Poultry & Pork"],
    ["Frozen Sausages, Hotdogs & Brats", "Meat, Poultry & Pork"],
    ["Beef Products", "Meat, Poultry & Pork"],
    ["Beef, excludes ground", "Meat, Poultry & Pork"],
    ["Ground beef", "Meat, Poultry & Pork"],
    ["Pork Products", "Meat, Poultry & Pork"],
    ["Pork", "Meat, Poultry & Pork"],
    ["Poultry Products", "Meat, Poultry & Pork"],
    ["Poultry, Chicken & Turkey", "Meat, Poultry & Pork"],
    ["Chicken, whole pieces", "Meat, Poultry & Pork"],
    ["Frozen Poultry, Chicken & Turkey", "Meat, Poultry & Pork"],
    ["Other Meats", "Meat, Poultry & Pork"],
    ["Other Deli", "Meat, Poultry & Pork"],
    ["Meat mixed dishes", "Meat, Poultry & Pork"],
    ["Meat/Poultry/Other Animals Unprepared/Unprocessed", "Meat, Poultry & Pork"],
    ["Pepperoni, Salami & Cold Cuts", "Meat, Poultry & Pork"],
    ["Meat/Poultry/Other Animals  Unprepared/Unprocessed", "Meat, Poultry & Pork"],
    ["Canned Meat", "Meat, Poultry & Pork"],
    ["Meat mixed dishes", "Meat, Poultry & Pork"],
    ["Stuffing", "Meat, Poultry & Pork"],
    ["Other Meats", "Meat, Poultry & Pork"],
    ["Other Deli", "Meat, Poultry & Pork"],
    ["Meat/Poultry/Other Animals - Prepared/Processed", "Meat, Poultry & Pork"],

    //🐟 Seafood
    ["Fish", "Seafood"],
    ["Canned Seafood", "Seafood"],
    ["Finfish and Shellfish Products", "Seafood"],
    ["Frozen Fish & Seafood", "Seafood"],
    ["Fish & Seafood", "Seafood"],


    // 🧀 Dairy & Eggs
    ["Milk", "Dairy & Eggs"],
    ["Milk, whole", "Dairy & Eggs"],
    ["Yogurt", "Dairy & Eggs"],
    ["Cheese", "Dairy & Eggs"],
    ["Butter & Spread", "Dairy & Eggs"],
    ["Cream", "Dairy & Eggs"],
    ["Cream cheese, sour cream, whipped cream", "Dairy & Eggs"],
    ["Dairy and Egg Products", "Dairy & Eggs"],


    //🔄 Dairy and Meat Alternatives
    ["Plant-based milk", "Dairy & Meat Alternatives"],
    ["Plant Based Milk", "Dairy & Meat Alternatives"],
    ["Cream and cream substitutes", "Dairy & Meat Alternatives"],
    ["Nut & Seed Butters", "Dairy & Meat Alternatives"],
    ["Eggs & Egg Substitutes", "Dairy & Meat Alternatives"],


    // 🧂 Pantry Staples (Spices, Oils, Sauces & Condiments)
    ["Herbs & Spices", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Spices and Herbs", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Seasoning Mixes, Salts, Marinades & Tenderizers", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Salad dressings and vegetable oils", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Salad Dressing & Mayonnaise", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Soups, Sauces, and Gravies", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Canned Soup", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Canned Condensed Soup", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Other Soups", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Gravy Mix", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Prepared Pasta & Pizza Sauces", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Pasta sauces, tomato-based", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Ketchup, Mustard, BBQ & Cheese Sauce", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Mustard and other condiments", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Tomato-based condiments", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Oriental, Mexican & Ethnic Sauces", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Other Cooking Sauces", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Soy-based condiments", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Dips & Salsa", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Dips, gravies, other sauces", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Pickles, Olives, Peppers & Relishes", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Olives, pickles, pickled vegetables", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Baking Additives & Extracts", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Granulated, Brown & Powdered Sugar", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Sugars and honey", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Honey", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Syrups & Molasses", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Jam, Jelly & Fruit Spreads", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Jams, syrups, toppings", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Other Condiments", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Fats and Oils", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Vegetable & Cooking Oils", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Butter and animal fats", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Nut and Seed Products", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Sugar substitutes", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Not included in a food category", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Nuts and seeds", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Frozen Dinners & Entrees", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],
    ["Frozen Prepared Sides", "Pantry Staples (Spices, Oils, Sauces & Condiments)"],


    // 🍬 Sweets & Snacks
    ["Chocolate", "Sweets & Snacks"],
    ["Candy containing chocolate", "Sweets & Snacks"],
    ["Candy not containing chocolate", "Sweets & Snacks"],
    ["Candy", "Sweets & Snacks"],
    ["Sweets", "Sweets & Snacks"],
    ["Baking Decorations & Dessert Toppings", "Sweets & Snacks"],
    ["Ice Cream & Frozen Yogurt", "Sweets & Snacks"],
    ["Other Frozen Desserts", "Sweets & Snacks"],
    ["Cakes and pies", "Sweets & Snacks"],
    ["Crackers & Biscotti", "Sweets & Snacks"],
    ["Crackers, excludes saltines", "Sweets & Snacks"],
    ["Chips, Pretzels & Snacks", "Sweets & Snacks"],
    ["Popcorn, Peanuts, Seeds & Related Snacks", "Sweets & Snacks"],
    ["Wholesome Snacks", "Sweets & Snacks"],
    ["Other Snacks", "Sweets & Snacks"],
    ["Snack, Energy & Granola Bars", "Sweets & Snacks"],
    ["Gelatin, Gels, Pectins & Desserts", "Sweets & Snacks"],
    ["Doughnuts, sweet rolls, pastries", "Sweets & Snacks"],
    ["Puddings & Custards", "Sweets & Snacks"],
    ["Croissants, Sweet Rolls, Muffins & Other Pastries", "Sweets & Snacks"],
    ["Cakes, Cupcakes, Snack Cakes", "Sweets & Snacks"],


    // 🥣 Ready-Made & Packaged Meals
    ["Cooked & Prepared", "Ready-Made & Packaged Meals"],
    ["Vegetable and Lentil Mixes", "Ready-Made & Packaged Meals"],
    ["Mexican Dinner Mixes", "Ready-Made & Packaged Meals"],
    ["Bean, pea, legume dishes", "Ready-Made & Packaged Meals"],
    ["Beans, peas, legumes", "Ready-Made & Packaged Meals"],
    ["Canned & Bottled Beans", "Ready-Made & Packaged Meals"],
    ["Baked Products", "Ready-Made & Packaged Meals"],
    ["Cakes and pies", "Ready-Made & Packaged Meals"],
    ["Cake, Cookie & Cupcake Mixes", "Ready-Made & Packaged Meals"],
    ["Fast Foods", "Ready-Made & Packaged Meals"],
    ["Other Cooking Sauces", "Ready-Made & Packaged Meals"],
    ["Restaurant Foods", "Ready-Made & Packaged Meals"],


    // 🍷 Beverages
    ["Soda", "Beverages (Non-Fruit)"],
    ["Powdered Drinks", "Beverages (Non-Fruit)"],
    ["Beverages", "Beverages (Non-Fruit)"],
    ["Coffee", "Beverages (Non-Fruit)"],
    ["Liquor and cocktails", "Beverages (Non-Fruit)"],
    ["Beer", "Beverages (Non-Fruit)"],
    ["Wine", "Beverages (Non-Fruit)"],

]);

module.exports = categoryMap;
