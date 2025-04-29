import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, IconButton, Typography, Card, CardContent, CardMedia } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IngredientsList } from "../components/IngredientsList.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { AnimatePresence, motion } from "framer-motion";
import EditUserForm from "../components/EditUserForm.jsx";
import LogoutIcon from "@mui/icons-material/Logout";

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState("ingredients");
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, savedRecipes, setSavedRecipes } = useUser();
    const navigate = useNavigate();
    const recipesFromState = location.state?.recipes || [];
    const [recipes] = useState(recipesFromState);

    const menuItems = [
        { key: "ingredients", label: "My Ingredients" },
        { key: "editProfile", label: "Edit Profile" },
        { key: "recipes", label: "Saved Recipes" },
        { key: "settings", label: "Settings" },
    ];

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/ingredients");
                let sortedIngredients = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setIngredients(sortedIngredients);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching ingredients:", error);
                setLoading(false);
            }
        };

        fetchIngredients();
        console.log("User in ProfilePage:", user);
    }, []);

    useEffect(() => {
        console.log("selectedIngredients", selectedIngredients);
    }, [selectedIngredients]);

    const renderSection = () => {
        switch (activeSection) {
            case "ingredients":
                return (
                    <Box>
                        <IngredientsList ingredients={ingredients} onClick={(ingredient) => handleToggleIngredient(ingredient)} />
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 15 }}>
                            <Button variant="contained" onClick={handleFindRecipes}>
                                Find Recipes
                            </Button>
                        </Box>
                    </Box>
                );
            case "editProfile":
                return (
                    <Box sx={{ p: 2 }}>
                        <EditUserForm />
                    </Box>
                );
            case "recipes":
                return (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h5">📖 Saved Recipes</Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mt: 2 }}>
                            <AnimatePresence>
                                {savedRecipes.map((recipe) => (
                                    <motion.div
                                        key={recipe._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        layout
                                    >
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={recipe.imageUrl || "https://placehold.co/300x160?text=No+Image"}
                                                alt={recipe.title}
                                            />
                                            <CardContent>
                                                <Typography variant="h6" component="div">
                                                    {recipe.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {recipe.category}
                                                </Typography>
                                            </CardContent>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, width: "100%" }}>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => navigate(`/recipe/${recipe._id}`, { state: { recipes } })}
                                                    sx={{ flexGrow: 1, marginRight: 1 }}
                                                >
                                                    View Recipe
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleDeleteRecipe(recipe._id)}
                                                    sx={{ flexGrow: 1, marginLeft: 1 }}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </Box>
                    </Box>
                );

            case "settings":
                return <Box sx={{ p: 2 }}>⚙️ Settings</Box>;
            default:
                return null;
        }
    };

    const handleToggleIngredient = (ingredient) => {
        setSelectedIngredients((prevSelected) =>
            prevSelected.find((item) => item._id === ingredient._id)
                ? prevSelected.filter((item) => item._id !== ingredient._id)
                : [...prevSelected, ingredient]
        );
    };

    const handleFindRecipes = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/recipes/filteredRecipes",
                { ingredients: selectedIngredients.map((ingredient) => ingredient.name) }
            );
            navigate("/recipes", { state: { recipes: response.data } });
        } catch (error) {
            console.error("Error fetching filtered recipes:", error);
        }
    };

    const handleDeleteRecipe = async (recipeId) => {
        const updatedRecipes = savedRecipes.filter((recipe) => recipe._id !== recipeId);
        setSavedRecipes(updatedRecipes);
        localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes)); // <--- добавлено

        try {
            if (user && user._id) {
                await axios.delete(`http://localhost:5000/api/users/${user._id}/savedRecipes/${recipeId}`);
            }
        } catch (error) {
            console.error("Error deleting recipe from user's saved list:", error);
        }
    };

    if (loading) return <CircularProgress sx={{ mt: 10 }} />;

    return (
        <Box
            sx={{
                px: 4,
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                position: "relative",
                minHeight: "100vh",
                minWidth: "80vw",
                backgroundColor: "background.paper",
                pl: 0,
                overflowX: "auto",
            }}
            className="profilePage"
        >
            {/* Sidebar */}
            <Box sx={{ width: 200, height: "100vh", backgroundColor: "primary.main", justifyContent: "center", gap: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                {menuItems.map((item) => (
                    <Button
                        key={item.key}
                        variant={activeSection === item.key ? "contained" : "outlined"}
                        fullWidth
                        sx={{ mb: 1, width: "90%", color: "text.primary" }}
                        onClick={() => setActiveSection(item.key)}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>

            <IconButton onClick={() => navigate("/")} sx={{ position: "absolute", top: 20, right: 20 }}>
                <LogoutIcon sx={{ fontSize: 40, marginTop:"25px", color: "text.primary" }} />
            </IconButton>

            {/* Main Content with Animation */}
            <Box sx={{ flex: 1, pt: 5, alignItems: "center" }}>
                <Typography variant="h3" gutterBottom textAlign="center">
                    Welcome {user ? user.username : "User"}!
                </Typography>

                <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }} textAlign="center">
                    {activeSection === "ingredients" ? "Choose your fridge's content" : ""}
                </Typography>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        style={{ width: "100%" }}
                    >
                        <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            {renderSection()}
                        </Box>
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default ProfilePage;
