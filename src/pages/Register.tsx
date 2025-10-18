import { Box, Button, Paper, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import type { IUser } from "../types/user";
import { BASE_URL } from "../constants/baseurl";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";

const Register = () => {
  const initialData: IUser = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
  const [data, setData] = useState<IUser>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const isFormValid = () => {
    const { firstName, lastName, email, password } = data;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // matches anything@anything.anything

    return (
      firstName.trim().length >= 3 &&
      lastName.trim().length >= 3 &&
      emailRegex.test(email) &&
      !loading &&
      password.length >= 8
    );
  };

  // Handlers
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setError("Unable To Register User, Please Try Deffernt Credientials!");
        throw new Error("HTTP error! Status: " + response.status);
        return;
      }

      const token = await response.json();

      if (!token) {
        setError("Invalid Token");
        return;
      }

      login(data.email, token);

      setData(initialData);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(`Somthing went Wrong, Try With Safe Info`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ flex: "1", display: "flex" }}>
      <Box
        component="form"
        onSubmit={onSend}
        sx={{
          "& .MuiTextField-root": {
            width: "100%",
            padding: "10px 0",
          },
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", md: "50%" },
          border: "1px solid #00000050",
          borderRadius: "20px",
          padding: "20px",
          margin: "auto",
        }}
        noValidate
        autoComplete="off"
      >
        <Typography
          sx={{
            fontSize: "2rem",
            textAlign: "center",
            textTransform: "uppercase",
            margin: "20px",
            fontWeight: "900",
          }}
        >
          Register
        </Typography>
        <TextField
          required
          id="outlined-required"
          label="Firstname"
          name="firstName"
          value={data.firstName}
          onChange={onChange}
        />
        <TextField
          required
          id="outlined-required"
          label="Lastname"
          name="lastName"
          value={data.lastName}
          onChange={onChange}
        />
        <TextField
          required
          id="outlined-required"
          label="Email"
          name="email"
          value={data.email}
          onChange={onChange}
        />
        <TextField
          required
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          name="password"
          value={data.password}
          onChange={onChange}
        />
        {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
        <Button
          type="submit"
          disabled={!isFormValid()}
          variant="contained"
          sx={{
            mt: "1rem",
            padding: "1rem",
            borderRadius: "5px 5px 20px 20px",
            fontSize: "1rem",
            letterSpacing: "4px",
          }}
        >
          Send
        </Button>{" "}
        <Typography
          sx={{
            color: "green",
            textDecoration: "underline",
            textAlign: "center",
            m: "1rem",
          }}
        >
          <Link to={"/login"}>Already I Have Account</Link>
        </Typography>
      </Box>
    </Paper>
  );
};
export default Register;
