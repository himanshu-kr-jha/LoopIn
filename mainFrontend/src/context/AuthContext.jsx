import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

const getUser = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("chatapp_token"));
    console.log("Token from localStorage:", token);
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      const response = await axios.get("http://localhost:5000/user/profile", {
        withCredentials: true,
      });
      // Attach the token to the user data
      const userData = {
        ...response.data.data,
        token, // ⬅️ Add the token here
      };
      console.log("User data from backend:", userData);
      return userData;
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
  }
  return null;
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      console.log("User fetched from getUser:", user);
      setAuthUser((prev) => {
        if (prev && prev._id === user._id && prev.token === user.token) {
          return prev; // Avoid triggering re-renders
        }
        return { ...user, token: user.token };
      });

      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
