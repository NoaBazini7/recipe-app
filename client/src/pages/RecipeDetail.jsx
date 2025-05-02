import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Box, Button, Card, CardContent, CardMedia, List, ListItem, Stack, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {AnimatePresence, motion} from "framer-motion"
import axios from "axios";
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

    const [activeTab, setActiveTab] = useState("ingredients");
    const [saved, setSaved] = useState(false);

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
                width: 500,
                height: "95vh",
            }}>
                {recipe.imageUrl && recipe.imageUrl.startsWith("http") && (
                    <CardMedia
                        component="img"
                        height="300"
                        alt={recipe.title}
                        image={recipe.imageUrl}
                        sx={{objectFit: "cover"}}
                    />
                )}

                <CardContent sx={{display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 200}}>
                    <Typography variant="h4" gutterBottom sx={{fontSize: "1.5rem"}}>
                        {recipe.title}
                    </Typography>

                    <Typography variant="h6" color="text.secondary" gutterBottom sx={{fontSize: "0.875rem"}}>
                        {recipe.category}
                    </Typography>

                    <Typography variant="body2" gutterBottom sx={{fontSize: "0.75rem"}}>
                        Total time: {recipe.total_time}
                    </Typography>


                    {recipe.calories && (
                        <Typography variant="body2" gutterBottom sx={{fontSize: "0.75rem"}}>
                            Calories per serving: {recipe.calories}
                        </Typography>
                    )}

                    <Stack direction="row" spacing={2} sx={{mt: 3}}>
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
                                backgroundColor: activeTab === "instructions" ? "text.primary" : "primary.main",
                                color: activeTab === "instructions" ? "primary.main" : "text.primary",
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
                            initial={{opacity: 0, x: 50}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: -50}}
                            transition={{duration: 0.3}}
                            style={{width: "100%", position: "relative", minHeight: 150, overflowY: "auto"}}
                        >
                            {activeTab === "ingredients" ? (
                                <Box sx={{mt: 2, maxHeight: 200, overflowY: "auto", pr: 1}}>
                                    {recipe.rawIngredients?.length > 0 ? (
                                        <List dense>
                                            {recipe.rawIngredients.map((ingredient, index) => (
                                                <ListItem key={index} sx={{py: 0}}>
                                                    <Typography variant="body2" sx={{fontSize: "0.875rem"}}>
                                                        • {ingredient}
                                                    </Typography>
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No ingredients provided.
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <Box sx={{mt: 2, maxHeight: 200, overflowY: "auto", pr: 1}}>
                                    {recipe.steps?.length > 0 ? (
                                        <List dense>
                                            {recipe.steps.map((step, index) => (
                                                <ListItem key={index} sx={{alignItems: "flex-start", py: 0.5}}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{fontSize: "0.875rem", mb: 1}}
                                                    >
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
                                </Box>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>

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

