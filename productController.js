const sequelize = require('./model')

module.exports = {
    createProduct: (req, res) => {
        try {
            let productToSave = req.body;
            const product =  sequelize.models.Product.build({ price: productToSave.price, name: productToSave.name,
            imgUrl: productToSave.imgUrl });
            product.save().then((savedProduct) => {
            res.status(200).json(savedProduct);
            }).catch((error)=>{
                res.status(400).json(error);
                console.error('Unable to connect to the database:', error);
            })
        }catch (error) {
            res.status(400).json(error);
            console.error('Unable to connect to the database:', error);
        }
    },
    getProduct: (req, res) => {
        try {
            let productId = req.params.productId;
            
            sequelize.models.Product.findByPk(productId).then((product) => {
              res.status(200).json(product);
            }).catch((error)=>{
              res.status(400).json(error);
            });
              
          } catch (error) {
              res.status(400).json(error);
              console.error('Unable to connect to the database:', error);
          }
    },
    updateProduct: (req, res) => {
        try {
            let productId = req.params.productId;
            let productToUpdate = req.body;
            
            sequelize.models.Order.findByPk(productId).then((product) => {
                product.name = productToUpdate.name;
                product.price = productToUpdate.price;
                product.imgUrl = productToUpdate.imgUrl;
             

              // actualiza product
              product.save().then((updatedProduct) => {
                
                res.status(200).json(updatedProduct);
                }).catch((error)=>{
                    res.status(400).json(error);
                    console.error('Unable to connect to the database:', error);
                })
            });
              
          } catch (error) {
              res.status(400).json(error);
              console.error('Unable to connect to the database:', error);
          }
    },
    deleteProduct: (req, res) => {
        try {
            let productId = req.params.productId;
           
            sequelize.models.Product.findByPk(productId).then((product) => {
              
              // delete la orden
              product.destroy().then((productDeleted) => {
                
                res.status(200).json(productDeleted);
                }).catch((error)=>{
                    res.status(400).json(error);
                    console.error('Unable to connect to the database:', error);
                })
            });
              
          } catch (error) {
              res.status(400).json(error);
              console.error('Unable to connect to the database:', error);
          }
    },
  };