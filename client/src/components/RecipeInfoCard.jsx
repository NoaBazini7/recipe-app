import {Box, CardMedia, Typography} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import React, {useEffect} from "react";

const RecipeInfoCard = ({recipe}) => {

    useEffect(() => {
        console.log(recipe);
    }, []);

    return (
        <Box>

            <CardMedia
                component="img"
                alt={recipe.title}
                image={recipe.imageUrl}
                sx={{
                    width: "100%",
                    aspectRatio: "4 / 3",
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 2
                }}
            />

            {/* Calories */}
            {recipe.calories && (
                <Box sx={{mb: 3}}>
                    <Typography variant="h6" sx={{fontSize: "0.875rem"}}>
                        Calories: {recipe.calories} per serving
                    </Typography>
                </Box>
            )}

            {/* Time */}
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                m: 3,
                backgroundColor: "primary.main",
                p: 2,
                pl: 4,
                pr: 4,
                borderRadius: 2

            }}>
                <Box>
                    <Typography variant="h2" sx={{fontSize: "1rem"}}>
                        Preparation:
                    </Typography>
                    <Typography variant="body2" sx={{fontSize: "1rem", mb: 1}}>
                        {recipe.prep_time}
                    </Typography>
                    <Typography variant="h2" sx={{fontSize: "1rem"}}>
                        Cooking:
                    </Typography>
                    <Typography variant="body2" sx={{fontSize: "1rem"}}>
                        {recipe.cook_time}
                    </Typography>
                </Box>
                <Box sx={{ml: 4}}>
                    <Typography variant="h2" sx={{fontSize: "1rem"}}>
                        Total time:
                    </Typography>
                    <Typography variant="h2" sx={{fontSize: "1.5rem", color: "text.primary"}}>
                        = {recipe.total_time}
                    </Typography>
                </Box>
            </Box>


            {/* Rating and kosher */}
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", m: 3, ml: 6, mr: 6}}>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <StarIcon sx={{fontSize: "1.75rem", color: "#fbc02d", mr: 0.5}}/>
                    <Typography variant="h2" sx={{fontSize: "1rem"}}>
                        {recipe.rating} / 5
                    </Typography>
                </Box>
                <Typography variant="h2" sx={{fontSize: "1rem"}}>
                    Kosher {recipe.kosher ? "✔" : "✘"}
                </Typography>
            </Box>
        </Box>

    )
}
export default RecipeInfoCard;