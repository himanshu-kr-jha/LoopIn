import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/profile", {
        withCredentials: true, // <-- This is required to send cookies
      });
      setData(response.data); // response.data = { data: { name, email, ... } }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setData({ error:"Failed" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;
  if (data.error) return <div>{data.error}</div>;

  const user = data.data;

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "1rem",
        padding: "1rem",
        border: "1px solid red",
        borderRadius: "8px",
        
      }}
    >
      <img
        src={user.profileimage}
        alt="Profile"
        style={{
          width: "100px",
          borderRadius: "50%",
          display: "block",
          margin: "auto",
          border:"solid",
          borderColor:"black"
        }}
      />
      <h2 style={{ textAlign: "center" }}>{user.name}</h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default Profile;
