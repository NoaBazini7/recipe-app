import './App.css'
import {Route, Routes} from "react-router-dom";
import {NotFound} from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/ProfilePage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import RecipesPage from "./pages/RecipesPage.jsx";
import RecipeDetail from './pages/RecipeDetail.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<WelcomePage/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/recipes" element={<RecipesPage/>}/>
            {<Route path="/recipe/:id" element={<RecipeDetail/>}/>}
            {/*<Route path="/" element={<Ingredients />} />*/}
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );

}

export default App;
