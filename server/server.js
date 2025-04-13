
//require is like import
const express = require("express"); //loading the express framework
const cors = require("cors"); //loading cors so we can allow frontend requests
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const app = express(); //create the express app instance
const PORT = 5000; //port number

connectDB();

app.use(express.json());
app.use(cors()); // allow frontend requests from different domain
app.use(express.static("public")); //serving static files like html from the public folder(not api requests)


const recipeRoutes = require("./routes/recipes");
app.use("/api/recipes", recipeRoutes);

const ingredientsRoutes = require("./routes/ingredients");
app.use("/api/ingredients", ingredientsRoutes);

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)); //starting the server
