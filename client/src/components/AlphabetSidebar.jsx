import {Box} from "@mui/material";

function AlphabetSidebar({onLetterClick, activeLetter}) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return (
        <Box
            sx={{
                width: 30,
                mr: 2,
                height: "100%",
                overflowY: "auto",
                backgroundColor: "background.paper",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
            }}
        >
            {alphabet.map((letter) => (
                <Box
                    key={letter}
                    sx={{
                        fontSize: 15,
                        cursor: "pointer",
                        userSelect: "none",
                        fontWeight: "bold",
                        color: letter === activeLetter ? "primary.main" : "text.primary",
                        transition: "color 0.2s, font-weight 0.2s",
                        "&:hover": {
                            color: "text.secondary",
                        },
                    }}
                    onClick={() => onLetterClick(letter)}
                >
                    {letter}
                </Box>
            ))}
        </Box>
    );
}

export default AlphabetSidebar;