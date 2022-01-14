//import module//

var express = require('express');
var app = express();

const {
    validateUserData,
    validateProductData,
    validateOrderData,
    validacionJWT,
    validacionJWTAdmin,
  } = require("./middlewares");
  const { createUser, login, getUser } = require("./userController");
  const { createProduct, getProduct, getProducts, updateProduct, deleteProduct } = require("./productController");
  const { createOrder, getOrder, updateOrder } = require("./orderController");
  
  app.use(express.json());
  
  app.listen(3000, () => {
    console.log("Servidor en puerto 3000");
  });

// Create routes//

// USERS
app.post("/users", validateUserData, createUser); // CREATE USER
app.post("/users/login", login); // LOGIN USER
app.get("/usuarios/:user_id", validacionJWT, getUser); // LISTAR DATOS DE UN USUARIO ESPECIFICO

// PRODUCTS
app.post("/products", validateProductData, validacionJWTAdmin, createProduct); // CREATE PRODUCTS
app.get("/products", validacionJWT, getProducts); // GET ALL PRODUCTS
app.get("/products/:productId", validacionJWT, getProduct); // FIND PRODUCT BY ID
app.patch("/products/:productId", validacionJWTAdmin, updateProduct); // UPDATE PRODUCT
app.delete("/products/:productId", validacionJWTAdmin, deleteProduct); // DELETE PRODUCT

// ORDERS
app.post("/orders", validateOrderData, validacionJWT, createOrder); // CREATE ORDER
app.get("/orders/:orderId", validacionJWT, getOrder); // GET ORDER
app.patch("/orders/:orderId", validacionJWTAdmin, updateOrder); // UPDATE ORDER