import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    Chip,
    Divider,
    Slider,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import MyFridge from "./MyFridge.jsx";
import IngredientsList from "./IngredientsList.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import theme from "../theme/theme.js";
import {useUser} from "../contexts/UserContext.jsx";


const Wizard = ({
                    ingredients,
                    showExtended,
                    setShowExtended,
                    isEditingFridge,
                    setIsEditingFridge,
                }) => {

    const {user} = useUser();
    const [step, setStep] = useState(1);
    const [mode, setMode] = useState("fridge");
    const [tolerance, setTolerance] = useState(0);
    const [complexity, setComplexity] = useState("intermediate");
    const [kosherOnly, setKosherOnly] = useState(false);
    const [userAllergies, setUserAllergies] = useState(user?.allergies || []);
    const navigate = useNavigate();
    const allergiesList = ['gluten', 'nuts', 'soy', 'eggs', 'fish', 'shellfish'];
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const handleFindRecipes = async (mode, tolerance) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/recipes/filteredRecipes",
                {
                    ingredients: selectedIngredients.map((ingredient) =>
                        ingredients.find((i) => i._id === ingredient)?.name
                    ),
                    mode,
                    tolerance,
                    kosherOnly,
                    complexity,
                    userAllergies,
                }
            );
            navigate("/recipes", {state: {recipes: response.data, selectedIngredients: selectedIngredients}});
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
        if (step === 2 && mode === "fridge") {
            setSelectedIngredients(user.fridgeIngredients);
        }
        if (step === 3) {
            console.log("tolerance", tolerance);
            console.log("mode", mode);

            await handleFindRecipes(mode, tolerance);
        } else {
            setStep(step + 1);
        }
    };

    useEffect(() => {
        console.log("selectedIngredients", selectedIngredients);
    }, [selectedIngredients]);

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
                    <Typography variant="h3" gutterBottom mt={2} mb={4}>
                        Let's plan a meal 🍽️
                    </Typography>
                    <Typography variant="h5" gutterBottom sx={{fontWeight: "bold", mb: 4}}>
                        Step 1: Choose a mode
                    </Typography>
                    <Typography sx={{mt: 4, mb: 3}}>
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


                    <Button variant="contained" onClick={handleNext}>
                        Next
                    </Button>
                </>)}

            {step === 2 && (
                <>
                    <Typography variant="h5" gutterBottom sx={{mt: 4, mb: 4, fontWeight: "bold"}}>
                        Step 2: Choose your ingredients
                    </Typography>
                    {mode === "fridge" ? (
                        <Box>
                            <MyFridge
                                ingredients={ingredients}
                                showExtended={showExtended}
                                setShowExtended={setShowExtended}
                                isEditingFridge={isEditingFridge}
                                setIsEditingFridge={setIsEditingFridge}
                                setSelectedIngredients={setSelectedIngredients}
                            />
                            {!isEditingFridge && (<Button variant="contained" onClick={handleNext} sx={{mt: 2}}>
                                Next
                            </Button>)}
                        </Box>
                    ) : (
                        <Box>
                            <IngredientsList
                                ingredients={ingredients}
                                selectedIngredients={selectedIngredients}
                                setSelectedIngredients={setSelectedIngredients}
                            />
                            <Button variant="contained" onClick={handleNext} sx={{mt: 2}}>
                                Next
                            </Button>
                        </Box>
                    )}
                </>
            )}

            {step === 3 && (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{mt: 4, mb: 4, fontWeight: "bold"}}>
                        Step 3: Preferences & Filters
                    </Typography>
                    <Card sx={{pl: 10, pr: 10, mb: 2, borderRadius: 2, backgroundColor: theme.palette.primary.light}}>
                        {mode === "inspiration" && (
                            <>
                                <Typography sx={{mt: 3, mb: 3, fontWeight: "bold"}} align="center">
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
                                    marks={[
                                        {value: 0, label: "🔍 I want a perfect match (0 missing)"},
                                        {value: 5, label: "🎲 Surprise me (up to 5 missing)"},
                                    ]}
                                />
                                <Divider sx={{my: 2, p: 2}}/>
                            </>
                        )}


                        {/* Recipe Complexity */}
                        <Box sx={{mt: 4, mb: 2}}>
                            <Typography align="center" sx={{mb: 3, fontWeight: "bold"}}>
                                How complex do you want your recipe to be?
                            </Typography>
                            <ToggleButtonGroup
                                value={complexity}
                                exclusive
                                onChange={(e, val) => {
                                    val && setComplexity(val);
                                    console.log("complexity", val);
                                }}
                                sx={{display: "flex", justifyContent: "center"}}
                            >
                                {[
                                    {value: "simple", emoji: "🍳", title: "Simple", subtitle: "≤ 5 ingredients"},
                                    {
                                        value: "intermediate",
                                        emoji: "🥘",
                                        title: "Intermediate",
                                        subtitle: "6–10 ingredients"
                                    },
                                    {value: "complex", emoji: "🍽️", title: "Complex", subtitle: "11+ ingredients"}
                                ].map(({value, emoji, title, subtitle}) => (
                                    <ToggleButton
                                        key={value}
                                        value={value}
                                        selected={complexity === value}
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            px: 3,
                                            py: 1.5,
                                            display: "flex",
                                            flexDirection: "column",
                                            border: "2px solid",
                                            borderColor: complexity === value ? theme.palette.primary.main : "divider",
                                            backgroundColor: complexity === value ? theme.palette.background.default : theme.palette.background.paper,
                                            color: complexity === value ? theme.palette.primary.contrastText : "inherit",
                                            "&:hover": {
                                                backgroundColor: complexity === value
                                                    ? theme.palette.primary.main
                                                    : theme.palette.action.hover,
                                            },
                                            mx: 1,
                                            borderRadius: "12px",
                                            minWidth: 130
                                        }}
                                    >
                                        <Typography variant="body1" fontWeight="bold">
                                            {emoji}
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {subtitle}
                                        </Typography>
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>

                        </Box>
                        <Divider sx={{my: 2, p: 2}}/>
                        {/* Kosher Filter */}
                        <Box sx={{mt: 4,}}>
                            <Typography align="center" sx={{mb: 3, fontWeight: "bold"}}>
                                Only show kosher recipes?
                            </Typography>
                            <ToggleButtonGroup
                                exclusive
                                onChange={(e, val) => val !== null && setKosherOnly(val)}
                                value={kosherOnly}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <ToggleButton
                                    value={true}
                                    sx={{
                                        backgroundColor: kosherOnly === true ? theme.palette.background.default : theme.palette.background.paper,
                                        "&:hover": {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                    }}
                                >
                                    ✅ Yes
                                </ToggleButton>
                                <ToggleButton
                                    value={false}
                                    sx={{
                                        backgroundColor: kosherOnly === false ? theme.palette.background.default : theme.palette.background.paper,
                                        "&:hover": {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                    }}
                                >
                                    ❌ No
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Divider sx={{my: 2, p: 2}}/>
                        {/* Allergies */}
                        <Typography variant="h6" sx={{mt: 4}} align="center" fontWeight="bold">
                            Do you have any allergies? 🚨
                        </Typography>
                        <Typography variant="caption" sx={{mb: 2}} align="center">
                            We will avoid recipes that contain any of these ingredients.
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1} mb={4} mt={2}>
                            {allergiesList.map((allergy) => {
                                const selected = userAllergies.includes(allergy);
                                return (
                                    <Chip
                                        key={allergy}
                                        label={allergy}
                                        onClick={() => {
                                            const updated = selected
                                                ? userAllergies.filter((a) => a !== allergy)
                                                : [...userAllergies, allergy];
                                            setUserAllergies(updated);
                                        }}
                                        sx={{
                                            textTransform: "capitalize",
                                            px: 2,
                                            py: 1,
                                            fontWeight: 500,
                                            bgcolor: selected ? theme.palette.secondary.main : theme.palette.grey[200],
                                            color: selected ? theme.palette.secondary.contrastText : theme.palette.text.primary,
                                            "&:hover": {
                                                opacity: 0.8,
                                            },
                                        }}
                                        clickable
                                    />
                                );
                            })}
                        </Stack>


                    </Card>
                    <Button variant="contained" onClick={handleNext} sx={{mt: 2}}>
                        Find Recipes
                    </Button>
                </Box>
            )}


        </Box>
    );
};

export default Wizard;
