const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    allergies: [String],
    fridgeIngredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
    }],
    recipeLists: [
        {
            title: {type: String, required: true}, // e.g., "Breakfast", "Favorites"
            recipes: [{type: mongoose.Schema.Types.ObjectId, ref: "Recipe"}] // List of recipe IDs
        }
    ]
});

//Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;