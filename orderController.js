const sequelize = require('./model')
const jwt = require('jsonwebtoken')


const sumTotalItems = (previousItem, currentItem) => previousItem.total + currentItem.total;

module.exports = {
    createOrder: (req, res) => {
       try {
            let orderToSave = req.body;
            //Find pay method of order to save by primary key
            sequelize.models.PaymentMethod.findByPk(orderToSave.payMethodId).then((paymentMethod)=>{
                const order =  sequelize.models.Order.build({ total: orderToSave.total, paymentMethodId: paymentMethod.id });
                    order.save().then((orderSaved) => {
                        let itemsToSave = orderToSave.detail;
                        let promisesItem = [];
                        //product plus others product  result the sum of amounts by price and total
                        itemsToSave.forEach(itemToSave => {
                            let promiseItem = new Promise((resolve, reject) => {
                                sequelize.models.Product.findByPk(itemToSave.productId).then((product)=>{
                                    order.addProduct(product, { through: { amount: itemToSave.amount } }).then(orderWithProduct =>{
                                        let total = itemToSave.amount*product.price;
                                        resolve({id: product.id,total: total});
                                    });
                                }).catch((error)=>{
                                    console.error('Unable to connect to the database:', error);
                                    reject(error);
                                });
                            });
                            promisesItem.push(promiseItem);
                        });
                        Promise.all(promisesItem).then(values=>{
                            //Calculate total
                            const total = values.reduce(sumTotalItems);
                            orderSaved.set({
                                total: total
                            });
                            orderSaved.save().then(orderWithTotal=>{
                                res.status(200).json(orderWithTotal);
                            });
                        }).catch((error)=>{
                            res.status(400).json(error);
                            console.error('Unable to connect to the database:', error);
                        });
                    }).catch((error)=>{
                        res.status(400).json(error);
                        console.error('Unable to connect to the database:', error);
                    })
            }).catch((error)=>{
                res.status(400).json(error);
                console.error('Unable to connect to the database:', error);
            });
        }catch (error) {
            res.status(400).json(error);
            console.error('Unable to connect to the database:', error);
        }
    },
    getOrder: (req, res) => {
        try {
          let orderId = req.params.orderId;
          sequelize.models.Order.findByPk(orderId).then((order) => {
            res.status(200).json(order);
          }).catch((error)=>{
            res.status(400).json(error);
          });
        } catch (error) {
            res.status(400).json(error);
            console.error('Unable to connect to the database:', error);
        }
    },
    updateOrder: (req, res) => {
        try {
            let orderId = req.params.orderId;
            let orderToUpdate = req.body;
            console.log(orderId);
            sequelize.models.Order.findByPk(orderId).then((order) => {
                order.total = orderToUpdate.total;
                order.payMethodId = orderToUpdate.payMethodId;
                order.detail = orderToUpdate.detail;
              // update order
                order.save().then((orderUpdated) => {
                //let itemsToSave = orderToUpdate.detail;
                //let promisesItem = [];
                //product plus others product  result the sum of amounts by price and total
                    res.status(200).json(orderUpdated);
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
    deleteOrder: (req, res) => {
        try {
            let orderId = req.params.orderId;
            
            sequelize.models.Order.findByPk(orderId).then((order) => {
              console.log(order);

              // delete order
              order.destroy().then((orderDeleted) => {
                
                res.status(200).json(orderDeleted);
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
