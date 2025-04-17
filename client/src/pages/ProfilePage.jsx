import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {Box, Button, Checkbox, CircularProgress, Typography,} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "../App.css";

const ProfilePage = () => {
    const [ingredients, setIngredients] = useState([]);
    const navigate = useNavigate();
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/ingredients"
                );
                setIngredients(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching ingredients:", error);
                setLoading(false);
            }
        };

        fetchIngredients();
    }, []);

    const handleToggleIngredient = (id) => {
        setSelectedIngredients((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((item) => item !== id)
                : [...prevSelected, id]
        );
    };

    const handleFindRecipes = () => {
        const query = selectedIngredients.join(",");
        navigate(`/recipes?ingredients=${query}`);
    };

    const handleGoToProfile = () => {
        navigate("/user");
    };

    if (loading) return <CircularProgress />;

    return (
        <div className="profile-container">
            <h1>Welcome! Are you ready for cooking adventures?</h1>
            <Box minWidth={1000} mx="auto" textAlign="center">
                <Typography variant="body1" sx={{ fontSize: "1.5rem", mb:4 }} gutterBottom>
                    Choose your fridge's content
                </Typography>

                <Box
                    sx={{
                        maxHeight: 200,
                        overflowY: "auto",
                        mb: 3,
                        px: 2,
                        width: 450,
                        mx: "auto",
                    }}
                >
                    <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
                        {ingredients.map((ingredient) => {
                            const isSelected = selectedIngredients.includes(ingredient._id);
                            return (
                                <Box
                                    key={ingredient._id}
                                    onClick={() => handleToggleIngredient(ingredient._id)}
                                    sx={{
                                        borderRadius: 4,
                                        padding: 1.5,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        boxShadow: isSelected ? 3 : 1,
                                        "&:hover": {
                                            boxShadow: 4,
                                        },
                                        minWidth: 10,
                                        border: isSelected ? "2px solid #E43D12" : "2px solid #eee",
                                    }}
                                >
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => handleToggleIngredient(ingredient._id)}
                                        icon={
                                            <Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#f1f1f1",
                                                }}
                                            />
                                        }
                                        checkedIcon={
                                            <Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#E43D12",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "#f1f1f1",
                                                    fontSize: 14,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                ✓
                                            </Box>
                                        }
                                        sx={{
                                            padding: 0,
                                            "& .MuiSvgIcon-root": {
                                                display: "none",
                                            },
                                        }}
                                    />
                                    <Typography fontWeight={isSelected ? "bold" : "normal"}>
                                        {ingredient.name}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                <Button
                    className="button"
                    onClick={handleFindRecipes}
                    variant="contained"
                    sx={{
                        backgroundColor: "#E43D12",
                        color: "#fff",
                        mb: 3,
                        px: 4,
                        borderRadius: 3,
                        "&:hover": {
                            backgroundColor: "#c5320f",
                        },
                    }}
                >
                    Find Recipes
                </Button>
                <Box
                    sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={handleGoToProfile}
                >
                    <AccountCircleIcon sx={{ fontSize: 40, color: "#E43D12" }} />
                </Box>
            </Box>
        </div>
    );
};

export default ProfilePage;
