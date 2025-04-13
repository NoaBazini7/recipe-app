const User = require("../models/user");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
    return User.find();
};

const getUserById = async (id) => {
    return User.findById(id);
};

 const getUserByUsername = async (username) => {
    return User.findOne({ username });
 };

const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

const updateUser = async (id, userData) => {
    return User.updateOne(id, userData);
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

    return user; }

module.exports = { getAllUsers, getUserById, getUserByUsername, createUser, updateUser, deleteUser, checkPassword, changePassword };
