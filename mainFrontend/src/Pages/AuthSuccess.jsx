import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    console.log("Token from URL:", token);
    localStorage.setItem("chatapp_token", JSON.stringify(token));
    const sendTokenToChatBackend = async (token) => {
      try {
        const response = await fetch("http://localhost:5001/api/store-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // crucial for cookies
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          console.log("Token sent to chat backend and stored in cookie");
          navigate("/profile");
        } else {
          console.error("Failed to send token to chat backend");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error sending token:", error);
        navigate("/login");
      }
    };

    if (token) {
      localStorage.setItem("jwtToken", token);
      sendTokenToChatBackend(token);
    } else {
      navigate("/login");
    }
  }, [navigate]); // now the warning is gone

  return (
    <p className="text-center mt-10 text-lg font-medium">Logging you in...</p>
  );
};

export default AuthSuccess;
