import {Box, Chip} from "@mui/material";
import {useMemo, useState} from "react";
import {FixedSizeGrid as Grid} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const COLUMN_COUNT = 4;
const ITEM_WIDTH = 200;
const CHIP_HEIGHT = 64; // You can tweak this to your liking

export function IngredientsList({ingredients, onClick}) {
    const [selectedIngredient, setSelectedIngredient] = useState([]);

    const handleChipClick = (ingredient) => {
        setSelectedIngredient((prev) =>
            prev.includes(ingredient._id)
                ? prev.filter((id) => id !== ingredient._id)
                : [...prev, ingredient._id]
        );
        onClick(ingredient);
    };

    const itemData = useMemo(() => {
        const rows = Math.ceil(ingredients.length / COLUMN_COUNT);
        return Array.from({length: rows}, (_, rowIndex) =>
            ingredients.slice(
                rowIndex * COLUMN_COUNT,
                rowIndex * COLUMN_COUNT + COLUMN_COUNT
            )
        );
    }, [ingredients]);

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
                    padding: 1,
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
                        width: ITEM_WIDTH - 16,
                        height: CHIP_HEIGHT,
                        backgroundColor: isSelected ? "text.primary" : "background.default",
                        color: isSelected ? "#fff" : "#000",
                        borderRadius: 3,
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

    return (
        <Box sx={{width: "100%", height: "60vh"}}>
            <AutoSizer>
                {({height, width}) => (
                    <Grid
                        columnCount={COLUMN_COUNT}
                        columnWidth={ITEM_WIDTH}
                        height={height}
                        rowCount={itemData.length}
                        rowHeight={CHIP_HEIGHT + 16}
                        width={width}
                    >
                        {Cell}
                    </Grid>
                )}
            </AutoSizer>
        </Box>
    );
}
