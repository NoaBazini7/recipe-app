import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Box, Button, Card, CardContent, CardMedia, Grid, IconButton, Stack, Typography,} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FilterPanel from "../components/FilterPanel.jsx";
import "../App.css";
import theme from "../theme/theme.js";

const RecipesPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const recipesFromState = location.state?.recipes || [];
    const selectedIngredients = location.state?.selectedIngredients || [];

    const [recipes] = useState(recipesFromState);
    const [filteredRecipes, setFilteredRecipes] = useState(recipesFromState);

    const [categoryFilter, setCategoryFilter] = useState("");
    const [kosherFilter, setKosherFilter] = useState("");
    const [timeFilter, setTimeFilter] = useState("");

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const uniqueCategories = [
            ...new Set(
                recipes.map((r) => r.category?.trim()).filter((c) => c && c.length > 0)
            ),
        ];
        setCategories(uniqueCategories);
    }, [recipes]);

    useEffect(() => {
        let filtered = [...recipes];

        if (categoryFilter) {
            filtered = filtered.filter(
                (recipe) =>
                    recipe.category?.toLowerCase() === categoryFilter.toLowerCase()
            );
        }

        if (kosherFilter === "kosher") {
            filtered = filtered.filter((r) => r.kosher === true);
        } else if (kosherFilter === "not_kosher") {
            filtered = filtered.filter((r) => r.kosher === false);
        }

        if (timeFilter) {
            const maxTime = Number(timeFilter);
            if (!isNaN(maxTime) && maxTime > 0) {
                filtered = filtered.filter((recipe) => {
                    const timeString = recipe.total_time;
                    if (!timeString) return false;

                    const hourMatch = timeString.match(/(\d+)\s*h/i);
                    const minMatch = timeString.match(/(\d+)\s*m/i);

                    let totalMinutes = 0;
                    if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
                    if (minMatch) totalMinutes += parseInt(minMatch[1]);

                    return totalMinutes <= maxTime;
                });
            }
        }

        setFilteredRecipes(filtered);
    }, [categoryFilter, kosherFilter, timeFilter, recipes]);

    return (
        <Box sx={{px: 4, pt: 10, pb: 6}}>
            {/* Top bar */}
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
                            <HomeIcon sx={{fontSize: 30, color: "text.secondary"}}/>
                        </IconButton>
                    </Box>
                </Stack>
            </Box>

            {/* Main layout */}
            <Box
                sx={{
                    display: "flex",
                    mt: 6,
                    ml: 1,
                    flexDirection: {xs: "column", md: "row"},
                    alignItems: "flex-start",
                }}
            >
                {/* Fixed/Responsive Filter Panel */}
                <Box
                    sx={{
                        position: {xs: "relative", md: "fixed"},
                        top: 80,
                        left: 0,
                        width: {xs: "100%", md: 260},
                        zIndex: 5,
                        px: {xs: 0, md: 2},
                        pb: 4,
                        borderRight: {md: "1px solid"},
                        borderColor: {md: "divider"},
                    }}
                >
                    <FilterPanel
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        kosherFilter={kosherFilter}
                        setKosherFilter={setKosherFilter}
                        timeFilter={timeFilter}
                        setTimeFilter={setTimeFilter}
                        categories={categories}
                    />
                </Box>

                {/* Recipes list */}
                <Box
                    sx={{
                        flexGrow: 1,
                        ml: {md: "280px"},
                        width: "100%",
                    }}
                >
                    {filteredRecipes.length === 0 ? (
                        <Box>
                            <Typography
                                textAlign="center"
                                mt={10}
                                variant="h2"
                                color="text.secondary"
                            >
                                No recipes found 😔
                            </Typography>
                            <Typography
                                variant="h6"
                                textAlign="center"
                                color={theme.palette.primary.main}
                                sx={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    "&:hover": {color: theme.palette.text.secondary},
                                }}
                                onClick={() => navigate("/profile")}
                            >
                                Search again? Click here!
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={4} justifyContent="center" mt={2} pb={2}>
                            {filteredRecipes.map((recipe) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={recipe._id}>
                                    <Card
                                        sx={{
                                            borderRadius: 2,
                                            boxShadow: 8,
                                            transition: "0.3s",
                                            ":hover": {boxShadow: 20},
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "100%",
                                        }}
                                    >
                                        {recipe.imageUrl && recipe.imageUrl.startsWith("http") && (
                                            <CardMedia
                                                component="img"
                                                height="160"
                                                alt={recipe.title}
                                                image={
                                                    recipe.imageUrl ||
                                                    "https://placehold.co/300x160?text=No+Image"
                                                }
                                                sx={{objectFit: "cover"}}
                                            />
                                        )}
                                        <CardContent sx={{flexGrow: 1}}>
                                            <Typography variant="h6" gutterBottom>
                                                {recipe.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {recipe.category || "No category"}
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
                                                    onClick={() =>
                                                        navigate(`/recipe/${recipe._id}`, {
                                                            state: {recipes, selectedIngredients},
                                                        })
                                                    }
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
            </Box>
        </Box>
    );
};

export default RecipesPage;
