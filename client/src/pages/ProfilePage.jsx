import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Box, Button, CircularProgress, IconButton, Typography,} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../App.css";
import {IngredientsList} from "../components/IngredientsList.jsx";
import {useUser} from "../contexts/UserContext.jsx";
import {AnimatePresence, motion} from "framer-motion";
import EditUserForm from "../components/EditUserForm.jsx";


const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState("ingredients");
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {user} = useUser();

    const menuItems = [
        {key: "ingredients", label: "My Ingredients"},
        {key: "editProfile", label: "Edit Profile"},
        {key: "recipes", label: "Saved Recipes"},
        {key: "settings", label: "Settings"},
    ];

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

    useEffect(() => {
        console.log("selectedIngredients", selectedIngredients);
    }, [selectedIngredients]);

    const renderSection = () => {
        switch (activeSection) {
            case "ingredients":
                return (
                    <Box>
                        <IngredientsList ingredients={ingredients} onClick={(ingredient) => {
                            handleToggleIngredient(ingredient);
                        }}/>
                        <Box sx={{display: "flex", justifyContent: "center", mt: 15}}>
                            <Button variant="contained" onClick={handleFindRecipes}>
                                Find Recipes
                            </Button>
                        </Box>
                    </Box>

                );
            case "editProfile":
                return (
                    <Box sx={{p: 2}}>
                        <EditUserForm/>
                    </Box>

                );
            case "recipes":
                return <Box sx={{p: 2}}>📖 Saved Recipes</Box>;
            case "settings":
                return <Box sx={{p: 2}}>⚙️ Settings</Box>;
            default:
                return null;
        }
    };

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
                flexDirection: "row", // changed from column
                alignItems: "flex-start",
                position: "relative",
                minHeight: "100vh",
                minWidth: "80vw",
                backgroundColor: "background.paper",
                pl: 0,
                overflowX: "auto",
            }}
            className="profilePage"
        >

            {/* Sidebar */}
            <Box sx={{
                width: 200,
                height: "100vh",
                backgroundColor: "primary.main",
                justifyContent: "center",
                gap: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                {menuItems.map((item) => (
                    <Button
                        key={item.key}
                        variant={activeSection === item.key ? "contained" : "outlined"}
                        fullWidth
                        sx={{mb: 1, width: "90%", color: "text.primary"}}
                        onClick={() => setActiveSection(item.key)}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>
            {/* Profile Icon in Top Right */}
            <IconButton
                onClick={handleGoToProfile}
                sx={{position: "absolute", top: 20, right: 20}}
            >
                <AccountCircleIcon sx={{fontSize: 40, color: "text.primary"}}/>
            </IconButton>


            {/* Main Content with Animation */}
            <Box sx={{flex: 1, pt: 5, alignItems: "center",}}>
                <Typography variant="h3" gutterBottom textAlign="center">
                    Welcome {user ? user.username : "User"}!
                </Typography>

                <Typography
                    variant="body1"
                    sx={{mb: 2, color: "text.secondary"}}
                    textAlign="center"
                >
                    {activeSection === "ingredients" ? "Choose your fridge's content" : ""}
                </Typography>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{opacity: 0, x: 50}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: -50}}
                        transition={{duration: 0.3}}
                        style={{width: "100%"}}
                    >
                        <Box sx={{p: 2, display: "flex", justifyContent: "center", alignItems: "center"}}>
                            {renderSection()}
                        </Box>

                    </motion.div>
                </AnimatePresence>


            </Box>
        </Box>
    );
};

export default ProfilePage;