import { Box, CardContent, CardMedia, Paper, Typography } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";


import type { IOrderItem } from "../types/order";

const Orders = () => {
  const { orders } = useCart();



  return (
    <Paper>
      <Typography
        variant="h4"
        sx={{
          padding: "2rem",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        Your Orders
      </Typography>
      <Box>
        {orders &&
          orders.map((order, index) => (
            <>
              <CardContent
                key={index}
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

              {order.orderItems &&
                order.orderItems.map((item: IOrderItem) => (
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid ",
                    }}
                  >
                    <CardMedia
                      image={item.productImage}
                      sx={{ width: "4rem", height: "4rem", marginLeft: "2rem" }}
                    />
                    <Typography> {item.productTitle}</Typography>
                    <Typography sx={{ marginRight: "1.5rem" }}>
                      {item.quantity} x {item.unitprice} SYP
                    </Typography>
                  </CardContent>
                ))}

              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingX: "2rem",
                }}
              >
                <CardContent sx={{ display: "flex", gap: ".5rem" }}>
                  <Typography>Total Amount :</Typography>
                  <Typography>{order.total.toFixed(2)} SYP</Typography>
                </CardContent>
                <Typography sx={{ width: "30%" }}>
                  Address : {order.address}
                </Typography>
              </CardContent>
              <br />
              <br />
              <br />
            </>
          ))}
      </Box>
    </Paper>
  );
};

export default Orders;
