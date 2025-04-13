import {Link} from "react-router-dom";
import "../App.css";
import GifBackground from "../components/GifBack.jsx";

function WelcomePage() {
    return (
        <>
            <GifBackground/>
            <div className="button-container">
                <h1>
                    Let's start exploring the world of cooking together!
                </h1>
                <Link to="/login">
                    <button className="button">Log in</button>
                </Link>
                <Link to="/register">
                    <button className="button">Register</button>
                </Link>
            </div>

        </>
    );
}

export default WelcomePage;