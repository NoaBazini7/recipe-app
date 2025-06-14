const userService = require("../services/userService");

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({error: "User not found"});
        res.json(user);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const updateUser = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.body);
        if (!updatedUser) return res.status(404).json({error: "User not found"});
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await userService.deleteUser(req.params.id);
        if (!deletedUser) return res.status(404).json({error: "User not found"});
        res.json({message: "User deleted successfully"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const changePassword = async (req, res) => {
    const {userId, oldPassword, newPassword} = req.body;

    try {
        const updatedUser = await userService.changePassword(userId, oldPassword, newPassword);
        res.json({message: "Password updated successfully", user: updatedUser});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const addRecipeToList = async (req, res) => {
    try {
        const updatedUser = await userService.addRecipeToList(req.body.username, req.body.recipeID, req.body.listName);
        if (!updatedUser) return res.status(404).json({error: "User not found"});
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const removeRecipeFromList = async (req, res) => {
    try {
        const updatedUser = await userService.removeRecipeFromList(req.body.username, req.body.recipeID, req.body.listName);
        if (!updatedUser) return res.status(404).json({error: "User not found"});
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

const fetchSavedRecipes = async (req, res) => {
    try {
        const user = await userService.getUserByUsername(req.params.username);
        if (!user) return res.status(404).json({error: "User not found"});
        res.json(user.recipeLists);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const updateFridgeIngredients = async (req, res) => {
    const {username, fridgeIngredients} = req.body;


    try {
        const updatedUser = await userService.updateFridgeIngredients(username, fridgeIngredients);
        res.json({message: "Fridge updated successfully", user: updatedUser});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};


const deleteList = async (req, res) => {
    const {username, listName} = req.body;

    try {
        await userService.deleteRecipeList(username, listName);
        res.status(200).json({message: "List deleted successfully"});
    } catch (error) {
        console.error("Error in deleteList controller:", error);
        res.status(500).json({error: "Failed to delete recipe list"});
    }
};


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    addRecipeToList,
    removeRecipeFromList,
    fetchSavedRecipes,
    updateFridgeIngredients,
    deleteList,
};
