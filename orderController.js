const sequelize = require('./model')
const jwt = require('jsonwebtoken');


const sumTotalItems = (previousItem, currentItem) => previousItem + currentItem;

module.exports = {
    createOrder: (req, res) => {
       try {
            let orderToSave = req.body;
            console.log(req.infoToken)
            //Find pay method of order to save by primary key
            sequelize.models.PaymentMethod.findByPk(orderToSave.paymentMethodId).then((paymentMethod)=>{
                console.log( req.infoToken.id);
                const order =  sequelize.models.Order.build({ total: orderToSave.total, paymentMethodId: paymentMethod.id, clientId: req.infoToken.id });
                    order.save().then((orderSaved) => {
                        let itemsToSave = orderToSave.items;
                        let promisesItem = [];
                        //product plus others product  result the sum of amounts by price and total
                        itemsToSave.forEach(itemToSave => {
                            let promiseItem = new Promise((resolve, reject) => {
                                sequelize.models.Product.findByPk(itemToSave.productId).then((product)=>{
                                    const itemToAdd =  sequelize.models.Item.build({ amount: itemToSave.amount, productId: product.id, orderId: order.id });
                                    itemToAdd.save().then(savedItem =>{
                                        console.log(savedItem);
                                        let total = itemToSave.amount*product.price;
                                        resolve(total);
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
                                    include: [ { model: sequelize.models.Item, as: 'Items' } ]
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
          sequelize.models.Order.findOne({
            where: {
              id: orderId
            },
            include: [ { model: sequelize.models.Item, as: 'Items' } ]
          }).then(findalOrder=>{
            res.status(200).json(findalOrder);
          }).catch((error)=>{
            console.error('Error getting final order:', error);
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
               
                order.payMethodId = orderToUpdate.payMethodId;
              // update order
                order.save().then((orderUpdated) => {
                    let itemsToSave = orderToUpdate.items;
                        let promisesItem = [];
                        //product plus others product  result the sum of amounts by price and total
                        itemsToSave.forEach(itemToSave => {
                            let promiseItem = new Promise((resolve, reject) => {
                                sequelize.models.Product.findByPk(itemToSave.productId).then((product)=>{
                                    
                                    sequelize.models.Item.findOrCreate({
                                        where: { orderId: order.id, productId: product.id },
                                        defaults: {
                                          orderId: order.id,
                                          productId: product.id,
                                          amount: itemToSave.amount
                                        }
                                    }).then(item=>{
                                        console.log(item,item[0]);
                                        let foundItem = item[0];
                                        foundItem.amount = itemToSave.amount;
                                        foundItem.save().then(updatedItem=>{
                                            let total = itemToSave.amount*product.price;
                                            resolve(total);
                                        }).catch((error)=>{
                                            console.error('Error updating item', error);
                                            reject(error);
                                        });
                                    }).catch((error)=>{
                                      console.error('Error finding item', error);
                                      reject(error);
                                    });
                                    
                                }).catch((error)=>{
                                    console.error('Error finding product:', error);
                                    reject(error);
                                });
                            });
                            promisesItem.push(promiseItem);
                        });
                        Promise.all(promisesItem).then(values=>{
                            //Calculate total
                            console.log(values);
                            const total = values.reduce(sumTotalItems);
                            console.log(total);
                            orderUpdated.total = total;
                            orderUpdated.save().then(orderWithTotal=>{
                                sequelize.models.Order.findOne({
                                    where: {
                                      id: orderWithTotal.id
                                    },
                                    include: [ { model: sequelize.models.Item, as: 'Items' } ]
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
            });
              
          } catch (error) {
              console.error('Unable to connect to the database:', error);
              res.status(400).json(error);
          }
    }
  };
