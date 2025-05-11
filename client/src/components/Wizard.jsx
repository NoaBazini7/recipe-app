import React, {useEffect, useState} from "react";
import {Box, Button, Slider, ToggleButton, ToggleButtonGroup, Typography,} from "@mui/material";
import MyFridge from "./MyFridge.jsx";
import {IngredientsList} from "./IngredientsList.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import theme from "../theme/theme.js";

const Wizard = ({
                    ingredients,
                    selectedIngredients,
                    setSelectedIngredients,
                    showExtended,
                    setShowExtended,
                    isEditingFridge,
                    setIsEditingFridge,
                    onClick
                }) => {
    const [step, setStep] = useState(1);
    const [mode, setMode] = useState("fridge");
    const [tolerance, setTolerance] = useState(0);
    // const [allergies, setAllergies] = useState(user?.allergies || []);
    const navigate = useNavigate();


    const handleFindRecipes = async (mode, tolerance) => {
        try {
            console.log("selectedIngredients from wizard", selectedIngredients);
            const response = await axios.post(
                "http://localhost:5000/api/recipes/filteredRecipes",
                {
                    ingredients: selectedIngredients.map((ingredient) => ingredients.find((i) => i._id === ingredient)?.name),
                    mode,
                    tolerance,
                }
            );
            navigate("/recipes", {state: {recipes: response.data}});
        } catch (error) {
            console.error("Error fetching filtered recipes:", error);
        }
    };

    useEffect(() => {
        if (mode === "inspiration") {
            setSelectedIngredients([]); // Clear selected items
        }
    }, [mode]);

    const handleNext = async () => {
        if (step === 3) {
            console.log("tolerance", tolerance);
            console.log("mode", mode);
            await handleFindRecipes(mode, tolerance);
        } else {
            setStep(step + 1);
        }
    };

    // const handleToggleAllergy = (ingredientId) => {
    //     setAllergies((prev) =>
    //         prev.includes(ingredientId)
    //             ? prev.filter((id) => id !== ingredientId)
    //             : [...prev, ingredientId]
    //     );
    // };

    return (
        <Box sx={{p: 3}}>
            {step === 1 && (
                <>
                    <Typography variant="h5" gutterBottom>
                        Let's plan a meal 🍽️
                    </Typography>

                    <Typography sx={{mt: 2, mb: 1}}>
                        How would you like to find recipes?
                    </Typography>

                    <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={(e, val) => val && setMode(val)}
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                            justifyContent: "center",
                            mb: 3,
                        }}
                    >
                        <ToggleButton value="fridge">
                            <Box>
                                <Typography fontSize="2rem" mb={1}>🧊</Typography>
                                <Typography fontWeight="bold">Fridge Mode</Typography>
                                <Typography variant="body2">
                                    Only show recipes I have <em>all</em> the ingredients for
                                </Typography>
                            </Box>
                        </ToggleButton>

                        <ToggleButton value="inspiration">
                            <Box>
                                <Typography fontSize="2rem" mb={1}>💡</Typography>
                                <Typography fontWeight="bold">Inspiration Mode</Typography>
                                <Typography variant="body2">
                                    Show recipes that <em>contain</em> my chosen ingredients
                                </Typography>
                            </Box>
                        </ToggleButton>
                    </ToggleButtonGroup>


                </>)}

            {step === 2 && (
                <>
                    {mode === "fridge" ? (
                        <MyFridge
                            ingredients={ingredients}
                            selectedIngredients={selectedIngredients}
                            setSelectedIngredients={setSelectedIngredients}
                            showExtended={showExtended}
                            setShowExtended={setShowExtended}
                            isEditingFridge={isEditingFridge}
                            setIsEditingFridge={setIsEditingFridge}
                            HandleToggleIngredient={onClick}
                            onClickNext={() => setStep(3)}
                        />
                    ) : (
                        <Box>
                            <IngredientsList
                                ingredients={ingredients}
                                selectedIngredients={selectedIngredients}
                                setSelectedIngredients={setSelectedIngredients}
                                handleToggleIngredient={onClick}
                            />
                        </Box>
                    )}
                </>
            )}

            {step === 3 && mode === "inspiration" && (
                <Box>
                    <>
                        <Typography sx={{mt: 3, mb: 1}} align="center">
                            How many ingredients are you okay with missing?
                        </Typography>
                        <Slider
                            value={tolerance}
                            onChange={(e, val) => setTolerance(val)}
                            step={1}
                            min={0}
                            max={5}
                            valueLabelDisplay="auto"
                            sx={{width: "60%", mx: "auto", color: theme.palette.secondary.main}}
                        />
                    </>
                    <Typography variant="h6" sx={{mb: 2}}>
                        Do you have any allergies? 🚨
                    </Typography>

                </Box>
            )}

            <Button variant="contained" sx={{mt: 4}} onClick={handleNext}>
                {step === 3 ? "Find Recipes" : "Next"}
            </Button>
        </Box>
    );
};

export default Wizard;
