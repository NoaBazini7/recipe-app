import React, {useEffect, useState} from "react";
import {Card, CardContent, CircularProgress, Typography} from "@mui/material";
import axios from "axios";

const RecipeListCard = ({title, recipeIds}) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <Card sx={{maxWidth: 345}}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
            </CardContent>
            {loading ? (
                <CardContent>
                    <CircularProgress/>
                </CardContent>
            ) : (
                recipes.map((recipe) => (
                    <CardContent key={recipe._id}>
                        <Typography>{recipe.title}</Typography>
                    </CardContent>
                ))
            )}
        </Card>
    );
};

export default RecipeListCard;