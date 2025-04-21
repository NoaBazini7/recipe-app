import {createContext, useContext, useState} from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null); // null = not logged in

    const login = (user, userToken) => {
        setUser(user);
        console.log(user.username);
        // Optionally save to localStorage/sessionStorage
    };

    const logout = () => {
        setUser(null);
        // Remove from localStorage/sessionStorage
    };

    return (
        <UserContext.Provider value={{user, setUser, login, logout}}>
            {children}
        </UserContext.Provider>
    );
};

