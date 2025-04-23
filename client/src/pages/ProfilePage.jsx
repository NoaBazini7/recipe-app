import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Box, Button, CircularProgress, IconButton, Typography,} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../App.css";
import {IngredientsList} from "../components/IngredientsList.jsx";
import {useUser} from "../contexts/UserContext.jsx";

const ProfilePage = () => {
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {user} = useUser();

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/ingredients"
                );
                let sortedIngredients = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setIngredients(sortedIngredients);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching ingredients:", error);
                setLoading(false);
            }
        };

        fetchIngredients();
        console.log("User in ProfilePage:", user);
    }, []);

    const handleToggleIngredient = (ingredient) => {
        setSelectedIngredients((prevSelected) =>
            prevSelected.find((item) => item._id === ingredient._id)
                ? prevSelected.filter((item) => item._id !== ingredient._id)
                : [...prevSelected, ingredient]
        );
    };

    const handleFindRecipes = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/recipes/filteredRecipes",
                {
                    ingredients: selectedIngredients.map((ingredient) => ingredient.name),
                }
            );
            navigate("/recipes", {state: {recipes: response.data}});
        } catch (error) {
            console.error("Error fetching filtered recipes:", error);
        }
    };

    const handleGoToProfile = () => {
        navigate("/user");
    };

    if (loading) return <CircularProgress sx={{mt: 10}}/>;

    return (
        <Box
            sx={{
                px: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                minHeight: "100vh",
                backgroundColor: "background.paper",
            }}
            className="profilePage"
        >
            {/* Profile Icon in Top Right */}
            <IconButton
                onClick={handleGoToProfile}
                sx={{position: "absolute", top: 20, right: 20}}
            >
                <AccountCircleIcon sx={{fontSize: 40, color: "text.primary"}}/>
            </IconButton>

            {/* Header */}
            <Typography variant="h3" gutterBottom textAlign="center">
                Welcome back {/*(user.username)*/}!
            </Typography>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    mb: 4,
                }}>
                {/* Subheading */}
                <Typography
                    variant="body1"
                    sx={{mb: 2, color: "text.secondary"}}
                    textAlign="center"
                >
                    Choose your fridge's content
                </Typography>

                {/* Ingredient List */}
                <Box
                    sx={{
                        width: "900px",
                        height: "50vh",
                        overflow: "hidden",
                    }}
                >
                    <IngredientsList
                        ingredients={ingredients}
                        onClick={(ingredient) => {
                            handleToggleIngredient(ingredient);
                        }}
                    />
                </Box>

                {/* Button */}
                <Button
                    variant="contained"
                    onClick={handleFindRecipes}
                    sx={{
                        mt: 1,
                    }}
                >
                    Find Recipes
                </Button>
            </Box>
        </Box>
    );
};

export default ProfilePage;