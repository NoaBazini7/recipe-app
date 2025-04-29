import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // null = not logged in
    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedRecipes = localStorage.getItem("savedRecipes");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedRecipes) {
            setSavedRecipes(JSON.parse(storedRecipes));
        }
    }, []);

    const login = (user) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        setSavedRecipes([]); // очищаем при выходе
        localStorage.removeItem("savedRecipes");
    };

    const saveRecipe = (recipe) => {
        setSavedRecipes((prev) => {
            const alreadySaved = prev.find((r) => r._id === recipe._id);
            if (alreadySaved) return prev;

            const updated = [...prev, recipe];
            localStorage.setItem("savedRecipes", JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                login,
                logout,
                savedRecipes,
                saveRecipe
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
