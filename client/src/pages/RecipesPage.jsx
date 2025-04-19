import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import {Box, Card, CardContent, CardMedia, Grid, Typography,} from "@mui/material";
import "../App.css";

const RecipesPage = () => {
    const location = useLocation();
    const recipesFromState = location.state?.recipes || [];
    const [recipes, setRecipes] = useState(recipesFromState);
    //const [loading, setLoading] = useState(true);

    //if (loading) return <CircularProgress sx={{mt: 10}}/>;

    return (
        <Box px={4} py={6} maxHeight={500} overflow={"auto"}>
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
                                    ":hover": {boxShadow: 6},
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
                                        {recipe.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {recipe.category || "No description provided."}
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
