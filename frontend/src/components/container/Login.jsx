import { Button, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../axios";

const loginUser = async (body) => {
  const response = await apiClient.post("/api/login", JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const {
    isLoading,
    mutate: login,
    isError,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => navigate("/"),
  });

  const handleLogin = () => {
    const newData = { email: email };
    login(newData);
  };

  return (
    <div
      style={{
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2%",
        margin: "0 auto",
      }}
    >
      <Typography
        sx={{
          color: "text.primary",
          fontWeight: "bold",
          fontSize: "24px",
          marginBottom: "10%",
        }}
      >
        LOGIN
      </Typography>
      <TextField
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        variant="outlined"
      />
      <br />
      <br />
      <Button disabled={isLoading} variant="contained" onClick={handleLogin}>
        Login
      </Button>
      {isError && <div>User not found!</div>}
    </div>
  );
};
