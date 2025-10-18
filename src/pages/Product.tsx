import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
import { PRODUCTS_KEY } from "../context/Auth/AuthProvider";
import type { IProductProps } from "../types/product";
import { useCart } from "../context/Cart/CartContext";
import { useEffect, useState } from "react";
import type { ICartItem } from "../types/cart";

const ProductPage = () => {
  const { id } = useParams();
  const { productsInContext, isAuthenticated } = useAuth();
  const { addItemToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [cartItem, setCartItem] = useState<ICartItem | undefined>({
    _id: "",
    product: "",
    image: "",
    quantity: 0,
    title: "",
    unitPrice: 0,
  });

  useEffect(() => {
    setCartItem(
      cartItems.find(
        (item: ICartItem) =>
          typeof item.product !== "string" && item.product._id == id
      )
    );
  }, [cartItems, id]);

  if (!id) return <Typography>Error</Typography>;
  const productsFromLocalStorage: IProductProps[] = JSON.parse(
    localStorage.getItem(PRODUCTS_KEY) || "[]"
  );
  let product: IProductProps | undefined = productsFromLocalStorage?.find(
    (p) => p._id == id
  );

  if (!product) product = productsInContext?.find((p) => p._id == id);

  if (cartItems)
    return (
      <Paper
        sx={{
          width: "100%",
          flex: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            border: "1px solid black",
            width: { xs: "95%", sm: "90%", md: "60%" },
            margin: "auto",
            borderRadius: "24px",
          }}
        >
          <Typography
            sx={{ color: "red", textAlign: "center", marginTop: "1rem" }}
          >
            Product Id :{id}
          </Typography>
          <CardMedia
            sx={{
              width: "50vw",
              height: { xs: "50vw", sm: "50vw", md: "25vw" },
              backgroundSize: "70%",
              margin: "auto",
            }}
            image={product?.image}
          ></CardMedia>
          <CardContent
            sx={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <Typography>Title :{product?.title}</Typography>
            <Typography>Price :{product?.price}</Typography>
            <Typography>Stock :{product?.stock}</Typography>
            <Button
              variant="contained"
              sx={{ padding: "1rem" }}
              onClick={() =>
                isAuthenticated ? addItemToCart(id) : navigate("/login")
              }
            >
              {cartItem
                ? `-- ${cartItem.quantity}  Piece --  In The Cart + Add More...`
                : "Add To Cart"}
            </Button>
          </CardContent>
        </Box>
      </Paper>
    );
};

export default ProductPage;
