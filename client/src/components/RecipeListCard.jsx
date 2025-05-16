import React, {useEffect, useState} from "react";
import {Card, CardContent, CircularProgress, Divider, IconButton, Snackbar, Typography} from "@mui/material";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import theme from "../theme/theme.js";
import {useUser} from "../contexts/UserContext.jsx";
import CloseIcon from "@mui/icons-material/Close";

const RecipeListCard = ({title, recipeIds}) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const {user, setUser} = useUser();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/recipes/getRecipesByIDs", {
                    params: {
                        recipeIds: recipeIds,
                    },
                });
                setRecipes(res.data);
                console.log("Fetched recipes:", res.data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [recipeIds]);

    function handleRecipeClick(recipe) {
        console.log("Clicked recipe:", recipe);
        navigate(`/recipe/${recipe._id}`, {state: {recipes: [recipe]}});
    }

    const handleRemove = async (idToRemove) => {
        try {
            // Local UI update
            setRecipes(prev => prev.filter(recipe => recipe._id !== idToRemove));

            // Backend update
            await axios.post("http://localhost:5000/api/users/remove-recipe", {
                username: user.username,
                recipeID: idToRemove,
                listName: title,
            });

            // Optional: Update user context (if list is stored there)
            const updatedLists = user.recipeLists.map((list) => {
                if (list.title === title) {
                    return {
                        ...list,
                        recipes: list.recipes.filter((id) => id !== idToRemove),
                    };
                }
                return list;
            });

            setUser({...user, recipeLists: updatedLists});

            // Show snackbar
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error removing recipe from list:", error);
        }
    };

    return (
        <Card sx={{maxWidth: 345, minHeight: 400, minWidth: 300, margin: 2, borderRadius: "20px", boxShadow: 6}}>
            <CardContent>
                <Typography variant="h6" component="div" color={theme.palette.text.secondary}>
                    {title}
                </Typography>
            </CardContent>
            <Divider variant="middle"/>
            {loading ? (
                <CardContent>
                    <CircularProgress/>
                </CardContent>
            ) : (
                recipes.map((recipe) => (
                    <CardContent key={recipe._id}>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Typography
                                onClick={() => handleRecipeClick(recipe.id)}
                                sx={{
                                    fontSize: 14,
                                    "&:hover": {
                                        color: theme.palette.text.secondary,
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                {recipe.title}
                            </Typography>
                            <Typography
                                onClick={() => handleRemove(recipe._id)}
                                sx={{
                                    color: "red",
                                    fontWeight: "bold",
                                    ml: 2,
                                    cursor: "pointer",
                                    "&:hover": {
                                        color: "#b71c1c",
                                    },
                                }}
                            >
                                ✖
                            </Typography>
                        </div>

                    </CardContent>
                ))
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message="Recipe removed from list"
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                }
            />
        </Card>


    );

};

export default RecipeListCard;