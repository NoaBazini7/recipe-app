import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    Snackbar,
    Typography
} from "@mui/material";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import theme from "../theme/theme.js";
import {useUser} from "../contexts/UserContext.jsx";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const RecipeListCard = ({title, recipeIds}) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const {user, setUser} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/recipes/getRecipesByIDs", {
                    params: {recipeIds},
                });
                setRecipes(res.data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [recipeIds]);

    function handleRecipeClick(recipe) {
        navigate(`/recipe/${recipe._id}`, {state: {recipes: [recipe], savedList: title}});
    }

    const handleRemove = async (idToRemove) => {
        try {
            setRecipes((prev) => prev.filter((r) => r._id !== idToRemove));
            await axios.post("http://localhost:5000/api/users/remove-recipe", {
                username: user.username,
                recipeID: idToRemove,
                listName: title,
            });

            const updatedLists = user.recipeLists.map((list) => {
                if (list.title === title) {
                    return {
                        ...list,
                        recipes: list.recipes.filter((id) => id !== idToRemove),
                    };
                }
                return list;
            });

            setUser({...user, recipeLists: updatedLists});
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error removing recipe:", error);
        }
    };

    const handleDeleteList = async () => {
        try {
            await axios.post("http://localhost:5000/api/users/delete-list", {
                username: user.username,
                listName: title,
            });

            const updatedLists = user.recipeLists.filter((list) => list.title !== title);
            setUser({...user, recipeLists: updatedLists});
            setConfirmDialogOpen(false);
        } catch (error) {
            console.error("Error deleting list:", error);
        }
    };

    return (
        <>
            <Card sx={{maxWidth: 345, minHeight: 400, minWidth: 300, margin: 2, borderRadius: "20px", boxShadow: 6}}>
                <CardContent sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Typography variant="h6" component="div" color={theme.palette.text.secondary}>
                        {title}
                    </Typography>
                    <IconButton onClick={() => setConfirmDialogOpen(true)} size="small" sx={{color: "red"}}>
                        <DeleteIcon/>
                    </IconButton>
                </CardContent>
                <Divider variant="middle"/>
                {loading ? (
                    <CardContent>
                        <CircularProgress/>
                    </CardContent>
                ) : (
                    recipes.map((recipe) => (
                        <CardContent key={recipe._id}>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <Typography
                                    onClick={() => handleRecipeClick(recipe)}
                                    sx={{
                                        fontSize: 14,
                                        "&:hover": {color: theme.palette.text.secondary, cursor: "pointer"},
                                    }}
                                >
                                    {recipe.title}
                                </Typography>
                                <Typography
                                    onClick={() => handleRemove(recipe._id)}
                                    sx={{
                                        color: "red",
                                        fontWeight: "bold",
                                        ml: 2,
                                        cursor: "pointer",
                                        "&:hover": {color: "#b71c1c"},
                                    }}
                                >
                                    ✖
                                </Typography>
                            </div>
                        </CardContent>
                    ))
                )}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    message="Recipe removed from list"
                    action={
                        <IconButton size="small" aria-label="close" color="inherit"
                                    onClick={() => setSnackbarOpen(false)}>
                            <CloseIcon fontSize="small"/>
                        </IconButton>
                    }
                />
            </Card>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Delete Recipe List</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the entire list "<strong>{title}</strong>"? This action cannot
                        be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteList} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default RecipeListCard;
