const User = require("../models/user");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
    return User.find();
};

const getUserById = async (id) => {
    return User.findById(id);
};

const getUserByUsername = async (username) => {
    return User.findOne({username});
};

const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

const updateUser = async (userData) => {
    const user = await getUserByUsername(userData.username);
    if (!user) {
        throw new Error("User not found");
    }

    if (!userData.password) {
        delete userData.password;
    }

    Object.assign(user, userData); // Update user fields
    await user.save();

    return user;
};

const deleteUser = async (id) => {
    return User.deleteOne(id);
};

const checkPassword = async (inputPassword, storedPassword) => {
    return bcrypt.compare(inputPassword, storedPassword);
};

const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error("Old password is incorrect");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return user;
}

const addRecipeToList = async (username, recipeID, listName) => {
    const user = await getUserByUsername(username);
    if (!user) {
        throw new Error("User not found");
    }
    const listIndex = user.recipeLists.findIndex((list) => list.title === listName);

    if (listIndex !== -1) {
        // ✅ List exists, modify in-place
        if (!user.recipeLists[listIndex].recipes.includes(recipeID)) {
            user.recipeLists[listIndex].recipes.push(recipeID);
        }
    } else {
        // ✅ List doesn't exist, create it
        user.recipeLists.push({
            title: listName,
            recipes: [recipeID],
        });
    }
    await user.save();
    return user;
};

const removeRecipeFromList = async (username, recipeID, listName) => {
    const user = await getUserByUsername(username);
    if (!user) {
        throw new Error("User not found");
    }
    const listIndex = user.recipeLists.findIndex((list) => list.title === listName);

    if (listIndex !== -1) {
        // ✅ List exists, modify in-place
        const recipeIndex = user.recipeLists[listIndex].recipes.indexOf(recipeID);
        if (recipeIndex !== -1) {
            user.recipeLists[listIndex].recipes.splice(recipeIndex, 1);
        }
    } else {
        throw new Error("List not found");
    }
    await user.save();
    return user;
};

const mongoose = require("mongoose");

const updateFridgeIngredients = async (username, ingredients) => {
    const user = await getUserByUsername(username);
    if (!user) {
        throw new Error("User not found");
    }
    console.log(ingredients);
    user.fridgeIngredients = ingredients.map(id => new mongoose.Types.ObjectId(id));

    await user.save();
    return user;
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser,
    checkPassword,
    changePassword,
    addRecipeToList,
    removeRecipeFromList,
    updateFridgeIngredients,
};
