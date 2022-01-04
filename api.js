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
  const { createProduct, getProduct, updateProduct, deleteProduct } = require("./productController");
  const { createOrder, getOrder, updateOrder, deleteOrder } = require("./orderController");
  
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
app.get("/products", validacionJWT, getProduct); // GET ALL PRODUCTS
app.patch("/products/:product_id", validacionJWTAdmin, updateProduct); // UPDATE PRODUCT
app.delete("/products/:product_id", validacionJWTAdmin, deleteProduct); // DELETE PRODUCT

// ORDERS
app.post("/orders", validateOrderData, validacionJWT, createOrder); // CREATE ORDER
app.get("/orders/:order_id", validacionJWT, getOrder); // GET ORDER
app.patch("/orders/:order_id", validacionJWTAdmin, updateOrder); // UPDATE ORDER
app.delete("/orders/:order_id", validacionJWTAdmin, deleteOrder); // DELETE ORDER