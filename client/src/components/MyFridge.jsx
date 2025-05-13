import React, {useEffect, useState} from "react";
import {Box, Button, Typography} from "@mui/material";
import {IngredientsList} from "./IngredientsList.jsx";
import axios from "axios";
import {useUser} from "../contexts/UserContext.jsx";

const MyFridge = ({
                      ingredients,
                      selectedIngredients,
                      setSelectedIngredients,
                      isEditingFridge,
                      setIsEditingFridge
                  }) => {
    const {user, updateUser} = useUser();
    const [fridgeIngredients, setFridgeIngredients] = useState(user.fridgeIngredients);
    const ingredientsMap = createIngredientMap(ingredients);

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
                fridgeIngredients: selectedIngredients,
            });
            updateUser(response.data.user);
            setIsEditingFridge(false);
        } catch (err) {
            console.error("Error saving fridge:", err);
        }
    }

    useEffect(() => {
        setFridgeIngredients(user.fridgeIngredients);
        setSelectedIngredients(user.fridgeIngredients);
    }, [user.fridgeIngredients]);

    const handleToggleIngredient = (ingredient) => {
        setSelectedIngredients((prev) =>
            prev.includes(ingredient._id)
                ? prev.filter((id) => id !== ingredient._id)
                : [...prev, ingredient._id]
        );
    };

    return (
        <Box>
            <Box sx={{display: "flex", alignItems: "flex-start"}}>
                <Typography variant="h4" sx={{pb: 2, mt: 2, ml: 2}}>🧊 My Fridge</Typography>
            </Box>
            {!isEditingFridge ? (
                <>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "top",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                    }}>
                        {Object.entries(
                            fridgeIngredients.reduce((groups, id) => {
                                const ingredient = ingredientsMap[id];
                                if (!ingredient) return groups;
                                const category = ingredient.category || "Uncategorized";
                                if (!groups[category]) groups[category] = [];
                                groups[category].push(ingredient);
                                return groups;
                            }, {})
                        ).map(([category, ingredients]) => (
                            <Box key={category} sx={{m: 1, backgroundColor: "primary.main", width: "250px"}}
                                 p={2}
                                 borderRadius={2}>
                                <Typography variant="h6"
                                            sx={{textTransform: "capitalize", color: "text.secondary"}}>
                                    {category}
                                </Typography>
                                {ingredients.map((ingredient) => (
                                    <Box
                                        key={ingredient._id}
                                        sx={{
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Typography variant="body2">{ingredient.name}</Typography>
                                    </Box>
                                ))}
                            </Box>
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
                    <Box sx={{textAlign: "center", mt: 2, mb: 1}}>
                        <Typography variant="body1" sx={{color:"text.secondary"}}>
                            Choose the ingredients you have
                        </Typography>
                    </Box>
                    <IngredientsList
                        ingredients={ingredients}
                        selectedIngredients={fridgeIngredients}
                        handleToggleIngredient={handleToggleIngredient}
                    />
                    {selectedIngredients.length === 0 && (
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