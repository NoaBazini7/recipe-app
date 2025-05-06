import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Box, Button, Card, CardContent, CardMedia, List, Popover,ListItem, Stack, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {AnimatePresence, motion} from "framer-motion"
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";
import {useUser} from "../contexts/UserContext.jsx";


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
    const [selectedIngredient, setSelectedIngredient] = useState('');

    // Check if the recipe is already saved
    useEffect(() => {
        if (user?.recipeLists?.some(list => list.recipes.includes(recipe?._id))) {
            setSaved(true);
        }
    }, [user, recipe]);

    const toggleSaveMenu = () => {
        setShowSaveMenu(prev => !prev);
    };

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
        <Box sx={{p: 4, display: 'flex', justifyContent: 'center', flexDirection: 'column',}}>
            <Box sx={{mb: 2}}>
                <Button
                    startIcon={<ArrowBackIcon/>}
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

            <Card sx={{
                borderRadius: 2,
                boxShadow: 10,
                position: "relative",
                width: "100%",
                maxWidth: 1000,
                display: "flex",
                flexDirection: "row",
                height: "auto",
                mt:8,
                boxSizing: "border-box",
                padding: 2
            }}>
                <CardContent sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                    p: 1,
                    overflow: "hidden",
                    maxWidth: "70%",
                    height: "auto",
                }}>
                    <Typography variant="h4" gutterBottom sx={{ fontSize: "1.25rem" }}>
                        {recipe.title}
                    </Typography>

                    <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: "0.875rem" }}>
                        {recipe.category}
                    </Typography>

                    {/* Steps */}
                    <Typography variant="h6" sx={{ mt: 1}}>
                        Instructions
                    </Typography>

                    {recipe.steps?.length > 0 ? (
                        <List dense sx={{ marginTop: 2 }}>
                            {recipe.steps.map((step, index) => (
                                <ListItem key={index} sx={{ alignItems: "flex-start", py: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontSize: "0.875rem", mb: 1 }}>
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
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Ingredients
                    </Typography>

                    {recipe.servings && (
                        <Typography variant="body2" gutterBottom sx={{ fontSize: "0.75rem" }}>
                            (for {recipe.servings} servings)
                        </Typography>
                    )}

                    <Box sx={{ width: "100%", mt: 1 }}>
                        {recipe.rawIngredients?.length > 0 ? (
                            <>
                                <List dense sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {recipe.rawIngredients.map((ingredient, index) => (
                                        <ListItem
                                            key={index}
                                            button
                                            onClick={(event) => {
                                                setAnchorEl(event.currentTarget);
                                                setSelectedIngredient(ingredient);
                                            }}
                                            sx={{
                                                width: { xs: "100%", sm: "48%", md: "30%" },
                                                py: 0,
                                                cursor: "pointer",
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
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
                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="subtitle1">{selectedIngredient}</Typography>
                                        <Typography variant="body2">Calories: 100</Typography>
                                        <Typography variant="body2">Category: Vegetable</Typography>
                                        <Typography variant="body2">Kosher: ✔</Typography>
                                    </Box>
                                </Popover>
                            </>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No ingredients provided.
                            </Typography>
                        )}
                    </Box>
                </CardContent>

                {/* right part: image with details*/}
                <Box sx={{
                    width: "100%",
                    maxWidth: "75vh",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    height: "auto",
                    boxSizing: "border-box"
                }}>
                    {recipe.imageUrl && recipe.imageUrl.startsWith("http") && (
                        <CardMedia
                            component="img"
                            alt={recipe.title}
                            image={recipe.imageUrl}
                            sx={{
                                objectFit: "cover",
                                width: "100%",
                                height: "50%",
                                borderRadius: 2,
                                mb: 2
                            }}
                        />
                    )}
                    {/* Calories */}
                    {recipe.calories && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontSize: "0.875rem"}}>
                                Calories: {recipe.calories} per serving
                            </Typography>
                        </Box>
                    )}

                    {/* Time */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3}}>
                        <Box>
                            <Typography variant="h2" sx={{ fontSize: "0.75rem" }}>
                                Preparation:
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.5rem", mb: 1 }}>
                                {recipe.prep_time}
                            </Typography>
                            <Typography variant="h2" sx={{ fontSize: "0.75rem" }}>
                                Cooking:
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.5rem" }}>
                                {recipe.cook_time}
                            </Typography>
                        </Box>
                        <Box sx={{ ml: 4 }}>
                            <Typography variant="h2" sx={{ fontSize: "1rem" }} >
                                Total time:
                            </Typography>
                            <Typography variant="h2" sx={{ fontSize: "1.5rem", color: "text.primary"}}>
                                =  {recipe.total_time}
                            </Typography>
                        </Box>
                    </Box>



                    {/* Rating and kosher */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        {recipe.rating && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <StarIcon sx={{ fontSize: "1.75rem", color: "#fbc02d", mr: 0.5 }} />
                                <Typography variant="h2" sx={{ fontSize: "0.75rem" }}>
                                    {recipe.rating} / 5
                                </Typography>
                            </Box>
                        )}

                        {recipe.kosher !== undefined && (
                            <Typography variant="h2" sx={{ fontSize: "1rem" }}>
                                Kosher {recipe.kosher ? "✔" : "✘"}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Card>

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
                    For the full recipe:&nbsp;
                    <a
                        href={recipe.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'underline', color: 'text.primary' }}
                    >
                        {recipe.url}
                    </a>
                </Typography>
            </Box>


            <Button
                variant="outlined"
                color={saved ? "background.default" : "primary"}
                onClick={toggleSaveMenu}
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
            {showSaveMenu && (
                <Card sx={{
                    position: "fixed",
                    bottom: 70,
                    right: 16,
                    width: 260,
                    zIndex: 11,
                    p: 2,
                    boxShadow: 6,
                    backgroundColor: "white",
                }}>
                    <Typography variant="subtitle1" sx={{mb: 1}}>Save to List</Typography>
                    <List dense>
                        {user?.recipeLists?.map((list, i) => (
                            <ListItem key={i} button onClick={() => saveToList(list.title)}>
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
                        >
                            Save to New List
                        </Button>
                    </Box>
                </Card>
            )}

        </Box>
    );
};

export default RecipeDetailPage;

