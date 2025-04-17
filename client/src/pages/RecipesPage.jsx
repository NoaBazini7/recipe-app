import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {Box, Typography, Card, CardContent, CardMedia, CircularProgress, Grid,} from "@mui/material";
import "../App.css";

const RecipesPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ingredientsParam = queryParams.get("ingredients");
    const selectedIngredients = ingredientsParam ? ingredientsParam.split(",") : [];
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/recipes", {
                    ingredients: selectedIngredients,
                });
                setRecipes(response.data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [selectedIngredients]);

    if (loading) return <CircularProgress sx={{ mt: 10 }} />;

    return (
        <Box px={4} py={6}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Recipes for You
            </Typography>

            {recipes.length === 0 ? (
                <Typography textAlign="center">No recipes found 😔</Typography>
            ) : (
                <Grid container spacing={4} justifyContent="center">
                    {recipes.map((recipe) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={recipe._id}>
                            <Card
                                sx={{
                                    borderRadius: 4,
                                    boxShadow: 3,
                                    transition: "0.3s",
                                    ":hover": { boxShadow: 6 },
                                }}
                            >
                                {recipe.image && (
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={recipe.image}
                                        alt={recipe.name}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {recipe.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {recipe.description || "No description provided."}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default RecipesPage;
