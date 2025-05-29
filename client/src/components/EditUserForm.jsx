import {useState} from "react";
import {useUser} from "../contexts/UserContext.jsx";
import {Alert, Box, Button, TextField, ToggleButton, ToggleButtonGroup, Typography,} from "@mui/material";
import axios from "axios";

const allergiesList = ['gluten', 'nuts', 'soy', 'eggs', 'fish', 'shellfish'];

export default function EditUserForm({onUpdate}) {
    const {user, updateUser} = useUser();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: user?.email || "",
        password: "",
        allergies: user?.allergies || [],
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAllergiesChange = (e, newAllergies) => {
        setFormData((prev) => ({
            ...prev,
            allergies: newAllergies,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const updateData = {
                ...formData,
                username: user.username,
            };

            const {data} = await axios.put(`http://localhost:5000/api/users/update`, updateData);
            setSuccess("User info updated successfully!");
            onUpdate?.(data);
            updateUser(data);

        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 500,
                mx: "auto",
                mt: 4,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                justifyContent: "center",
            }}
        >
            <Typography variant="h5">Edit Profile</Typography>

            <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
            />

            <TextField
                label="New Password"
                name="password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                helperText="Leave blank to keep current password"
            />

            <Box>
                <Typography variant="subtitle1" mb={1} align="center" fontWeight="bold">
                    What are you allergic to?
                </Typography>
                <ToggleButtonGroup
                    value={formData.allergies}
                    onChange={handleAllergiesChange}
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    {allergiesList.map((allergy) => (
                        <ToggleButton
                            key={allergy}
                            value={allergy}
                            selected={formData.allergies.includes(allergy)}
                            sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                                borderRadius: "12px",
                                px: 2,
                                py: 1,
                                border: "2px solid",
                                borderColor: formData.allergies.includes(allergy)
                                    ? "primary.main"
                                    : "divider",
                                backgroundColor: formData.allergies.includes(allergy)
                                    ? "primary.light"
                                    : "background.paper",
                                "&:hover": {
                                    backgroundColor: formData.allergies.includes(allergy)
                                        ? "primary.main"
                                        : "action.hover",
                                    color: formData.allergies.includes(allergy)
                                        ? "white"
                                        : "inherit",
                                },
                            }}
                        >
                            {allergy}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>

            {success && <Alert severity="success">{success}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{display: "flex", justifyContent: "center"}}>
                <Button type="submit" variant="contained" disabled={loading} sx={{width: "70%"}}>
                    {loading ? "Updating..." : "Save Changes"}
                </Button>
            </Box>
        </Box>
    );
}
