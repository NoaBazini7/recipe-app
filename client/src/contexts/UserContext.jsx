import {createContext, useContext, useEffect, useState} from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null); // null = not logged in

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

    }, []);

    const login = (user) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };


    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                login,
                logout,
                updateUser,

            }}
        >
            {children}
        </UserContext.Provider>
    );
};
