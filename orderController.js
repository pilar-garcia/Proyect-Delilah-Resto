const sequelize = require('./model')
const jwt = require('jsonwebtoken');
const { getProducts } = require('./productController');


const sumTotalItems = (previousItem, currentItem) => previousItem.total + currentItem.total;

module.exports = {
    createOrder: (req, res) => {
       try {
            let orderToSave = req.body;
            //Find pay method of order to save by primary key
            sequelize.models.PaymentMethod.findByPk(orderToSave.paymentMethodId).then((paymentMethod)=>{
                const order =  sequelize.models.Order.build({ total: orderToSave.total, paymentMethodId: paymentMethod.id });
                    order.save().then((orderSaved) => {
                        let itemsToSave = orderToSave.items;
                        let promisesItem = [];
                        //product plus others product  result the sum of amounts by price and total
                        itemsToSave.forEach(itemToSave => {
                            let promiseItem = new Promise((resolve, reject) => {
                                sequelize.models.Product.findByPk(itemToSave.productId).then((product)=>{
                                    order.addDetail(product, { through: { amount: itemToSave.amount } }).then(orderWithProduct =>{
                                        let total = itemToSave.amount*product.price;
                                        resolve({id: product.id,total: total});
                                    }).catch((error)=>{
                                        console.error('error adding product to order', error);
                                        reject(error);
                                    });
                                }).catch((error)=>{
                                    console.error('Error finding order:', error);
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
                                sequelize.models.Order.findOne({
                                    where: {
                                      id: orderWithTotal.id
                                    },
                                    include: 'Details'
                                    //include: [ { model: sequelize.models.Item, as: 'Detail' } ]
                                  }).then(findalOrder=>{
                                    res.status(200).json(findalOrder);
                                  }).catch((error)=>{
                                    console.error('Error getting final order:', error);
                                    res.status(400).json(error);
                                });
                            }).catch((error)=>{
                                console.error('Error saving order with total:', error);
                                res.status(400).json(error);
                            });
                        }).catch((error)=>{
                            console.error('Unable to connect to the database:', error);
                            res.status(400).json(error);
                        });
                    }).catch((error)=>{
                        console.error('Unable to connect to the database:', error);
                        res.status(400).json(error);
                    })
            }).catch((error)=>{
                console.error('Error finding paymentMethod:', error);
                res.status(400).json(error);
            });
        }catch (error) {
            console.error('Unable to connect to the database:', error);
            res.status(400).json(error);
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
            console.error('Unable to connect to the database:', error);
            res.status(400).json(error);
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
                    console.error('Unable to connect to the database:', error);
                    res.status(400).json(error);
                })
            });
              
          } catch (error) {
              console.error('Unable to connect to the database:', error);
              res.status(400).json(error);
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
                    console.error('Unable to connect to the database:', error);
                    res.status(400).json(error);
                })
            });
              
          } catch (error) {
              console.error('Unable to connect to the database:', error);
              res.status(400).json(error);
          }
    },
  };
