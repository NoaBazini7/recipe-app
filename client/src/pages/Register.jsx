import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Axios from "axios";
import "../App.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        try {

            const response = await Axios.post("http://localhost:5000/api/register", {
                email,
                password
            });

            if (response.data.success) {
                navigate("/profile");
            } else {
                setErrorMessage(response.data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setErrorMessage("Registration failed. Please try again.");
        }
    };

    return (
        <div className="button-container">
            <h2>Register</h2>
            {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>} {/* Показываем ошибку */}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
};

export default Register;
