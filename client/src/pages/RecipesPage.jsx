import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    IconButton,
    Button,
    Stack,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import "../App.css";

const RecipesPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const recipesFromState = location.state?.recipes || [];
    const [recipes, setRecipes] = useState(recipesFromState);

    return (
        <Box sx={{ maxHeight: 500, overflow: "auto", px: 4, pt: 10, pb: 6 }}>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    px: 4,
                    py: 1.5,
                    zIndex: 10,
                    borderBottom: "3px solid",
                    borderColor: "text.secondary",
                    backgroundColor: "background.paper",
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h2" textAlign="center" flex={1}>
                        Recipes for You
                    </Typography>
                    <Box>
                        <IconButton onClick={() => navigate("/profile")}>
                            <HomeIcon sx={{ fontSize: 30, color: "text.secondary" }} />
                        </IconButton>
                        <IconButton onClick={() => navigate("/user")}>
                            <AccountCircleIcon sx={{ fontSize: 30, color: "text.secondary" }} />
                        </IconButton>
                    </Box>
                </Stack>
            </Box>

            {recipes.length === 0 ? (
                <Typography textAlign="center" mt={4}>
                    No recipes found 😔
                </Typography>
            ) : (
                <Grid container spacing={4} justifyContent="center" mt={2}>
                    {recipes.map((recipe) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={recipe._id}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: 8,
                                    transition: "0.3s",
                                    ":hover": { boxShadow: 20 },
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                }}
                            >
                                {recipe.image && recipe.image.startsWith("http") &&(
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        alt={recipe.title}
                                        image ={recipe.image}
                                        sx={{ objectFit: "cover" }}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {recipe.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {recipe.category || "No description provided."}
                                    </Typography>

                                    {recipe.total_time && (
                                        <Typography variant="body2" color="text.secondary">
                                            ⏱️ {recipe.total_time}
                                        </Typography>
                                    )}
                                    {recipe.calories && (
                                        <Typography variant="body2" color="text.secondary">
                                            🔥 {recipe.calories} calories
                                        </Typography>
                                    )}

                                    <Box mt={2}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            onClick={() => navigate(`/recipe/${recipe._id}`)}
                                        >
                                            View Recipe
                                        </Button>
                                    </Box>
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
