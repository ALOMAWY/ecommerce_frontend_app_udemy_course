import React, { useEffect, useState } from "react";
import Product from "../components/Product";
import type { IProductProps } from "../types/product";
import { Box, Container, Grid } from "@mui/material";
import { BASE_URL } from "../constants/baseurl";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
import { PRODUCTS_KEY } from "../context/Auth/AuthProvider";
const HomePage = () => {
  const navigate = useNavigate();
  const { setProductsInContext } = useAuth();
  // States
  const [products, setProducts] = useState<IProductProps[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(BASE_URL + "/product");
        const data = await res.json();
        setProducts(data);
        setProductsInContext(data);
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
      } catch (error) {
        setError(true);
        console.error("Cannot Fetch Data !!", error);
      }
    };
    fetchData();
  }, []);

  if (error)
    return (
      <Box
        sx={{
          padding: "20px",
          fontSize: "1.5rem",
          fontFamily: "cursive",
          color: "red",
        }}
      >
        Somthing went wrong, Please try agein !!
      </Box>
    );

  return (
    <>
      <Container sx={{ padding: 0, marginTop: "1rem" }}>
        <Grid container spacing={2} alignItems={"flex-end"}>
          {products.map((product, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              onClick={() => {
                navigate(`/product/${product._id}`);
              }}
            >
              <Product {...product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};
export default HomePage;
