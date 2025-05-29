import React, {useEffect, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Typography} from "@mui/material";
import IngredientsList from "./IngredientsList.jsx";
import axios from "axios";
import {useUser} from "../contexts/UserContext.jsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "../theme/theme.js";
import categoryColors from "../utils/categoryColors.js";


const MyFridge = ({
                      ingredients,
                      isEditingFridge,
                      setIsEditingFridge,
                      setSelectedIngredients

                  }) => {
    const {user, updateUser} = useUser();
    const [fridgeIngredients, setFridgeIngredients] = useState(user.fridgeIngredients);
    const ingredientsMap = createIngredientMap(ingredients);
    const [selectedIngredientsEditing, setSelectedIngredientsEditing] = useState(user.fridgeIngredients);
    const groupedIngredients = fridgeIngredients.reduce((groups, id) => {
        const ingredient = ingredientsMap[id];
        if (!ingredient) return groups;
        const category = ingredient.category || "Uncategorized";
        if (!groups[category]) groups[category] = [];
        groups[category].push(ingredient);
        return groups;
    }, {});

    function createIngredientMap(ingredients) {
        return ingredients.reduce((map, ingredient) => {
            map[ingredient._id] = ingredient;
            return map;
        }, {});
    }

    async function handleSaveFridge() {
        try {
            const response = await axios.put('http://localhost:5000/api/users/fridgeUpdate', {
                username: user.username,
                fridgeIngredients: selectedIngredientsEditing,
            });
            updateUser(response.data.user);
            setIsEditingFridge(false);
        } catch (err) {
            console.error("Error saving fridge:", err);
        }
    }

    useEffect(() => {
        console.log("Fridge ingredients updated:", user.fridgeIngredients);
        setFridgeIngredients(user.fridgeIngredients);
        setSelectedIngredientsEditing(user.fridgeIngredients);
    }, [user.fridgeIngredients]);


    return (
        <Box>
            <Typography variant="h5" sx={{pb: 2, mt: 2, ml: 2}}>🧊 My Fridge</Typography>
            {!isEditingFridge ? (
                <>

                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "top",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                    }}>
                        {fridgeIngredients?.length === 0 && (
                            <Box sx={{textAlign: "center", mb: 1}}>
                                <Typography variant="body1" sx={{color: "text.secondary"}}>
                                    Your fridge is empty! Please add ingredients.
                                </Typography>
                            </Box>
                        )}
                        {Object.entries(groupedIngredients).map(([category, ingredients]) => (
                            <Accordion key={category}
                                       sx={{
                                           width: "100%",
                                           mb: 1,
                                           backgroundColor: theme.palette.primary.lighter,
                                           borderRadius: 1,
                                       }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                    <Typography variant="h6" color={categoryColors [category]}>{category}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1,


                                    }}>
                                        {ingredients.map((ingredient) => (
                                            <Chip key={ingredient._id} label={ingredient.name} variant="outlined"
                                                  sx={{backgroundColor: theme.palette.background.paper}}/>
                                        ))}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>

                    <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
                        <Button variant="outlined" onClick={() => setIsEditingFridge(true)}>
                            Edit Fridge
                        </Button>
                    </Box>
                </>
            ) : (
                <>
                    <Box sx={{textAlign: "center", mb: 1}}>
                        <Typography variant="body1" sx={{color: "text.secondary"}}>
                            Search and add ingredients to your fridge.
                        </Typography>
                    </Box>
                    <IngredientsList
                        ingredients={ingredients}
                        selectedIngredients={selectedIngredientsEditing}
                        setSelectedIngredients={setSelectedIngredientsEditing}
                    />
                    {selectedIngredientsEditing.length === 0 && (
                        <Box sx={{textAlign: "center", mt: 2}}>
                            <Typography color="error" variant="body1">
                                At the moment your fridge is empty!🍅
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{display: "flex", justifyContent: "center", mt: 2, gap: 2}}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                handleSaveFridge();
                            }}
                        >
                            Save
                        </Button>
                        <Button variant="outlined" onClick={() => setIsEditingFridge(false)}>
                            Cancel
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default MyFridge;