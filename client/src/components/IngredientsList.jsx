import {Box, Chip, Collapse, FormControlLabel, IconButton, Switch, TextField, Typography} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import categoryColors from "../utils/categoryColors.js";

const ITEM_WIDTH = 200;
const CHIP_HEIGHT = 64;

const IngredientsList = ({ingredients, selectedIngredients, setSelectedIngredients}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [showExtended, setShowExtended] = useState(false);
    const [collapsedCategories, setCollapsedCategories] = useState({});

    useEffect(() => {
        const filtered = ingredients.filter((ingredient) =>
            ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const finalFiltered = showExtended
            ? filtered
            : filtered.filter((ingredient) => ingredient.isCommon);
        setFilteredIngredients(finalFiltered);
    }, [ingredients, searchTerm, showExtended]);

    const groupedIngredients = useMemo(() => {
        const groups = {};
        for (const ingredient of filteredIngredients) {
            const cat = ingredient.category || "Uncategorized";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(ingredient);
        }
        return groups;
    }, [filteredIngredients]);

    const toggleCategory = (category) => {
        setCollapsedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const handleChipClick = (ingredient) => {
        setSelectedIngredients((prev) =>
            prev.includes(ingredient._id)
                ? prev.filter((id) => id !== ingredient._id)
                : [...prev, ingredient._id]
        );
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            width: "60vw",
            height: "65vh",
            border: "1px solid",
            borderColor: "text.primary",
            borderRadius: 1,
            padding: 2,
            boxShadow: 2,
            backgroundColor: "background.paper",

        }}>
            <TextField
                variant="outlined"
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                    mb: 3,
                    mt: 1,
                    width: "70%",
                    mx: "auto",
                }}
            />

            <Box sx={{display: "flex", justifyContent: "center", mb: 2}}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showExtended}
                            onChange={() => setShowExtended(!showExtended)}
                            color="secondary"
                        />
                    }
                    label={<Typography fontSize={15}>Show Extended Ingredients</Typography>}
                />
            </Box>

            <Box sx={{
                flex: 1,
                overflowY: "auto",
                pr: 1,
                "&::-webkit-scrollbar": {
                    width: 6,

                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "background.paper",
                    borderRadius: 3,
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "text.primary",
                    borderRadius: 9,
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "text.secondary",
                },
                "&::-webkit-scrollbar-button": {
                    display: "none",
                    height: 0,
                    width: 0,
                },
            }}>
                {Object.entries(groupedIngredients).map(([category, ingredients]) => (
                    <Box key={category} sx={{mb: 2}}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                                backgroundColor: "primary.light",
                                padding: 1,
                                borderRadius: 1,
                            }}
                            onClick={() => toggleCategory(category)}
                        >
                            <Typography variant="h6" color={categoryColors[category]}>{category}</Typography>
                            <IconButton size="small">
                                {collapsedCategories[category] ? <ExpandMoreIcon/> : <ExpandLessIcon/>}
                            </IconButton>
                        </Box>
                        <Collapse in={!collapsedCategories[category]}>
                            <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mt: 1}}>
                                {ingredients.map((ingredient) => {
                                    const isSelected = selectedIngredients.includes(ingredient._id);
                                    return (
                                        <Chip
                                            key={ingredient._id}
                                            label={ingredient.name}
                                            onClick={() => handleChipClick(ingredient)}
                                            sx={{
                                                backgroundColor: isSelected ? "text.primary" : "primary.main",
                                                color: isSelected ? "background.paper" : "text.primary",
                                                fontWeight: isSelected ? "bold" : "normal",
                                                borderRadius: 3,
                                                cursor: "pointer",
                                            }}
                                        />
                                    );
                                })}
                            </Box>
                        </Collapse>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default IngredientsList;