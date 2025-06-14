import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Box, Button, CircularProgress, IconButton, Typography} from "@mui/material";
import {useUser} from "../contexts/UserContext.jsx";
import {AnimatePresence, motion} from "framer-motion";
import EditUserForm from "../components/EditUserForm.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import RecipeListCard from "../components/RecipeListCard.jsx";
import Wizard from "../components/Wizard.jsx";
import MyFridge from "../components/MyFridge.jsx";

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState("wizard");
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const {user, logout} = useUser();
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [isEditingFridge, setIsEditingFridge] = useState(false);
    const [wizardKey, setWizardKey] = useState(0); // Add a key state for the Wizard


    const menuItems = [
        {key: "wizard", label: "🔮 Plan a Meal"},
        {key: "myFridge", label: "🧊 My Fridge"},
        {key: "editProfile", label: "✏️ Edit Profile"},
        {key: "recipes", label: "📖 My Lists"},
    ];


    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                setLoading(true)
                const response = await axios.get("http://localhost:5000/api/ingredients");
                let sortedIngredients = response.data.sort((a, b) => a.name.localeCompare(b.name));
                // const filtered = showExtended
                //     ? sortedIngredients
                //     : sortedIngredients.filter((ingredient) => ingredient.isCommon);
                setIngredients(sortedIngredients);
            } catch (error) {
                console.error("Error fetching ingredients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIngredients();

    }, []);


    useEffect(() => {
        console.log("User in ProfilePage:", user);
        if (!user) return; // ⛔ skip if user is not ready

        const fetchSavedRecipes = async () => {
            setLists(user.recipeLists);
        };

        fetchSavedRecipes();
    }, [user]); // ⬅️ make sure to rerun when `user` becomes available


    const renderSection = () => {
        switch (activeSection) {
            case "wizard":
                return (
                    <Wizard
                        key={wizardKey}
                        ingredients={ingredients}
                        isEditingFridge={isEditingFridge}
                        setIsEditingFridge={setIsEditingFridge}
                    />
                );
            case "myFridge":
                return (
                    <MyFridge
                        ingredients={ingredients}
                        isEditingFridge={isEditingFridge}
                        setIsEditingFridge={setIsEditingFridge}
                    />
                );

            case "editProfile":
                return (
                    <Box sx={{p: 2}}>
                        <EditUserForm/>
                    </Box>
                );
            case "recipes":
                return (
                    <Box sx={{p: 2}}>
                        <Typography variant="h5">📖 My Lists</Typography>

                        {lists.length === 0 && (
                            <>
                                <Typography variant="body1" color="text.secondary" sx={{mt: 8}}>
                                    No lists found.
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Recipe you find and save will appear here!
                                </Typography>
                            </>

                        )
                        }
                        <Box sx={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mt: 2,}}>
                            <AnimatePresence>
                                {lists.map((list) => (
                                    <motion.div
                                        key={list._id}
                                        initial={{opacity: 0, scale: 0.9}}
                                        animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0.9}}
                                        transition={{duration: 0.3}}
                                        layout
                                    >
                                        <RecipeListCard title={list.title} recipeIds={list.recipes}/>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </Box>
                    </Box>
                );

            default:
                return null;
        }
    };

    const handleMenuClick = (section) => {
        if (section === "wizard") {
            setWizardKey((prevKey) => prevKey + 1); // Increment the key to reset the Wizard
        }
        setActiveSection(section);
    };


    if (loading) return <CircularProgress sx={{mt: 10}}/>;

    return (
        <Box
            sx={{
                px: 4,
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                position: "relative",
                minWidth: "80vw",
                minHeight: "100vh",
                backgroundColor: "background.paper",
                pl: 0,
                overflowX: "auto",
                borderRadius: 2,
            }}
            className="profilePage"
        >
            {/* Sidebar */}
            <Box sx={{
                width: 230,
                height: "100vh",
                backgroundColor: "primary.main",
                justifyContent: "center",
                gap: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",

            }}>
                <Typography variant="h3" gutterBottom textAlign="center" mb={5}>
                    Welcome, {user ? user.username : "User"}!
                </Typography>
                {menuItems.map((item) => (
                    <Button
                        key={item.key}
                        variant={activeSection === item.key ? "contained" : "outlined"}
                        fullWidth
                        sx={{mb: 1, width: "90%", color: "text.primary"}}
                        onClick={() => handleMenuClick(item.key)}
                    >
                        {item.label}
                    </Button>
                ))}
                <Box sx={{flexDirection: "row", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <IconButton onClick={() => {
                        logout();
                        navigate("/");
                    }}>
                        <Typography variant="body1" color="text.primary"> Logout</Typography>
                        <LogoutIcon sx={{color: "text.primary", margin: "0 5px"}}/>
                    </IconButton>
                </Box>
            </Box>


            {/* Main Content with Animation */}
            <Box sx={{flex: 1, pt: 5, alignItems: "center"}}>

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
