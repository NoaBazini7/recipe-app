import {useState} from "react";
import {useUser} from "../contexts/UserContext.jsx";
import {Alert, Box, Button, Stack, TextField, Typography,} from "@mui/material";
import axios from "axios";

export default function EditUserForm({onUpdate}) {
    const {user} = useUser();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: user.username || "",
        email: user.email || "",
        password: "", // Leave empty unless they want to change
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const {data} = await axios.put(`/api/users/${user._id}`, formData);
            setSuccess("User info updated successfully!");
            onUpdate?.(data); // Notify parent if needed
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{maxWidth: 400, mx: "auto", mt: 4}}>
            <Typography variant="h5" gutterBottom>
                Edit Profile
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    value={formData.username}
                    onChange={handleChange}
                />

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

                {success && <Alert severity="success">{success}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? "Updating..." : "Save Changes"}
                </Button>
            </Stack>
        </Box>
    );
}
