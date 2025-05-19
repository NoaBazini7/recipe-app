import React from "react";
import {Box, Typography,Checkbox, FormControl,Select,MenuItem,InputLabel,FormControlLabel,} from "@mui/material";

const FilterPanel = ({
                         categoryFilter,
                         setCategoryFilter,
                         kosherFilter,
                         setKosherFilter,
                         timeFilter,
                         setTimeFilter,
                         categories,
                     }) => {
    return (
        <Box
            sx={{
                position: "sticky",
                top: 100,
                alignSelf: "flex-start",
                width: 300,
                maxHeight: "90vh",
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                backgroundColor: "background.default",
                mr: 2,
            }}
        >
            <Typography variant="h6" sx={{color:"background.paper"}}>
                Filters
            </Typography>

            {/* Category */}
            <Box mb={2}>
                <FormControl fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
                    <InputLabel shrink htmlFor="category-select" sx={{ fontWeight: 500, marginTop: 2, color:"background.paper"}}>
                        Category
                    </InputLabel>
                    <Select
                        variant="outlined"
                        displayEmpty
                        id="category-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        sx={{
                            mt: 3.5,
                            borderRadius: "12px",
                            fontFamily: "Inter, sans-serif",
                            color: "text.primary",
                            '.MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: "background.paper" },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: "text.secondary" },
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Time Filter */}
            <Box mb={2}>
                <FormControl fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
                    <InputLabel shrink htmlFor="time-filter-select" sx={{ fontWeight: 500, color:"background.paper" }}>
                        Time
                    </InputLabel>
                    <Select
                        variant="outlined"
                        notched
                        displayEmpty
                        id="time-filter-select"
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        sx={{
                            mt: 3,
                            borderRadius: "12px",
                            fontFamily: "Inter, sans-serif",
                            color: "text.primary",
                            '.MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: "background.paper" },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: "text.secondary" },
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="15">≤15 min</MenuItem>
                        <MenuItem value="30">≤30 min</MenuItem>
                        <MenuItem value="60">≤ 1 h</MenuItem>
                        <MenuItem value="60+"> 1h+</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Kosher */}
            <Box mb={2}>
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <InputLabel
                        shrink
                        sx={{
                            marginBottom: 6,
                            color: "background.paper",
                        }}
                        htmlFor="kosher-checkboxes"
                    >
                        Kosher
                    </InputLabel>
                    <Box
                        id="kosher-checkboxes"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 3,
                            color: "background.paper",
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={kosherFilter === 'kosher'}
                                    onChange={() =>
                                        setKosherFilter(kosherFilter === 'kosher' ? '' : 'kosher')
                                    }
                                />
                            }
                            label="✔"
                            sx={{ userSelect: 'none', fontSize: '0.875rem' }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={kosherFilter === 'not_kosher'}
                                    onChange={() =>
                                        setKosherFilter(kosherFilter === 'not_kosher' ? '' : 'not_kosher')
                                    }
                                />
                            }
                            label="✘"
                            sx={{ userSelect: 'none', fontSize: '0.875rem' }}
                        />
                    </Box>
                </FormControl>
            </Box>


        </Box>
    );
};

export default FilterPanel;
