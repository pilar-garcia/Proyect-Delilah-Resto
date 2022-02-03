# Proyect-Delilah-Resto

# Objetivo:
Crear el backend para un sistema de pedidos online para un restaurante.

# Acciones User:

- Registrarnos
- Identificarnos
- Crear Órdenes

# Acciones Admin:

- Obtener Productos
- Agregar Productos
- Eliminar Productos
- Actualizar Productos
- Obtener todas las Órdenes
- Eliminar Órdenes
- Actualizar status de las Órdenes
- Crear Órdenes
- Obtener  Usuarios
# Clonar el proyecto desde tu consola:
copia y pega esta línea de comando:

git clone https://github.com/pilar-garcia/Proyect-Delilah-Resto.git

# Instalar dependencia:
copia y pega esta línea de comando:

npm i

# Crear Base de Datos:
Existen dos opciones:
1. crear una base de datos con el nombre delilah en el motor mysql, despues crera un usuario de nombre admin y la contraseña delilah.

2. ir al archivo model.js y modificar la conexion a la base de datos por una que se tenga, una vez hecho esto y al ejecutar el proyecto se generaran las tablas necesarias para su funcionamiento.

# Crear usuario con el rol Administrador:
 El sistema unicamente permite registrar usuarios con el rol de Cliente. Para crear un usuario Administrador se debe de ejecutar la siguiente linea de SQL en la base de datos:

INSERT INTO delilah.Users
(userName, fullName, email, phone, address, pass, createdAt, updatedAt, rolId)
VALUES('admin', 'admin', 'admin@delilah.com', '0000000', 'some address', 'admin', '2022-01-27 00:45:53', '2022-01-27 00:45:53', 1);


# Inicia el servidor 
Tienes varias opciones para iniciar el servidor. Desde tu terminal o editor de código(en la consola) y estando en la carpeta proyect-delilah-resto puedes introducir cualquiera de estos comandos:

node api.js
nodemon api.js
npm start

Puedes ir a swagger copiar y pegar el contenido del archivo YAML para entender mejor el funcionamiento de la API

Adiconalmente puedes agregar la siguiente coleccion de postman para visualizar el uso adecuado de cada Enpoint:
Para agregar la colecion, debes:
1. ir a la aplicacion de Postman y dar click en File(Archivo).
2. dar click en import(importar) y seleccionar la tercera pestaña(link).
3. copiar y pegar el link acontinuación y dar click en continue(continuar).
https://www.getpostman.com/collections/d37fd5daeeb8a02312bd 

# ENDPOINTS:

| Metodo  | Endpoint               | Header  | Descripcion                        |
|---------|------------------------|---------|------------------------------------|
| USERS   |                        |         |                                    |
|         |                        |         |                                    |
| POST    | /users                 |         | Registra un usuario nuevo          |
| POST    | /users/login           |         | Inicio de sesión del usuario       |
| GET     | /usuarios/:userId      | {TOKEN} | Obtiene usuario por su ID (Admin)  |
|         |                        |         |                                    |
|PRODUCTS |                        |         |                                    |
|         |                        |         |                                    |
| POST    | /products              | {TOKEN} | Crea un producto (Admin)           |
| PUT     | /products/:productId   | {TOKEN} | actualiza los productos (Admin)    |
| GET     | /products              | {TOKEN} | Obtener todos los productos        |
| GET     | /products/:productId   | {TOKEN} |Encuentra un producto por id        |
| DELETE  | /products/:productId   | {TOKEN} | Inactiva un producto (Admin)       |
|         |                        |         |                                    |
| ORDERS  |                        |         |                                    |
|         |                        |         |                                    |
| POST    | /orders                | {TOKEN} | Crea una nueva orden               |
| GET     | /orders/:orderId       | {TOKEN} | Obtiene ordenes por id             |
| PUT     | /orders/:orderId       | {TOKEN} | Actualiza status orden (Admin)     |
