const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('mysql://admin:dalilah@localhost:3306/dalilah')

class User extends Model {}

User.init({
  // Model attributes are defined here
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
     type: DataTypes.STRING,
     allowNull: false   
  },
  phone: {
     type: DataTypes.STRING,
     allowNull: false   
  },
  address: {
     type: DataTypes.STRING,
     allowNull: false   
  },
  pass: {
     type: DataTypes.STRING,
     allowNull: false   
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
});


// Rol user

class Rol extends Model {}

Rol.init({
  // Model attributes are defined here
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Rol' // We need to choose the model name
  });
//Product

class Product extends Model {}

Product.init({
  // Model attributes are defined here
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  imgUrl: {
     type: DataTypes.STRING,
     allowNull: false   
  },
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Product' // We need to choose the model name
});

class Item extends Model {}

Item.init({
  // Model attributes are defined here
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Item' // We need to choose the model name
});

class PaymentMethod extends Model {}

PaymentMethod.init({
  // Model attributes are defined here
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'PaymentMethod' // We need to choose the model name
});

class Order extends Model {}

Order.init({
  // Model attributes are defined here
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },
  total: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Order' // We need to choose the model name
});

Product.belongsToMany(Order, { through: Item })
User.belongsTo(Rol, {
  foreignKey: 'rolId'
});
Order.belongsTo(PaymentMethod,  {
  foreignKey: 'paymentMethodId'
});
Order.belongsTo(User, {
  foreignKey: 'clientId'
});
Product.sync();
PaymentMethod.sync();
Order.sync();
Item.sync();
Rol.sync().then(result=>{
  Rol.findOrCreate({
    where: { name: 'ADMIN' },
    defaults: {
      name: 'ADMIN'
    }
  });
  Rol.findOrCreate({
    where: { name: 'CLIENT' },
    defaults: {
      name: 'CLIENT'
    }
  });
}).catch((error)=>{
  console.error('Error', error);
});
User.sync();

module.exports = sequelize;