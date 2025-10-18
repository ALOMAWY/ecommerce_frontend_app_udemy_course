import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useCart } from "../context/Cart/CartContext";
import { useNavigate } from "react-router-dom";
import type { ICartItem } from "../types/cart";
import React, { useState } from "react";
import { BASE_URL } from "../constants/baseurl";
import { useAuth } from "../context/Auth/AuthContext";

const Checkout = () => {
  const { cartItems, totalAmount, fetchOrders } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<boolean>(false);
  const [address, setAddress] = useState("");

  const handleOrder = async () => {
    if (!address) return;

    try {
      const response = await fetch(`${BASE_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        setError(true);
        throw new Error("Cannot To Post Checkout");
      }

      await response.json();
      navigate("/success_order");

      fetchOrders();
    } catch (err) {
      setError(true);
      console.error(err);
    }
  };

  if (error) console.error("Somthing went wrong");

  return (
    <Paper>
      <Box>
        <Typography
          variant="h4"
          sx={{
            padding: "2rem",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Checkout
        </Typography>

        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ marginX: "2.5rem" }}> IMAGE</Typography>
          <Typography sx={{ marginX: "5rem" }}> TITLE</Typography>
          <Typography sx={{ marginX: "2.5rem" }}> PRICE</Typography>
        </CardContent>

        <hr />

        {cartItems.length &&
          cartItems.map(({ product }: ICartItem) => {
            if (typeof product == "string") {
              setError(true);
              return;
            }

            return (
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid ",
                }}
              >
                <CardMedia
                  image={product.image}
                  sx={{ width: "4rem", height: "4rem", marginLeft: "2rem" }}
                />
                <Typography> {product.title}</Typography>
                <Typography sx={{ marginRight: "1.5rem" }}>
                  {product.price} SYP
                </Typography>
              </CardContent>
            );
          })}
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: { xs: "column" },
            justifyContent: "space-between",
            paddingX: "2rem",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              gap: ".5rem",
              alignItems: "center",
              justifyContent: { sm: "space-between", xs: "space-between" },
              width: { xs: "100%", sm: "100%" },
            }}
          >
            <Typography sx={{ display: "flex", gap: "10px" }}>
              <Typography>Total Amount :</Typography>
              {totalAmount.toFixed(2)} SYP
            </Typography>
            <TextField
              id="outlined-basic"
              label="Delivary Address"
              variant="outlined"
              name="address"
              sx={{ width: { xs: "50%" } }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAddress(e.target.value)
              }
            />
          </CardContent>

          <Button
            sx={{ width: { sm: "100%", xs: "100%" } }}
            variant="contained"
            onClick={() => handleOrder()}
          >
            Confirm Order
          </Button>
        </CardContent>
      </Box>
    </Paper>
  );
};

export default Checkout;
