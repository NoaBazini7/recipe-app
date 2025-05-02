import {Box, Chip, TextField} from "@mui/material";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {FixedSizeGrid as Grid} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import AlphabetSidebar from "./AlphabetSidebar.jsx";

const COLUMN_COUNT = 4;
const ITEM_WIDTH = 200;
const CHIP_HEIGHT = 64;


export function IngredientsList({ingredients, onClick}) {
    const [selectedIngredient, setSelectedIngredient] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const gridRef = useRef();

    useEffect(() => {
        const filtered = ingredients.filter((ingredient) =>
            ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredIngredients(filtered);
    }, [ingredients, searchTerm]);

    useEffect(() => {
        console.log("Selected Ingredients:", selectedIngredient);
    }, [selectedIngredient]);

    const handleChipClick = (ingredient) => {
        setSelectedIngredient((prev) =>
            prev.includes(ingredient._id)
                ? prev.filter((id) => id !== ingredient._id)
                : [...prev, ingredient._id]
        );
        onClick(ingredient);
    };

    const itemData = useMemo(() => {
        const sorted = [...filteredIngredients].sort((a, b) => a.name.localeCompare(b.name));
        const rows = Math.ceil(sorted.length / COLUMN_COUNT);
        return Array.from({length: rows}, (_, rowIndex) =>
            sorted.slice(
                rowIndex * COLUMN_COUNT,
                rowIndex * COLUMN_COUNT + COLUMN_COUNT
            )
        );
    }, [filteredIngredients]);

    const Cell = ({columnIndex, rowIndex, style}) => {
        const row = itemData[rowIndex];
        const ingredient = row?.[columnIndex];
        if (!ingredient) return null;

        const isSelected = selectedIngredient.includes(ingredient._id);

        return (
            <Box
                sx={{
                    ...style,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 2,
                }}
            >
                <Chip
                    label={
                        <Box
                            sx={{
                                textAlign: "center",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                            }}
                        >
                            {ingredient.name}
                        </Box>
                    }
                    variant="outlined"
                    onClick={() => handleChipClick(ingredient)}
                    sx={{
                        width: ITEM_WIDTH,
                        height: CHIP_HEIGHT,
                        backgroundColor: isSelected ? "text.primary" : "primary.main",
                        color: isSelected ? "background.paper" : "text.primary",
                        fontWeight: isSelected ? "bold" : "normal",
                        borderRadius: 3,
                        borderWidth: "1.5px ",
                        borderColor: isSelected ? "primary.main" : "text.primary",
                        px: 2,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                />
            </Box>
        );
    };

    const handleLetterClick = useCallback((letter) => {
        const index = filteredIngredients.findIndex((ing) =>
            ing.name.toUpperCase().startsWith(letter)
        );
        if (index !== -1) {
            const rowIndex = Math.floor(index / COLUMN_COUNT);
            gridRef.current?.scrollToItem({
                rowIndex,
                align: "start",
            });
        }
    }, [filteredIngredients]);

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
            boxShadow: 2, // optional: adds a soft shadow
            backgroundColor: "background.paper", // optional: ensures it’s not transparent

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
            <Box sx={{flex: 1, minHeight: 0, display: "flex"}}>
                <AutoSizer>
                    {({height, width}) => (
                        <Box sx={{display: "flex", width, height}}>
                            <AlphabetSidebar onLetterClick={handleLetterClick}/>
                            <Grid
                                ref={gridRef}
                                columnCount={COLUMN_COUNT}
                                columnWidth={ITEM_WIDTH}
                                height={height}
                                rowCount={itemData.length}
                                rowHeight={CHIP_HEIGHT + 16}
                                width={width - 60} // subtract sidebar width if needed
                            >
                                {Cell}
                            </Grid>
                        </Box>
                    )}
                </AutoSizer>
            </Box>
        </Box>
    );
}
