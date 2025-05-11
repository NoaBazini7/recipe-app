import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Box, Button, Card, CardContent, List, ListItem, Popover, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {useUser} from "../contexts/UserContext.jsx";
import RecipeInfoCard from "../components/RecipeInfoCard.jsx";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";


const RecipeDetailPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const recipes = location.state?.recipes || [];
    const recipe = recipes.find((r) => r._id === id);
    const {user, updateUser} = useUser();
    const [showSaveMenu, setShowSaveMenu] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [saved, setSaved] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIngredient, setSelectedIngredient] = useState({name: "", index: 0});
    const [ingredients, setIngredients] = useState([]);
    const [heartAnchorEl, setHeartAnchorEl] = useState(null);


    // Check if the recipe is already saved
    useEffect(() => {
        if (user?.recipeLists?.some(list => list.recipes.includes(recipe?._id))) {
            setSaved(true);
        }
    }, [user, recipe]);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const toggleSaveMenu = (event) => {
        if (saved) return; // ignore if already saved
        setHeartAnchorEl(event.currentTarget);
        setShowSaveMenu(prev => !prev);
    };


    useEffect(() => {
        const fetchRecipeIngredients = async () => {
            if (!recipe || !recipe.matchedIngredients) return;

            try {
                const ingredientsNames = recipe.matchedIngredients.map(ingredient => ingredient.name);
                const response = await axios.get("http://localhost:5000/api/ingredients/getIngredientsByName", {
                    params: {names: ingredientsNames}
                });

                const fetchedIngredients = response.data;

                // Reorder the response to match the original order
                const orderedIngredients = ingredientsNames.map(name =>
                    fetchedIngredients.find(ing => ing.name.toLowerCase() === name.toLowerCase())
                );

                setIngredients(orderedIngredients);
                console.log(orderedIngredients);

            } catch (error) {
                console.error("Error fetching recipe ingredients:", error);
            }
        };

        fetchRecipeIngredients();
    }, [recipe]);


    const saveToList = async (listName) => {
        try {
            await axios.post("http://localhost:5000/api/users/add-recipe", {
                username: user.username,
                recipeID: recipe._id,
                listName,
            });
            console.log("Recipe saved to", listName);
            setSaved(true);
            setShowSaveMenu(false);

            const updatedLists = [...user.recipeLists];
            if (!updatedLists.find(list => list.title === listName)) {
                updatedLists.push({title: listName, recipes: [recipe._id]});
            } else {
                const targetList = updatedLists.find(list => list.title === listName);
                if (!targetList.recipes.includes(recipe._id)) {
                    targetList.recipes.push(recipe._id);
                }
            }

            updateUser({...user, recipeLists: updatedLists});
        } catch (error) {
            console.error("Error saving to list:", error);
        }
    };


    if (!recipe) {
        return (
            <Box p={4}>
                <Typography variant="h4" textAlign="center">
                    Recipe not found (⌣̀_⌣́)
                </Typography>
                <Button onClick={() => navigate(-1)} sx={{mt: 2}}>
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{p: 1, display: 'flex', flexDirection: 'column',}}>
            <Box sx={{mb: 2, alignItems: "left", display: "flex", gap: 1}}>
                <Button
                    startIcon={<ArrowBackIcon/>}
                    onClick={() => navigate(-1)}
                    variant="contained"
                    color="primary"
                    sx={{
                        borderRadius: 2,
                        boxShadow: 10,
                        backgroundColor: "primary.main",
                        "&:hover": {
                            backgroundColor: "primary.dark",
                        },
                    }}

                >
                    back
                </Button>
            </Box>

            <Card sx={{
                borderRadius: 2,
                boxShadow: 10,
                position: "relative",
                width: "80vw",
                display: "flex",
                flexDirection: "row",
                boxSizing: "border-box",
                padding: 2,
            }}>
                <Box sx={{width: "50vw"}}>
                    <CardContent sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        boxSizing: "border-box",
                        p: 1,


                    }}>

                        <Typography variant="h4" gutterBottom
                                    sx={{
                                        fontSize: "1.5rem",
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        justifyContent: 'center'
                                    }}>
                            <IconButton
                                onClick={toggleSaveMenu}
                                sx={{p: 0, mr: 1}}
                                aria-label={saved ? "Unsave Recipe" : "Save Recipe"}
                                disabled={saved}
                            >
                                {saved ? (
                                    <FavoriteIcon sx={{color: 'red'}}/>
                                ) : (
                                    <FavoriteBorderIcon/>
                                )}
                            </IconButton>
                            {recipe.title}
                        </Typography>

                        <Popover
                            open={showSaveMenu}
                            anchorEl={heartAnchorEl}
                            onClose={() => setShowSaveMenu(false)}
                            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                            transformOrigin={{vertical: 'top', horizontal: 'center'}}
                        >
                            <Box sx={{p: 2, width: 260}}>
                                <Typography variant="subtitle1" sx={{mb: 1}}>Save to List</Typography>
                                <List dense>
                                    {user?.recipeLists?.map((list, i) => (
                                        <ListItem key={i} button disabled={saved}
                                                  onClick={() => saveToList(list.title)}>
                                            <Typography>{list.title}</Typography>
                                        </ListItem>
                                    ))}
                                </List>

                                <Box sx={{mt: 1}}>
                                    <Typography variant="caption">Or create new list:</Typography>
                                    <input
                                        type="text"
                                        value={newListName}
                                        onChange={(e) => setNewListName(e.target.value)}
                                        placeholder="e.g. Meal Prep"
                                        style={{width: "100%", padding: "4px", marginTop: "4px"}}
                                    />
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => saveToList(newListName)}
                                        sx={{mt: 1, width: "100%"}}
                                        disabled={saved || !newListName.trim()}
                                    >
                                        {saved ? "Saved" : "Save to New List"}
                                    </Button>
                                </Box>
                            </Box>
                        </Popover>

                        <Typography variant="h6" color="text.secondary" gutterBottom sx={{fontSize: "1rem"}}>
                            {recipe.category}
                        </Typography>

                        {/* Steps */}
                        <Typography variant="h6" sx={{mt: 4}}>
                            Instructions
                        </Typography>

                        {recipe.steps?.length > 0 ? (
                            <List dense sx={{}}>
                                {recipe.steps.map((step, index) => (
                                    <ListItem key={index} sx={{alignItems: "flex-start", py: 0.5}}>
                                        <Typography variant="body2" sx={{fontSize: "0.875rem", mb: 1}}>
                                            {index + 1}. {step}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No instructions provided.
                            </Typography>
                        )}

                        {/* Ingredients */}
                        <Typography variant="h6" sx={{mt: 2}}>
                            Ingredients
                        </Typography>

                        {recipe.servings && (
                            <Typography variant="body2" gutterBottom sx={{fontSize: "0.75rem"}}>
                                (for {recipe.servings} servings)
                            </Typography>
                        )}

                        <Box sx={{width: "45vw", mt: 1}}>
                            {recipe.rawIngredients?.length > 0 ? (
                                <>
                                    <List dense
                                          sx={{display: "flex", gap: 1, flexDirection: "column"}}>
                                        {recipe.rawIngredients.map((ingredient, index) => (
                                            <ListItem
                                                key={index}
                                                button
                                                onClick={(event) => {
                                                    setAnchorEl(event.currentTarget);
                                                    setSelectedIngredient({name: ingredient, index: index});

                                                }}
                                                sx={{

                                                    cursor: "pointer",
                                                }}
                                            >
                                                <Typography variant="body2" sx={{fontSize: "0.875rem"}}>
                                                    • {ingredient}
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Popover
                                        open={Boolean(anchorEl)}
                                        anchorEl={anchorEl}
                                        onClose={() => setAnchorEl(null)}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                    >
                                        {Boolean(anchorEl) && ingredients[selectedIngredient.index] && (
                                            <Box sx={{p: 2}}>
                                                <Typography variant="subtitle1">{selectedIngredient.name}</Typography>
                                                <Typography variant="body2">
                                                    Calories Per
                                                    100g: {ingredients[selectedIngredient.index]?.caloriesPer100g ?? "N/A"}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Category: {ingredients[selectedIngredient.index]?.category ?? "N/A"}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Kosher: {ingredients[selectedIngredient.index]?.kosher ? "✔" : "✘"}
                                                </Typography>
                                            </Box>
                                        )}

                                    </Popover>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No ingredients provided.
                                </Typography>
                            )}
                        </Box>

                    </CardContent>
                </Box>


                {/* right part: image with details*/}
                <Box sx={{
                    width: "40%",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    height: "auto",
                    boxSizing: "border-box"
                }}>
                    <RecipeInfoCard recipe={recipe}/>
                </Box>
            </Card>
            {/*</Box>*/}

            {/* url to original website */}
            <Box
                sx={{
                    width: "100%",
                    pt: 1.5,
                    textAlign: "center",
                    mt: 0,
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    For the full recipe:
                    <br/>
                    <Box
                        component="a"
                        href={recipe.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            textDecoration: "underline",
                            color: "text.primary", // uses MUI theme color properly
                            fontSize: "inherit",   // match the Typography caption sizing
                        }}
                    >
                        {recipe.url}
                    </Box>
                </Typography>
            </Box>


        </Box>
    );
};

export default RecipeDetailPage;

