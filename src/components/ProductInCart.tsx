import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { IProductProps } from "../types/product";
import { CardMedia } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";
import ButtonGroup from "@mui/material/ButtonGroup";
import type { ICartItem } from "../types/cart";

export default function ProductInCart({
  _id,
  title,
  price,
  stock,
  image,
}: IProductProps) {
  const { updateItemInCart, removeItemInCart, cartItems } = useCart();

  const product = cartItems.find((item: ICartItem) => {
    if (typeof item.product !== "string") return item.product._id == _id;
  });
  const productQuantity = product?.quantity || 1;

  const handleQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return;

    updateItemInCart(productId, quantity);
  };

  return (
    <Card
      sx={{
        flex: "1",
        boxShadow:
          "-1px -2px 16px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        sx={{
          height: 200,
          aspectRatio: " 16 / 9",
          backgroundSize: "60%",
          margin: "20px",
        }}
        image={image}
        title="green iguana"
      />
      <CardContent sx={{ padding: "0 0 0 30px", marginRight: "auto" }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{
            mb: "20px",
            height: "60px",
            width: "100%",
          }}
        >
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {price} SYP
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mt: "10px" }}
        >
          {stock} In Stock
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          margin: "20px",
          width: "100%",
          paddingLeft: "30px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Typography
            variant="body2"
            sx={{ fontSize: "0.9rem", color: "text.secondary" }}
          >
            {`${productQuantity} x ${price}SYP`}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "0.9rem", color: "text.secondary" }}
          >
            {product?.quantity} Item In Cart
          </Typography>
        </CardContent>
        <ButtonGroup
          sx={{ marginRight: "1rem" }}
          variant="contained"
          aria-label="Basic button group"
        >
          <Button onClick={() => handleQuantity(_id, productQuantity + 1)}>
            +
          </Button>
          <Button onClick={() => handleQuantity(_id, productQuantity - 1)}>
            -
          </Button>
          <Button onClick={() => removeItemInCart(_id)} color="error">
            <DeleteIcon sx={{ fontSize: "1.3rem", color: "white" }} />
          </Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
}
