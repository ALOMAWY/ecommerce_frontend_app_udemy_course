import { Container, Grid, Paper, Typography } from "@mui/material";
import ProductInCart from "../components/ProductInCart";
import { useCart } from "../context/Cart/CartContext";
import InfoBar from "../components/InfoBar";

const Cart = () => {
  const { cartItems } = useCart();

  return (
    <Paper
      sx={{
        flex: "1",
      }}
    >
      <InfoBar />
      <Container sx={{ padding: 0, marginTop: "1rem" }}>
        <Grid container spacing={2} alignItems={"flex-end"}>
          {cartItems.length ? (
            cartItems.map((product, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={3}>
                {typeof product.product !== "string" && (
                  <ProductInCart {...product.product} />
                )}
              </Grid>
            ))
          ) : (
            <Typography sx={{ margin: "2rem", fontSize: "2rem" }}>
              No Items In Cart
            </Typography>
          )}
        </Grid>
      </Container>
    </Paper>
  );
};

export default Cart;
