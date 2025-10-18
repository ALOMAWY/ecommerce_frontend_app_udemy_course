import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useCart } from "../context/Cart/CartContext";
import { Button, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

function InfoBar() {
  const { totalAmount, clearCart, cartItems } = useCart();
  const navigate = useNavigate();
  const handleClearCart = () => clearCart();

  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{ borderTop: "5px solid #fff" }}>
        <Toolbar disableGutters sx={{ p: 0 }}>
          <CardContent
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "column", md: "row" },
              padding: 0,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                width: { xs: "100%", sm: "100%", md: "fit-content" },
                justifyContent: {
                  xs: "space-between",
                  sm: "space-between",
                  md: "center",
                },
                paddingBottom: "0",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "normal",
                  letterSpacing: "1px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <Typography sx={{ fontWeight: "900" }}>Total :</Typography>
                {new Intl.NumberFormat("en-US").format(totalAmount)} SYP
              </Typography>
              <Button
                disabled={!cartItems.length}
                variant="contained"
                color="success"
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </Button>
            </CardContent>

            <CardContent
              sx={{
                paddingBottom: "0px",
              }}
            >
              <Button
                sx={{ margin: "auto" }}
                disabled={!cartItems.length}
                variant="contained"
                color="error"
                onClick={() => handleClearCart()}
              >
                Clear Cart
              </Button>
            </CardContent>
          </CardContent>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default InfoBar;
