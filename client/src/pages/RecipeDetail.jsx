import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, CardMedia, Typography, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AnimatePresence, motion } from "framer-motion";

const RecipeDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const recipes = location.state?.recipes || [];
    const recipe = recipes.find((r) => r._id === id);

    const [activeTab, setActiveTab] = useState("ingredients");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved((prev) => !prev);
    };

    if (!recipe) {
        return (
            <Box p={4}>
                <Typography variant="h4" textAlign="center">
                    Recipe not found (⌣̀_⌣́)
                </Typography>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <Box sx={{ mb: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    variant="contained"
                    color="primary"
                    sx={{
                        position: 'fixed',
                        top: 16,
                        left: 16,
                        zIndex: 10
                    }}
                >
                    Back
                </Button>
            </Box>

            <Card sx={{ borderRadius: 2, boxShadow: 10, position: "relative", width: 600, margin: "0 auto" }}>
                {recipe.imageUrl && recipe.imageUrl.startsWith("http") && (
                    <CardMedia
                        component="img"
                        height="300"
                        alt={recipe.title}
                        image={recipe.imageUrl}
                        sx={{ objectFit: "cover" }}
                    />
                )}

                <CardContent sx={{ display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 200 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontSize: "1.5rem" }}>
                        {recipe.title}
                    </Typography>

                    <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: "0.875rem" }}>
                        {recipe.category}
                    </Typography>

                    <Typography variant="body2" gutterBottom sx={{ fontSize: "0.75rem" }}>
                                Total time: {recipe.total_time}
                    </Typography>



                    {recipe.calories && (
                        <Typography variant="body2" gutterBottom sx={{ fontSize: "0.75rem" }}>
                             Calories: {recipe.calories}
                        </Typography>
                    )}

                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                        <Button
                            variant={activeTab === "ingredients" ? "contained" : "outlined"}
                            onClick={() => setActiveTab("ingredients")}
                            sx={{
                                flex: 1,
                                fontWeight: activeTab === "ingredients" ? "bold" : "normal",
                                backgroundColor: activeTab === "ingredients" ? "text.primary" : "primary.main",
                                color: activeTab === "ingredients" ? "primary.main" : "text.primary",
                                '&:hover': {
                                    backgroundColor: activeTab === "ingredients" ? "text.secondary" : "text.secondary"
                                }
                            }}
                        >
                            Ingredients
                        </Button>
                        <Button
                            variant={activeTab === "instructions" ? "contained" : "outlined"}
                            onClick={() => setActiveTab("instructions")}
                            sx={{
                                flex: 1,
                                fontWeight: activeTab === "instructions" ? "bold" : "normal",
                                backgroundColor: activeTab === "instructions" ?"text.primary" : "primary.main",
                                color: activeTab === "instructions" ?  "primary.main" : "text.primary",
                                '&:hover': {
                                    backgroundColor: activeTab === "instructions" ? "text.secondary" : "text.secondary"
                                }
                            }}
                        >
                            Instructions
                        </Button>
                    </Stack>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: "100%", position: "relative", minHeight: 150, overflowY: "auto" }}
                        >
                            {activeTab === "ingredients" ? (
                                <Box sx={{ mt: 2, maxHeight: 200, overflowY: "auto", paddingRight: 1 }}>
                                    {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                                        <ul>
                                            {recipe.ingredients.map((ingredient, index) => (
                                                <li key={index}>
                                                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                                                        {ingredient}
                                                    </Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No ingredients provided.
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <Box sx={{ mt: 2, maxHeight: 200, overflowY: "auto", paddingRight: 1 }}>
                                    {recipe.steps && Array.isArray(recipe.steps) && recipe.steps.length > 0 ? (
                                        <ol>
                                            {recipe.steps.map((step, index) => (
                                                <li key={index}>
                                                    <Typography variant="body2" sx={{ fontSize: "0.875rem", mb: 1 }}>
                                                        {step}
                                                    </Typography>
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No instructions provided.
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>

            <Button
                variant="outlined"
                color={saved ? "background.default" : "primary"}
                onClick={handleSave}
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    zIndex: 10,
                    transition: "all 0.3s ease",
                }}
            >
                {saved ? "Saved" : "Save"}
            </Button>
        </Box>
    );
};

export default RecipeDetailPage;

